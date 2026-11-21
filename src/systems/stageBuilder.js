// Builds the list of world items (obstacles, pickups, portals, goal) for a stage from data.
import { WORLD, LAYOUT, ITEM_SIZES } from "../data/config.js";
import { PATTERNS, OBSTACLE_POOLS, COLLECTIBLE_ARC } from "../data/obstaclePatterns.js";
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

/** Obstacle mix for a stage: later stages (and harder difficulties) get harder patterns. */
export function obstaclePoolFor(stageIndex, difficulty) {
  const index = Math.min(stageIndex + (difficulty.obstacleBoost ?? 0), OBSTACLE_POOLS.length - 1);
  return OBSTACLE_POOLS[index];
}

/**
 * @param {number} stageIndex position of the stage in the topic (0-based)
 * @param {{gapTiles:[number,number], obstacleBoost?:number}} difficulty
 * @returns {{items: object[], length: number}}
 */
export function buildStage(stageIndex, difficulty, rng = Math.random) {
  const pool = obstaclePoolFor(stageIndex, difficulty);
  const shrink = 1 - Math.min(stageIndex, OBSTACLE_POOLS.length - 1) * LAYOUT.gapShrinkPerStage;
  const items = [];
  let x = LAYOUT.startX;

  const gap = () => T * randomBetween(...difficulty.gapTiles, rng) * shrink;
  const addPatterns = count => {
    for (let i = 0; i < count; i++) {
      const pattern = PATTERNS[pickOne(pool, rng)];
      pattern.items.forEach(spec => items.push(...placePatternItem(spec, x, rng)));
      x += pattern.width * T + gap();
    }
  };

  for (let q = 0; q < LAYOUT.questionsPerStage; q++) {
    addPatterns(LAYOUT.patternsBeforeQuestion + Math.min(stageIndex, OBSTACLE_POOLS.length - 1) + q);
    x += LAYOUT.beforePortal;
    items.push({ type: "portal", x, y: GROUND - ITEM_SIZES.portal.h, ...ITEM_SIZES.portal });
    if (q === LAYOUT.heartAfterQuestion) {
      items.push({ type: "heart", x: x + LAYOUT.heartOffset, y: GROUND - ITEM_SIZES.heartLift, r: ITEM_SIZES.heartRadius });
    }
    x += LAYOUT.afterPortal;
  }
  addPatterns(LAYOUT.patternsBeforeGoal + Math.min(stageIndex, OBSTACLE_POOLS.length - 1));
  x += LAYOUT.beforeGoal;
  items.push({ type: "goal", x, y: GROUND - ITEM_SIZES.goal.h, ...ITEM_SIZES.goal });

  items.sort((a, b) => a.x - b.x);
  // Variant picks which of the stage's collectible kinds/colors each pickup shows.
  items.filter(it => it.type === "collectible").forEach((it, i) => { it.variant = i; });
  return { items, length: x };
}
