// Game rules and flow for playing one level: scoring, hearts, quiz, progress and the state machine.
// Works with any topic (see src/topic). Each level has its own difficulty (data/config.js DIFFICULTY).
// It has no DOM, canvas or audio code and tells the outside world what happened through events:
//   "state"          new state name
//   "hud"            { hearts, maxHearts, score, level }
//   "progress"       0..1 along the current level
//   "levelIntro"     { level, best }                    best: { best: 0..100, completed }
//   "quiz:open"      { question, number, total, level, streak }
//   "quiz:answered"  { chosenIndex, correctIndex, correct, points, streak, explanation, correctText, outOfHearts }
//   "gameOver"       { won, score, correct, asked, level, percent, isNewBest, nextLevel }
//   "sound"          sound name (see data/sounds.js)
//   "music"          { action: "start", track, tempo } | { action: "stop" }
import { Emitter } from "../utils/emitter.js";
import { DIFFICULTY, PHYSICS, PLAYER, SCORING, SPEED, TIMING, WORLD } from "../data/config.js";
import { VISUALS } from "../data/visuals.js";
import { createPlayer, resetPlayer, movePlayer, jump, launch, animatePlayer, fallAfterDefeat, playerBottom, playerCenter } from "../entities/player.js";
import { buildLevel } from "../systems/levelBuilder.js";
import { detectCollisions } from "../systems/collision.js";
import { pickLevelQuestions, prepareQuestion } from "../systems/questionPicker.js";
import { createQuestionHistory } from "../systems/questionHistory.js";
import { createRecords } from "../systems/records.js";
import { createLevelProgress } from "../systems/levelProgress.js";
import { Effects } from "../systems/effects.js";
import { STATES } from "./states.js";

export class Game extends Emitter {
  /** @param {{topic: object, storage: object, rng?: () => number}} options  topic: from prepareTopic() */
  constructor({ topic, storage, rng = Math.random }) {
    super();
    this.topic = topic;
    this.rng = rng;
    this.history = createQuestionHistory(storage, topic.id);
    this.records = createRecords(storage, topic.id);
    this.levelProgress = createLevelProgress(storage, topic.id);
    this.state = STATES.MENU;
    this.time = 0;
    this.camera = 0;
    this.shake = 0;
    this.player = createPlayer();
    this.effects = new Effects(rng);
    this.world = { items: [], length: 1, speed: 0 };
    this.session = null;
    this.quiz = null;
    this.jumpInput = { held: false, buffer: 0 };
    this.timers = [];
  }

  /* ---------- read-only views ---------- */

  get levels() { return this.topic.levels; }
  get levelIndex() { return this.session?.levelIndex ?? 0; }
  get level() { return this.levels[this.levelIndex]; }
  get nextLevel() { return this.levels[this.levelIndex + 1] ?? null; }
  get difficulty() { return DIFFICULTY[this.level.difficulty]; }
  get progress() { return Math.max(0, Math.min(1, this.player.x / this.world.length)); }
  get quizAnswered() { return this.state === STATES.QUIZ && this.quiz.answered; }

  /* ---------- commands ---------- */

  /** Starts (or restarts) a level by its position in the topic. */
  start(levelIndex = this.levelIndex) {
    const level = this.levels[levelIndex];
    if (!level) return;
    const difficulty = DIFFICULTY[level.difficulty];
    const { questions, seen } = pickLevelQuestions({
      topic: this.topic, level, count: difficulty.questions, seen: this.history.load(), rng: this.rng,
    });
    this.history.save(seen);
    this.session = {
      levelIndex, score: 0, hearts: difficulty.hearts, maxHearts: difficulty.hearts,
      streak: 0, correct: 0, asked: 0, questions, won: false, percent: 0,
    };
    this.timers = [];

    const { items, length } = buildLevel(level.difficulty, difficulty, this.rng);
    this.world = { items, length, speed: SPEED.base * difficulty.speedFactor };
    resetPlayer(this.player);
    this.camera = 0;
    this.effects.clear();
    this.#setState(STATES.LEVEL_INTRO);
    this.emit("levelIntro", { level, best: this.levelProgress.get(level.id) });
    this.#emitHud();
    this.emit("progress", 0);
  }

  beginRun() {
    if (this.state === STATES.LEVEL_INTRO) this.#resumePlaying();
  }

  pause() {
    if (this.state !== STATES.PLAYING) return;
    this.#stopMusic();
    this.#setState(STATES.PAUSED);
  }

  resume() {
    if (this.state === STATES.PAUSED) this.#resumePlaying();
  }

  quit() {
    this.#stopMusic();
    this.timers = [];
    this.session = null;
    this.effects.clear();
    this.#setState(STATES.MENU);
  }

  pressJump() {
    if (this.state !== STATES.PLAYING) return false;
    this.jumpInput.held = true;
    this.jumpInput.buffer = PHYSICS.jumpBuffer;
    return true;
  }

  releaseJump() {
    this.jumpInput.held = false;
  }

  answer(index) {
    if (this.state !== STATES.QUIZ || this.quiz.answered) return;
    const question = this.quiz.question;
    if (!question.options[index]) return;
    this.quiz.answered = true;

    const s = this.session;
    const correct = question.options[index].correct;
    let points = 0;
    if (correct) {
      s.streak++;
      s.correct++;
      points = SCORING.correctAnswer + (s.streak - 1) * SCORING.streakBonus;
      s.score += points;
      this.emit("sound", "correct");
      this.effects.celebrate(80);
    } else {
      s.streak = 0;
      s.hearts--;
      this.shake = TIMING.wrongAnswerShake;
      this.emit("sound", "wrong");
    }
    this.#emitHud();
    this.emit("quiz:answered", {
      chosenIndex: index, correctIndex: question.correctIndex, correct, points, streak: s.streak,
      explanation: question.explanation, correctText: question.correctText, outOfHearts: s.hearts <= 0,
    });
  }

  continueAfterAnswer() {
    if (this.state !== STATES.QUIZ || !this.quiz.answered) return false;
    if (this.session.hearts <= 0) this.#endGame(false);
    else this.#resumePlaying();
    return true;
  }

  /** @returns {number} position in the table, or -1 */
  saveRecord(name) {
    const s = this.session;
    return this.records.add({ name, score: s.score, levelId: this.level.id, percent: s.percent });
  }

  /* ---------- simulation ---------- */

  update(dt) {
    this.time += dt;
    this.#tickTimers(dt);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - dt * TIMING.shakeDecay);
    this.effects.update(dt);

    switch (this.state) {
      case STATES.MENU:
      case STATES.LEVEL_INTRO:
        this.camera += WORLD.menuScrollSpeed * dt;
        break;
      case STATES.DEFEATED:
        fallAfterDefeat(this.player, dt);
        break;
      case STATES.PLAYING:
        this.#updatePlaying(dt);
        break;
    }
  }

  #updatePlaying(dt) {
    const p = this.player;
    const input = this.jumpInput;
    if (input.buffer > 0) input.buffer -= dt;

    const previousBottom = playerBottom(p);
    const wasGrounded = p.grounded;
    movePlayer(p, dt, this.world.speed);

    for (const event of detectCollisions(p, this.world.items, previousBottom)) {
      this.#handleCollision(event);
      if (this.state !== STATES.PLAYING) return;
    }

    if (p.grounded && !wasGrounded) {
      p.squash = 1;
      this.effects.dust(p.x, playerBottom(p), PLAYER.size, VISUALS.dust);
    }
    if (p.grounded && (input.held || input.buffer > 0)) {
      jump(p);
      input.buffer = 0;
      this.emit("sound", "jump");
    }
    animatePlayer(p, dt);

    const center = playerCenter(p);
    this.effects.addTrail(center.x, center.y);
    this.camera = p.x - WORLD.playerScreenX;
    this.emit("progress", this.progress);
  }

  #handleCollision({ type, item }) {
    switch (type) {
      case "hurt": return this.#hurt();
      case "pad": return this.#bounce(item);
      case "collect": return this.#collect(item);
      case "heart": return this.#collectHeart(item);
      case "portal": return this.#openQuiz(item);
      case "goal": return this.#completeLevel(item);
    }
  }

  #hurt() {
    const p = this.player, s = this.session;
    if (p.invulnerable > 0) return;
    s.hearts--;
    s.streak = 0;
    p.invulnerable = PLAYER.invulnerableTime;
    this.shake = TIMING.hitShake;
    const center = playerCenter(p);
    this.effects.splash(center.x, center.y, VISUALS.hurt);
    this.emit("sound", "hit");
    this.#emitHud();
    if (s.hearts <= 0) {
      this.#setState(STATES.DEFEATED);
      this.#after(TIMING.deathDelay, () => this.#endGame(false));
    }
  }

  #bounce(pad) {
    launch(this.player);
    this.effects.burst(pad.x + pad.w / 2, pad.y, VISUALS.pad.glow, 12);
    this.emit("sound", "pad");
  }

  #collect(item) {
    item.done = true;
    const kind = this.level.collectible;
    const color = kind.colors[item.variant % kind.colors.length];
    const name = kind.names[item.variant % kind.names.length];
    this.session.score += SCORING.collectible;
    this.effects.burst(item.x, item.y, color);
    this.effects.popup(item.x, item.y - 20, `+${SCORING.collectible} ${name}`, color);
    this.emit("sound", "collect");
    this.#emitHud();
  }

  #collectHeart(item) {
    item.done = true;
    const s = this.session;
    if (s.hearts < s.maxHearts) s.hearts++;
    else s.score += SCORING.heartWhenFull;
    this.effects.burst(item.x, item.y, VISUALS.heart.glow, 20);
    this.emit("sound", "heart");
    this.#emitHud();
  }

  #openQuiz(portal) {
    portal.done = true;
    const s = this.session;
    const question = s.questions[s.asked];
    this.history.markAsked(question);
    s.asked++;
    this.quiz = { question: prepareQuestion(question, this.rng), answered: false };
    this.effects.burst(portal.x + portal.w / 2, portal.y + portal.h / 2, VISUALS.portal.ring, 30);
    this.#stopMusic();
    this.emit("sound", "portal");
    this.#setState(STATES.QUIZ);
    this.emit("quiz:open", {
      question: this.quiz.question, number: s.asked, total: s.questions.length, level: this.level, streak: s.streak,
    });
  }

  #completeLevel(goal) {
    goal.done = true;
    const s = this.session;
    this.#stopMusic();
    this.emit("sound", "levelComplete");
    this.effects.celebrate(120);
    s.score += SCORING.levelComplete;
    s.won = true;
    this.#emitHud();
    this.#setState(STATES.TRANSITION);
    this.#after(TIMING.victoryDelay, () => this.#endGame(true));
  }

  #endGame(won) {
    const s = this.session;
    s.percent = won ? 100 : Math.min(99, Math.floor(this.progress * 100));
    const { isNewBest } = this.levelProgress.record(this.level.id, s.percent);
    this.#stopMusic();
    this.#setState(STATES.OVER);
    if (won) this.effects.celebrate(250);
    else this.emit("sound", "gameOver");
    this.emit("gameOver", {
      won, score: s.score, correct: s.correct, asked: s.asked, level: this.level,
      percent: s.percent, isNewBest, nextLevel: this.nextLevel,
    });
  }

  #resumePlaying() {
    this.releaseJump();
    this.jumpInput.buffer = 0;
    this.#setState(STATES.PLAYING);
    this.emit("music", { action: "start", track: this.level.music, tempo: this.difficulty.musicTempo });
  }

  #stopMusic() { this.emit("music", { action: "stop" }); }

  #setState(state) {
    this.state = state;
    this.emit("state", state);
  }

  #emitHud() {
    const s = this.session;
    this.emit("hud", { hearts: s.hearts, maxHearts: s.maxHearts, score: s.score, level: this.level });
  }

  #after(seconds, action) { this.timers.push({ remaining: seconds, action }); }

  #tickTimers(dt) {
    const due = [];
    for (const timer of this.timers) {
      timer.remaining -= dt;
      if (timer.remaining <= 0) due.push(timer);
    }
    this.timers = this.timers.filter(t => t.remaining > 0);
    due.forEach(t => t.action());
  }
}
