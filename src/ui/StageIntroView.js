// Card shown before each stage: what it is, what to collect and, for the topic's own hero, a note.
import { byId, focusSoon } from "./dom.js";
import { TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

export class StageIntroView {
  constructor({ onStart }) {
    this.step = byId("intro-step");
    this.emoji = byId("intro-emoji");
    this.name = byId("intro-name");
    this.text = byId("intro-text");
    this.heroNote = byId("intro-hero-note");
    this.collect = byId("intro-collect");
    this.startButton = byId("intro-start");
    this.startButton.addEventListener("click", onStart);
  }

  /** @param {{stage, number, total}} info  @param {boolean} showHeroNote */
  show({ stage, number, total }, showHeroNote) {
    this.step.textContent = format(TEXTS.stageStep, { number, total });
    this.emoji.textContent = stage.emoji;
    this.name.textContent = stage.name;
    this.text.textContent = stage.intro;
    this.heroNote.textContent = showHeroNote && stage.heroNote ? stage.heroNote : "";
    this.heroNote.hidden = !this.heroNote.textContent;
    this.collect.textContent = stage.collectible.hint;
    focusSoon(this.startButton);
  }
}
