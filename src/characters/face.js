// A cartoon face shared by the generic characters, in two forms:
// SVG for portraits (moods "happy", "think", "sad", "wow") and canvas for the running character.

const DEFAULT_INK = "#4a2a10";

/**
 * SVG face designed around (50,52) in a 100x100 box, moved to (x,y) and scaled.
 * @param {string} mood
 * @param {{x?:number, y?:number, scale?:number, ink?:string, cheeks?:boolean}} options
 */
export function faceSvg(mood = "happy", { x = 50, y = 52, scale = 1, ink = DEFAULT_INK, cheeks = true } = {}) {
  const mouths = {
    happy: `<path d="M38 66 Q50 80 62 66" stroke="${ink}" stroke-width="5" fill="#ff7a8a" stroke-linecap="round"/>`,
    think: `<ellipse cx="54" cy="70" rx="5" ry="6" fill="${ink}"/>`,
    sad: `<path d="M38 74 Q50 62 62 74" stroke="${ink}" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    wow: `<ellipse cx="50" cy="70" rx="9" ry="10" fill="${ink}"/><ellipse cx="50" cy="74" rx="5" ry="4" fill="#ff7a8a"/>`,
  };
  const brows = {
    sad: `<path d="M28 30 L42 35 M72 30 L58 35" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`,
    think: `<path d="M28 31 L42 29 M58 27 L72 31" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>`,
  };
  const [left, right, top] = mood === "think" ? [42, 62, 34] : [40, 60, 40];
  const blush = cheeks && (mood === "happy" || mood === "wow")
    ? '<circle cx="26" cy="60" r="6" fill="#ff8fa3" opacity=".7"/><circle cx="74" cy="60" r="6" fill="#ff8fa3" opacity=".7"/>' : "";
  const tear = mood === "sad" ? '<path d="M30 52 q-4 8 0 11 q4 -3 0 -11z" fill="#7fd3ff"/>' : "";
  return `<g transform="translate(${x - 50 * scale} ${y - 52 * scale}) scale(${scale})">
    ${brows[mood] ?? ""}
    <ellipse cx="38" cy="46" rx="9" ry="11" fill="#fff"/><ellipse cx="62" cy="46" rx="9" ry="11" fill="#fff"/>
    <circle cx="${left}" cy="${top + 8}" r="5" fill="#1b0f2e"/><circle cx="${right}" cy="${top + 8}" r="5" fill="#1b0f2e"/>
    <circle cx="${left + 2}" cy="${top + 6}" r="1.8" fill="#fff"/><circle cx="${right + 2}" cy="${top + 6}" r="1.8" fill="#fff"/>
    ${blush}${mouths[mood] ?? mouths.happy}${tear}
  </g>`;
}

/** Wraps portrait content in the standard 100x100 SVG with a floor shadow. */
export const portraitSvg = content =>
  `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><ellipse cx="50" cy="94" rx="30" ry="5" fill="rgba(0,0,0,.35)"/>${content}</svg>`;

/** Canvas face centered at (0, y): smiles on the ground, says "o" in the air. */
export function drawFace(ctx, { grounded, y = 0, scale = 1, ink = DEFAULT_INK }) {
  ctx.save();
  ctx.translate(0, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#fff";
  ctx.beginPath(); ctx.ellipse(-5, -3, 4.5, 5.5, 0, 0, 7); ctx.ellipse(6, -3, 4.5, 5.5, 0, 0, 7); ctx.fill();
  ctx.fillStyle = "#1b0f2e";
  ctx.beginPath(); ctx.arc(-4, -2, 2.4, 0, 7); ctx.arc(7, -2, 2.4, 0, 7); ctx.fill();
  ctx.strokeStyle = ink; ctx.lineWidth = 2.5;
  ctx.beginPath();
  if (grounded) ctx.arc(1, 5, 5, 0.2, Math.PI - 0.2);
  else ctx.ellipse(1, 8, 3, 3.5, 0, 0, 7);
  ctx.stroke();
  ctx.restore();
}
