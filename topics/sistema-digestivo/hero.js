// Bolo, a bite of food: this topic's own character. Same interface as the generic characters
// (see src/characters/index.js): { id, name, tagline, color, draw(ctx, options), portrait(mood) }.
import { drawFace, faceSvg, portraitSvg } from "../../src/characters/face.js";

const C = { body: "#f3c37a", edge: "#7a4a1d", crumbs: "#d9a35a", seed: "#8bc34a", tomato: "#e5533d", shine: "#fff2d6" };

export const bolo = {
  id: "bolo",
  name: "Bolo",
  tagline: "un bocado de comida",
  color: C.body,

  portrait: mood => portraitSvg(`
    <circle cx="50" cy="52" r="40" fill="${C.body}" stroke="${C.edge}" stroke-width="4"/>
    <circle cx="30" cy="34" r="4" fill="${C.crumbs}"/><circle cx="72" cy="78" r="5" fill="${C.crumbs}"/>
    <circle cx="76" cy="40" r="3" fill="${C.seed}"/><circle cx="24" cy="72" r="3" fill="${C.tomato}"/>
    <path d="M22 40 Q30 18 52 14" stroke="${C.shine}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
    ${faceSvg(mood)}`),

  /** `tint` changes the body color as the food is digested (stage.heroTint). */
  draw(ctx, { radius: r, grounded, tint }) {
    ctx.fillStyle = tint ?? C.body; ctx.strokeStyle = "#5a3412"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "rgba(0,0,0,.12)"; ctx.beginPath(); ctx.arc(-9, -8, 3, 0, 7); ctx.arc(9, 10, 3.5, 0, 7); ctx.fill();
    ctx.fillStyle = C.seed; ctx.beginPath(); ctx.arc(10, -7, 2.2, 0, 7); ctx.fill();
    drawFace(ctx, { grounded });
  },
};
