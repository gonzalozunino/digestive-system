// Slime: a bouncy jelly blob that wobbles as it runs.
import { drawFace, faceSvg, portraitSvg } from "./face.js";

const C = { body: "#7ee081", edge: "#2f8a3e", shine: "rgba(255,255,255,.55)" };

export const slime = {
  id: "slime",
  name: "Gelo",
  tagline: "un slime saltarín",
  color: C.body,

  portrait: mood => portraitSvg(`
    <path d="M14 90 Q8 54 30 36 Q50 16 70 36 Q92 54 86 90 Z" fill="${C.body}" stroke="${C.edge}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M28 46 Q36 32 50 28" stroke="${C.shine}" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${faceSvg(mood, { x: 50, y: 64, scale: 0.8 })}`),

  draw(ctx, { radius: r, grounded, time }) {
    const wobble = Math.sin(time * 12) * 2;
    ctx.fillStyle = C.body; ctx.strokeStyle = C.edge; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-r, r);
    ctx.quadraticCurveTo(-r - 3, -r * 0.1, -r * 0.5, -r * 0.75);
    ctx.quadraticCurveTo(0, -r - 5 + wobble, r * 0.5, -r * 0.75);
    ctx.quadraticCurveTo(r + 3, -r * 0.1, r, r);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = C.shine; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(-r * 0.55, -r * 0.35); ctx.quadraticCurveTo(-r * 0.35, -r * 0.7, 0, -r * 0.8); ctx.stroke();
    drawFace(ctx, { grounded, y: 3, scale: 0.9 });
  },
};
