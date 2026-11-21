// Chooses the questions for one game and prepares them for display.
// Each level gets one general question (función, ingestión/digestión or recorrido), one about the
// level's organs/glands and one from the level's own list. Questions not seen recently come first,
// and two questions about the same topic (`group`) are never asked in the same game.
import { LEVELS } from "../data/levels.js";
import { LAYOUT, QUIZ } from "../data/config.js";
import { ORGAN_QUESTIONS, GENERAL_QUESTIONS } from "../data/questions.js";
import { organQuestions, routeQuestions } from "./questionFactory.js";
import { pickOne, shuffle } from "../utils/random.js";

export const QUESTIONS_PER_GAME = LEVELS.length * LAYOUT.questionsPerLevel;

const withIds = (questions, prefix) => questions.map((q, i) => ({ ...q, id: q.id ?? prefix + i }));

/**
 * @param {{seen?: Set<string>, rng?: () => number}} options
 * @returns {{questionsByLevel: object[][], seen: Set<string>}} `seen` may have been reset for exhausted pools.
 */
export function pickQuestions({ seen = new Set(), rng = Math.random } = {}) {
  seen = new Set(seen);
  const usedGroups = new Set();
  const general = withIds(GENERAL_QUESTIONS, "gen");

  const choose = pool => {
    let candidates = pool.filter(q => !usedGroups.has(q.group ?? q.id));
    if (!candidates.length) candidates = pool;
    let fresh = candidates.filter(q => !seen.has(q.id));
    if (!fresh.length) {
      pool.forEach(q => seen.delete(q.id));  // everything in this pool was seen: start over
      fresh = candidates;
    }
    const question = pickOne(fresh, rng);
    usedGroups.add(question.group ?? question.id);
    return question;
  };

  const questionsByLevel = LEVELS.map(level => shuffle([
    choose(rng() < QUIZ.routeQuestionChance ? routeQuestions(rng) : general),
    choose(organQuestions(level.id, rng)),
    choose(withIds(ORGAN_QUESTIONS[level.id], level.id)),
  ], rng));

  return { questionsByLevel, seen };
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
