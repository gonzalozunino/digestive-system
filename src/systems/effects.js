// Short-lived visual effects state: particles, floating labels, trail and confetti.
// Only simulation lives here; drawing is done by render/effectsRenderer.js.
import { VIEW } from "../data/config.js";
import { VISUALS } from "../data/visuals.js";
import { pickOne, randomBetween } from "../utils/random.js";

const PARTICLE_GRAVITY = 900;
const CONFETTI_GRAVITY = 500;
const TRAIL_LIFE = 0.35;

export class Effects {
  constructor(rng = Math.random) {
    this.rng = rng;
    this.confetti = [];   // screen space; survives level changes
    this.clear();
  }

  clear() {
    this.particles = [];  // world space
    this.popups = [];
    this.trail = [];
  }

  update(dt) {
    for (const p of this.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += PARTICLE_GRAVITY * dt; p.life -= dt; }
    for (const p of this.popups) { p.y -= 60 * dt; p.life -= dt; }
    for (const t of this.trail) t.life -= dt;
    for (const c of this.confetti) {
      c.x += c.vx * dt; c.y += c.vy * dt; c.vy += CONFETTI_GRAVITY * dt; c.vx *= 0.99; c.rotation += c.spin * dt; c.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);
    this.popups = this.popups.filter(p => p.life > 0);
    this.trail = this.trail.filter(t => t.life > 0);
    this.confetti = this.confetti.filter(c => c.life > 0 && c.y < VIEW.height + 40);
  }

  #spawn(x, y, vx, vy, life, color, size) {
    this.particles.push({ x, y, vx, vy, life, maxLife: life, color, size });
  }

  /** Sparkles flying out in every direction. */
  burst(x, y, color, count = 10) {
    const r = (a, b) => randomBetween(a, b, this.rng);
    for (let i = 0; i < count; i++) {
      const angle = r(0, Math.PI * 2), speed = r(80, 260);
      this.#spawn(x, y, Math.cos(angle) * speed, Math.sin(angle) * speed - 100, r(0.3, 0.6), color, r(2, 5));
    }
  }

  /** Pieces flying up when the player gets hurt. */
  splash(x, y, color) {
    const r = (a, b) => randomBetween(a, b, this.rng);
    for (let i = 0; i < 24; i++) this.#spawn(x, y, r(-300, 300), r(-400, 100), r(0.4, 0.8), color, r(3, 7));
  }

  /** Small puff under the player when landing. */
  dust(x, y, width, color) {
    const r = (a, b) => randomBetween(a, b, this.rng);
    for (let i = 0; i < 6; i++) this.#spawn(x + r(0, width), y, r(-80, 80), r(-120, -20), 0.3, color, 3);
  }

  popup(x, y, text, color) {
    this.popups.push({ x, y, text, color, life: 0.8 });
  }

  addTrail(x, y) {
    this.trail.push({ x, y, life: TRAIL_LIFE, maxLife: TRAIL_LIFE });
  }

  celebrate(count) {
    const r = (a, b) => randomBetween(a, b, this.rng);
    const piece = (x, y, vx, vy, life) => ({
      x, y, vx, vy, life, rotation: r(0, 6), spin: r(-8, 8), w: r(6, 12), h: r(4, 8),
      color: pickOne(VISUALS.confettiColors, this.rng),
    });
    for (let i = 0; i < count; i++) this.confetti.push(piece(r(0, VIEW.width), r(-60, -10), r(-120, 120), r(100, 350), r(2, 3.5)));
    for (let i = 0; i < count / 3; i++) this.confetti.push(piece(VIEW.width / 2 + r(-40, 40), VIEW.height * 0.6, r(-500, 500), r(-700, -300), r(2, 3)));
  }
}
