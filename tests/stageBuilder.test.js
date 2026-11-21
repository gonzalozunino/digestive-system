import { test } from "node:test";
import assert from "node:assert/strict";
import { DIFFICULTY, LAYOUT } from "../src/data/config.js";
import { OBSTACLE_POOLS } from "../src/data/obstaclePatterns.js";
import { buildStage, obstaclePoolFor } from "../src/systems/stageBuilder.js";
import { seededRandom } from "./helpers.js";

for (const [name, difficulty] of Object.entries(DIFFICULTY)) {
  for (const stageIndex of [0, 2, 4, 9]) {
    test(`${name}, stage ${stageIndex + 1}: portals, goal and a safe zone after each question`, () => {
      const { items, length } = buildStage(stageIndex, difficulty, seededRandom(stageIndex + 1));
      const portals = items.filter(it => it.type === "portal");
      assert.equal(portals.length, LAYOUT.questionsPerStage);
      assert.equal(items.at(-1).type, "goal");
      assert.ok(length >= items.at(-1).x);
      for (let i = 1; i < items.length; i++) assert.ok(items[i].x >= items[i - 1].x, "items sorted by x");
      for (const portal of portals) {
        const danger = items.filter(it => (it.type === "spike" || it.type === "block") && it.x > portal.x && it.x < portal.x + LAYOUT.afterPortal - 100);
        assert.deepEqual(danger, [], "no obstacles right after a question");
      }
    });
  }
}

test("hard mode uses harder obstacles from the start and fewer hearts", () => {
  assert.deepEqual(obstaclePoolFor(0, DIFFICULTY.hard), OBSTACLE_POOLS[1]);
  assert.deepEqual(obstaclePoolFor(20, DIFFICULTY.hard), OBSTACLE_POOLS.at(-1));
  assert.ok(DIFFICULTY.hard.hearts < DIFFICULTY.normal.hearts);
  assert.ok(DIFFICULTY.hard.speedFactor > DIFFICULTY.normal.speedFactor);
});
