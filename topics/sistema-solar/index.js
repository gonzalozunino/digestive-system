// Topic: El sistema solar. A small example that uses only generic characters and sceneries.
// Build it with: npm run build -- --topic=sistema-solar

const PLANETS = [
  { id: "mercurio", name: "Mercurio", level: "rocosos", role: "Está más cerca del Sol que todos los demás" },
  { id: "venus", name: "Venus", level: "rocosos", role: "Es el más caliente de todos" },
  { id: "tierra", name: "la Tierra", level: "rocosos", role: "Tiene agua líquida y seres vivos" },
  { id: "marte", name: "Marte", level: "rocosos", role: "Se ve rojo por el óxido de su suelo" },
  { id: "jupiter", name: "Júpiter", level: "gaseosos", categories: ["gaseous"], role: "Es el más grande de todos" },
  { id: "saturno", name: "Saturno", level: "gaseosos", categories: ["gaseous"], role: "Tiene los anillos más grandes y brillantes" },
  { id: "urano", name: "Urano", level: "gaseosos", categories: ["gaseous"], role: "Gira acostado, de costado" },
  { id: "neptuno", name: "Neptuno", level: "gaseosos", categories: ["gaseous"], role: "Está más lejos del Sol que todos los demás" },
];

export default {
  id: "sistema-solar",
  subject: "El sistema solar",
  pitch: "Viaja desde el Sol hasta el último planeta: salta obstáculos, junta estrellas y responde las preguntas de los portales.",
  collectHelp: "Junta estrellas ⭐ para sumar puntos.",

  levels: [
    {
      id: "sol", name: "El Sol", emoji: "☀️", difficulty: "facil", scenery: "volcano", general: true,
      intro: "El Sol es una estrella: una enorme bola de gas muy caliente que nos da luz y calor.",
      collectible: { style: "star", names: ["estrella"], colors: ["#ffe066"], hint: "Junta ⭐ estrellas para sumar puntos." },
      questions: [
        { prompt: "¿Qué es el Sol?", answers: ["Una estrella", "Un planeta", "Un satélite", "Un cometa"], explanation: "El Sol es la estrella más cercana a la Tierra." },
        { prompt: "¿Qué nos da el Sol?", answers: ["Luz y calor", "Agua", "Oxígeno", "Lluvia"], explanation: "Sin la luz y el calor del Sol no podría haber vida en la Tierra." },
        { prompt: "¿Qué giran alrededor del Sol?", answers: ["Los planetas", "Todas las estrellas", "Nada", "Solo la Luna"], explanation: "Los ocho planetas giran alrededor del Sol, cada uno en su órbita." },
        { prompt: "¿Cuánto tarda la luz del Sol en llegar a la Tierra?", answers: ["Unos 8 minutos", "1 segundo", "1 día", "1 año"], explanation: "La luz viaja muy rápido, pero el Sol está tan lejos que tarda unos 8 minutos." },
      ],
    },
    {
      id: "rocosos", name: "Planetas rocosos", shortName: "Rocosos", emoji: "🪨", difficulty: "normal", scenery: "space",
      intro: "Mercurio, Venus, la Tierra y Marte: los planetas más cercanos al Sol tienen superficie de roca.",
      collectible: { style: "star", names: ["estrella"], colors: ["#ffe066"], hint: "Junta ⭐ estrellas para sumar puntos." },
      questions: [
        { group: "mercurio", prompt: "¿Cuál es el planeta más cercano al Sol?", answers: ["Mercurio", "Venus", "La Tierra", "Marte"], explanation: "Mercurio es el primero y el más pequeño de los planetas." },
        { group: "marte", prompt: "¿Qué planeta es conocido como el planeta rojo?", answers: ["Marte", "Júpiter", "Venus", "Mercurio"], explanation: "Su suelo tiene mucho óxido de hierro, que lo hace ver rojo." },
        { group: "venus", prompt: "¿Cuál es el planeta más caliente?", answers: ["Venus", "Mercurio", "Marte", "La Tierra"], explanation: "Aunque Mercurio está más cerca del Sol, Venus es más caliente porque su atmósfera atrapa el calor." },
        { prompt: "¿Cómo se llama el satélite natural de la Tierra?", answers: ["La Luna", "Fobos", "Titán", "Europa"], explanation: "La Luna gira alrededor de la Tierra y tarda unos 27 días en dar una vuelta." },
      ],
    },
    {
      id: "gaseosos", name: "Planetas gaseosos", shortName: "Gaseosos", emoji: "🪐", difficulty: "dificil", scenery: "space",
      intro: "Júpiter, Saturno, Urano y Neptuno son gigantes hechos sobre todo de gases.",
      collectible: { style: "gem", names: ["cristal de hielo"], colors: ["#9fe3ff", "#c4b5fd"], hint: "Junta 💎 cristales de hielo para sumar puntos." },
      questions: [
        { group: "jupiter", prompt: "¿Cuál es el planeta más grande?", answers: ["Júpiter", "Saturno", "Neptuno", "La Tierra"], explanation: "En Júpiter cabrían más de mil planetas como la Tierra." },
        { group: "saturno", prompt: "¿Qué planeta es famoso por sus anillos brillantes?", answers: ["Saturno", "Marte", "Mercurio", "Venus"], explanation: "Júpiter, Urano y Neptuno también tienen anillos, pero los de Saturno son los más grandes y brillantes." },
        { group: "neptuno", prompt: "¿Cuál es el planeta más lejano del Sol?", answers: ["Neptuno", "Urano", "Saturno", "Marte"], explanation: "Neptuno es el octavo planeta. Plutón se considera un planeta enano desde 2006." },
        { prompt: "¿De qué están hechos principalmente Júpiter y Saturno?", answers: ["De gases", "De roca", "De hierro", "De arena"], explanation: "Están formados sobre todo por hidrógeno y helio." },
      ],
    },
  ],

  generalQuestions: [
    { prompt: "¿Cuántos planetas tiene el sistema solar?", answers: ["8", "9", "7", "12"], explanation: "Mercurio, Venus, la Tierra, Marte, Júpiter, Saturno, Urano y Neptuno." },
    { prompt: "¿Qué es una órbita?", answers: ["El camino que sigue un planeta alrededor del Sol", "Un tipo de estrella", "Un planeta pequeño", "La luz del Sol"], explanation: "Cada planeta recorre su propia órbita alrededor del Sol." },
    { prompt: "¿Qué causa el día y la noche?", answers: ["Que la Tierra gira sobre sí misma", "Que la Tierra gira alrededor del Sol", "Las nubes", "La Luna"], explanation: "Ese giro se llama rotación y dura unas 24 horas." },
    { prompt: "¿Cuánto tarda la Tierra en dar una vuelta alrededor del Sol?", answers: ["Un año", "Un día", "Un mes", "Una semana"], explanation: "Ese movimiento se llama traslación y dura unos 365 días." },
  ],

  concepts: PLANETS,
  sequence: PLANETS.map(p => p.id),
  categories: [
    { id: "gaseous", prompt: "¿Cuál de estos es un planeta gaseoso?", explanation: "Júpiter, Saturno, Urano y Neptuno son los planetas gaseosos." },
  ],
  questionWording: {
    conceptRole: "¿Qué característica tiene {name}?",
    conceptFor: "¿Qué planeta {role}?",
    conceptForExplanation: "{Name}: {role}.",
    sequenceNext: "Alejándonos del Sol, ¿qué planeta viene después {deName}?",
    sequenceOrder: "¿Cuál es el orden correcto, desde el Sol hacia afuera?",
    sequenceFirst: "¿Cuál de estos planetas está más cerca del Sol?",
    sequenceExplanation: "El orden desde el Sol es: {sequence}.",
  },
};
