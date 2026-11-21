// Sceneries: sky, parallax decorations and ground. Generic sceneries live here; a topic may add its own.
//
// Scenery interface:
//   colors      { skyTop, skyBottom, ground, groundEdge, spike, spikeEdge, block, blockEdge }
//   spikeStyle  "triangle" | "tooth";  spikeGlow: shadow blur for spikes;  groundDots: speckled ground
//   draw(ctx, camera, time)  parallax decorations between the sky and the ground
import { VIEW, WORLD } from "../data/config.js";
import { roundRectPath, wrap } from "./canvasUtils.js";

const W = VIEW.width, H = VIEW.height, GROUND = WORLD.groundY;

export const GENERIC_SCENERIES = {
  forest: {
    spikeStyle: "triangle", spikeGlow: 4,
    colors: { skyTop: "#2b6e8f", skyBottom: "#9fd8b8", ground: "#4f7a2a", groundEdge: "#a5d86a",
      spike: "#e8f5c8", spikeEdge: "#557a2a", block: "#7a4e2d", blockEdge: "#c08a5a" },
    draw(ctx, camera, time) {
      ctx.fillStyle = "rgba(40,110,80,.35)";
      for (let i = -1; i < 8; i++) {
        const x = wrap(i * 180 - camera * 0.15, 180 * 8) - 180;
        ctx.beginPath(); ctx.ellipse(x + 90, GROUND, 160, 120, 0, Math.PI, 0); ctx.fill();
      }
      for (let i = -1; i < 14; i++) {
        const x = wrap(i * 90 - camera * 0.45, 90 * 14) - 90, h = 120 + (i * 37) % 70;
        ctx.fillStyle = "rgba(60,40,20,.55)"; ctx.fillRect(x + 40, GROUND - 30, 10, 30);
        ctx.fillStyle = "rgba(25,80,45,.7)";
        for (let k = 0; k < 3; k++) {
          const top = GROUND - h + k * 30;
          ctx.beginPath(); ctx.moveTo(x + 45, top); ctx.lineTo(x + 45 - 34 + k * 3, top + 60); ctx.lineTo(x + 45 + 34 - k * 3, top + 60); ctx.closePath(); ctx.fill();
        }
      }
      for (let i = 0; i < 18; i++) {
        ctx.fillStyle = `rgba(255,240,140,${0.35 + 0.35 * Math.sin(time * 3 + i)})`;
        ctx.beginPath(); ctx.arc(wrap(i * 73 - camera * 0.3, W + 40) - 20, 120 + (i * 53) % 240 + Math.sin(time + i) * 10, 2.5, 0, 7); ctx.fill();
      }
    },
  },

  ocean: {
    spikeStyle: "triangle", spikeGlow: 6,
    colors: { skyTop: "#06325a", skyBottom: "#1b7fb0", ground: "#d9b77a", groundEdge: "#ffe3a8",
      spike: "#ff8c8c", spikeEdge: "#b84a4a", block: "#5a6f80", blockEdge: "#a8c4d8" },
    draw(ctx, camera, time) {
      ctx.fillStyle = "rgba(255,255,255,.06)";
      for (let i = 0; i < 6; i++) {
        const x = wrap(i * 200 - camera * 0.1, W + 200) - 100;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 60, 0); ctx.lineTo(x - 80, GROUND); ctx.lineTo(x - 160, GROUND); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = "rgba(60,180,110,.6)"; ctx.lineWidth = 6; ctx.lineCap = "round";
      for (let i = -1; i < 16; i++) {
        const x = wrap(i * 70 - camera * 0.5, 70 * 16) - 70, h = 60 + (i * 29) % 60;
        ctx.beginPath(); ctx.moveTo(x, GROUND);
        for (let k = 1; k <= 4; k++) ctx.lineTo(x + Math.sin(time * 2 + i + k) * 8, GROUND - (h * k) / 4);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(200,240,255,.5)"; ctx.lineWidth = 2;
      for (let i = 0; i < 22; i++) {
        const y = H - wrap(time * (30 + (i * 13) % 40) + i * 71, H + 40);
        ctx.beginPath(); ctx.arc(wrap(i * 89 - camera * 0.35, W + 60) - 30 + Math.sin(time * 2 + i) * 6, y, 3 + (i % 3) * 2, 0, 7); ctx.stroke();
      }
    },
  },

  cave: {
    spikeStyle: "triangle", spikeGlow: 14,
    colors: { skyTop: "#1a1420", skyBottom: "#3b2f3f", ground: "#5c5160", groundEdge: "#a596a8",
      spike: "#c084fc", spikeEdge: "#7e3fbf", block: "#3f3646", blockEdge: "#8d7b92" },
    draw(ctx, camera, time) {
      ctx.fillStyle = "rgba(90,75,95,.8)";
      for (let i = -1; i < 18; i++) {
        const x = wrap(i * 60 - camera * 0.4, 60 * 18) - 60, h = 40 + (i * 41) % 80;
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 30, h); ctx.lineTo(x + 60, 0); ctx.closePath(); ctx.fill();
      }
      for (let i = 0; i < 14; i++) {
        const x = wrap(i * 97 - camera * 0.25, W + 40) - 20, y = 140 + (i * 61) % 220;
        ctx.fillStyle = `rgba(192,132,252,${0.25 + 0.25 * Math.sin(time * 2 + i)})`;
        ctx.beginPath(); ctx.moveTo(x, y - 8); ctx.lineTo(x + 5, y); ctx.lineTo(x, y + 8); ctx.lineTo(x - 5, y); ctx.closePath(); ctx.fill();
      }
      ctx.fillStyle = "rgba(160,200,255,.5)";
      for (let i = 0; i < 8; i++) {
        const x = wrap(i * 131 - camera * 0.4, W + 40) - 20;
        ctx.beginPath(); ctx.arc(x, wrap(time * 120 + i * 90, GROUND), 2, 0, 7); ctx.fill();
      }
    },
  },

  volcano: {
    spikeStyle: "triangle", spikeGlow: 14,
    colors: { skyTop: "#2a0a0a", skyBottom: "#8a2b0e", ground: "#3b2a26", groundEdge: "#ff7b39",
      spike: "#ffb347", spikeEdge: "#c2410c", block: "#4a3530", blockEdge: "#ff9a5a" },
    draw(ctx, camera, time) {
      for (let i = -1; i < 5; i++) {
        const x = wrap(i * 320 - camera * 0.15, 320 * 5) - 320;
        ctx.fillStyle = "rgba(40,15,10,.75)";
        ctx.beginPath(); ctx.moveTo(x, GROUND); ctx.lineTo(x + 130, 190); ctx.lineTo(x + 190, 190); ctx.lineTo(x + 320, GROUND); ctx.closePath(); ctx.fill();
        ctx.fillStyle = `rgba(255,110,40,${0.5 + 0.2 * Math.sin(time * 3 + i)})`;
        ctx.beginPath(); ctx.ellipse(x + 160, 192, 32, 8, 0, 0, 7); ctx.fill();
      }
      for (let i = 0; i < 30; i++) {
        const y = GROUND - wrap(time * (40 + (i * 17) % 50) + i * 53, GROUND);
        ctx.fillStyle = `rgba(255,${120 + (i * 7) % 100},40,.8)`;
        ctx.fillRect(wrap(i * 67 - camera * 0.3 + Math.sin(time + i) * 10, W + 40) - 20, y, 3, 3);
      }
    },
  },

  space: {
    spikeStyle: "triangle", spikeGlow: 12,
    colors: { skyTop: "#070b24", skyBottom: "#241a52", ground: "#3d3a6b", groundEdge: "#9f9cf5",
      spike: "#7df9ff", spikeEdge: "#2a9fb0", block: "#2b2850", blockEdge: "#9f9cf5" },
    draw(ctx, camera, time) {
      for (let layer = 0; layer < 2; layer++) {
        for (let i = 0; i < 45; i++) {
          const x = wrap(i * 47 + layer * 23 - camera * (layer ? 0.3 : 0.1), W + 20) - 10;
          const y = (i * 89 + layer * 41) % (GROUND - 20);
          ctx.fillStyle = `rgba(255,255,255,${(layer ? 0.7 : 0.4) * (0.6 + 0.4 * Math.sin(time * 2 + i))})`;
          ctx.fillRect(x, y, layer ? 2.5 : 1.5, layer ? 2.5 : 1.5);
        }
      }
      const px = wrap(700 - camera * 0.05, W + 300) - 150;
      ctx.fillStyle = "#e7a96b"; ctx.beginPath(); ctx.arc(px, 150, 46, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(160,90,40,.35)"; ctx.fillRect(px - 46, 140, 92, 10);
      ctx.strokeStyle = "rgba(255,230,190,.7)"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.ellipse(px, 150, 80, 16, -0.3, 0, 7); ctx.stroke();
    },
  },
};

/** Order used for stages that do not choose a scenery. */
export const AUTO_SCENERIES = ["forest", "ocean", "cave", "volcano", "space"];

export function drawSky(ctx, scenery) {
  const gradient = ctx.createLinearGradient(0, 0, 0, H);
  gradient.addColorStop(0, scenery.colors.skyTop);
  gradient.addColorStop(1, scenery.colors.skyBottom);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);
}

export function drawDecorations(ctx, scenery, camera, time) {
  ctx.save();
  scenery.draw?.(ctx, camera, time);
  ctx.restore();
}

export function drawGround(ctx, scenery, camera) {
  const { ground, groundEdge } = scenery.colors;
  ctx.fillStyle = ground;
  ctx.fillRect(0, GROUND, W, H - GROUND);
  ctx.fillStyle = "rgba(0,0,0,.12)";
  for (let i = -1; i < 26; i++) ctx.fillRect(wrap(i * 40 - camera, 40 * 26) - 40, GROUND + 14, 20, 4);
  if (scenery.groundDots) {
    ctx.fillStyle = "rgba(255,255,255,.18)";
    for (let i = 0; i < 40; i++) {
      ctx.beginPath(); ctx.arc(wrap(i * 61 - camera, W + 40) - 20, GROUND + 30 + (i * 13) % 50, 3, 0, 7); ctx.fill();
    }
  }
  ctx.fillStyle = groundEdge;
  ctx.fillRect(0, GROUND, W, 5);
  ctx.shadowColor = groundEdge;
  ctx.shadowBlur = 14;
  ctx.fillRect(0, GROUND, W, 2);
  ctx.shadowBlur = 0;
}
