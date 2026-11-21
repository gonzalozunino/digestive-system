// Builds the list of world items (obstacles, pickups, portals, goal) for a level from data.
import { WORLD, LAYOUT, ITEM_SIZES } from "../data/config.js";
import { LEVELS } from "../data/levels.js";
import { PATTERNS, COLLECTIBLE_ARC } from "../data/obstaclePatterns.js";
import { pickOne, randomBetween } from "../utils/random.js";

const T = WORLD.tile;
const GROUND = WORLD.groundY;

/** Converts one pattern item (tile units) into world items (px) placed at `originX`. */
function placePatternItem(spec, originX, rng) {
  const x = originX + spec.x * T;
  switch (spec.type) {
    case "spike":
      return [{ type: "spike", x, y: GROUND - T, w: T, h: T }];
    case "block":
      return [{ type: "block", x, y: GROUND - spec.h * T, w: spec.w * T, h: spec.h * T }];
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

/**
 * @param {number} levelIndex
 * @param {{gapTiles:[number,number]}} difficulty
 * @returns {{items: object[], length: number}}
 */
export function buildLevel(levelIndex, difficulty, rng = Math.random) {
  const level = LEVELS[levelIndex];
  const items = [];
  let x = LAYOUT.startX;

  const gap = () => T * randomBetween(...difficulty.gapTiles, rng) * (1 - levelIndex * LAYOUT.gapShrinkPerLevel);
  const addPatterns = count => {
    for (let i = 0; i < count; i++) {
      const pattern = PATTERNS[pickOne(level.obstacles, rng)];
      pattern.items.forEach(spec => items.push(...placePatternItem(spec, x, rng)));
      x += pattern.width * T + gap();
    }
  };

  for (let q = 0; q < LAYOUT.questionsPerLevel; q++) {
    addPatterns(LAYOUT.patternsBeforeQuestion + levelIndex + q);
    x += LAYOUT.beforePortal;
    items.push({ type: "portal", x, y: GROUND - ITEM_SIZES.portal.h, ...ITEM_SIZES.portal });
    if (q === LAYOUT.heartAfterQuestion) {
      items.push({ type: "heart", x: x + LAYOUT.heartOffset, y: GROUND - ITEM_SIZES.heartLift, r: ITEM_SIZES.heartRadius });
    }
    x += LAYOUT.afterPortal;
  }
  addPatterns(LAYOUT.patternsBeforeGoal + levelIndex);
  x += LAYOUT.beforeGoal;
  items.push({ type: "goal", x, y: GROUND - ITEM_SIZES.goal.h, ...ITEM_SIZES.goal });

  items.sort((a, b) => a.x - b.x);
  // Variant picks which of the level's collectible kinds/colors each pickup shows.
  items.filter(it => it.type === "collectible").forEach((it, i) => { it.variant = i; });
  return { items, length: x };
}
