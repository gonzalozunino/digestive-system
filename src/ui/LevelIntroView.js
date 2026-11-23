// Card shown before a level: difficulty, what it is about, what to collect and the best progress.
import { byId, focusSoon } from "./dom.js";
import { difficultyLabel } from "./labels.js";
import { TEXTS } from "../data/texts.js";
import { DIFFICULTY } from "../data/config.js";
import { format } from "../utils/text.js";

export class LevelIntroView {
  constructor({ onStart }) {
    this.difficulty = byId("intro-difficulty");
    this.emoji = byId("intro-emoji");
    this.name = byId("intro-name");
    this.text = byId("intro-text");
    this.heroNote = byId("intro-hero-note");
    this.collect = byId("intro-collect");
    this.stats = byId("intro-stats");
    this.startButton = byId("intro-start");
    this.startButton.addEventListener("click", onStart);
  }

  /** @param {{level, best}} info  @param {boolean} showHeroNote only for the topic's own hero */
  show({ level, best }, showHeroNote) {
    const { hearts, questions } = DIFFICULTY[level.difficulty];
    this.difficulty.textContent = difficultyLabel(level.difficulty);
    this.difficulty.className = `chip chip--${level.difficulty}`;
    this.emoji.textContent = level.emoji;
    this.name.textContent = level.name;
    this.text.textContent = level.intro;
    this.heroNote.textContent = showHeroNote && level.heroNote ? level.heroNote : "";
    this.heroNote.hidden = !this.heroNote.textContent;
    this.collect.textContent = level.collectible.hint;
    const stats = [format(TEXTS.levelHearts, { hearts, questions })];
    if (best.best > 0) stats.push(best.completed ? TEXTS.completed : format(TEXTS.bestProgress, { best: best.best }));
    this.stats.textContent = stats.join(" · ");
    focusSoon(this.startButton);
  }
}
