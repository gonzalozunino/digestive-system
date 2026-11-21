import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/game/Game.js";
import { STATES } from "../src/game/states.js";
import { SCORING, DIFFICULTY } from "../src/data/config.js";
import { createMemoryStorage } from "../src/utils/storage.js";
import { createRecords } from "../src/systems/records.js";
import digestive from "../topics/sistema-digestivo/index.js";
import miniTopic from "./fixtures/miniTopic.js";
import { loadTopic, seededRandom } from "./helpers.js";

function newGame(topicModule = digestive, difficulty = "easy") {
  const game = new Game({ topic: loadTopic(topicModule), storage: createMemoryStorage(), rng: seededRandom(5) });
  game.setDifficulty(difficulty);
  const events = [];
  for (const name of ["state", "quiz:open", "quiz:answered", "gameOver", "sound"]) game.on(name, payload => events.push([name, payload]));
  return { game, events };
}

function runUntil(game, predicate, maxSeconds = 120) {
  for (let t = 0; t < maxSeconds && !predicate(); t += 1 / 120) {
    game.player.invulnerable = 99;  // ignore obstacles: these tests are about flow
    game.update(1 / 120);
  }
}

test("start shows the first level intro, then running reaches a question", () => {
  const { game, events } = newGame();
  game.start();
  assert.equal(game.state, STATES.STAGE_INTRO);
  game.beginRun();
  runUntil(game, () => game.state === STATES.QUIZ);
  assert.equal(game.state, STATES.QUIZ);
  assert.ok(events.some(([name]) => name === "quiz:open"));
});

test("a correct answer gives points; a wrong one costs a heart", () => {
  const { game } = newGame();
  game.start(); game.beginRun();
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

test("running out of hearts on a question ends the game", () => {
  const { game, events } = newGame();
  game.start(); game.beginRun();
  game.session.hearts = 1;
  runUntil(game, () => game.state === STATES.QUIZ);
  game.answer((game.quiz.question.correctIndex + 1) % 4);
  game.continueAfterAnswer();
  assert.equal(game.state, STATES.OVER);
  const [, summary] = events.find(([name]) => name === "gameOver");
  assert.equal(summary.won, false);
});

function playToTheEnd(game) {
  game.start();
  for (let guard = 0; guard < 200 && game.state !== STATES.OVER; guard++) {
    if (game.state === STATES.STAGE_INTRO) game.beginRun();
    if (game.state === STATES.QUIZ) { game.answer(game.quiz.question.correctIndex); game.continueAfterAnswer(); }
    runUntil(game, () => [STATES.QUIZ, STATES.STAGE_INTRO, STATES.OVER].includes(game.state));
  }
}

for (const [name, topicModule] of [["sistema digestivo", digestive], ["a minimal topic", miniTopic]]) {
  test(`the whole journey can be finished: ${name}`, () => {
    const { game } = newGame(topicModule);
    playToTheEnd(game);
    assert.equal(game.state, STATES.OVER);
    assert.ok(game.session.won);
    assert.equal(game.session.asked, topicModule.stages.length * 3);
    assert.equal(game.session.hearts, DIFFICULTY.easy.hearts);
  });
}

test("hard mode starts with fewer hearts and runs faster", () => {
  const { game } = newGame(digestive, "hard");
  game.start();
  assert.equal(game.session.hearts, DIFFICULTY.hard.hearts);
  const hardSpeed = game.world.speed;
  const { game: normal } = newGame(digestive, "normal");
  normal.start();
  assert.ok(hardSpeed > normal.world.speed);
});

test("records and question history are kept per topic", () => {
  const storage = createMemoryStorage();
  const a = new Game({ topic: loadTopic(digestive), storage, rng: seededRandom(1) });
  const b = new Game({ topic: loadTopic(miniTopic), storage, rng: seededRandom(1) });
  a.records.add({ name: "A", score: 10, reachedStage: 0 });
  assert.equal(b.records.list().length, 0);
  assert.equal(a.records.list().length, 1);
});

test("records are sorted, capped and remember the last name", () => {
  const records = createRecords(createMemoryStorage(), "test");
  for (let i = 0; i < 12; i++) records.add({ name: "N" + i, score: i * 10, reachedStage: 1, now: i });
  const list = records.list();
  assert.equal(list.length, 10);
  assert.equal(list[0].score, 110);
  assert.equal(records.lastName(), "N11");
  assert.equal(records.add({ name: "low", score: 0, reachedStage: 0, now: 99 }), -1);
});
