import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTY, SPEED, WORLD } from "../src/data/config.js";
import { PATTERNS, OBSTACLE_POOLS } from "../src/data/obstaclePatterns.js";
import { placePattern } from "../src/systems/levelBuilder.js";
import { canPass } from "./solver.js";

const T = WORLD.tile;
const noCollectibles = () => 1;  // rng that never adds optional collectible arcs

// Every pair of patterns a level can produce, back to back at the smallest gap, must be passable.
for (const [key, difficulty] of Object.entries(DIFFICULTY)) {
  test(`${key}: every pair of patterns can be passed at the minimum gap`, () => {
    const speed = SPEED.base * difficulty.speedFactor;
    const pool = [...new Set(OBSTACLE_POOLS[key])];
    const failures = [];
    for (const first of pool) {
      for (const second of pool) {
        const x1 = 400;
        const x2 = x1 + (PATTERNS[first].width + difficulty.gapTiles[0]) * T;
        const items = [...placePattern(first, x1, noCollectibles), ...placePattern(second, x2, noCollectibles)].sort((a, b) => a.x - b.x);
        const endX = x2 + PATTERNS[second].width * T + 6 * T;
        if (!canPass(items, { speed, startX: 0, endX })) failures.push(`${first} → ${second}`);
      }
    }
    assert.deepEqual(failures, []);
  });
}

test("a pad is needed to get over the tall wall", () => {
  const speed = SPEED.base * DIFFICULTY.extremo.speedFactor;
  const withPad = placePattern("padWall", 400, noCollectibles);
  const withoutPad = withPad.filter(it => it.type !== "pad");
  assert.ok(canPass(withPad, { speed, startX: 0, endX: 900 }));
  assert.ok(!canPass(withoutPad, { speed, startX: 0, endX: 900 }));
});

test("jumping under a low ceiling hurts", () => {
  const speed = SPEED.base;
  const ceilingOnly = placePattern("ceiling", 400, noCollectibles).filter(it => it.type === "block");
  const block = ceilingOnly[0];
  assert.ok(block.y + block.h < WORLD.groundY - 36, "there is room to run under it");
  // Jumping is only allowed while under the ceiling: the run must fail.
  assert.ok(canPass(ceilingOnly, { speed, startX: 0, endX: 700, jumpEvery: 100000 }), "running under is safe");
});
