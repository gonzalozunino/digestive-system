// Chooses the questions for one game and prepares them for display.
// Each stage gets one general question (written or about the sequence/categories), one about the
// stage's concepts and one from the stage's own list. When a pool is empty the slot falls back to
// the others. Questions not seen recently come first, and two questions about the same topic
// (`group`) are never asked in the same game.
import { LAYOUT, QUIZ } from "../data/config.js";
import { conceptQuestions, sequenceQuestions } from "./questionFactory.js";
import { pickOne, shuffle } from "../utils/random.js";

export const questionsPerGame = topic => topic.stages.length * LAYOUT.questionsPerStage;

const withIds = (questions, prefix) => questions.map((q, i) => ({ ...q, id: q.id ?? prefix + i }));

/**
 * @param {{topic: object, seen?: Set<string>, rng?: () => number}} options
 * @returns {{questionsByStage: object[][], seen: Set<string>}} `seen` may have been reset for exhausted pools.
 */
export function pickQuestions({ topic, seen = new Set(), rng = Math.random }) {
  seen = new Set(seen);
  const usedGroups = new Set();
  const usedIds = new Set();
  const general = withIds(topic.generalQuestions, "gen");
  const generated = sequenceQuestions(topic, rng);
  const stagePools = topic.stages.map(stage => ({
    concepts: conceptQuestions(topic, stage.id, rng),
    own: withIds(stage.questions, stage.id + ":"),
  }));
  const everything = [general, generated, ...stagePools.flatMap(p => [p.concepts, p.own])].flat();

  const available = pool => pool.filter(q => !usedIds.has(q.id) && !usedGroups.has(q.group ?? q.id));
  const choose = (...pools) => {
    const pool = [...pools, everything].find(p => available(p).length) ?? everything;
    const candidates = available(pool).length ? available(pool) : pool.filter(q => !usedIds.has(q.id));
    let fresh = candidates.filter(q => !seen.has(q.id));
    if (!fresh.length) {
      candidates.forEach(q => seen.delete(q.id));  // all seen already: start over
      fresh = candidates.length ? candidates : pool;
    }
    const question = pickOne(fresh, rng);
    usedIds.add(question.id);
    usedGroups.add(question.group ?? question.id);
    return question;
  };

  const questionsByStage = stagePools.map(({ concepts, own }) => {
    const useGenerated = generated.length && rng() < QUIZ.sequenceQuestionChance;
    const slots = [
      useGenerated ? choose(generated, general) : choose(general, generated),
      choose(concepts, own),
      choose(own, concepts),
    ];
    return shuffle(slots.slice(0, LAYOUT.questionsPerStage), rng);
  });

  return { questionsByStage, seen };
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
