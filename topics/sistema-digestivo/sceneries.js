// Sceneries drawn for this topic: one per organ. Same shape as the generic sceneries in
// src/render/sceneries.js: { colors, spikeStyle, spikeGlow, groundDots, draw(ctx, camera, time) }.
import { VIEW, WORLD } from "../../src/data/config.js";
import { roundRectPath, wrap } from "../../src/render/canvasUtils.js";

const W = VIEW.width, H = VIEW.height, GROUND = WORLD.groundY;

export const SCENERIES = {
  /** Mouth: palate bumps and a row of upper teeth. */
  teeth: {
    spikeStyle: "tooth", spikeGlow: 0, groundDots: true,
    colors: { skyTop: "#5a0f2a", skyBottom: "#a3244b", ground: "#e35d7f", groundEdge: "#ff9ab3",
      spike: "#fffaf0", spikeEdge: "#d9cbb4", block: "#f4e9d8", blockEdge: "#bfa98a" },
    draw(ctx, camera) {
      ctx.fillStyle = "rgba(255,140,170,.25)";
      for (let i = -1; i < 14; i++) {
        const x = wrap(i * 90 - camera * 0.25, 90 * 14) - 90;
        ctx.beginPath(); ctx.arc(x, H * 0.62, 70, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = "#c2335c";
      ctx.fillRect(0, 0, W, 52);
      for (let i = -1; i < 12; i++) {
        const x = wrap(i * 96 - camera * 0.5, 96 * 12) - 96;
        ctx.fillStyle = "#fffaf0"; roundRectPath(ctx, x + 8, 30, 72, 58, 18); ctx.fill();
        ctx.fillStyle = "rgba(0,0,0,.08)"; roundRectPath(ctx, x + 50, 34, 22, 48, 10); ctx.fill();
      }
    },
  },

  /** Pharynx: the uvula swinging above and the two tunnels (air and food) in the back. */
  throat: {
    spikeStyle: "triangle", spikeGlow: 6,
    colors: { skyTop: "#4a0d1f", skyBottom: "#8e2a43", ground: "#cf5470", groundEdge: "#ff9fb4",
      spike: "#ffd6df", spikeEdge: "#c0566f", block: "#7a2338", blockEdge: "#ff9fb4" },
    draw(ctx, camera, time) {
      for (let i = -1; i < 6; i++) {
        const x = wrap(i * 260 - camera * 0.2, 260 * 6) - 260;
        ctx.fillStyle = "rgba(30,0,10,.45)";
        ctx.beginPath(); ctx.ellipse(x + 70, GROUND, 55, 150, 0, Math.PI, 0); ctx.fill();
        ctx.fillStyle = "rgba(60,0,20,.3)";
        ctx.beginPath(); ctx.ellipse(x + 190, GROUND, 45, 120, 0, Math.PI, 0); ctx.fill();
      }
      ctx.fillStyle = "#b8395a";
      ctx.fillRect(0, 0, W, 46);
      for (let i = -1; i < 5; i++) {
        const x = wrap(i * 300 - camera * 0.5, 300 * 5) - 150;
        const swing = Math.sin(time * 2 + i) * 0.25;
        ctx.save();
        ctx.translate(x, 40); ctx.rotate(swing);
        ctx.fillStyle = "#e2738e";
        ctx.beginPath(); ctx.moveTo(-14, 0); ctx.quadraticCurveTo(-12, 70, 0, 84); ctx.quadraticCurveTo(12, 70, 14, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    },
  },

  /** Esophagus: muscle rings pulsing like peristalsis. */
  rings: {
    spikeStyle: "triangle", spikeGlow: 6,
    colors: { skyTop: "#5c2306", skyBottom: "#b4521b", ground: "#d9783a", groundEdge: "#ffb27a",
      spike: "#ffd9a8", spikeEdge: "#c98745", block: "#8a3a12", blockEdge: "#ffb27a" },
    draw(ctx, camera, time) {
      for (let i = -1; i < 10; i++) {
        const x = wrap(i * 130 - camera * 0.6, 130 * 10) - 130;
        const pulse = 1 + 0.15 * Math.sin(time * 5 + i * 0.9);
        ctx.strokeStyle = "rgba(255,190,130,.28)";
        ctx.lineWidth = 16 * pulse;
        ctx.beginPath(); ctx.ellipse(x, H / 2 - 20, 38 * pulse, H * 0.55, 0, 0, Math.PI * 2); ctx.stroke();
      }
      ctx.fillStyle = "rgba(60,20,4,.45)";
      ctx.fillRect(0, 0, W, 40);
    },
  },

  /** Stomach: wavy folds and rising acid bubbles. */
  acid: {
    spikeStyle: "triangle", spikeGlow: 16,
    colors: { skyTop: "#1d3a0c", skyBottom: "#4f7d14", ground: "#9acd32", groundEdge: "#e4ff7a",
      spike: "#d8ff3a", spikeEdge: "#7aa312", block: "#3d5f10", blockEdge: "#c7f25a" },
    draw(ctx, camera, time) {
      ctx.strokeStyle = "rgba(220,255,120,.18)";
      ctx.lineWidth = 10;
      for (let row = 0; row < 3; row++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 20) {
          const y = 40 + row * 45 + Math.sin((x + camera * 0.3) / 60 + row + time) * 12;
          if (x) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(230,255,140,.5)";
      ctx.lineWidth = 2;
      for (let i = 0; i < 26; i++) {
        const speed = 40 + (i * 37) % 60;
        const x = wrap(i * 97 - camera * 0.35, W + 60) - 30;
        const y = H - wrap(time * speed + i * 83, H + 40);
        ctx.beginPath(); ctx.arc(x + Math.sin(time * 2 + i) * 8, y, 5 + (i % 4) * 3, 0, Math.PI * 2); ctx.stroke();
      }
    },
  },

  /** Small intestine: swaying villi above and below. */
  villi: {
    spikeStyle: "triangle", spikeGlow: 6,
    colors: { skyTop: "#3a0f4f", skyBottom: "#7d2f8f", ground: "#c45bd6", groundEdge: "#f3a6ff",
      spike: "#ffc2f3", spikeEdge: "#b45fb0", block: "#5a1f6e", blockEdge: "#f3a6ff" },
    draw(ctx, camera, time) {
      for (let layer = 0; layer < 2; layer++) {
        const parallax = layer ? 0.55 : 0.3, size = layer ? 1 : 0.7;
        ctx.fillStyle = layer ? "rgba(243,166,255,.35)" : "rgba(243,166,255,.16)";
        for (let i = -1; i < 24; i++) {
          const x = wrap(i * 48 - camera * parallax, 48 * 24) - 48;
          const sway = Math.sin(time * 2 + i) * 6;
          const h = (70 + (i * 29) % 50) * size;
          roundRectPath(ctx, x + sway * 0.3, -20, 26 * size, h, 13 * size); ctx.fill();
          roundRectPath(ctx, x + 20 + sway, GROUND - h - 10 + 20 * (1 - size), 26 * size, h + 30, 13 * size); ctx.fill();
        }
      }
    },
  },

  /** Large intestine: haustra bulges and faint background bacteria. */
  colon: {
    spikeStyle: "triangle", spikeGlow: 6,
    colors: { skyTop: "#2e1a0b", skyBottom: "#6b4320", ground: "#9b6a3c", groundEdge: "#e0ac74",
      spike: "#f5d0a0", spikeEdge: "#a8743f", block: "#4a2c12", blockEdge: "#e0ac74" },
    draw(ctx, camera, time) {
      ctx.fillStyle = "rgba(224,172,116,.16)";
      for (let i = -1; i < 9; i++) {
        const x = wrap(i * 150 - camera * 0.3, 150 * 9) - 150;
        ctx.beginPath(); ctx.arc(x + 75, -30, 95, 0, Math.PI); ctx.fill();
      }
      const colors = ["#7ed957", "#ffb347", "#6fc3ff", "#ff7eb6"];
      for (let i = 0; i < 10; i++) {
        const x = wrap(i * 130 - camera * 0.45 + Math.sin(time + i) * 20, W + 120) - 60;
        const y = 120 + (i * 67) % 220 + Math.sin(time * 1.5 + i * 2) * 12;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(Math.sin(time + i) * 0.3);
        ctx.globalAlpha = 0.3; ctx.fillStyle = colors[i % 4];
        roundRectPath(ctx, -20, -10, 40, 20, 10); ctx.fill();
        ctx.globalAlpha = 0.45; ctx.fillStyle = "#2e1a0b";
        ctx.beginPath(); ctx.arc(-6, -2, 2.4, 0, 7); ctx.arc(6, -2, 2.4, 0, 7); ctx.fill();
        ctx.strokeStyle = "#2e1a0b"; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.arc(0, 2, 5, 0.2, Math.PI - 0.2); ctx.stroke();
        ctx.restore();
      }
    },
  },
};
