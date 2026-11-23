import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/game/Game.js";
import { STATES } from "../src/game/states.js";
import { SCORING, DIFFICULTY, SPEED } from "../src/data/config.js";
import { createMemoryStorage } from "../src/utils/storage.js";
import { createRecords } from "../src/systems/records.js";
import digestive from "../topics/sistema-digestivo/index.js";
import miniTopic from "./fixtures/miniTopic.js";
import { loadTopic, seededRandom } from "./helpers.js";

function newGame(topicModule = digestive, storage = createMemoryStorage()) {
  const game = new Game({ topic: loadTopic(topicModule), storage, rng: seededRandom(5) });
  const events = [];
  for (const name of ["state", "quiz:open", "quiz:answered", "gameOver", "sound"]) game.on(name, payload => events.push([name, payload]));
  return { game, events };
}

function runUntil(game, predicate, maxSeconds = 180) {
  for (let t = 0; t < maxSeconds && !predicate(); t += 1 / 120) {
    game.player.invulnerable = 99;  // ignore obstacles: these tests are about flow
    game.update(1 / 120);
  }
}

function playLevel(game, index, { answerCorrectly = true } = {}) {
  game.start(index);
  game.beginRun();
  for (let guard = 0; guard < 20 && game.state !== STATES.OVER; guard++) {
    runUntil(game, () => [STATES.QUIZ, STATES.OVER].includes(game.state));
    if (game.state === STATES.QUIZ) {
      const { correctIndex } = game.quiz.question;
      game.answer(answerCorrectly ? correctIndex : (correctIndex + 1) % 4);
      game.continueAfterAnswer();
    }
  }
}

test("starting a level shows its intro, then running reaches a question about it", () => {
  const { game, events } = newGame();
  game.start(3);
  assert.equal(game.state, STATES.LEVEL_INTRO);
  assert.equal(game.level.id, "estomago");
  game.beginRun();
  runUntil(game, () => game.state === STATES.QUIZ);
  const [, open] = events.find(([name]) => name === "quiz:open");
  assert.equal(open.level.id, "estomago");
});

test("each level uses its own difficulty", () => {
  const { game } = newGame();
  for (const [index, level] of game.levels.entries()) {
    game.start(index);
    const difficulty = DIFFICULTY[level.difficulty];
    assert.equal(game.session.hearts, difficulty.hearts);
    assert.equal(game.session.questions.length, difficulty.questions);
    assert.equal(game.world.speed, SPEED.base * difficulty.speedFactor);
    assert.equal(game.world.items.filter(it => it.type === "portal").length, difficulty.questions);
  }
  assert.deepEqual(game.levels.map(l => l.difficulty), ["facil", "facil", "normal", "dificil", "muy-dificil", "extremo", "demonio"]);
});

test("a correct answer gives points; a wrong one costs a heart", () => {
  const { game } = newGame();
  game.start(0); game.beginRun();
  runUntil(game, () => game.state === STATES.QUIZ);
  const before = game.session.score;
  game.answer(game.quiz.question.correctIndex);
  assert.equal(game.session.score, before + SCORING.correctAnswer);
  game.continueAfterAnswer();
  assert.equal(game.state, STATES.PLAYING);

  runUntil(game, () => game.state === STATES.QUIZ);
  const hearts = game.session.hearts;
  game.answer((game.quiz.question.correctIndex + 1) % 4);
  assert.equal(game.session.hearts, hearts - 1);
  assert.equal(game.session.streak, 0);
});

for (const [name, topicModule] of [["sistema digestivo", digestive], ["a minimal topic", miniTopic]]) {
  test(`every level can be completed: ${name}`, () => {
    const { game, events } = newGame(topicModule);
    for (let index = 0; index < game.levels.length; index++) {
      playLevel(game, index);
      assert.equal(game.state, STATES.OVER, game.levels[index].id);
      const [, summary] = events.filter(([n]) => n === "gameOver").at(-1);
      assert.ok(summary.won);
      assert.equal(summary.percent, 100);
      assert.equal(game.levelProgress.get(game.levels[index].id).completed, true);
    }
  });
}

test("losing saves the best progress in %", () => {
  const storage = createMemoryStorage();
  const { game, events } = newGame(digestive, storage);
  game.start(6);
  game.beginRun();
  game.session.hearts = 1;
  runUntil(game, () => game.state === STATES.QUIZ);
  game.answer((game.quiz.question.correctIndex + 1) % 4);
  game.continueAfterAnswer();
  assert.equal(game.state, STATES.OVER);
  const [, summary] = events.find(([n]) => n === "gameOver");
  assert.equal(summary.won, false);
  assert.ok(summary.percent > 0 && summary.percent < 100);
  assert.ok(summary.isNewBest);
  assert.deepEqual(game.levelProgress.get("recorrido"), { best: summary.percent, completed: false });
});

test("records, progress and question history are kept per topic", () => {
  const storage = createMemoryStorage();
  const a = new Game({ topic: loadTopic(digestive), storage, rng: seededRandom(1) });
  const b = new Game({ topic: loadTopic(miniTopic), storage, rng: seededRandom(1) });
  a.records.add({ name: "A", score: 10, levelId: "boca", percent: 50 });
  a.levelProgress.record("boca", 50);
  assert.equal(b.records.list().length, 0);
  assert.equal(a.records.list().length, 1);
  assert.equal(b.levelProgress.get("boca").best, 0);
});

test("records are sorted, capped and remember the last name", () => {
  const records = createRecords(createMemoryStorage(), "test");
  for (let i = 0; i < 12; i++) records.add({ name: "N" + i, score: i * 10, levelId: "x", percent: 10, now: i });
  const list = records.list();
  assert.equal(list.length, 10);
  assert.equal(list[0].score, 110);
  assert.equal(records.lastName(), "N11");
  assert.equal(records.add({ name: "low", score: 0, levelId: "x", percent: 0, now: 99 }), -1);
});
