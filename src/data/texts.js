// Text shown by the engine (static copy lives in index.html). Placeholders look like {name}.
// Topics can override the end-of-level texts and question wording; see src/topic/defaults.js.

export const GAME_NAME = "Trivia Runner";

export const MASCOT_LINES = {
  ask: ["¡Tú puedes!", "Piénsalo bien…", "¡Esta es fácil!", "Mmm… ¿cuál será?", "¡Concéntrate!", "¡Vamos, crack!"],
  correct: ["¡Genial!", "¡Increíble!", "¡Eres un genio!", "¡Correcto!", "¡Bravo!", "¡Toma ya!"],
  wrong: ["¡Uy, casi!", "¡Ay, no!", "¡Ups!", "¡Por poquito!"],
};

/** Name and face of each difficulty (keys match DIFFICULTY in config.js). */
export const DIFFICULTY_LABELS = {
  facil: { label: "Fácil", icon: "🙂" },
  normal: { label: "Normal", icon: "😐" },
  dificil: { label: "Difícil", icon: "😠" },
  "muy-dificil": { label: "Muy difícil", icon: "😡" },
  extremo: { label: "Extremo", icon: "🤯" },
  demonio: { label: "Demonio", icon: "👹" },
};

export const TEXTS = {
  documentTitle: "{subject} · {game}",
  menuLead: "Eres {hero}, {tagline}. {pitch}",
  difficulty: "{icon} {label}",
  helpDifficulties: "Cada nivel tiene su dificultad: {list}. Cuanto más difícil, más rápido, con menos vidas y saltos más complejos.",
  levelHearts: "❤️ x{hearts} · ❓ x{questions}",
  bestProgress: "Mejor avance: {best}%",
  completed: "✅ Completado",
  quizCounter: "Pregunta {number} de {total} · {emoji} {level}",
  streak: "🔥 Racha x{streak}",
  correctTitle: "✅ ¡Correcto!",
  wrongTitle: "❌ La respuesta era:",
  explanationPrefix: "💡 ",
  continue: "Seguir ▶",
  seeResults: "Ver resultado",
  loseTitle: "¡Oh no, te quedaste sin vidas!",
  loseText: "Llegaste al {percent}% de {level}. Respondiste bien {correct} de {asked} preguntas. ¡Inténtalo otra vez!",
  loseTextEarly: "Llegaste al {percent}% de {level}. ¡Inténtalo otra vez!",
  newBest: "🏅 ¡Nuevo récord de avance en este nivel!",
  finalScore: "⭐ {score} puntos",
  score: "⭐ {score}",
  percent: "{percent}%",
  recordsEmpty: "Todavía no hay récords. ¡Sé el primero!",
  recordLevel: "{level} · {percent}%",
  anonymous: "Anónimo",
  muteOn: "🔇",
  muteOff: "🔊",
  topicError: "El tema tiene errores:",
};

export const MEDALS = ["🥇", "🥈", "🥉"];
