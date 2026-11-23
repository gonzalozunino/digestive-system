// Top bar: hearts, current level, progress (bar and %), score, pause and mute buttons.
import { byId } from "./dom.js";
import { TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

export class HudView {
  constructor({ onPause, onMute }) {
    this.root = byId("hud");
    this.hearts = byId("hud-hearts");
    this.level = byId("hud-level");
    this.progress = byId("hud-progress");
    this.percent = byId("hud-percent");
    this.score = byId("hud-score");
    this.muteButton = byId("hud-mute");
    byId("hud-pause").addEventListener("click", onPause);
    this.muteButton.addEventListener("click", onMute);
  }

  setVisible(visible) { this.root.hidden = !visible; }

  update({ hearts, maxHearts, score, level }) {
    this.hearts.textContent = "❤️".repeat(Math.max(0, hearts)) + "🖤".repeat(Math.max(0, maxHearts - hearts));
    this.score.textContent = format(TEXTS.score, { score });
    this.level.textContent = `${level.emoji} ${level.shortName}`;
  }

  setProgress(ratio) {
    this.progress.style.setProperty("--progress", ratio);
    this.percent.textContent = format(TEXTS.percent, { percent: Math.floor(ratio * 100) });
  }

  setMuted(muted) { this.muteButton.textContent = muted ? TEXTS.muteOn : TEXTS.muteOff; }
}
