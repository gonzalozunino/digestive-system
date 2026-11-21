// Main menu, difficulty selector and the help screen's back button.
import { byId } from "./dom.js";
import { mascotSvg } from "../assets/mascot.js";

export class MenuView {
  constructor({ onPlay, onRecords, onHelp, onBack, onDifficulty }) {
    byId("menu-mascot").innerHTML = mascotSvg("happy");
    byId("menu-play").addEventListener("click", onPlay);
    byId("menu-records").addEventListener("click", onRecords);
    byId("menu-help").addEventListener("click", onHelp);
    document.querySelectorAll("[data-back]").forEach(button => button.addEventListener("click", onBack));
    this.difficultyButtons = [...document.querySelectorAll("[data-difficulty]")];
    this.difficultyButtons.forEach(button =>
      button.addEventListener("click", () => onDifficulty(button.dataset.difficulty)));
  }

  setDifficulty(key) {
    this.difficultyButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.difficulty === key)));
  }
}
