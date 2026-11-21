import { test } from "node:test";
import assert from "node:assert/strict";
import { WORLD, PLAYER } from "../src/data/config.js";
import { createPlayer, movePlayer } from "../src/entities/player.js";
import { detectCollisions } from "../src/systems/collision.js";

const T = WORLD.tile, G = WORLD.groundY, S = PLAYER.size;

test("falling onto a block lands on top of it", () => {
  const block = { type: "block", x: 100, y: G - T, w: T, h: T };
  const p = { ...createPlayer(), x: 100, y: G - T - S + 5, vy: 100, grounded: false };
  const events = detectCollisions(p, [block], G - T - 2);
  assert.deepEqual(events, []);
  assert.equal(p.y, G - T - S);
  assert.ok(p.grounded);
});

test("running into the side of a block hurts", () => {
  const block = { type: "block", x: 100, y: G - T, w: T, h: T };
  const p = { ...createPlayer(), x: 80 };
  assert.deepEqual(detectCollisions(p, [block], G).map(e => e.type), ["hurt"]);
});

test("touching a spike hurts, jumping over it does not", () => {
  const spike = { type: "spike", x: 100, y: G - T, w: T, h: T };
  assert.equal(detectCollisions({ ...createPlayer(), x: 95 }, [spike], G)[0]?.type, "hurt");
  assert.deepEqual(detectCollisions({ ...createPlayer(), x: 95, y: G - T - S - 10 }, [spike], G), []);
});

test("reaching a portal reports it and stops checking", () => {
  const portal = { type: "portal", x: 100, y: G - 170, w: 70, h: 170 };
  const spike = { type: "spike", x: 130, y: G - T, w: T, h: T };
  const events = detectCollisions({ ...createPlayer(), x: 120 }, [portal, spike], G);
  assert.deepEqual(events.map(e => e.type), ["portal"]);
});

test("gravity brings the player back to the ground", () => {
  const p = { ...createPlayer(), y: G - 200 };
  for (let i = 0; i < 200; i++) movePlayer(p, 1 / 120, 0);
  assert.equal(p.y, G - S);
  assert.ok(p.grounded);
});
