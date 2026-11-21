// End-of-game card (win or lose) with the form to save the score.
import { byId, focusSoon } from "./dom.js";
import { mascotSvg } from "../assets/mascot.js";
import { TEXTS } from "../data/texts.js";
import { RECORDS } from "../data/config.js";
import { format } from "../utils/text.js";

export class ResultsView {
  constructor({ onSave, onAgain, onMenu }) {
    this.mascot = byId("results-mascot");
    this.title = byId("results-title");
    this.text = byId("results-text");
    this.score = byId("results-score");
    this.form = byId("results-form");
    this.nameInput = byId("results-name");
    this.nameInput.maxLength = RECORDS.nameMaxLength;
    byId("results-again").addEventListener("click", onAgain);
    byId("results-menu").addEventListener("click", onMenu);
    this.form.addEventListener("submit", event => {
      event.preventDefault();
      const name = this.nameInput.value.trim().slice(0, RECORDS.nameMaxLength) || TEXTS.anonymous;
      this.form.hidden = true;
      onSave(name);
    });
  }

  show({ won, score, correct, asked, level }, lastName = "") {
    this.mascot.innerHTML = mascotSvg(won ? "wow" : "sad");
    this.title.textContent = won ? TEXTS.winTitle : TEXTS.loseTitle;
    this.text.textContent = format(won ? TEXTS.winText : TEXTS.loseText, { correct, asked, place: level.name.toLowerCase() });
    this.score.textContent = format(TEXTS.finalScore, { score });
    this.form.hidden = false;
    this.nameInput.value = lastName;
    focusSoon(this.nameInput);
  }
}
