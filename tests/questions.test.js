import { test } from "node:test";
import assert from "node:assert/strict";
import { LEVELS } from "../src/data/levels.js";
import { ORGAN_QUESTIONS, GENERAL_QUESTIONS } from "../src/data/questions.js";
import { organQuestions, routeQuestions } from "../src/systems/questionFactory.js";
import { pickQuestions, prepareQuestion, QUESTIONS_PER_GAME } from "../src/systems/questionPicker.js";
import { seededRandom } from "./helpers.js";

const assertWellFormed = q => {
  assert.ok(q.prompt, "prompt");
  assert.equal(q.answers.length, 4, q.prompt);
  assert.equal(new Set(q.answers).size, 4, `duplicate answers in: ${q.prompt}`);
  assert.ok(q.explanation, `explanation for: ${q.prompt}`);
};

test("every written question has 4 different answers and an explanation", () => {
  Object.values(ORGAN_QUESTIONS).flat().forEach(assertWellFormed);
  GENERAL_QUESTIONS.forEach(assertWellFormed);
});

test("every level has its own question list", () => {
  for (const level of LEVELS) assert.ok(ORGAN_QUESTIONS[level.id]?.length >= 3, level.id);
});

test("generated questions are well formed for many random seeds", () => {
  for (let seed = 1; seed <= 200; seed++) {
    const rng = seededRandom(seed);
    routeQuestions(rng).forEach(assertWellFormed);
    LEVELS.forEach(level => organQuestions(level.id, rng).forEach(assertWellFormed));
  }
});

test("a game has 3 questions per level and no repeated topic", () => {
  const { questionsByLevel } = pickQuestions({ rng: seededRandom(7) });
  assert.equal(questionsByLevel.flat().length, QUESTIONS_PER_GAME);
  questionsByLevel.forEach(level => assert.equal(level.length, 3));
  const groups = questionsByLevel.flat().map(q => q.group ?? q.id);
  assert.equal(new Set(groups).size, groups.length);
});

test("questions already seen are avoided in the next game", () => {
  const first = pickQuestions({ rng: seededRandom(3) });
  const seen = new Set(first.questionsByLevel.flat().map(q => q.id).filter(id => !id.startsWith("rnd:")));
  const second = pickQuestions({ seen, rng: seededRandom(4) });
  const repeated = second.questionsByLevel.flat().filter(q => seen.has(q.id));
  assert.deepEqual(repeated, []);
});

test("prepareQuestion keeps track of the correct option after shuffling", () => {
  const prepared = prepareQuestion({ id: "x", ...GENERAL_QUESTIONS[0] }, seededRandom(9));
  assert.equal(prepared.options[prepared.correctIndex].text, GENERAL_QUESTIONS[0].answers[0]);
  assert.equal(prepared.options.filter(o => o.correct).length, 1);
});
