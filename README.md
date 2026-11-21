# El Viaje de Bolo

Juego de trivia en español sobre el sistema digestivo, para niños de unos 11 años.

Eres **Bolo**, un bocado de comida que recorre boca → esófago → estómago → intestino delgado → intestino grueso.
Salta obstáculos al ritmo de la música, junta los jugos digestivos de cada órgano y responde las preguntas de los portales.

- Saltar: tocar la pantalla, clic, `Espacio` o `↑` (mantén pulsado para saltar seguido)
- Preguntas: clic o teclas `1`–`4`
- `P` / `Esc`: pausa · `M`: silenciar
- Modo Fácil (5 vidas, más lento) y Normal (3 vidas)
- Los récords se guardan en el navegador del dispositivo.

## Cómo jugarlo

```sh
npm install      # una sola vez
npm run build    # crea dist/index.html: un único archivo que se abre con doble clic, sin internet
npm run dev      # para desarrollar: http://localhost:8000
npm test         # pruebas
```

`index.html` en la raíz usa módulos de JavaScript, así que necesita `npm run dev`; para jugar sin servidor usa `dist/index.html`.

## Preguntas

Basadas en los temas a evaluar: función del sistema digestivo; ingestión y digestión; órganos, glándulas y partes con su función; y el recorrido del alimento.
En cada partida salen 15 preguntas (3 por órgano) elegidas al azar: una general, una sobre los órganos y glándulas de ese tramo y una propia del órgano.
Las preguntas sobre funciones y recorrido se arman con respuestas mezcladas distintas cada vez, y el juego recuerda cuáles ya salieron para no repetirlas.

Para cambiar o agregar preguntas, edita `src/data/questions.js` (la primera respuesta es la correcta) y `src/data/anatomy.js` (órganos y sus funciones).

## Estructura

| Carpeta | Qué contiene |
|---|---|
| `index.html` | Estructura: pantalla de juego, HUD y pantallas |
| `styles/` | Estilos: tokens, base y un archivo por pantalla |
| `src/data/` | Contenido y configuración: niveles, obstáculos, preguntas, textos, sonidos, música, física y puntaje |
| `src/entities/` | El jugador (Bolo) |
| `src/systems/` | Construcción de niveles, colisiones, efectos, preguntas y récords |
| `src/game/` | Reglas del juego y máquina de estados |
| `src/render/` | Dibujo en canvas |
| `src/ui/` | Pantallas (DOM) |
| `src/audio/` | Motor de audio, efectos y música |
| `src/input/` | Teclado y toques |
| `src/assets/` | Dibujo de la mascota (todo el arte y sonido se generan por código) |
| `src/core/`, `src/utils/` | Bucle del juego y utilidades |
| `tests/` | Pruebas unitarias |
| `scripts/` | Servidor de desarrollo y build |

Las reglas de arquitectura del proyecto están en `CLAUDE.md`.
