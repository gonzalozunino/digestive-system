# El Viaje de Bolo: project rules

A Spanish trivia + runner game about the digestive system, for 11-year-olds. Plain HTML/CSS/JS (ES modules), no framework.

## Architecture rules (always follow)

Markup defines structure. Styles define appearance. Logic defines behavior. Data defines content and configuration.

1. **Separate layers.** HTML only in `index.html`; CSS only in `styles/`; behavior in `src/`; content and tuning in `src/data/`. No inline styles in markup, no colors or copy hardcoded in logic.
2. **Data-driven.** Numbers (physics, speeds, scoring, timings), level content, obstacle patterns, questions, texts, sounds and music live in `src/data/`. Change content there, not in gameplay code.
3. **Modules with one job.** Keep modules small. The game core (`src/game`, `src/systems`, `src/entities`) must not touch the DOM, canvas or audio; it reports what happened through events (see the header of `src/game/Game.js`). `src/main.js` wires modules together and holds no rules or drawing.
4. **Dependencies point inward:** `ui`, `render`, `audio`, `input` → `game` → `systems`/`entities` → `data`/`utils`. Never the other way round.
5. **Before changing code:** read the relevant modules, put the change in the right layer, reuse existing systems, avoid new dependencies and duplicated code.
6. **After changing code:** run `npm test`, run the game (`npm run dev`), and explain any new module or dependency.

## Folder map

| Folder | Responsibility |
|---|---|
| `index.html` | Markup: stage, HUD and overlay screens |
| `styles/` | Tokens, base, and one stylesheet per screen; `main.css` imports them |
| `src/data/` | Config, levels, obstacle patterns, questions, anatomy, texts, sounds, music, visuals, controls |
| `src/entities/` | Player state and movement |
| `src/systems/` | Level building, collisions, effects state, question factory/picker/history, records |
| `src/game/` | `Game` state machine and rules; `states.js` |
| `src/render/` | Canvas drawing: scenery, sprites, effects, `Renderer` |
| `src/ui/` | DOM views, one per screen, plus screen manager and stage scaling |
| `src/audio/` | Web Audio engine, sound effects, music sequencer |
| `src/input/` | Keyboard/pointer → named actions |
| `src/assets/` | Generated art (mascot SVG). All art and sound are procedural; there are no image or audio files |
| `src/core/` | Game loop |
| `src/utils/` | Random, storage, text, event emitter |
| `tests/` | Unit tests (`node --test`) for pure modules |
| `scripts/` | Dev server and single-file build |

## Commands

- `npm install`: once, installs esbuild (only needed to build)
- `npm run dev`: serves the game at http://localhost:8000 (modules don't load from `file://`)
- `npm test`: unit tests
- `npm run build`: writes `dist/index.html`, a single self-contained file that works offline

## Content conventions

- Questions: the correct answer is always **first** in `answers`; they are shuffled at play time. Use `group` when two questions cover the same topic so they don't appear in the same game.
- Topics follow the school syllabus: función del sistema digestivo; ingestión y digestión; órganos, glándulas y partes con su función; recorrido del alimento.
- All player-facing text is in Spanish.
