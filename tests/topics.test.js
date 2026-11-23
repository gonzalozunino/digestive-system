import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTY } from "../src/data/config.js";
import { validateTopic } from "../src/topic/validateTopic.js";
import { conceptQuestions, sequenceQuestions } from "../src/systems/questionFactory.js";
import { pickLevelQuestions, prepareQuestion } from "../src/systems/questionPicker.js";
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
      topic.levels.forEach(level => conceptQuestions(topic, level.id, rng).forEach(assertWellFormed));
    }
  });

  test(`${id}: every level gets enough different questions`, () => {
    const topic = loadTopic(topicModule);
    for (const level of topic.levels) {
      const count = DIFFICULTY[level.difficulty].questions;
      for (let seed = 1; seed <= 20; seed++) {
        const { questions } = pickLevelQuestions({ topic, level, count, rng: seededRandom(seed) });
        assert.equal(questions.length, count);
        const ids = questions.map(q => q.id);
        assert.equal(new Set(ids).size, ids.length, `no question twice in ${level.id}`);
        const groups = questions.map(q => q.group ?? q.id);
        assert.equal(new Set(groups).size, groups.length, `no repeated idea in ${level.id}`);
        questions.forEach(assertWellFormed);
      }
    }
  });
}

test("a level asks about its own subject first", () => {
  const topic = loadTopic(digestive);
  const stomach = topic.levels.find(l => l.id === "estomago");
  const { questions } = pickLevelQuestions({ topic, level: stomach, count: 3, rng: seededRandom(2) });
  const ownOrConcept = q => q.id.startsWith("estomago:") || /^(role|for|next):estomago$/.test(q.id);
  assert.ok(questions.every(ownOrConcept), questions.map(q => q.id).join(", "));
});

test("questions already seen are avoided next time", () => {
  const topic = loadTopic(digestive);
  const level = topic.levels[0];
  const first = pickLevelQuestions({ topic, level, count: 3, rng: seededRandom(3) });
  const seen = new Set(first.questions.map(q => q.id).filter(id => !id.startsWith("rnd:")));
  const second = pickLevelQuestions({ topic, level, count: 3, seen, rng: seededRandom(4) });
  assert.deepEqual(second.questions.filter(q => seen.has(q.id)), []);
});

test("prepareQuestion keeps track of the correct option after shuffling", () => {
  const prepared = prepareQuestion({ id: "x", prompt: "?", answers: ["a", "b", "c", "d"], explanation: "." }, seededRandom(9));
  assert.equal(prepared.options[prepared.correctIndex].text, "a");
  assert.equal(prepared.options.filter(o => o.correct).length, 1);
});

test("the validator explains what is wrong with a topic", () => {
  const broken = {
    id: "Mal Tema", subject: "", pitch: "x",
    levels: [{ id: "a", name: "A", intro: "i", difficulty: "imposible", scenery: "luna", questions: [{ prompt: "?", answers: ["1", "1", "2"], explanation: "" }] },
      { id: "b", name: "B", intro: "i", difficulty: "demonio", questions: [] }],
    concepts: [{ id: "c", name: "c", role: "r", level: "zzz" }],
    sequence: ["nope"],
  };
  const errors = validateTopic(broken, { sceneryKeys: ["forest"] }).join("\n");
  for (const fragment of ['"id"', '"subject"', 'dificultad "imposible"', 'escenario "luna"', "4 respuestas", "explanation", 'nivel "zzz"', '"nope"', "necesita 5"]) {
    assert.ok(errors.includes(fragment), `missing error about ${fragment}:\n${errors}`);
  }
});

test("prepareTopic fills in defaults", () => {
  const topic = loadTopic(miniTopic);
  const [first, second] = topic.levels;
  assert.equal(first.shortName, first.name);
  assert.equal(first.collectible.style, "star");
  assert.equal(first.difficulty, "facil");
  assert.equal(second.difficulty, "normal");
  assert.equal(first.finish.icon, "🏁");
  assert.ok(first.scenery && first.music && first.emoji);
  assert.notEqual(first.scenery, second.scenery);
  assert.equal(topic.heroId, null);
});
