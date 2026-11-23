// Main menu (title, topic, character picker) and the help screen.
import { byId } from "./dom.js";
import { difficultyLabel } from "./labels.js";
import { GAME_NAME, TEXTS } from "../data/texts.js";
import { DIFFICULTY_ORDER } from "../data/config.js";
import { format } from "../utils/text.js";

export class MenuView {
  /**
   * @param {{topic: object, characters: object[]}} content  topic from prepareTopic()
   * @param {{onPlay, onRecords, onHelp, onBack, onCharacter}} handlers
   */
  constructor({ topic, characters }, { onPlay, onRecords, onHelp, onBack, onCharacter }) {
    this.topic = topic;
    this.mascot = byId("menu-mascot");
    this.lead = byId("menu-lead");
    byId("menu-title").textContent = GAME_NAME;
    byId("menu-subject").textContent = topic.subject;
    byId("help-collect").textContent = topic.collectHelp;
    byId("help-difficulties").textContent = format(TEXTS.helpDifficulties, {
      list: DIFFICULTY_ORDER.map(difficultyLabel).join(", "),
    });

    byId("menu-play").addEventListener("click", onPlay);
    byId("menu-records").addEventListener("click", onRecords);
    byId("menu-help").addEventListener("click", onHelp);
    document.querySelectorAll("[data-back]").forEach(button => button.addEventListener("click", onBack));

    this.characterButtons = characters.map(character => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "character-option";
      button.dataset.character = character.id;
      button.setAttribute("aria-label", character.name);
      button.title = character.name;
      button.innerHTML = character.portrait("happy");
      button.addEventListener("click", () => onCharacter(character.id));
      return button;
    });
    byId("menu-characters").replaceChildren(...this.characterButtons);
  }

  setCharacter(character) {
    this.characterButtons.forEach(b => b.setAttribute("aria-pressed", String(b.dataset.character === character.id)));
    this.mascot.innerHTML = character.portrait("happy");
    this.lead.textContent = format(TEXTS.menuLead, { hero: character.name, tagline: character.tagline, pitch: this.topic.pitch });
  }
}
