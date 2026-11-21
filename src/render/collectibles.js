// Collectible looks. A stage picks one with collectible.style; colors cycle through collectible.colors.
import { VISUALS } from "../data/visuals.js";
import { roundRectPath } from "./canvasUtils.js";

function tinyFace(ctx, y) {
  ctx.shadowBlur = 0;
  ctx.fillStyle = VISUALS.ink;
  ctx.beginPath(); ctx.arc(-3.5, y, 1.8, 0, 7); ctx.arc(3.5, y, 1.8, 0, 7); ctx.fill();
  ctx.strokeStyle = VISUALS.ink; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, y + 3, 3, 0.3, Math.PI - 0.3); ctx.stroke();
}

const STYLES = {
  /** A drop of liquid with a face. */
  drop(ctx) {
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.bezierCurveTo(6, -7, 11, -1, 11, 4);
    ctx.arc(0, 4, 11, 0, Math.PI); ctx.bezierCurveTo(-11, -1, -6, -7, 0, -16); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.beginPath(); ctx.ellipse(-5, -1, 2.2, 4, 0.4, 0, Math.PI * 2); ctx.fill();
    tinyFace(ctx, 4);
  },
  /** A friendly microbe with wiggling flagella. */
  microbe(ctx, { color, time, seed }) {
    ctx.rotate(Math.sin(time * 3 + seed) * 0.3);
    roundRectPath(ctx, -15, -9, 30, 18, 9); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = color;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 15, 0); ctx.quadraticCurveTo(side * 21, Math.sin(time * 10) * 5, side * 24, 0); ctx.stroke();
    }
    tinyFace(ctx, -2);
  },
  /** A five-pointed star that slowly turns. */
  star(ctx, { time, seed }) {
    ctx.rotate(Math.sin(time * 2 + seed) * 0.25);
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5, radius = i % 2 ? 6.5 : 15;
      ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
    }
    ctx.closePath(); ctx.fill(); ctx.stroke();
    tinyFace(ctx, 0);
  },
  /** A shiny cut gem. */
  gem(ctx) {
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(12, -3); ctx.lineTo(0, 15); ctx.lineTo(-12, -3); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.55)";
    ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(-12, -3); ctx.lineTo(0, -1); ctx.closePath(); ctx.fill();
  },
};

export function drawCollectible(ctx, kind, item, x, time) {
  const color = kind.colors[item.variant % kind.colors.length];
  ctx.save();
  ctx.translate(x, item.y + Math.sin(time * 5 + item.x * 0.05) * 3);
  ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.fillStyle = color; ctx.strokeStyle = "rgba(27,15,46,.55)"; ctx.lineWidth = 2;
  (STYLES[kind.style] ?? STYLES.star)(ctx, { color, time, seed: item.x });
  ctx.restore();
}
