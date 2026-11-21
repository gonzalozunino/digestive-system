// Level scenery: sky gradient, parallax decorations for each organ, and the ground.
// Each level theme names its decoration in `theme.background`.
import { VIEW, WORLD } from "../data/config.js";
import { roundRectPath, wrap } from "./canvasUtils.js";

const W = VIEW.width, H = VIEW.height, GROUND = WORLD.groundY;

export function drawSky(ctx, theme) {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, theme.colors.skyTop);
  gradient.addColorStop(1, theme.colors.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

/** Mouth: palate bumps and a row of upper teeth. */
function teeth(ctx, camera) {
  ctx.fillStyle = "rgba(255,140,170,.25)";
  for (let i = -1; i < 14; i++) {
    const x = wrap(i * 90 - camera * 0.25, 90 * 14) - 90;
    ctx.beginPath(); ctx.arc(x, H * 0.62, 70, Math.PI, 0); ctx.fill();
  }
  ctx.fillStyle = "#c2335c";
  ctx.fillRect(0, 0, W, 52);
  for (let i = -1; i < 12; i++) {
    const x = wrap(i * 96 - camera * 0.5, 96 * 12) - 96;
    ctx.fillStyle = "#fffaf0"; roundRectPath(ctx, x + 8, 30, 72, 58, 18); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,.08)"; roundRectPath(ctx, x + 50, 34, 22, 48, 10); ctx.fill();
  }
}

/** Esophagus: muscle rings pulsing like peristalsis. */
function rings(ctx, camera, time) {
  for (let i = -1; i < 10; i++) {
    const x = wrap(i * 130 - camera * 0.6, 130 * 10) - 130;
    const pulse = 1 + 0.15 * Math.sin(time * 5 + i * 0.9);
    ctx.strokeStyle = "rgba(255,190,130,.28)";
    ctx.lineWidth = 16 * pulse;
    ctx.beginPath(); ctx.ellipse(x, H / 2 - 20, 38 * pulse, H * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.fillStyle = "rgba(60,20,4,.45)";
  ctx.fillRect(0, 0, W, 40);
}

/** Stomach: wavy folds and rising acid bubbles. */
function acid(ctx, camera, time) {
  ctx.strokeStyle = "rgba(220,255,120,.18)";
  ctx.lineWidth = 10;
  for (let row = 0; row < 3; row++) {
    ctx.beginPath();
    for (let x = 0; x <= W; x += 20) {
      const y = 40 + row * 45 + Math.sin((x + camera * 0.3) / 60 + row + time) * 12;
      if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
    }
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(230,255,140,.5)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 26; i++) {
    const speed = 40 + (i * 37) % 60;
    const x = wrap(i * 97 - camera * 0.35, W + 60) - 30;
    const y = H - wrap(time * speed + i * 83, H + 40);
    ctx.beginPath(); ctx.arc(x + Math.sin(time * 2 + i) * 8, y, 5 + (i % 4) * 3, 0, Math.PI * 2); ctx.stroke();
  }
}

/** Small intestine: swaying villi above and below. */
function villi(ctx, camera, time) {
  for (let layer = 0; layer < 2; layer++) {
    const parallax = layer ? 0.55 : 0.3, size = layer ? 1 : 0.7;
    ctx.fillStyle = layer ? "rgba(243,166,255,.35)" : "rgba(243,166,255,.16)";
    for (let i = -1; i < 24; i++) {
      const x = wrap(i * 48 - camera * parallax, 48 * 24) - 48;
      const sway = Math.sin(time * 2 + i) * 6;
      const h = (70 + (i * 29) % 50) * size;
      roundRectPath(ctx, x + sway * 0.3, -20, 26 * size, h, 13 * size); ctx.fill();
      roundRectPath(ctx, x + 20 + sway, GROUND - h - 10 + 20 * (1 - size), 26 * size, h + 30, 13 * size); ctx.fill();
    }
  }
}

/** Large intestine: haustra bulges and faint background bacteria. */
function bacteria(ctx, camera, time) {
  ctx.fillStyle = "rgba(224,172,116,.16)";
  for (let i = -1; i < 9; i++) {
    const x = wrap(i * 150 - camera * 0.3, 150 * 9) - 150;
    ctx.beginPath(); ctx.arc(x + 75, -30, 95, 0, Math.PI); ctx.fill();
  }
  const colors = ["#7ed957", "#ffb347", "#6fc3ff", "#ff7eb6"];
  for (let i = 0; i < 10; i++) {
    const x = wrap(i * 130 - camera * 0.45 + Math.sin(time + i) * 20, W + 120) - 60;
    const y = 120 + (i * 67) % 220 + Math.sin(time * 1.5 + i * 2) * 12;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.sin(time + i) * 0.3);
    ctx.globalAlpha = 0.3; ctx.fillStyle = colors[i % 4];
    roundRectPath(ctx, -20, -10, 40, 20, 10); ctx.fill();
    ctx.globalAlpha = 0.45; ctx.fillStyle = "#2e1a0b";
    ctx.beginPath(); ctx.arc(-6, -2, 2.4, 0, 7); ctx.arc(6, -2, 2.4, 0, 7); ctx.fill();
    ctx.strokeStyle = "#2e1a0b"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.arc(0, 2, 5, 0.2, Math.PI - 0.2); ctx.stroke();
    ctx.restore();
  }
}

const DECORATIONS = { teeth, rings, acid, villi, bacteria };

export function drawDecorations(ctx, theme, camera, time) {
  ctx.save();
  DECORATIONS[theme.background]?.(ctx, camera, time);
  ctx.restore();
}

export function drawGround(ctx, theme, camera) {
  const { ground, groundEdge } = theme.colors;
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "rgba(0,0,0,.12)";
  for (let i = -1; i < 26; i++) ctx.fillRect(wrap(i * 40 - camera, 40 * 26) - 40, GROUND + 14, 20, 4);
  if (theme.groundDots) {
    ctx.fillStyle = "rgba(255,255,255,.18)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath(); ctx.arc(wrap(i * 61 - camera, W + 40) - 20, GROUND + 30 + (i * 13) % 50, 3, 0, 7); ctx.fill();
    }
  }
  ctx.fillStyle = groundEdge;
  ctx.fillRect(0, GROUND, W, 5);
  ctx.shadowColor = groundEdge;
  ctx.shadowBlur = 14;
  ctx.fillRect(0, GROUND, W, 2);
  ctx.shadowBlur = 0;
}
