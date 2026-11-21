// Text shown by code (static copy lives in index.html). Placeholders look like {name}.

export const MASCOT_LINES = {
  ask: ["¡Tú puedes!", "Piénsalo bien…", "¡Esta es fácil!", "Mmm… ¿cuál será?", "¡Concéntrate!", "¡Vamos, crack!"],
  correct: ["¡Genial!", "¡Increíble!", "¡Eres un genio!", "¡Correcto!", "¡Bravo!", "¡Toma ya!"],
  wrong: ["¡Uy, casi!", "¡Ay, no!", "¡Ups!", "¡Por poquito!"],
};

export const TEXTS = {
  levelStep: "Parada {number} de {total}",
  quizCounter: "Pregunta {number} de {total} · {emoji} {level}",
  streak: "🔥 Racha x{streak}",
  correctTitle: "✅ ¡Correcto!",
  wrongTitle: "❌ La respuesta era:",
  explanationPrefix: "💡 ",
  continue: "Seguir ▶",
  seeResults: "Ver resultado",
  winTitle: "¡Misión cumplida! 🚽🎉",
  loseTitle: "¡Oh no, te quedaste sin vidas!",
  winText: "Recorriste todo el sistema digestivo: ¡unos 9 metros de aventura! Respondiste bien {correct} de {asked} preguntas.",
  loseText: "Llegaste hasta {place}. Respondiste bien {correct} de {asked} preguntas. ¡Inténtalo otra vez!",
  finalScore: "⭐ {score} puntos",
  score: "⭐ {score}",
  recordsEmpty: "Todavía no hay récords. ¡Sé el primero!",
  recordsFinished: "¡La meta!",
  anonymous: "Anónimo",
  goalNext: "SIGUIENTE",
  goalExit: "SALIDA",
  goalExitIcon: "🚽",
  muteOn: "🔇",
  muteOff: "🔊",
};

export const MEDALS = ["🥇", "🥈", "🥉"];

// Templates for generated questions (see systems/questionFactory.js).
export const QUESTION_TEMPLATES = {
  roleOf: "¿Qué función cumple{pluralN} {name}?",
  roleOfExplanation: "{Name}: {role}.",
  partFor: "¿Qué parte del sistema digestivo se encarga de {role}?",
  partForExplanation: "{Name} se encarga{pluralN} de {role}.",
  nextInRoute: "En el recorrido del alimento, ¿a qué órgano pasa después {ofName}?",
  routeOrder: "¿En qué orden pasa el alimento por estos órganos?",
  firstInRoute: "De estos órganos, ¿por cuál pasa PRIMERO el alimento?",
  notInRoute: "¿Por cuál de estos órganos NO pasa el alimento?",
  notInRouteExplanation: "El alimento no pasa por {name}: es un órgano anexo que ayuda a la digestión desde afuera del tubo digestivo.",
  annexGland: "¿Cuál de estas es una glándula anexa del sistema digestivo?",
  annexGlandExplanation: "Las glándulas anexas son las glándulas salivales, el hígado y el páncreas: fabrican jugos que ayudan a digerir.",
  routeExplanation: "El recorrido es: {route}.",
  routeSeparator: " → ",
};
