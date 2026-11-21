// Obstacle patterns used to build stages. All positions are in tiles (see WORLD.tile).
// x: offset from the pattern start. Spikes and blocks stand on the ground.
// block: w/h size in tiles. collectible: `lift` = height of its center above the ground.
// arc: a curve of `count` collectibles centered at x, added with probability `chance`.

export const PATTERNS = {
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
  coins: { width: 5, items: [0.5, 1.5, 2.5, 3.5, 4.5].map(x => ({ type: "collectible", x, lift: 0.5 })) },
};

/** Which patterns can appear in each stage (by position; later stages use the last list). */
export const OBSTACLE_POOLS = [
  ["s1", "s1", "s2", "b1", "bwide", "coins"],
  ["s1", "s2", "s2", "b1", "bwide", "spikeB", "stairs"],
  ["s1", "s2", "s3", "spikeB", "stairs", "bridge", "bwide"],
  ["s2", "s3", "spikeB", "stairs", "bridge", "tall", "b1"],
  ["s2", "s3", "s3", "spikeB", "stairs", "bridge", "tall", "bwide"],
];

/** Shape of a collectible arc, in tiles. */
export const COLLECTIBLE_ARC = { spacing: 0.9, peakLift: 3, dropPerStep: 0.55 };
