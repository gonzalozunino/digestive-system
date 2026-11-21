// Bolo, the player: physical state and movement. Knows nothing about levels, UI or sound.
import { WORLD, PHYSICS, PLAYER } from "../data/config.js";

const FULL_TURN = Math.PI * 2;

export function createPlayer() {
  return {
    x: 0,
    y: WORLD.groundY - PLAYER.size,
    vy: 0,
    grounded: true,
    rotation: 0,
    invulnerable: 0,  // seconds left
    squash: 0,        // 1 right after landing, fades to 0
  };
}

export function resetPlayer(player) {
  Object.assign(player, createPlayer());
}

export const playerBottom = player => player.y + PLAYER.size;
export const playerCenter = player => ({ x: player.x + PLAYER.size / 2, y: player.y + PLAYER.size / 2 });

/** Applies gravity and forward speed. Call before collisions; clears `grounded`. */
export function movePlayer(player, dt, speed) {
  player.vy += PHYSICS.gravity * dt;
  player.y += player.vy * dt;
  player.x += speed * dt;
  player.grounded = false;
  if (playerBottom(player) >= WORLD.groundY) standOn(player, WORLD.groundY);
}

export function standOn(player, surfaceY) {
  player.y = surfaceY - PLAYER.size;
  player.vy = 0;
  player.grounded = true;
}

export function jump(player) {
  player.vy = -PHYSICS.jumpVelocity;
  player.grounded = false;
}

/** Falls slowly off screen after losing the last heart. */
export function fallAfterDefeat(player, dt) {
  player.vy += PHYSICS.gravity * dt;
  player.y += player.vy * dt * 0.3;
}

/** Spin in the air, snap upright on the ground, landing squash and invulnerability timer. */
export function animatePlayer(player, dt) {
  if (player.invulnerable > 0) player.invulnerable -= dt;
  if (!player.grounded) {
    player.rotation += dt * FULL_TURN / PHYSICS.airSpinTime;
  } else {
    const upright = Math.round(player.rotation / FULL_TURN) * FULL_TURN;
    player.rotation += (upright - player.rotation) * Math.min(1, dt * 18);
  }
  if (player.squash > 0) player.squash = Math.max(0, player.squash - dt * 5);
}
