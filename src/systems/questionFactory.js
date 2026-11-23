// Builds questions from a topic's concepts, sequence and categories, so the answer mixes are
// different every game. Every question has the shape { id, group, prompt, answers: [correct, ...wrong], explanation }.
// Wording comes from the topic (topic.questionWording, with defaults in src/topic/defaults.js).
import { pickOne, shuffle } from "../utils/random.js";
import { capitalize, lowercaseFirst, withDe, withoutArticle, format } from "../utils/text.js";

const nameValues = concept => ({
  name: concept.name, Name: capitalize(concept.name), n: concept.plural ? "n" : "", deName: withDe(concept.name),
});

function context(topic) {
  const byId = new Map(topic.concepts.map(c => [c.id, c]));
  const sequence = topic.sequence.map(id => byId.get(id));
  const outside = topic.concepts.filter(c => c.outsideSequence);
  const wording = topic.questionWording;
  const sequenceText = sequence.map(c => withoutArticle(c.name)).join(wording.sequenceSeparator);
  return { byId, sequence, outside, wording, sequenceExplanation: format(wording.sequenceExplanation, { sequence: sequenceText }) };
}

/* ---------- questions about one concept ---------- */

function wrongConceptsFor(concept, concepts, rng) {
  const candidates = concepts.filter(o => o.id !== concept.id && !(concept.similarTo && o.similarTo === concept.similarTo));
  return shuffle(candidates, rng).slice(0, 3);
}

function roleOf(concept, wrong, { wording }) {
  const values = { ...nameValues(concept), role: lowercaseFirst(concept.role) };
  return {
    id: "role:" + concept.id, group: concept.id,
    prompt: format(wording.conceptRole, values),
    answers: [concept.role, ...wrong.map(o => o.role)],
    explanation: format(wording.conceptRoleExplanation, values),
  };
}

function conceptFor(concept, wrong, { wording }) {
  const values = { ...nameValues(concept), role: lowercaseFirst(concept.role) };
  return {
    id: "for:" + concept.id, group: concept.id,
    prompt: format(wording.conceptFor, values),
    answers: [capitalize(concept.name), ...wrong.map(o => capitalize(o.name))],
    explanation: format(wording.conceptForExplanation, values),
  };
}

function nextInSequence(concept, ctx, rng) {
  const index = ctx.sequence.indexOf(concept);
  if (index < 0 || index === ctx.sequence.length - 1) return null;
  const next = ctx.sequence[index + 1];
  const candidates = [...ctx.sequence, ...ctx.outside].filter(o => o !== concept && o !== next);
  if (candidates.length < 3) return null;
  const wrong = shuffle(candidates, rng).slice(0, 3);
  return {
    id: "next:" + concept.id, group: "next:" + concept.id,
    prompt: format(ctx.wording.sequenceNext, nameValues(concept)),
    answers: [capitalize(next.name), ...wrong.map(o => capitalize(o.name))],
    explanation: ctx.sequenceExplanation,
  };
}

/** Questions about the concepts that belong to a level. */
export function conceptQuestions(topic, levelId, rng = Math.random) {
  if (topic.concepts.length < 4) return [];
  const ctx = context(topic);
  return topic.concepts.filter(c => c.level === levelId).flatMap(concept => {
    const wrong = wrongConceptsFor(concept, topic.concepts, rng);
    if (wrong.length < 3) return [nextInSequence(concept, ctx, rng)].filter(Boolean);
    return [roleOf(concept, wrong, ctx), conceptFor(concept, wrong, ctx), nextInSequence(concept, ctx, rng)].filter(Boolean);
  });
}

/* ---------- questions about the whole sequence and categories (random content, ids "rnd:") ---------- */

/** Questions about the order of the sequence, items outside it and categories. */
export function sequenceQuestions(topic, rng = Math.random) {
  const ctx = context(topic);
  const { sequence, outside, wording } = ctx;
  const questions = [];
  const named = c => capitalize(c.name);

  if (sequence.length >= 3) { // correct order of three items
    const picked = shuffle(sequence, rng).slice(0, 3).sort((a, b) => sequence.indexOf(a) - sequence.indexOf(b));
    const names = picked.map(c => withoutArticle(c.name));
    const asText = order => capitalize(order.map(k => names[k]).join(wording.sequenceSeparator));
    const orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    questions.push({ id: "rnd:order", group: "order", prompt: wording.sequenceOrder,
      answers: [asText(orders[0]), ...shuffle(orders.slice(1), rng).slice(0, 3).map(asText)],
      explanation: ctx.sequenceExplanation });
  }
  if (sequence.length >= 5) { // which comes first (the last item can never be the answer, so leave it out)
    const four = shuffle(sequence.slice(0, -1), rng).slice(0, 4);
    const first = four.reduce((a, b) => (sequence.indexOf(a) < sequence.indexOf(b) ? a : b));
    questions.push({ id: "rnd:first", group: "first", prompt: wording.sequenceFirst,
      answers: [first, ...four.filter(c => c !== first)].map(named), explanation: ctx.sequenceExplanation });
  }
  if (outside.length && sequence.length >= 3) { // not part of the sequence
    const odd = pickOne(outside, rng);
    questions.push({ id: "rnd:outside", group: "outside", prompt: wording.outside,
      answers: [odd, ...shuffle(sequence, rng).slice(0, 3)].map(named),
      explanation: format(wording.outsideExplanation, nameValues(odd)) });
  }
  for (const category of topic.categories) { // which one belongs to a category
    const members = topic.concepts.filter(c => c.categories?.includes(category.id));
    const pool = sequence.length ? sequence : topic.concepts;
    const others = pool.filter(c => !c.categories?.includes(category.id));
    if (!members.length || others.length < 3) continue;
    questions.push({ id: "rnd:category:" + category.id, group: "category:" + category.id, prompt: category.prompt,
      answers: [pickOne(members, rng), ...shuffle(others, rng).slice(0, 3)].map(named), explanation: category.explanation });
  }
  return questions;
}
