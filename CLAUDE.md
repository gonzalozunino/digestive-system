# Trivia Runner: project rules

A Spanish trivia + runner game for primary-school kids. The engine works with any topic; each build ships one topic from `topics/`. Plain HTML/CSS/JS (ES modules), no framework.

## Architecture rules (always follow)

Markup defines structure. Styles define appearance. Logic defines behavior. Data defines content and configuration.

1. **Separate layers.** HTML only in `index.html`; CSS only in `styles/`; behavior in `src/`; engine tuning in `src/data/`; topic content in `topics/`. No inline styles in markup, no colors or copy hardcoded in logic.
2. **The engine knows no topic.** Nothing in `src/` may mention a specific subject (organs, planets…). Topic-specific content, wording, characters and sceneries live in `topics/<id>/`. A new topic must need no engine changes.
3. **Data-driven.** Numbers (physics, speeds, difficulty, scoring, timings), obstacle patterns, texts, sounds and music live in `src/data/`. Change them there, not in gameplay code.
4. **Modules with one job.** The game core (`src/game`, `src/systems`, `src/entities`, `src/topic`) must not touch the DOM, canvas or audio; it reports what happened through events (see the header of `src/game/Game.js`). `src/main.js` wires modules together and holds no rules or drawing.
5. **Dependencies point inward:** `ui`, `render`, `audio`, `input`, `characters` → `game` → `systems`/`entities`/`topic` → `data`/`utils`. Topics may import drawing helpers from `src/characters/face.js` and `src/render/canvasUtils.js` for their own hero and sceneries.
6. **Before changing code:** read the relevant modules, put the change in the right layer, reuse existing systems, avoid new dependencies and duplicated code.
7. **After changing code:** run `npm test`, run the game (`npm run dev`, also with `--topic=sistema-solar`), and explain any new module or dependency.

## Folder map

| Folder | Responsibility |
|---|---|
| `topics/<id>/index.js` | A topic: stages, questions, optional concepts/sequence/categories, wording, hero, sceneries, finish texts |
| `src/activeTopic.js` | Which topic this build uses (overridable with `--topic=<id>`) |
| `src/topic/` | `validateTopic` (Spanish error messages for topic authors), `prepareTopic` (defaults), `defaults.js` |
| `index.html` | Markup: stage, HUD and overlay screens |
| `styles/` | Tokens, base, and one stylesheet per screen; `main.css` imports them |
| `src/data/` | Engine config: physics, difficulty, layout, scoring, obstacle patterns/pools, texts, sounds, music, visuals, controls |
| `src/characters/` | Generic playable characters and the shared face helper; interface documented in `index.js` |
| `src/entities/` | Player state and movement |
| `src/systems/` | Stage building, collisions, effects state, question factory/picker/history, records |
| `src/game/` | `Game` state machine and rules; `states.js` |
| `src/render/` | Canvas drawing: generic sceneries (interface in `scenery.js`), sprites, collectibles, effects, `Renderer` |
| `src/ui/` | DOM views, one per screen, plus screen manager and stage scaling |
| `src/audio/`, `src/input/`, `src/core/`, `src/utils/` | Audio engine, input → actions, game loop, helpers |
| `tests/` | `node --test` suites; every topic in `topics/` is validated automatically; `fixtures/miniTopic.js` proves the engine works with a bare topic |
| `scripts/` | Dev server and single-file build (`--topic=<id>`) |

## Commands

- `npm install`: once, installs esbuild (only needed to build)
- `npm run dev [-- --topic=<id>]`: serves the game at http://localhost:8000 (modules don't load from `file://`)
- `npm test`: unit tests
- `npm run build [-- --topic=<id>]`: writes `dist/<id>.html`, a single self-contained file that works offline

## Content conventions

- Questions: the correct answer is always **first** in `answers`; they are shuffled at play time. Use `group` when two questions cover the same idea so they don't appear in the same game.
- Concept names carry their Spanish article ("el hígado", "la Tierra"); generated questions rely on it.
- All player-facing text is in Spanish. The sistema digestivo topic follows the school syllabus: función del sistema digestivo; ingestión y digestión; órganos, glándulas y partes con su función; recorrido del alimento.
