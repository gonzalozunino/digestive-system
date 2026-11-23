# Trivia Runner

Juego de saltos y trivia en español para chicos de primaria, al estilo de Geometry Dash. El personaje corre solo: hay que saltar obstáculos, juntar coleccionables y responder las preguntas de los portales **?**.

Cada tema se divide en **niveles independientes** (por ejemplo: Boca, Faringe, Esófago, Estómago…), cada uno con su propia dificultad y con preguntas de su parte del tema. Se eligen desde un selector de niveles que muestra el mejor avance en %.

El juego no depende del tema: cada tema (sistema digestivo, sistema solar…) es una carpeta en `topics/` con su contenido. Para un tema nuevo alcanza con escribir ese archivo.

- Saltar: tocar la pantalla, clic, `Espacio` o `↑` (mantén pulsado para saltar seguido)
- Preguntas: clic o teclas `1`–`4` · `P`/`Esc`: pausa · `M`: silenciar
- Dificultades de los niveles: 🙂 **Fácil**, 😐 **Normal**, 😠 **Difícil**, 😡 **Muy difícil**, 🤯 **Extremo** y 👹 **Demonio**. Cuanto más difícil, más rápido, menos vidas, más preguntas y saltos más complejos:

  | Dificultad | Vidas | Preguntas | Saltos nuevos |
  |---|---|---|---|
  | Fácil | 5 | 3 | pinchos y cajas simples |
  | Normal | 4 | 3 | escaleras, caja + pincho |
  | Difícil | 3 | 3 | puentes, **pads de salto** 🟡 |
  | Muy difícil | 3 | 4 | **techos bajos** (no saltar debajo), muros con pad, pincho sobre caja |
  | Extremo | 2 | 4 | pilares en ritmo, escalera de 3 |
  | Demonio | 2 | 5 | puente largo, muros seguidos, todo junto |
- Personajes: Robi (robot), Mishi (gata), Zip (ovni), Gelo (slime) y, si el tema trae uno, su propio personaje (por ejemplo Bolo en el sistema digestivo)
- Los récords se guardan en el navegador, por separado para cada tema.

## Cómo jugarlo

```sh
npm install                              # una sola vez
npm run build                            # crea dist/<tema>.html con el tema de src/activeTopic.js
npm run build -- --topic=sistema-solar   # u otro tema de la carpeta topics/
npm run dev                              # para desarrollar: http://localhost:8000 (acepta --topic=… también)
npm test                                 # pruebas
```

El archivo de `dist/` es un único HTML que se abre con doble clic y funciona sin internet. Cada versión del juego trae **un solo tema**.

## Temas incluidos

| Tema | Carpeta | Contenido |
|---|---|---|
| Sistema digestivo | `topics/sistema-digestivo/` | 7 niveles: Boca y Faringe (Fácil), Esófago (Normal), Estómago (Difícil), Intestino delgado (Muy difícil), Intestino grueso (Extremo) y Recorrido completo (Demonio). Personaje y escenarios propios |
| El sistema solar | `topics/sistema-solar/` | Ejemplo chico: 3 niveles, escenarios y personajes genéricos |

## Cómo crear un tema nuevo

1. Crea la carpeta `topics/<mi-tema>/` con un archivo `index.js` (copia `topics/sistema-solar/index.js` como punto de partida).
2. Completa el contenido:

```js
export default {
  id: "mi-tema",                      // minúsculas y guiones; igual que la carpeta
  subject: "Nombre del tema",         // se muestra en el menú
  pitch: "Una frase que invita a jugar.",
  collectHelp: "Qué se junta en el camino.",   // opcional

  levels: [                            // los niveles, del más fácil al más difícil
    {
      id: "nivel-1", name: "Primer nivel", shortName: "Nivel 1", emoji: "🌟",
      difficulty: "facil",             // facil, normal, dificil, muy-dificil, extremo, demonio (si falta: según el orden)
      intro: "Texto que se muestra antes de empezar el nivel.",
      general: true,                   // opcional: este nivel también usa las preguntas generales
      scenery: "forest",               // opcional: forest, ocean, cave, volcano, space
      collectible: { style: "star", names: ["estrella"], colors: ["#ffe066"], hint: "Junta ⭐ estrellas." },  // opcional
      questions: [
        { prompt: "¿Pregunta?", answers: ["Correcta", "Incorrecta", "Incorrecta", "Incorrecta"], explanation: "Dato que se muestra al responder." },
      ],
    },
  ],
  generalQuestions: [ /* preguntas sobre el tema en general, mismo formato (se usan en niveles con general: true) */ ],
};
```

   - La **respuesta correcta va siempre primera**; el juego las mezcla.
   - Cada nivel necesita tantas preguntas como pide su dificultad (3, 4 o 5), sumando las suyas, las de sus conceptos y las generales si tiene `general: true`.
   - Si dos preguntas hablan de lo mismo, dales el mismo `group` para que no salgan en la misma partida.

3. Opcional, para que el juego invente preguntas variadas por su cuenta:
   - `concepts`: lista de conceptos con `id`, `name` (con artículo: "el hígado"), `role` (qué hace o qué lo caracteriza), `level` y, si hace falta, `plural`, `categories`, `outsideSequence`, `similarTo`.
   - `sequence`: ids de conceptos en orden (un recorrido, una secuencia de pasos…) → preguntas de "qué viene después" y "cuál es el orden".
   - `categories`: grupos de conceptos (ej. "planeta gaseoso") → preguntas de "cuál de estos es…".
   - `questionWording`: cómo se redactan esas preguntas en este tema (ver `src/topic/defaults.js`).
4. Opcional: un personaje propio (`hero`), escenarios propios (`sceneries`) y textos del final de un nivel (`finish`, en el tema o en cada nivel). El sistema digestivo es el ejemplo completo.
5. Pruébalo con `npm run dev -- --topic=mi-tema` y `npm test`. Si algo falta o está mal, el juego y las pruebas muestran exactamente qué corregir.
6. Para que sea el tema por defecto, cambia la línea de `src/activeTopic.js`.

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `topics/` | Los temas: contenido (paradas, preguntas, conceptos) y, si quieren, personaje y escenarios propios |
| `index.html` | Estructura: pantalla de juego, HUD y pantallas |
| `styles/` | Estilos: tokens, base y un archivo por pantalla |
| `src/data/` | Configuración del motor: física, dificultad, obstáculos, puntaje, textos, sonidos, música |
| `src/topic/` | Validación del tema y valores por defecto |
| `src/characters/` | Personajes genéricos |
| `src/entities/` | El jugador |
| `src/systems/` | Construcción de niveles, colisiones, efectos, preguntas, avance por nivel y récords |
| `src/game/` | Reglas del juego y máquina de estados |
| `src/render/` | Dibujo en canvas: escenarios genéricos, obstáculos, coleccionables |
| `src/ui/` | Pantallas (DOM) |
| `src/audio/`, `src/input/` | Sonido y controles |
| `src/core/`, `src/utils/` | Bucle del juego y utilidades |
| `tests/` | Pruebas: incluye un tema mínimo de ejemplo y un "solucionador" que comprueba que todos los saltos de cada dificultad se pueden pasar |
| `scripts/` | Servidor de desarrollo y build |

Las reglas de arquitectura del proyecto están en `CLAUDE.md`.
