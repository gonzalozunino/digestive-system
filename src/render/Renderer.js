// Draws a frame of the game. Reads game state; never changes it.
import { VIEW, WORLD, PLAYER } from "../data/config.js";
import { STATES } from "../game/states.js";
import { drawSky, drawDecorations, drawGround } from "./scenery.js";
import { drawSpike, drawBlock, drawPad, drawPortal, drawGoal, drawHeart, drawPlayer } from "./sprites.js";
import { drawCollectible } from "./collectibles.js";
import { drawTrail, drawParticles, drawPopups, drawConfetti } from "./effectsRenderer.js";

const VISIBLE_MARGIN = 120;

export class Renderer {
  /**
   * @param {HTMLCanvasElement} worldCanvas
   * @param {HTMLCanvasElement} overlayCanvas  confetti, drawn above the UI screens
   * @param {{sceneries: object, character: object}} options  sceneries by name; the chosen character
   */
  constructor(worldCanvas, overlayCanvas, { sceneries, character }) {
    for (const canvas of [worldCanvas, overlayCanvas]) {
      canvas.width = VIEW.width;
      canvas.height = VIEW.height;
    }
    this.ctx = worldCanvas.getContext("2d");
    this.overlay = overlayCanvas.getContext("2d");
    this.sceneries = sceneries;
    this.character = character;
  }

  setCharacter(character) { this.character = character; }

  render(game) {
    const ctx = this.ctx;
    const scenery = this.sceneries[game.level.scenery];
    ctx.save();
    if (game.shake > 0) ctx.translate((Math.random() * 2 - 1) * game.shake, (Math.random() * 2 - 1) * game.shake);

    drawSky(ctx, scenery);
    drawDecorations(ctx, scenery, game.camera, game.time);
    drawGround(ctx, scenery, game.camera);

    if (game.state === STATES.MENU) this.#drawMenuCharacter(game);
    else this.#drawWorld(game, scenery);

    drawParticles(ctx, game.effects.particles, game.camera);
    drawPopups(ctx, game.effects.popups, game.camera);
    ctx.restore();

    this.overlay.clearRect(0, 0, VIEW.width, VIEW.height);
    drawConfetti(this.overlay, game.effects.confetti);
  }

  /** Only the topic's own hero changes color between levels. */
  #tint(game) {
    return this.character.id === game.topic.heroId ? game.level.heroTint ?? undefined : undefined;
  }

  #drawWorld(game, scenery) {
    const { ctx } = this;
    const { camera, time, level } = game;
    const goalLabel = { label: level.finish.label, icon: level.finish.icon };

    for (const item of game.world.items) {
      const x = item.x - camera;
      if (x > VIEW.width + VISIBLE_MARGIN) break;
      if (x + (item.w || 40) < -VISIBLE_MARGIN) continue;
      switch (item.type) {
        case "spike": drawSpike(ctx, scenery, x, item.y); break;
        case "block": drawBlock(ctx, scenery, item, x); break;
        case "portal": drawPortal(ctx, item, x, time); break;
        case "goal": drawGoal(ctx, item, x, time, goalLabel); break;
        case "pad": drawPad(ctx, item, x, time); break;
        case "collectible": if (!item.done) drawCollectible(ctx, level.collectible, item, x, time); break;
        case "heart": if (!item.done) drawHeart(ctx, item, x, time); break;
      }
    }

    drawTrail(ctx, game.effects.trail, camera);
    const p = game.player;
    const blinking = p.invulnerable > 0 && Math.floor(p.invulnerable * 12) % 2 === 0;
    if (!blinking) drawPlayer(ctx, { ...p, x: p.x - camera }, this.character, { time, tint: this.#tint(game) });
  }

  /** On the menu, the chosen character bounces in place. */
  #drawMenuCharacter(game) {
    const t = game.time;
    const restingY = WORLD.groundY - PLAYER.size;
    const y = restingY - Math.abs(Math.sin(t * 3)) * 90;
    const pose = { x: WORLD.playerScreenX, y, rotation: t * 6, grounded: y > restingY - 4, squash: 0 };
    drawPlayer(this.ctx, pose, this.character, { time: t, tint: this.#tint(game) });
  }
}
