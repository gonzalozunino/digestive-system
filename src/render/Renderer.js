// Draws a frame of the game. Reads game state; never changes it.
import { VIEW, WORLD, PLAYER } from "../data/config.js";
import { TEXTS } from "../data/texts.js";
import { STATES } from "../game/states.js";
import { drawSky, drawDecorations, drawGround } from "./scenery.js";
import { drawSpike, drawBlock, drawPortal, drawGoal, drawCollectible, drawHeart, drawPlayer } from "./sprites.js";
import { drawTrail, drawParticles, drawPopups, drawConfetti } from "./effectsRenderer.js";

const VISIBLE_MARGIN = 120;

export class Renderer {
  constructor(worldCanvas, overlayCanvas) {
    for (const canvas of [worldCanvas, overlayCanvas]) {
      canvas.width = VIEW.width;
      canvas.height = VIEW.height;
    }
    this.ctx = worldCanvas.getContext("2d");
    this.overlay = overlayCanvas.getContext("2d");
  }

  render(game) {
    const ctx = this.ctx;
    const theme = game.level.theme;
    ctx.save();
    if (game.shake > 0) ctx.translate((Math.random() * 2 - 1) * game.shake, (Math.random() * 2 - 1) * game.shake);

    drawSky(ctx, theme);
    drawDecorations(ctx, theme, game.camera, game.time);
    drawGround(ctx, theme, game.camera);

    if (game.state === STATES.MENU) this.#drawMenuMascot(game);
    else this.#drawWorld(game);

    drawParticles(ctx, game.effects.particles, game.camera);
    drawPopups(ctx, game.effects.popups, game.camera);
    ctx.restore();

    this.overlay.clearRect(0, 0, VIEW.width, VIEW.height);
    drawConfetti(this.overlay, game.effects.confetti);
  }

  #drawWorld(game) {
    const { ctx } = this;
    const { camera, time, level } = game;
    const next = game.nextLevel;
    const goalLabel = next ? { label: TEXTS.goalNext, icon: next.emoji } : { label: TEXTS.goalExit, icon: TEXTS.goalExitIcon };

    for (const item of game.world.items) {
      const x = item.x - camera;
      if (x > VIEW.width + VISIBLE_MARGIN) break;
      if (x + (item.w || 40) < -VISIBLE_MARGIN) continue;
      switch (item.type) {
        case "spike": drawSpike(ctx, level.theme, x, item.y); break;
        case "block": drawBlock(ctx, level.theme, item, x); break;
        case "portal": drawPortal(ctx, item, x, time); break;
        case "goal": drawGoal(ctx, item, x, time, goalLabel); break;
        case "collectible": if (!item.done) drawCollectible(ctx, level.collectible, item, x, time); break;
        case "heart": if (!item.done) drawHeart(ctx, item, x, time); break;
      }
    }

    drawTrail(ctx, game.effects.trail, camera);
    const p = game.player;
    const blinking = p.invulnerable > 0 && Math.floor(p.invulnerable * 12) % 2 === 0;
    if (!blinking) drawPlayer(ctx, { ...p, x: p.x - camera }, level.theme.colors.player);
  }

  /** On the menu, Bolo bounces in place. */
  #drawMenuMascot(game) {
    const t = game.time;
    const restingY = WORLD.groundY - PLAYER.size;
    const y = restingY - Math.abs(Math.sin(t * 3)) * 90;
    drawPlayer(this.ctx, { x: WORLD.playerScreenX, y, rotation: t * 6, grounded: y > restingY - 4, squash: 0 },
      game.level.theme.colors.player);
  }
}
