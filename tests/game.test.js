import { test } from "node:test";
import assert from "node:assert/strict";
import { Game } from "../src/game/Game.js";
import { STATES } from "../src/game/states.js";
import { SCORING, DIFFICULTY } from "../src/data/config.js";
import { createMemoryStorage } from "../src/utils/storage.js";
import { createRecords } from "../src/systems/records.js";
import { seededRandom } from "./helpers.js";

function newGame() {
  const game = new Game({ storage: createMemoryStorage(), rng: seededRandom(5) });
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
  assert.equal(game.state, STATES.LEVEL_INTRO);
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

test("the whole journey can be finished", () => {
  const { game } = newGame();
  game.start();
  for (let guard = 0; guard < 100 && game.state !== STATES.OVER; guard++) {
    if (game.state === STATES.LEVEL_INTRO) game.beginRun();
    if (game.state === STATES.QUIZ) { game.answer(game.quiz.question.correctIndex); game.continueAfterAnswer(); }
    runUntil(game, () => [STATES.QUIZ, STATES.LEVEL_INTRO, STATES.OVER].includes(game.state));
  }
  assert.equal(game.state, STATES.OVER);
  assert.ok(game.session.won);
  assert.equal(game.session.asked, 15);
  assert.equal(game.session.hearts, DIFFICULTY.easy.hearts);
});

test("records are sorted, capped and remember the last name", () => {
  const records = createRecords(createMemoryStorage());
  for (let i = 0; i < 12; i++) records.add({ name: "N" + i, score: i * 10, reachedLevel: 1, now: i });
  const list = records.list();
  assert.equal(list.length, 10);
  assert.equal(list[0].score, 110);
  assert.equal(records.lastName(), "N11");
  assert.equal(records.add({ name: "low", score: 0, reachedLevel: 0, now: 99 }), -1);
});
