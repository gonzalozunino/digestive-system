import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTY, DIFFICULTY_ORDER, LAYOUT } from "../src/data/config.js";
import { OBSTACLE_POOLS, PATTERNS } from "../src/data/obstaclePatterns.js";
import { buildLevel } from "../src/systems/levelBuilder.js";
import { seededRandom } from "./helpers.js";

for (const [key, difficulty] of Object.entries(DIFFICULTY)) {
  test(`${key}: portals, goal and a safe zone after each question`, () => {
    const { items, length } = buildLevel(key, difficulty, seededRandom(key.length));
    const portals = items.filter(it => it.type === "portal");
    assert.equal(portals.length, difficulty.questions);
    assert.equal(items.at(-1).type, "goal");
    assert.ok(length >= items.at(-1).x);
    for (let i = 1; i < items.length; i++) assert.ok(items[i].x >= items[i - 1].x, "items sorted by x");
    for (const portal of portals) {
      const danger = items.filter(it => ["spike", "block", "pad"].includes(it.type) && it.x > portal.x && it.x < portal.x + LAYOUT.afterPortal - 100);
      assert.deepEqual(danger, [], "no obstacles right after a question");
    }
  });
}

test("harder difficulties are faster, longer, with fewer hearts and new kinds of jumps", () => {
  const BASIC = new Set(["s1", "s2", "b1", "coins", "bwide"]);
  const basicShare = key => OBSTACLE_POOLS[key].filter(name => BASIC.has(name)).length / OBSTACLE_POOLS[key].length;
  for (let i = 1; i < DIFFICULTY_ORDER.length; i++) {
    const key = DIFFICULTY_ORDER[i];
    const easier = DIFFICULTY[DIFFICULTY_ORDER[i - 1]], harder = DIFFICULTY[key];
    assert.ok(harder.speedFactor > easier.speedFactor, "faster");
    assert.ok(harder.hearts <= easier.hearts, "no more hearts");
    assert.ok(harder.questions >= easier.questions, "at least as many questions");
    const seenBefore = new Set(DIFFICULTY_ORDER.slice(0, i).flatMap(k => OBSTACLE_POOLS[k]));
    assert.ok(OBSTACLE_POOLS[key].some(name => !seenBefore.has(name)), `${key} brings at least one new pattern`);
    assert.ok(basicShare(key) <= basicShare(DIFFICULTY_ORDER[i - 1]), `${key} has fewer basic patterns`);
  }
});

test("every pattern in the pools exists", () => {
  for (const pool of Object.values(OBSTACLE_POOLS)) for (const name of pool) assert.ok(PATTERNS[name], name);
  assert.deepEqual(Object.keys(OBSTACLE_POOLS), DIFFICULTY_ORDER);
});
