// Drawing of world objects and the player. Positions are screen coordinates.
import { WORLD, PLAYER } from "../data/config.js";
import { VISUALS } from "../data/visuals.js";
import { roundRectPath } from "./canvasUtils.js";

const T = WORLD.tile;

export function drawSpike(ctx, theme, x, y) {
  const { spike, spikeEdge } = theme.colors;
  ctx.fillStyle = spike;
  ctx.strokeStyle = spikeEdge;
  if (theme.spikeStyle === "tooth") {
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 3, y + T); ctx.lineTo(x + 8, y + 10);
    ctx.quadraticCurveTo(x + T / 2, y - 6, x + T - 8, y + 10);
    ctx.lineTo(x + T - 3, y + T); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.9)";
    ctx.fillRect(x + 12, y + 12, 4, 14);
    return;
  }
  ctx.lineWidth = 3;
  ctx.shadowColor = spike;
  ctx.shadowBlur = theme.spikeGlow;
  ctx.beginPath(); ctx.moveTo(x + 2, y + T); ctx.lineTo(x + T / 2, y + 2); ctx.lineTo(x + T - 2, y + T); ctx.closePath();
  ctx.fill(); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,.45)";
  ctx.beginPath(); ctx.moveTo(x + T / 2, y + 8); ctx.lineTo(x + T / 2 - 5, y + T - 6); ctx.lineTo(x + T / 2, y + T - 6); ctx.closePath(); ctx.fill();
}

export function drawBlock(ctx, theme, block, x) {
  ctx.fillStyle = theme.colors.block;
  ctx.strokeStyle = theme.colors.blockEdge;
  ctx.lineWidth = 3;
  roundRectPath(ctx, x + 1.5, block.y + 1.5, block.w - 3, block.h - 1.5, 8); ctx.fill(); ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,.18)";
  ctx.lineWidth = 2;
  for (let gx = x + T; gx < x + block.w - 2; gx += T) { ctx.beginPath(); ctx.moveTo(gx, block.y + 6); ctx.lineTo(gx, block.y + block.h - 4); ctx.stroke(); }
  for (let gy = block.y + T; gy < block.y + block.h - 2; gy += T) { ctx.beginPath(); ctx.moveTo(x + 6, gy); ctx.lineTo(x + block.w - 6, gy); ctx.stroke(); }
  ctx.fillStyle = "rgba(255,255,255,.25)";
  roundRectPath(ctx, x + 6, block.y + 5, block.w - 12, 5, 3); ctx.fill();
}

export function drawPortal(ctx, portal, x, time) {
  const { ring, inner, fill, used } = VISUALS.portal;
  const cx = x + portal.w / 2, cy = portal.y + portal.h / 2;
  ctx.save();
  ctx.shadowColor = ring; ctx.shadowBlur = 25;
  ctx.lineWidth = 10; ctx.strokeStyle = portal.done ? used : ring;
  ctx.beginPath(); ctx.ellipse(cx, cy, portal.w / 2, portal.h / 2, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 4; ctx.strokeStyle = inner;
  ctx.beginPath(); ctx.ellipse(cx, cy, portal.w / 2 - 10, portal.h / 2 - 10, 0, time * 3, time * 3 + Math.PI * 1.3); ctx.stroke();
  ctx.shadowBlur = 0;
  if (!portal.done) {
    ctx.fillStyle = fill;
    ctx.beginPath(); ctx.ellipse(cx, cy, portal.w / 2 - 6, portal.h / 2 - 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = inner;
    ctx.font = `800 64px ${VISUALS.fontFamily}`; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("?", cx, cy + Math.sin(time * 4) * 6 + 4);
  }
  ctx.restore();
}

export function drawGoal(ctx, goal, x, time, { label, icon }) {
  const { ring, fill } = VISUALS.goal;
  ctx.save();
  ctx.fillStyle = fill; roundRectPath(ctx, x, goal.y, goal.w, goal.h, 45); ctx.fill();
  ctx.lineWidth = 8; ctx.strokeStyle = ring; ctx.shadowColor = ring; ctx.shadowBlur = 20 + Math.sin(time * 5) * 8;
  roundRectPath(ctx, x, goal.y, goal.w, goal.h, 45); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = ring; ctx.textAlign = "center";
  ctx.font = `800 22px ${VISUALS.fontFamily}`; ctx.fillText(label, x + goal.w / 2, goal.y - 34);
  ctx.font = "34px sans-serif"; ctx.fillText(icon, x + goal.w / 2, goal.y - 2);
  ctx.restore();
}

/** A collectible: a drop of digestive juice with a face, or a friendly bacterium. */
export function drawCollectible(ctx, kind, item, x, time) {
  const color = kind.colors[item.variant % kind.colors.length];
  const isBacteria = kind.style === "bacteria";
  ctx.save();
  ctx.translate(x, item.y + Math.sin(time * 5 + item.x * 0.05) * 3);
  ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.fillStyle = color; ctx.strokeStyle = "rgba(27,15,46,.55)"; ctx.lineWidth = 2;
  if (isBacteria) {
    ctx.rotate(Math.sin(time * 3 + item.x) * 0.3);
    roundRectPath(ctx, -15, -9, 30, 18, 9); ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.strokeStyle = color;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 15, 0); ctx.quadraticCurveTo(side * 21, Math.sin(time * 10) * 5, side * 24, 0); ctx.stroke();
    }
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -16); ctx.bezierCurveTo(6, -7, 11, -1, 11, 4);
    ctx.arc(0, 4, 11, 0, Math.PI); ctx.bezierCurveTo(-11, -1, -6, -7, 0, -16); ctx.closePath();
    ctx.fill(); ctx.stroke();
    ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.7)";
    ctx.beginPath(); ctx.ellipse(-5, -1, 2.2, 4, 0.4, 0, Math.PI * 2); ctx.fill();
  }
  const faceY = isBacteria ? -2 : 4;
  ctx.shadowBlur = 0; ctx.fillStyle = VISUALS.ink;
  ctx.beginPath(); ctx.arc(-3.5, faceY, 1.8, 0, 7); ctx.arc(3.5, faceY, 1.8, 0, 7); ctx.fill();
  ctx.strokeStyle = VISUALS.ink; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.arc(0, faceY + 3, 3, 0.3, Math.PI - 0.3); ctx.stroke();
  ctx.restore();
}

export function drawHeart(ctx, item, x, time) {
  const { fill, glow } = VISUALS.heart;
  ctx.save();
  ctx.translate(x, item.y + Math.sin(time * 4) * 5);
  const pulse = 1 + Math.sin(time * 6) * 0.08;
  ctx.scale(pulse, pulse);
  ctx.shadowColor = glow; ctx.shadowBlur = 18; ctx.fillStyle = fill;
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.bezierCurveTo(-22, 0, -14, -18, 0, -7); ctx.bezierCurveTo(14, -18, 22, 0, 0, 14); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = "rgba(255,255,255,.6)";
  ctx.beginPath(); ctx.ellipse(-7, -5, 2.5, 4, 0.6, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

/**
 * Bolo. `pose` = { x, y, rotation, grounded, squash } in screen coordinates (x,y = top-left).
 */
export function drawPlayer(ctx, pose, bodyColor) {
  const v = VISUALS.player;
  const r = PLAYER.size / 2;
  ctx.save();
  ctx.translate(pose.x + r, pose.y + r + pose.squash * 4);
  ctx.scale(1 + pose.squash * 0.18, 1 - pose.squash * 0.18);
  ctx.rotate(pose.rotation);
  ctx.fillStyle = bodyColor; ctx.strokeStyle = v.outline; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  ctx.fillStyle = v.spots; ctx.beginPath(); ctx.arc(-9, -8, 3, 0, 7); ctx.arc(9, 10, 3.5, 0, 7); ctx.fill();
  ctx.fillStyle = v.seed; ctx.beginPath(); ctx.arc(10, -7, 2.2, 0, 7); ctx.fill();
  ctx.fillStyle = v.eye; ctx.beginPath(); ctx.ellipse(-5, -3, 4.5, 5.5, 0, 0, 7); ctx.ellipse(6, -3, 4.5, 5.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = v.pupil; ctx.beginPath(); ctx.arc(-4, -2, 2.4, 0, 7); ctx.arc(7, -2, 2.4, 0, 7); ctx.fill();
  ctx.strokeStyle = v.mouth; ctx.lineWidth = 2.5; ctx.beginPath();
  if (pose.grounded) ctx.arc(1, 5, 5, 0.2, Math.PI - 0.2);
  else ctx.ellipse(1, 8, 3, 3.5, 0, 0, 7);
  ctx.stroke();
  ctx.restore();
}
