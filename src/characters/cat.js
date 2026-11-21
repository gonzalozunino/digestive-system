// Cat: a round orange kitten with pointy ears and whiskers.
import { drawFace, faceSvg, portraitSvg } from "./face.js";

const C = { fur: "#ffa94d", edge: "#8a4b12", ear: "#ff9ecb", whisker: "#5a3412" };

export const cat = {
  id: "gato",
  name: "Mishi",
  tagline: "una gatita curiosa",
  color: C.fur,

  portrait: mood => portraitSvg(`
    <polygon points="18,44 24,8 48,28" fill="${C.fur}" stroke="${C.edge}" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="82,44 76,8 52,28" fill="${C.fur}" stroke="${C.edge}" stroke-width="4" stroke-linejoin="round"/>
    <polygon points="25,36 27,18 40,28" fill="${C.ear}"/><polygon points="75,36 73,18 60,28" fill="${C.ear}"/>
    <circle cx="50" cy="56" r="36" fill="${C.fur}" stroke="${C.edge}" stroke-width="4"/>
    ${faceSvg(mood, { x: 50, y: 58, scale: 0.78 })}
    <path d="M47 62 L53 62 L50 66 Z" fill="${C.ear}"/>
    <path d="M30 64 L12 60 M30 68 L12 70 M70 64 L88 60 M70 68 L88 70" stroke="${C.whisker}" stroke-width="2" stroke-linecap="round"/>`),

  draw(ctx, { radius: r, grounded }) {
    ctx.fillStyle = C.fur; ctx.strokeStyle = C.edge; ctx.lineWidth = 2.5;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * (r - 3), -r + 9); ctx.lineTo(side * (r - 5), -r - 7); ctx.lineTo(side * 3, -r + 2); ctx.closePath();
      ctx.fill(); ctx.stroke();
    }
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    drawFace(ctx, { grounded, y: 0, scale: 0.9 });
    ctx.strokeStyle = C.whisker; ctx.lineWidth = 1.2;
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 8, 4); ctx.lineTo(side * 17, 2); ctx.moveTo(side * 8, 6); ctx.lineTo(side * 17, 8); ctx.stroke();
    }
  },
};
