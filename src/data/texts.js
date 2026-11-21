// Text shown by the engine (static copy lives in index.html). Placeholders look like {name}.
// Topics can override `finish` texts and question wording; see src/topic/defaults.js.

export const GAME_NAME = "Trivia Runner";

export const MASCOT_LINES = {
  ask: ["¡Tú puedes!", "Piénsalo bien…", "¡Esta es fácil!", "Mmm… ¿cuál será?", "¡Concéntrate!", "¡Vamos, crack!"],
  correct: ["¡Genial!", "¡Increíble!", "¡Eres un genio!", "¡Correcto!", "¡Bravo!", "¡Toma ya!"],
  wrong: ["¡Uy, casi!", "¡Ay, no!", "¡Ups!", "¡Por poquito!"],
};

export const TEXTS = {
  documentTitle: "{subject} · {game}",
  menuLead: "Eres {hero}, {tagline}. {pitch}",
  helpStages: "Cruza las {count} paradas: {list}.",
  stageStep: "Parada {number} de {total}",
  quizCounter: "Pregunta {number} de {total} · {emoji} {stage}",
  streak: "🔥 Racha x{streak}",
  correctTitle: "✅ ¡Correcto!",
  wrongTitle: "❌ La respuesta era:",
  explanationPrefix: "💡 ",
  continue: "Seguir ▶",
  seeResults: "Ver resultado",
  loseTitle: "¡Oh no, te quedaste sin vidas!",
  loseText: "Llegaste a la parada {number}: {stage}. Respondiste bien {correct} de {asked} preguntas. ¡Inténtalo otra vez!",
  finalScore: "⭐ {score} puntos",
  score: "⭐ {score}",
  recordsEmpty: "Todavía no hay récords. ¡Sé el primero!",
  recordsFinished: "¡La meta!",
  anonymous: "Anónimo",
  goalNext: "SIGUIENTE",
  muteOn: "🔇",
  muteOff: "🔊",
  topicError: "El tema tiene errores:",
};

export const MEDALS = ["🥇", "🥈", "🥉"];
