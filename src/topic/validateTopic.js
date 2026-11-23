// Checks a topic and returns a list of problems (in Spanish, for whoever writes the topic).
// An empty list means the topic is ready to play.
import { DIFFICULTY, DIFFICULTY_ORDER } from "../data/config.js";
import { COLLECTIBLE_STYLES } from "./defaults.js";

const isText = value => typeof value === "string" && value.trim() !== "";

function checkQuestion(question, where, errors) {
  if (!isText(question?.prompt)) errors.push(`${where}: falta "prompt" (la pregunta).`);
  const answers = question?.answers;
  if (!Array.isArray(answers) || answers.length !== 4 || !answers.every(isText)) {
    errors.push(`${where}: "answers" debe tener 4 respuestas (la correcta primero).`);
  } else if (new Set(answers).size !== 4) {
    errors.push(`${where}: hay respuestas repetidas.`);
  }
  if (!isText(question?.explanation)) errors.push(`${where}: falta "explanation" (el dato que se muestra al responder).`);
}

/** Difficulty of a level: its own, or one by position (first levels easiest). */
export const difficultyOf = (level, index) => level.difficulty ?? DIFFICULTY_ORDER[Math.min(index, DIFFICULTY_ORDER.length - 1)];

/**
 * @param topic the topic module's default export
 * @param {{sceneryKeys: string[]}} options names of the sceneries available to this topic
 * @returns {string[]}
 */
export function validateTopic(topic, { sceneryKeys }) {
  const errors = [];
  if (!topic || typeof topic !== "object") return ["El tema no exporta un objeto."];
  if (!/^[a-z0-9-]+$/.test(topic.id ?? "")) errors.push('"id" debe usar solo minúsculas, números y guiones (ej. "sistema-solar").');
  if (!isText(topic.subject)) errors.push('Falta "subject" (el nombre del tema).');
  if (!isText(topic.pitch)) errors.push('Falta "pitch" (una frase que invita a jugar).');

  const levels = Array.isArray(topic.levels) ? topic.levels : [];
  if (!levels.length) errors.push('"levels" debe tener al menos un nivel.');
  const conceptsPerLevel = new Map();
  (topic.concepts ?? []).forEach(c => conceptsPerLevel.set(c?.level, (conceptsPerLevel.get(c?.level) ?? 0) + 1));
  const usableConcepts = (topic.concepts?.length ?? 0) >= 4;

  const levelIds = new Set();
  levels.forEach((level, i) => {
    const where = `Nivel ${i + 1}${level?.id ? ` (${level.id})` : ""}`;
    if (!isText(level?.id)) errors.push(`${where}: falta "id".`);
    else if (levelIds.has(level.id)) errors.push(`${where}: el id está repetido.`);
    else levelIds.add(level.id);
    if (!isText(level?.name)) errors.push(`${where}: falta "name".`);
    if (!isText(level?.intro)) errors.push(`${where}: falta "intro" (texto de presentación).`);
    if (level?.difficulty !== undefined && !(level.difficulty in DIFFICULTY)) {
      errors.push(`${where}: la dificultad "${level.difficulty}" no existe. Opciones: ${DIFFICULTY_ORDER.join(", ")}.`);
    }
    if (level?.scenery !== undefined && !sceneryKeys.includes(level.scenery)) {
      errors.push(`${where}: el escenario "${level.scenery}" no existe. Opciones: ${sceneryKeys.join(", ")}.`);
    }
    if (level?.collectible?.style !== undefined && !COLLECTIBLE_STYLES.includes(level.collectible.style)) {
      errors.push(`${where}: el coleccionable "${level.collectible.style}" no existe. Opciones: ${COLLECTIBLE_STYLES.join(", ")}.`);
    }
    (level?.questions ?? []).forEach((q, k) => checkQuestion(q, `${where}, pregunta ${k + 1}`, errors));

    const difficulty = DIFFICULTY[difficultyOf(level ?? {}, i)];
    if (difficulty) {
      const available = (level?.questions?.length ?? 0)
        + (usableConcepts ? conceptsPerLevel.get(level?.id) ?? 0 : 0)
        + (level?.general ? topic.generalQuestions?.length ?? 0 : 0);
      if (available < difficulty.questions) {
        errors.push(`${where}: tiene ${available} preguntas y su dificultad necesita ${difficulty.questions}. Agrega preguntas, conceptos o "general: true".`);
      }
    }
  });
  (topic.generalQuestions ?? []).forEach((q, k) => checkQuestion(q, `Pregunta general ${k + 1}`, errors));

  const conceptIds = new Set();
  const categoryIds = new Set((topic.categories ?? []).map(c => c?.id));
  (topic.concepts ?? []).forEach((concept, i) => {
    const where = `Concepto ${i + 1}${concept?.id ? ` (${concept.id})` : ""}`;
    if (!isText(concept?.id) || conceptIds.has(concept.id)) errors.push(`${where}: falta "id" o está repetido.`);
    conceptIds.add(concept?.id);
    if (!isText(concept?.name)) errors.push(`${where}: falta "name".`);
    if (!isText(concept?.role)) errors.push(`${where}: falta "role" (qué hace o qué lo caracteriza).`);
    if (concept?.level !== undefined && !levelIds.has(concept.level)) errors.push(`${where}: el nivel "${concept.level}" no existe.`);
    (concept?.categories ?? []).forEach(c => { if (!categoryIds.has(c)) errors.push(`${where}: la categoría "${c}" no está en "categories".`); });
  });
  (topic.sequence ?? []).forEach(id => { if (!conceptIds.has(id)) errors.push(`"sequence": "${id}" no es un concepto.`); });
  (topic.categories ?? []).forEach((c, i) => {
    if (!isText(c?.id) || !isText(c?.prompt) || !isText(c?.explanation)) errors.push(`Categoría ${i + 1}: necesita "id", "prompt" y "explanation".`);
  });

  const hero = topic.hero;
  if (hero && (!isText(hero.id) || !isText(hero.name) || typeof hero.draw !== "function" || typeof hero.portrait !== "function")) {
    errors.push('"hero" necesita "id", "name", "tagline", "draw(ctx, options)" y "portrait(mood)".');
  }
  return errors;
}
