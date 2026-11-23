// Detects what the player touches this step. Blocks are solid (the player can land on them);
// everything else is reported as an event for the game to handle.
import { PLAYER } from "../data/config.js";
import { playerCenter, standOn } from "../entities/player.js";

const S = PLAYER.size;
const LOOK_AHEAD = 120;
const LOOK_BEHIND = 60;

function overlapsBlock(p, block) {
  const inset = PLAYER.blockSideInset;
  return p.x + S > block.x + inset && p.x < block.x + block.w - inset && p.y + S > block.y && p.y < block.y + block.h;
}

function touchesSpike(p, spike) {
  const { insetX, insetTop } = PLAYER.spikeHitbox;
  const hit = PLAYER.playerHitbox;
  return p.x + S - hit.insetX > spike.x + insetX && p.x + hit.insetX < spike.x + spike.w - insetX
    && p.y + S - hit.insetBottom > spike.y + insetTop;
}

function touchesRound(p, item) {
  const c = playerCenter(p);
  return Math.hypot(c.x - item.x, c.y - item.y) < item.r + S / 2;
}

const reachedCenter = (p, item) => p.x + S / 2 >= item.x + item.w / 2;

/** A pad fires when the player touches it while not already going up. */
const touchesPad = (p, pad) => p.vy >= 0 && p.x + S > pad.x + 4 && p.x < pad.x + pad.w - 4 && p.y + S >= pad.y;

/**
 * @param player  the player, already moved this step
 * @param items   world items sorted by x
 * @param previousBottom  player's bottom edge before moving (to tell landing from side hits)
 * @returns {{type: "hurt"|"collect"|"heart"|"pad"|"portal"|"goal", item?: object}[]}
 */
export function detectCollisions(player, items, previousBottom) {
  const events = [];
  for (const item of items) {
    if (item.x > player.x + LOOK_AHEAD) break;
    if (item.done || item.x + (item.w || 30) < player.x - LOOK_BEHIND) continue;

    switch (item.type) {
      case "block":
        if (!overlapsBlock(player, item)) break;
        if (previousBottom <= item.y + PLAYER.landingTolerance && player.vy >= 0) standOn(player, item.y);
        else events.push({ type: "hurt", item });
        break;
      case "spike":
        if (touchesSpike(player, item)) events.push({ type: "hurt", item });
        break;
      case "pad":
        if (touchesPad(player, item)) events.push({ type: "pad", item });
        break;
      case "collectible":
      case "heart":
        if (touchesRound(player, item)) events.push({ type: item.type === "heart" ? "heart" : "collect", item });
        break;
      case "portal":
      case "goal":
        if (reachedCenter(player, item)) { events.push({ type: item.type, item }); return events; }
        break;
    }
  }
  return events;
}
