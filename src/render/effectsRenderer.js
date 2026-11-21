// Draws the state kept by systems/effects.js.
import { VISUALS } from "../data/visuals.js";

export function drawTrail(ctx, trail, camera) {
  for (const t of trail) {
    const a = t.life / t.maxLife;
    ctx.fillStyle = `rgba(${VISUALS.trail},${a * 0.35})`;
    ctx.beginPath(); ctx.arc(t.x - camera, t.y, 14 * a, 0, 7); ctx.fill();
  }
}

export function drawParticles(ctx, particles, camera) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - camera - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

export function drawPopups(ctx, popups, camera) {
  ctx.font = `800 18px ${VISUALS.fontFamily}`;
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = VISUALS.ink;
  for (const p of popups) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.strokeText(p.text, p.x - camera, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x - camera, p.y);
  }
  ctx.globalAlpha = 1;
}

export function drawConfetti(ctx, confetti) {
  for (const c of confetti) {
    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate(c.rotation);
    ctx.globalAlpha = Math.min(1, c.life);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
    ctx.restore();
  }
}
