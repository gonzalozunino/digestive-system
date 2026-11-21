// Robot: a boxy explorer with a screen face and an antenna.
import { drawFace, faceSvg, portraitSvg } from "./face.js";
import { roundRectPath } from "../render/canvasUtils.js";

const C = { body: "#9aa7b8", edge: "#3d4756", screen: "#18263a", light: "#ff5d6e", ink: "#7ff0ff" };

export const robot = {
  id: "robot",
  name: "Robi",
  tagline: "un robot explorador",
  color: C.body,

  portrait: mood => portraitSvg(`
    <line x1="50" y1="22" x2="50" y2="10" stroke="${C.edge}" stroke-width="4"/>
    <circle cx="50" cy="9" r="6" fill="${C.light}"/>
    <rect x="14" y="20" width="72" height="70" rx="16" fill="${C.body}" stroke="${C.edge}" stroke-width="4"/>
    <rect x="22" y="30" width="56" height="46" rx="10" fill="${C.screen}"/>
    ${faceSvg(mood, { x: 50, y: 53, scale: 0.72, ink: C.ink, cheeks: false })}
    <circle cx="20" cy="83" r="3" fill="${C.edge}"/><circle cx="80" cy="83" r="3" fill="${C.edge}"/>`),

  draw(ctx, { radius: r, grounded, time }) {
    ctx.strokeStyle = C.edge; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(0, -r); ctx.lineTo(0, -r - 6); ctx.stroke();
    ctx.fillStyle = Math.sin(time * 8) > 0 ? C.light : "#ffb3ba";
    ctx.beginPath(); ctx.arc(0, -r - 8, 3, 0, 7); ctx.fill();
    ctx.fillStyle = C.body; ctx.lineWidth = 3;
    roundRectPath(ctx, -r, -r, 2 * r, 2 * r, 7); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.screen;
    roundRectPath(ctx, -r + 5, -r + 5, 2 * r - 10, 2 * r - 14, 5); ctx.fill();
    drawFace(ctx, { grounded, y: -2, scale: 0.8, ink: C.ink });
  },
};
