// Finds out whether a run of world items can be passed without getting hurt, by searching every
// "jump now / don't jump" choice while grounded. Uses the real player physics and collisions, in the
// same order as Game#updatePlaying. Jump choices are only allowed every `jumpEvery` frames, so a
// passable layout leaves the player some room for timing error.
import { PHYSICS, WORLD } from "../src/data/config.js";
import { createPlayer, movePlayer, jump, launch, playerBottom } from "../src/entities/player.js";
import { detectCollisions } from "../src/systems/collision.js";

const dt = PHYSICS.fixedStep;

export function canPass(items, { speed, startX, endX, jumpEvery = 3, maxFrames = 4000 }) {
  const start = { ...createPlayer(), x: startX, frame: 0 };
  const stack = [start];
  const seen = new Set();
  while (stack.length) {
    const p = stack.pop();
    if (p.frame > maxFrames) continue;
    const key = `${p.frame}|${Math.round(p.y)}|${Math.round(p.vy / 10)}|${p.grounded}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const next = { ...p, frame: p.frame + 1 };
    const previousBottom = playerBottom(next);
    movePlayer(next, dt, speed);
    let hurt = false;
    for (const event of detectCollisions(next, items, previousBottom)) {
      if (event.type === "hurt") hurt = true;
      if (event.type === "pad") launch(next);
    }
    if (hurt) continue;
    if (next.x >= endX && next.grounded) return true;
    if (next.grounded && next.frame % jumpEvery === 0) {
      const jumped = { ...next };
      jump(jumped);
      stack.push(next, jumped);
    } else {
      stack.push(next);
    }
  }
  return false;
}

export const GROUND_Y = WORLD.groundY;
