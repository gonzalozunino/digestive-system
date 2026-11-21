// UFO: a little flying saucer with a pilot under a glass dome.
import { drawFace, faceSvg, portraitSvg } from "./face.js";

const C = { dome: "#bfefff", hull: "#b8c0cc", edge: "#4b5563", pilot: "#8be38b", lights: ["#ffe066", "#ff7eb6", "#7ff0ff"] };

export const ufo = {
  id: "ovni",
  name: "Zip",
  tagline: "un ovni viajero",
  color: C.hull,

  portrait: mood => portraitSvg(`
    <path d="M22 58 A28 28 0 0 1 78 58 Z" fill="${C.dome}" stroke="${C.edge}" stroke-width="4"/>
    <circle cx="50" cy="48" r="17" fill="${C.pilot}"/>
    ${faceSvg(mood, { x: 50, y: 48, scale: 0.42, cheeks: false })}
    <ellipse cx="50" cy="64" rx="44" ry="14" fill="${C.hull}" stroke="${C.edge}" stroke-width="4"/>
    <circle cx="26" cy="66" r="4" fill="${C.lights[0]}"/><circle cx="50" cy="70" r="4" fill="${C.lights[1]}"/><circle cx="74" cy="66" r="4" fill="${C.lights[2]}"/>`),

  draw(ctx, { radius: r, grounded, time }) {
    ctx.strokeStyle = C.edge; ctx.lineWidth = 2.5;
    ctx.fillStyle = C.dome;
    ctx.beginPath(); ctx.arc(0, 2, r * 0.72, Math.PI, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = C.pilot;
    ctx.beginPath(); ctx.arc(0, -3, r * 0.45, 0, 7); ctx.fill();
    drawFace(ctx, { grounded, y: -4, scale: 0.55 });
    ctx.fillStyle = C.hull; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.ellipse(0, 6, r, r * 0.42, 0, 0, 7); ctx.fill(); ctx.stroke();
    C.lights.forEach((color, i) => {
      ctx.fillStyle = Math.floor(time * 6 + i) % 3 === 0 ? "#fff" : color;
      ctx.beginPath(); ctx.arc((i - 1) * r * 0.55, 8, 2.5, 0, 7); ctx.fill();
    });
  },
};
