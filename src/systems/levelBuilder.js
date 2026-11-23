// Builds the list of world items (obstacles, pads, pickups, portals, goal) for a level from data.
import { WORLD, LAYOUT, ITEM_SIZES } from "../data/config.js";
import { PATTERNS, OBSTACLE_POOLS, COLLECTIBLE_ARC } from "../data/obstaclePatterns.js";
import { pickOne, randomBetween } from "../utils/random.js";

const T = WORLD.tile;
const GROUND = WORLD.groundY;

/** Converts one pattern item (tile units) into world items (px) placed at `originX`. */
function placePatternItem(spec, originX, rng) {
  const x = originX + spec.x * T;
  const lift = (spec.lift ?? 0) * T;
  switch (spec.type) {
    case "spike":
      return [{ type: "spike", x, y: GROUND - T - lift, w: T, h: T }];
    case "block":
      return [{ type: "block", x, y: GROUND - spec.h * T - lift, w: spec.w * T, h: spec.h * T }];
    case "pad":
      return [{ type: "pad", x, y: GROUND - ITEM_SIZES.pad.h, ...ITEM_SIZES.pad }];
    case "collectible":
      return [collectible(x, spec.lift)];
    case "arc":
      return rng() < spec.chance ? collectibleArc(x, spec.count) : [];
    default:
      throw new Error(`Unknown pattern item type: ${spec.type}`);
  }
}

function collectible(x, liftTiles) {
  return { type: "collectible", x, y: GROUND - liftTiles * T, r: ITEM_SIZES.collectibleRadius };
}

function collectibleArc(centerX, count) {
  const middle = (count - 1) / 2;
  return Array.from({ length: count }, (_, k) => {
    const offset = k - middle;
    const lift = COLLECTIBLE_ARC.peakLift - Math.abs(offset) * COLLECTIBLE_ARC.dropPerStep;
    return collectible(centerX + offset * COLLECTIBLE_ARC.spacing * T, lift);
  });
}

/** Turns a pattern into world items starting at x (px). Also used by the tests' level solver. */
export function placePattern(name, x, rng = Math.random) {
  return PATTERNS[name].items.flatMap(spec => placePatternItem(spec, x, rng));
}

/**
 * @param {string} difficultyKey key of DIFFICULTY (data/config.js)
 * @param {{gapTiles:[number,number], patterns:number, questions:number}} difficulty
 * @returns {{items: object[], length: number}}
 */
export function buildLevel(difficultyKey, difficulty, rng = Math.random) {
  const pool = OBSTACLE_POOLS[difficultyKey];
  const items = [];
  let x = LAYOUT.startX;

  const addPatterns = count => {
    for (let i = 0; i < count; i++) {
      const name = pickOne(pool, rng);
      items.push(...placePattern(name, x, rng));
      x += PATTERNS[name].width * T + T * randomBetween(...difficulty.gapTiles, rng);
    }
  };

  for (let q = 0; q < difficulty.questions; q++) {
    addPatterns(difficulty.patterns + q * LAYOUT.extraPatternsPerSection);
    x += LAYOUT.beforePortal;
    items.push({ type: "portal", x, y: GROUND - ITEM_SIZES.portal.h, ...ITEM_SIZES.portal });
    if (q === LAYOUT.heartAfterQuestion) {
      items.push({ type: "heart", x: x + LAYOUT.heartOffset, y: GROUND - ITEM_SIZES.heartLift, r: ITEM_SIZES.heartRadius });
    }
    x += LAYOUT.afterPortal;
  }
  addPatterns(difficulty.patterns);
  x += LAYOUT.beforeGoal;
  items.push({ type: "goal", x, y: GROUND - ITEM_SIZES.goal.h, ...ITEM_SIZES.goal });

  items.sort((a, b) => a.x - b.x);
  // Variant picks which of the level's collectible kinds/colors each pickup shows.
  items.filter(it => it.type === "collectible").forEach((it, i) => { it.variant = i; });
  return { items, length: x };
}
