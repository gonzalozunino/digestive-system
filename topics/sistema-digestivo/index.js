// Topic: Sistema digestivo (5º-6º grado).
// Syllabus: función del sistema digestivo; ingestión y digestión; órganos, glándulas y partes
// con su función; recorrido del alimento. See CLAUDE.md for the topic format.
// Levels follow the path of the food and get harder along the way; the last one mixes everything.
import { LEVEL_QUESTIONS, GENERAL_QUESTIONS } from "./questions.js";
import { CONCEPTS, SEQUENCE } from "./concepts.js";
import { bolo } from "./hero.js";
import { SCENERIES } from "./sceneries.js";

const JUICES = { style: "drop", names: ["saliva", "jugo gástrico", "bilis", "jugo pancreático"], colors: ["#9fe3ff", "#e8ff3a", "#8fd14f", "#ffa54a"] };

export default {
  id: "sistema-digestivo",
  subject: "Sistema digestivo",
  pitch: "Recorre el sistema digestivo nivel por nivel: salta obstáculos, junta jugos digestivos y responde las preguntas de los portales.",
  collectHelp: "Junta jugos digestivos (saliva, jugo gástrico, bilis…): te ayudan a digerirte y dan puntos.",

  hero: bolo,
  sceneries: SCENERIES,

  levels: [
    {
      id: "boca", name: "La Boca", shortName: "Boca", emoji: "👄", difficulty: "facil", scenery: "teeth", heroTint: "#f3c37a",
      general: true,
      intro: "Aquí empieza la digestión: los dientes trituran la comida y la saliva la ablanda. ¡Esquiva los dientes!",
      heroNote: "Ahora eres: un bocado de comida que se convierte en bolo alimenticio.",
      collectible: { style: "drop", names: ["saliva"], colors: ["#9fe3ff"],
        hint: "Junta 💧 gotas de saliva: ablandan la comida y empiezan a digerir el almidón del pan y el arroz." },
      questions: LEVEL_QUESTIONS.boca,
    },
    {
      id: "faringe", name: "La Faringe", shortName: "Faringe", emoji: "🔀", difficulty: "facil", scenery: "throat", heroTint: "#efbb72",
      intro: "La garganta es un cruce: el aire va a los pulmones y la comida al esófago. ¡La epiglotis cuida el paso!",
      heroNote: "Ahora eres: el bolo alimenticio, a punto de ser tragado.",
      collectible: { style: "drop", names: ["saliva"], colors: ["#b5ecff"],
        hint: "Junta 💧 gotas de saliva: ayudan a que el bolo resbale al tragar." },
      questions: LEVEL_QUESTIONS.faringe,
    },
    {
      id: "esofago", name: "El Esófago", shortName: "Esófago", emoji: "🌀", difficulty: "normal", scenery: "rings", heroTint: "#e9b36a",
      intro: "Un tubo de unos 25 cm. Sus músculos te empujan hacia abajo con movimientos peristálticos.",
      heroNote: "Ahora eres: el bolo alimenticio, deslizándote hacia el estómago.",
      collectible: { style: "drop", names: ["moco"], colors: ["#d6f5a0"],
        hint: "Junta 💧 gotas de moco: cubren el esófago para que resbales más fácil hacia abajo." },
      questions: LEVEL_QUESTIONS.esofago,
    },
    {
      id: "estomago", name: "El Estómago", shortName: "Estómago", emoji: "🧪", difficulty: "dificil", scenery: "acid", heroTint: "#c9d36b",
      intro: "¡Cuidado con el ácido! El jugo gástrico mezcla y deshace la comida durante horas. Aparecen los pads de salto.",
      heroNote: "Ahora eres: quimo, una papilla espesa y ácida.",
      collectible: { style: "drop", names: ["jugo gástrico"], colors: ["#e8ff3a"],
        hint: "Junta 💧 gotas de jugo gástrico: su ácido y sus enzimas deshacen las proteínas." },
      questions: LEVEL_QUESTIONS.estomago,
    },
    {
      id: "delgado", name: "El Intestino Delgado", shortName: "Int. delgado", emoji: "🪱", difficulty: "muy-dificil", scenery: "villi", heroTint: "#f0d9a0",
      intro: "¡Unos 6 metros de curvas! Aquí los nutrientes pasan a la sangre gracias a las vellosidades. Ojo con los techos bajos.",
      heroNote: "Ahora eres: quilo, un líquido lleno de nutrientes.",
      collectible: { style: "drop", names: ["bilis", "jugo pancreático"], colors: ["#8fd14f", "#ffa54a"],
        hint: "Junta 💧 bilis (verde, del hígado) y jugo pancreático (naranja, del páncreas): terminan de digerir todo." },
      questions: LEVEL_QUESTIONS.delgado,
    },
    {
      id: "grueso", name: "El Intestino Grueso", shortName: "Int. grueso", emoji: "🦠", difficulty: "extremo", scenery: "colon", heroTint: "#a8743f",
      intro: "Aquí se absorbe el agua y las bacterias buenas ayudan. ¡El camino se pone muy difícil!",
      heroNote: "Ahora eres: restos que no sirven… ¡futuras heces! 💩",
      collectible: { style: "microbe", names: ["bacterias buenas"], colors: ["#7ed957", "#6fc3ff", "#ff9ecb"],
        hint: "Junta 🦠 bacterias buenas: ayudan a digerir la fibra y fabrican algunas vitaminas." },
      questions: LEVEL_QUESTIONS.grueso,
      finish: { label: "SALIDA", icon: "🚽" },
    },
    {
      id: "recorrido", name: "Recorrido Completo", shortName: "Recorrido", emoji: "🏁", difficulty: "demonio", scenery: "acid", heroTint: "#f3c37a",
      general: true,
      intro: "El desafío final: todo el sistema digestivo de una vez, a máxima velocidad. Preguntas de todo el recorrido.",
      heroNote: "Ahora eres: un bocado de comida dispuesto a recorrer los 9 metros de una sola vez.",
      collectible: { ...JUICES, hint: "Junta 💧 todos los jugos digestivos: saliva, jugo gástrico, bilis y jugo pancreático." },
      finish: {
        label: "SALIDA", icon: "🚽",
        winTitle: "¡Misión cumplida! 🚽🎉",
        winText: "Recorriste todo el sistema digestivo: ¡unos 9 metros de aventura! Respondiste bien {correct} de {asked} preguntas.",
      },
    },
  ],

  generalQuestions: GENERAL_QUESTIONS,

  concepts: CONCEPTS,
  sequence: SEQUENCE,
  categories: [
    { id: "gland", prompt: "¿Cuál de estas es una glándula anexa del sistema digestivo?",
      explanation: "Las glándulas anexas son las glándulas salivales, el hígado y el páncreas: fabrican jugos que ayudan a digerir." },
  ],
  questionWording: {
    conceptFor: "¿Qué parte del sistema digestivo se encarga de {role}?",
    sequenceNext: "En el recorrido del alimento, ¿a qué órgano pasa después {deName}?",
    sequenceOrder: "¿En qué orden pasa el alimento por estos órganos?",
    sequenceFirst: "De estos órganos, ¿por cuál pasa PRIMERO el alimento?",
    sequenceExplanation: "El recorrido es: {sequence}.",
    outside: "¿Por cuál de estos órganos NO pasa el alimento?",
    outsideExplanation: "El alimento no pasa por {name}: es un órgano anexo que ayuda a la digestión desde afuera del tubo digestivo.",
  },
};
