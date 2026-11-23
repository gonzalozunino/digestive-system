// End-of-level card (completed or out of hearts) with the form to save the score.
import { byId, focusSoon } from "./dom.js";
import { TEXTS } from "../data/texts.js";
import { RECORDS } from "../data/config.js";
import { format } from "../utils/text.js";

export class ResultsView {
  constructor({ onSave, onAgain, onNext, onLevels }) {
    this.mascot = byId("results-mascot");
    this.title = byId("results-title");
    this.text = byId("results-text");
    this.best = byId("results-best");
    this.score = byId("results-score");
    this.form = byId("results-form");
    this.nameInput = byId("results-name");
    this.nextButton = byId("results-next");
    this.nameInput.maxLength = RECORDS.nameMaxLength;
    byId("results-again").addEventListener("click", onAgain);
    byId("results-levels").addEventListener("click", onLevels);
    this.nextButton.addEventListener("click", onNext);
    this.form.addEventListener("submit", event => {
      event.preventDefault();
      const name = this.nameInput.value.trim().slice(0, RECORDS.nameMaxLength) || TEXTS.anonymous;
      this.form.hidden = true;
      onSave(name);
    });
  }

  /**
   * @param summary  "gameOver" event from the game
   * @param {{character: object, lastName: string}} context
   */
  show({ won, score, correct, asked, level, percent, isNewBest, nextLevel }, { character, lastName = "" }) {
    const values = { correct, asked, percent, level: level.name };
    this.mascot.innerHTML = character.portrait(won ? "wow" : "sad");
    this.title.textContent = won ? level.finish.winTitle : TEXTS.loseTitle;
    const loseText = asked ? TEXTS.loseText : TEXTS.loseTextEarly;
    this.text.textContent = format(won ? level.finish.winText : loseText, values);
    this.best.textContent = isNewBest && !won ? TEXTS.newBest : "";
    this.best.hidden = !this.best.textContent;
    this.score.textContent = format(TEXTS.finalScore, { score });
    this.nextButton.hidden = !(won && nextLevel);
    this.form.hidden = false;
    this.nameInput.value = lastName;
    focusSoon(this.nameInput);
  }
}
