import { test } from "node:test";
import assert from "node:assert/strict";
import { LEVELS } from "../src/data/levels.js";
import { DIFFICULTY, LAYOUT } from "../src/data/config.js";
import { buildLevel } from "../src/systems/levelBuilder.js";
import { seededRandom } from "./helpers.js";

for (const [index, level] of LEVELS.entries()) {
  test(`level ${level.id}: portals, goal and a safe zone after each question`, () => {
    const { items, length } = buildLevel(index, DIFFICULTY.normal, seededRandom(index + 1));
    const portals = items.filter(it => it.type === "portal");
    assert.equal(portals.length, LAYOUT.questionsPerLevel);
    assert.equal(items.at(-1).type, "goal");
    assert.ok(length >= items.at(-1).x);
    for (let i = 1; i < items.length; i++) assert.ok(items[i].x >= items[i - 1].x, "items sorted by x");
    for (const portal of portals) {
      const danger = items.filter(it => (it.type === "spike" || it.type === "block") && it.x > portal.x && it.x < portal.x + LAYOUT.afterPortal - 100);
      assert.deepEqual(danger, [], "no obstacles right after a question");
    }
  });
}
