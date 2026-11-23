// Values used when a topic leaves something out.

export const COLLECTIBLE_STYLES = ["star", "gem", "drop", "microbe"];

export const DEFAULT_COLLECTIBLE = {
  style: "star",
  names: ["estrella"],
  colors: ["#ffe066"],
  hint: "Junta ⭐ estrellas para sumar puntos.",
};

/** Name shown in the "+10 …" label when a level does not name its collectible. */
export const COLLECTIBLE_NAMES = { star: "estrella", gem: "gema", drop: "gota", microbe: "microbio" };

export const DEFAULT_LEVEL_EMOJI = "⭐";

/**
 * Wording of generated questions. Placeholders: {name} (with article, e.g. "el hígado"),
 * {Name} (capitalized), {n} ("n" when the name is plural), {role}, {deName} ("del hígado"),
 * {sequence} (the whole sequence).
 */
export const DEFAULT_QUESTION_WORDING = {
  conceptRole: "¿Qué función cumple{n} {name}?",
  conceptRoleExplanation: "{Name}: {role}.",
  conceptFor: "¿Cuál de estos se encarga de {role}?",
  conceptForExplanation: "{Name} se encarga{n} de {role}.",
  sequenceNext: "¿Qué viene después {deName}?",
  sequenceOrder: "¿Cuál es el orden correcto?",
  sequenceFirst: "¿Cuál de estos va primero?",
  sequenceExplanation: "El orden es: {sequence}.",
  sequenceSeparator: " → ",
  outside: "¿Cuál de estos NO forma parte del recorrido?",
  outsideExplanation: "{Name} no forma parte del recorrido.",
};

/** End of a level: goal sign and victory texts ({level}, {correct}, {asked}). A topic or a level can override them. */
export const DEFAULT_FINISH = {
  label: "META",
  icon: "🏁",
  winTitle: "¡Nivel completado! 🎉",
  winText: "Completaste {level}. Respondiste bien {correct} de {asked} preguntas.",
};
