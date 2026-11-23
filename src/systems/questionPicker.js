// Chooses the questions for one level and prepares them for display.
// Sources, taken in turns: the level's own questions, questions about the level's concepts and,
// when the level has `general: true`, the topic's general questions (written ones, or generated
// sequence/category ones). If a source runs out, the others fill in, and general questions are the
// last resort for any level. Questions not seen recently come first, and two questions about the
// same idea (`group`) are never asked in the same level.
import { QUIZ } from "../data/config.js";
import { conceptQuestions, sequenceQuestions } from "./questionFactory.js";
import { pickOne, shuffle } from "../utils/random.js";

const withIds = (questions, prefix) => questions.map((q, i) => ({ ...q, id: q.id ?? prefix + i }));

/**
 * @param {{topic: object, level: object, count: number, seen?: Set<string>, rng?: () => number}} options
 * @returns {{questions: object[], seen: Set<string>}} `seen` may have been reset for exhausted sources.
 */
export function pickLevelQuestions({ topic, level, count, seen = new Set(), rng = Math.random }) {
  seen = new Set(seen);
  const usedIds = new Set();
  const usedGroups = new Set();
  const own = withIds(level.questions, level.id + ":");
  const concepts = conceptQuestions(topic, level.id, rng);
  const written = withIds(topic.generalQuestions, "gen");
  const generated = sequenceQuestions(topic, rng);
  const general = () => (generated.length && rng() < QUIZ.sequenceQuestionChance ? [generated, written] : [written, generated]);

  const available = pool => pool.filter(q => !usedIds.has(q.id) && !usedGroups.has(q.group ?? q.id));
  const choose = pools => {
    const pool = pools.find(p => available(p).length) ?? pools.find(p => p.some(q => !usedIds.has(q.id))) ?? [];
    let candidates = available(pool);
    if (!candidates.length) candidates = pool.filter(q => !usedIds.has(q.id));
    let fresh = candidates.filter(q => !seen.has(q.id));
    if (!fresh.length) {
      candidates.forEach(q => seen.delete(q.id));  // all seen already: start over
      fresh = candidates;
    }
    const question = pickOne(fresh, rng);
    usedIds.add(question.id);
    usedGroups.add(question.group ?? question.id);
    return question;
  };

  const turns = level.general ? ["own", "concepts", "general"] : ["own", "concepts"];
  const sources = { own: () => [own], concepts: () => [concepts], general };
  const questions = [];
  for (let i = 0; i < count; i++) {
    const first = turns[i % turns.length];
    const order = [first, ...turns.filter(t => t !== first)].flatMap(name => sources[name]());
    questions.push(choose([...order, ...general()]));
  }
  return { questions: shuffle(questions, rng), seen };
}

/** Questions with random content should not count as "seen". */
export const isRepeatable = question => question.id.startsWith("rnd:");

/** Shuffles the answers into options ready for display. */
export function prepareQuestion(question, rng = Math.random) {
  const options = shuffle(question.answers.map((text, i) => ({ text, correct: i === 0 })), rng);
  return {
    id: question.id,
    prompt: question.prompt,
    options,
    correctIndex: options.findIndex(o => o.correct),
    correctText: question.answers[0],
    explanation: question.explanation,
  };
}
