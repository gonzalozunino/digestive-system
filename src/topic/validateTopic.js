// Checks a topic and returns a list of problems (in Spanish, for whoever writes the topic).
// An empty list means the topic is ready to play.
import { LAYOUT } from "../data/config.js";
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

  const stages = Array.isArray(topic.stages) ? topic.stages : [];
  if (!stages.length) errors.push('"stages" debe tener al menos una parada.');
  const stageIds = new Set();
  stages.forEach((stage, i) => {
    const where = `Parada ${i + 1}${stage?.id ? ` (${stage.id})` : ""}`;
    if (!isText(stage?.id)) errors.push(`${where}: falta "id".`);
    else if (stageIds.has(stage.id)) errors.push(`${where}: el id está repetido.`);
    else stageIds.add(stage.id);
    if (!isText(stage?.name)) errors.push(`${where}: falta "name".`);
    if (!isText(stage?.intro)) errors.push(`${where}: falta "intro" (texto de presentación).`);
    if (stage?.scenery !== undefined && !sceneryKeys.includes(stage.scenery)) {
      errors.push(`${where}: el escenario "${stage.scenery}" no existe. Opciones: ${sceneryKeys.join(", ")}.`);
    }
    if (stage?.collectible?.style !== undefined && !COLLECTIBLE_STYLES.includes(stage.collectible.style)) {
      errors.push(`${where}: el coleccionable "${stage.collectible.style}" no existe. Opciones: ${COLLECTIBLE_STYLES.join(", ")}.`);
    }
    (stage?.questions ?? []).forEach((q, k) => checkQuestion(q, `${where}, pregunta ${k + 1}`, errors));
  });
  (topic.generalQuestions ?? []).forEach((q, k) => checkQuestion(q, `Pregunta general ${k + 1}`, errors));

  const written = stages.reduce((sum, s) => sum + (s?.questions?.length ?? 0), 0) + (topic.generalQuestions?.length ?? 0);
  const needed = stages.length * LAYOUT.questionsPerStage;
  if (stages.length && written < needed) errors.push(`Hay ${written} preguntas escritas; se necesitan al menos ${needed} (${LAYOUT.questionsPerStage} por parada).`);

  const conceptIds = new Set();
  const categoryIds = new Set((topic.categories ?? []).map(c => c?.id));
  (topic.concepts ?? []).forEach((concept, i) => {
    const where = `Concepto ${i + 1}${concept?.id ? ` (${concept.id})` : ""}`;
    if (!isText(concept?.id) || conceptIds.has(concept.id)) errors.push(`${where}: falta "id" o está repetido.`);
    conceptIds.add(concept?.id);
    if (!isText(concept?.name)) errors.push(`${where}: falta "name".`);
    if (!isText(concept?.role)) errors.push(`${where}: falta "role" (qué hace o qué lo caracteriza).`);
    if (concept?.stage !== undefined && !stageIds.has(concept.stage)) errors.push(`${where}: la parada "${concept.stage}" no existe.`);
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
