// Card shown before each organ: what it is, what Bolo becomes and what to collect.
import { byId, focusSoon } from "./dom.js";
import { TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

export class LevelIntroView {
  constructor({ onStart }) {
    this.step = byId("intro-step");
    this.emoji = byId("intro-emoji");
    this.name = byId("intro-name");
    this.text = byId("intro-text");
    this.form = byId("intro-form");
    this.collect = byId("intro-collect");
    this.startButton = byId("intro-start");
    this.startButton.addEventListener("click", onStart);
  }

  show({ level, number, total }) {
    this.step.textContent = format(TEXTS.levelStep, { number, total });
    this.emoji.textContent = level.emoji;
    this.name.textContent = level.name;
    this.text.textContent = level.intro;
    this.form.textContent = level.form;
    this.collect.textContent = level.collectible.hint;
    focusSoon(this.startButton);
  }
}
