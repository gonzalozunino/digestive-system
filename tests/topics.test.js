import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTopic } from "../src/topic/validateTopic.js";
import { conceptQuestions, sequenceQuestions } from "../src/systems/questionFactory.js";
import { pickQuestions, prepareQuestion, questionsPerGame } from "../src/systems/questionPicker.js";
import miniTopic from "./fixtures/miniTopic.js";
import digestive from "../topics/sistema-digestivo/index.js";
import { allTopics, loadTopic, sceneryKeysFor, seededRandom } from "./helpers.js";

const assertWellFormed = q => {
  assert.ok(q.prompt, "prompt");
  assert.equal(q.answers.length, 4, q.prompt);
  assert.equal(new Set(q.answers).size, 4, `duplicate answers in: ${q.prompt}`);
  assert.ok(q.explanation, `explanation for: ${q.prompt}`);
  assert.doesNotMatch(q.prompt + q.explanation, /\{\w+\}/, `unfilled placeholder in: ${q.prompt}`);
};

for (const [id, topicModule] of [...await allTopics(), ["fixture: colores", miniTopic]]) {
  test(`${id}: the topic is valid`, () => {
    assert.deepEqual(validateTopic(topicModule, { sceneryKeys: sceneryKeysFor(topicModule) }), []);
  });

  test(`${id}: generated questions are well formed for many random seeds`, () => {
    const topic = loadTopic(topicModule);
    for (let seed = 1; seed <= 100; seed++) {
      const rng = seededRandom(seed);
      sequenceQuestions(topic, rng).forEach(assertWellFormed);
      topic.stages.forEach(stage => conceptQuestions(topic, stage.id, rng).forEach(assertWellFormed));
    }
  });

  test(`${id}: a game has 3 questions per stage and no repeated topic`, () => {
    const topic = loadTopic(topicModule);
    for (let seed = 1; seed <= 20; seed++) {
      const { questionsByStage } = pickQuestions({ topic, rng: seededRandom(seed) });
      assert.equal(questionsByStage.flat().length, questionsPerGame(topic));
      const ids = questionsByStage.flat().map(q => q.id);
      assert.equal(new Set(ids).size, ids.length, "no question twice");
      questionsByStage.flat().forEach(assertWellFormed);
    }
  });
}

test("questions already seen are avoided in the next game", () => {
  const topic = loadTopic(digestive);
  const first = pickQuestions({ topic, rng: seededRandom(3) });
  const seen = new Set(first.questionsByStage.flat().map(q => q.id).filter(id => !id.startsWith("rnd:")));
  const second = pickQuestions({ topic, seen, rng: seededRandom(4) });
  assert.deepEqual(second.questionsByStage.flat().filter(q => seen.has(q.id)), []);
});

test("prepareQuestion keeps track of the correct option after shuffling", () => {
  const prepared = prepareQuestion({ id: "x", prompt: "?", answers: ["a", "b", "c", "d"], explanation: "." }, seededRandom(9));
  assert.equal(prepared.options[prepared.correctIndex].text, "a");
  assert.equal(prepared.options.filter(o => o.correct).length, 1);
});

test("the validator explains what is wrong with a topic", () => {
  const broken = {
    id: "Mal Tema", subject: "", pitch: "x",
    stages: [{ id: "a", name: "A", intro: "i", scenery: "luna", questions: [{ prompt: "?", answers: ["1", "1", "2"], explanation: "" }] }],
    concepts: [{ id: "c", name: "c", role: "r", stage: "zzz" }],
    sequence: ["nope"],
  };
  const errors = validateTopic(broken, { sceneryKeys: ["forest"] }).join("\n");
  for (const fragment of ['"id"', '"subject"', 'escenario "luna"', "4 respuestas", "explanation", 'parada "zzz"', '"nope"', "se necesitan al menos 3"]) {
    assert.match(errors, new RegExp(fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing error about ${fragment}`);
  }
});

test("prepareTopic fills in defaults", () => {
  const topic = loadTopic(miniTopic);
  const [first] = topic.stages;
  assert.equal(first.shortName, first.name);
  assert.equal(first.collectible.style, "star");
  assert.ok(first.scenery && first.music && first.emoji);
  assert.notEqual(topic.stages[0].scenery, topic.stages[1].scenery);
  assert.equal(topic.heroId, null);
});
