// Bolo's portrait as SVG markup, with one face per mood: "happy", "think", "sad", "wow".

const MOUTHS = {
  happy: '<path d="M38 66 Q50 80 62 66" stroke="#4a2a10" stroke-width="5" fill="#ff7a8a" stroke-linecap="round"/>',
  think: '<ellipse cx="54" cy="70" rx="5" ry="6" fill="#4a2a10"/>',
  sad: '<path d="M38 74 Q50 62 62 74" stroke="#4a2a10" stroke-width="5" fill="none" stroke-linecap="round"/>',
  wow: '<ellipse cx="50" cy="70" rx="9" ry="10" fill="#4a2a10"/><ellipse cx="50" cy="74" rx="5" ry="4" fill="#ff7a8a"/>',
};
const BROWS = {
  sad: '<path d="M28 30 L42 35 M72 30 L58 35" stroke="#4a2a10" stroke-width="4" stroke-linecap="round"/>',
  think: '<path d="M28 31 L42 29 M58 27 L72 31" stroke="#4a2a10" stroke-width="4" stroke-linecap="round"/>',
};
const CHEEKS = '<circle cx="26" cy="60" r="6" fill="#ff8fa3" opacity=".7"/><circle cx="74" cy="60" r="6" fill="#ff8fa3" opacity=".7"/>';
const TEAR = '<path d="M30 52 q-4 8 0 11 q4 -3 0 -11z" fill="#7fd3ff"/>';

export function mascotSvg(mood = "happy") {
  const [left, right, top] = mood === "think" ? [42, 62, 34] : [40, 60, 40];
  const cheeks = mood === "happy" || mood === "wow" ? CHEEKS : "";
  return `<svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true">
    <ellipse cx="50" cy="94" rx="30" ry="5" fill="rgba(0,0,0,.35)"/>
    <circle cx="50" cy="52" r="40" fill="#f3c37a" stroke="#7a4a1d" stroke-width="4"/>
    <circle cx="30" cy="34" r="4" fill="#d9a35a"/><circle cx="72" cy="78" r="5" fill="#d9a35a"/>
    <circle cx="76" cy="40" r="3" fill="#8bc34a"/><circle cx="24" cy="72" r="3" fill="#e5533d"/>
    <path d="M22 40 Q30 18 52 14" stroke="#fff2d6" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
    ${BROWS[mood] ?? ""}
    <ellipse cx="38" cy="46" rx="9" ry="11" fill="#fff"/><ellipse cx="62" cy="46" rx="9" ry="11" fill="#fff"/>
    <circle cx="${left}" cy="${top + 8}" r="5" fill="#1b0f2e"/><circle cx="${right}" cy="${top + 8}" r="5" fill="#1b0f2e"/>
    <circle cx="${left + 2}" cy="${top + 6}" r="1.8" fill="#fff"/><circle cx="${right + 2}" cy="${top + 6}" r="1.8" fill="#fff"/>
    ${cheeks}${MOUTHS[mood] ?? MOUTHS.happy}${mood === "sad" ? TEAR : ""}
  </svg>`;
}
