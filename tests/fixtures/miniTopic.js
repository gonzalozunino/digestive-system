// The smallest possible topic: two levels (difficulty chosen by position), written questions only, no concepts, hero or sceneries.
const q = (prompt, correct, explanation) => ({ prompt, answers: [correct, "Otra", "Ninguna", "No sé"], explanation });

export default {
  id: "colores",
  subject: "Colores",
  pitch: "Responde preguntas de colores.",
  levels: [
    { id: "primarios", name: "Colores primarios", intro: "Rojo, azul y amarillo.",
      questions: [q("¿Es el rojo primario?", "Sí", "El rojo es primario."), q("¿Es el azul primario?", "Sí", "El azul es primario."), q("¿Es el amarillo primario?", "Sí", "El amarillo es primario.")] },
    { id: "mezclas", name: "Mezclas", intro: "Mezclando colores salen otros.",
      questions: [q("Rojo + amarillo", "Naranja", "Rojo y amarillo dan naranja."), q("Azul + amarillo", "Verde", "Azul y amarillo dan verde."), q("Rojo + azul", "Violeta", "Rojo y azul dan violeta.")] },
  ],
};
