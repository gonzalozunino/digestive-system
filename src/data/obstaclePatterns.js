// Obstacle patterns used to build levels. All positions are in tiles (see WORLD.tile).
// x: offset from the pattern start.
// spike: optional `lift` puts it on top of something that high.
// block: w/h size; optional `lift` makes it float (hitting it from below hurts: don't jump there!).
// pad: a jump pad that launches the player much higher than a normal jump.
// collectible: `lift` = height of its center above the ground.
// arc: a curve of `count` collectibles centered at x, added with probability `chance`.

export const PATTERNS = {
  /* ---- basics ---- */
  s1: { width: 1, items: [
    { type: "spike", x: 0 },
    { type: "arc", x: 0.5, count: 3, chance: 0.6 },
  ] },
  s2: { width: 2, items: [
    { type: "spike", x: 0 }, { type: "spike", x: 1 },
    { type: "arc", x: 1, count: 3, chance: 0.5 },
  ] },
  s3: { width: 3, items: [
    { type: "spike", x: 0 }, { type: "spike", x: 1 }, { type: "spike", x: 2 },
    { type: "arc", x: 1.5, count: 3, chance: 1 },
  ] },
  b1: { width: 1, items: [
    { type: "block", x: 0, w: 1, h: 1 },
  ] },
  bwide: { width: 4, items: [
    { type: "block", x: 0, w: 4, h: 1 },
    { type: "collectible", x: 1, lift: 1.75 }, { type: "collectible", x: 2, lift: 1.75 }, { type: "collectible", x: 3, lift: 1.75 },
  ] },
  coins: { width: 5, items: [0.5, 1.5, 2.5, 3.5, 4.5].map(x => ({ type: "collectible", x, lift: 0.5 })) },

  /* ---- climbing ---- */
  spikeB: { width: 2, items: [
    { type: "block", x: 0, w: 1, h: 1 }, { type: "spike", x: 1 },
  ] },
  stairs: { width: 4, items: [
    { type: "block", x: 0, w: 2, h: 1 }, { type: "block", x: 2, w: 2, h: 2 },
    { type: "collectible", x: 3, lift: 2.75 },
  ] },
  bridge: { width: 7, items: [
    { type: "block", x: 0, w: 2, h: 1 },
    { type: "spike", x: 2 }, { type: "spike", x: 3 }, { type: "spike", x: 4 },
    { type: "block", x: 5, w: 2, h: 1 },
    { type: "collectible", x: 3.5, lift: 3.75 },
  ] },
  tall: { width: 1, items: [
    { type: "block", x: 0, w: 1, h: 2 },
  ] },

  /* ---- complex (hard levels and up) ---- */
  // A spike sitting on a long block: land on the block, then hop the spike.
  spikeOnBlock: { width: 4, items: [
    { type: "block", x: 0, w: 4, h: 1 }, { type: "spike", x: 2, lift: 1 },
    { type: "collectible", x: 2.5, lift: 3.5 },
  ] },
  // Three steps up: one jump per step (2 extra tiles to land after dropping from the top).
  stairs3: { width: 8, items: [
    { type: "block", x: 0, w: 2, h: 1 }, { type: "block", x: 2, w: 2, h: 2 }, { type: "block", x: 4, w: 2, h: 3 },
    { type: "collectible", x: 5, lift: 3.75 },
  ] },
  // Pillars of different heights with spikes in between: rhythm jumps.
  pillars: { width: 5, items: [
    { type: "block", x: 0, w: 1, h: 1 }, { type: "spike", x: 1 },
    { type: "block", x: 2, w: 1, h: 2 }, { type: "spike", x: 3 },
    { type: "block", x: 4, w: 1, h: 1 },
  ] },
  // A jump pad over a row of spikes.
  pad: { width: 6, items: [
    { type: "pad", x: 0 },
    { type: "spike", x: 2 }, { type: "spike", x: 3 }, { type: "spike", x: 4 }, { type: "spike", x: 5 },
    { type: "arc", x: 3.5, count: 3, chance: 1 },
  ] },
  // A wall too tall for a normal jump: the pad throws you over it.
  // 1 tile of run-up before the pad and 5 tiles to land after the wall.
  padWall: { width: 10, items: [
    { type: "pad", x: 1 },
    { type: "block", x: 4, w: 1, h: 3 },
    { type: "collectible", x: 4.5, lift: 4.5 },
  ] },
  // A low ceiling: jumping under it hurts. Wait, then jump the spike after it.
  ceiling: { width: 7, items: [
    { type: "block", x: 0, w: 3, h: 1, lift: 2 },
    { type: "collectible", x: 0.5, lift: 0.5 }, { type: "collectible", x: 1.5, lift: 0.5 }, { type: "collectible", x: 2.5, lift: 0.5 },
    { type: "spike", x: 6 },
  ] },
  // Long bridge: a long jump from block to block.
  longBridge: { width: 8, items: [
    { type: "block", x: 0, w: 2, h: 1 },
    { type: "spike", x: 2 }, { type: "spike", x: 3 }, { type: "spike", x: 4 }, { type: "spike", x: 5 },
    { type: "block", x: 6, w: 2, h: 1 },
  ] },
  // Three tall walls in a row.
  walls: { width: 7, items: [
    { type: "block", x: 0, w: 1, h: 2 }, { type: "block", x: 3, w: 1, h: 2 }, { type: "block", x: 6, w: 1, h: 2 },
  ] },
};

/** Which patterns can appear at each difficulty (see DIFFICULTY in config.js). */
export const OBSTACLE_POOLS = {
  facil: ["s1", "s1", "s2", "b1", "bwide", "coins"],
  normal: ["s1", "s2", "s2", "b1", "bwide", "spikeB", "stairs"],
  dificil: ["s2", "s3", "spikeB", "stairs", "bridge", "bwide", "pad"],
  "muy-dificil": ["s3", "stairs", "bridge", "tall", "pad", "padWall", "spikeOnBlock", "ceiling"],
  extremo: ["s3", "bridge", "tall", "padWall", "spikeOnBlock", "ceiling", "pillars", "stairs3"],
  demonio: ["s3", "pillars", "stairs3", "padWall", "spikeOnBlock", "ceiling", "longBridge", "walls"],
};

/** Shape of a collectible arc, in tiles. */
export const COLLECTIBLE_ARC = { spacing: 0.9, peakLift: 3, dropPerStep: 0.55 };
