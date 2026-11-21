// Builds questions from the anatomy data, so answer mixes are different every game.
// Every question has the shape { id, group, prompt, answers: [correct, ...wrong], explanation }.
import { PARTS, ROUTE } from "../data/anatomy.js";
import { QUESTION_TEMPLATES as Q } from "../data/texts.js";
import { pickOne, shuffle } from "../utils/random.js";
import { capitalize, lowercaseFirst, withDe, withoutArticle, format } from "../utils/text.js";

const partById = id => PARTS.find(p => p.id === id);
const routeParts = ROUTE.map(partById);
const annexParts = PARTS.filter(p => p.gland || p.annex);
const glands = PARTS.filter(p => p.gland);

const routeExplanation = () => format(Q.routeExplanation, {
  route: routeParts.map(p => withoutArticle(p.name)).join(Q.routeSeparator),
});

function wrongPartsFor(part, rng) {
  const candidates = PARTS.filter(o => o.id !== part.id && !(part.similarTo && o.similarTo === part.similarTo));
  return shuffle(candidates, rng).slice(0, 3);
}

function roleOf(part, wrong) {
  const pluralN = part.plural ? "n" : "";
  return {
    id: "role:" + part.id, group: part.id,
    prompt: format(Q.roleOf, { pluralN, name: part.name }),
    answers: [part.role, ...wrong.map(o => o.role)],
    explanation: format(Q.roleOfExplanation, { Name: capitalize(part.name), role: lowercaseFirst(part.role) }),
  };
}

function partFor(part, wrong) {
  const pluralN = part.plural ? "n" : "";
  return {
    id: "part:" + part.id, group: part.id,
    prompt: format(Q.partFor, { role: lowercaseFirst(part.role) }),
    answers: [capitalize(part.name), ...wrong.map(o => capitalize(o.name))],
    explanation: format(Q.partForExplanation, { Name: capitalize(part.name), pluralN, role: lowercaseFirst(part.role) }),
  };
}

function nextInRoute(part, rng) {
  const index = ROUTE.indexOf(part.id);
  if (index < 0 || index === ROUTE.length - 1) return null;
  const next = partById(ROUTE[index + 1]);
  const wrong = shuffle(PARTS.filter(o => (ROUTE.includes(o.id) || o.gland) && o.id !== part.id && o.id !== next.id), rng).slice(0, 3);
  return {
    id: "next:" + part.id, group: "next:" + part.id,
    prompt: format(Q.nextInRoute, { ofName: withDe(part.name) }),
    answers: [capitalize(next.name), ...wrong.map(o => capitalize(o.name))],
    explanation: routeExplanation(),
  };
}

/** Questions about the organs, glands and parts that belong to a level. */
export function organQuestions(levelId, rng = Math.random) {
  return PARTS.filter(p => p.level === levelId).flatMap(part => {
    const wrong = wrongPartsFor(part, rng);
    return [roleOf(part, wrong), partFor(part, wrong), nextInRoute(part, rng)].filter(Boolean);
  });
}

/** Questions about the path of the food, with random organs each time. Ids start with "rnd:". */
export function routeQuestions(rng = Math.random) {
  const questions = [];

  { // correct order of three organs
    const indexes = shuffle(ROUTE.map((_, i) => i), rng).slice(0, 3).sort((a, b) => a - b);
    const names = indexes.map(i => withoutArticle(routeParts[i].name));
    const asText = order => capitalize(order.map(k => names[k]).join(Q.routeSeparator));
    const orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const wrong = shuffle(orders.slice(1), rng).slice(0, 3);
    questions.push({ id: "rnd:order", group: "order", prompt: Q.routeOrder,
      answers: [asText(orders[0]), ...wrong.map(asText)], explanation: routeExplanation() });
  }
  { // which one comes first (the last organ is never the answer, so leave it out)
    const four = shuffle(ROUTE.slice(0, -1), rng).slice(0, 4);
    const first = four.reduce((a, b) => (ROUTE.indexOf(a) < ROUTE.indexOf(b) ? a : b));
    questions.push({ id: "rnd:first", group: "first", prompt: Q.firstInRoute,
      answers: [first, ...four.filter(id => id !== first)].map(id => capitalize(partById(id).name)),
      explanation: routeExplanation() });
  }
  { // food does not go through annex organs
    const annex = pickOne(annexParts, rng);
    const wrong = shuffle(routeParts, rng).slice(0, 3);
    questions.push({ id: "rnd:notroute", group: "notroute", prompt: Q.notInRoute,
      answers: [capitalize(annex.name), ...wrong.map(o => capitalize(o.name))],
      explanation: format(Q.notInRouteExplanation, { name: annex.name }) });
  }
  { // annex glands
    const gland = pickOne(glands, rng);
    const wrong = shuffle(routeParts, rng).slice(0, 3);
    questions.push({ id: "rnd:gland", group: "gland", prompt: Q.annexGland,
      answers: [capitalize(gland.name), ...wrong.map(o => capitalize(o.name))],
      explanation: Q.annexGlandExplanation });
  }
  return questions;
}
