// Characters the player can choose, independent of the topic. A topic may add its own `hero`.
//
// Character interface:
//   id, name, tagline   e.g. "robot", "Robi", "un robot explorador" (menu: "Eres Robi, un robot explorador.")
//   color               main color, used by the UI
//   portrait(mood)      SVG markup; mood is "happy" | "think" | "sad" | "wow"
//   draw(ctx, options)  canvas drawing centered at (0,0); options: { radius, grounded, time, tint }
//                       (`tint` is only passed to a topic's own hero, from level.heroTint)
import { robot } from "./robot.js";
import { cat } from "./cat.js";
import { ufo } from "./ufo.js";
import { slime } from "./slime.js";

export const GENERIC_CHARACTERS = [robot, cat, ufo, slime];

/** The topic's hero (if any) comes first and is the default choice. */
export const charactersFor = topicModule => [topicModule.hero, ...GENERIC_CHARACTERS].filter(Boolean);
