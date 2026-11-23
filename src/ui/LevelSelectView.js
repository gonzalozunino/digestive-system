// Level selection: one card per level with its difficulty and the best progress on this device.
import { byId, focusSoon } from "./dom.js";
import { difficultyLabel } from "./labels.js";
import { TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

export class LevelSelectView {
  constructor({ onPick }) {
    this.list = byId("levels-list");
    this.onPick = onPick;
  }

  /** @param levels topic levels  @param progressOf levelId -> { best, completed } */
  render(levels, progressOf) {
    const cards = levels.map((level, index) => this.#card(level, index, progressOf(level.id)));
    this.list.replaceChildren(...cards);
    focusSoon(cards[0]);
  }

  #card(level, index, { best, completed }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `level-option level-option--${level.difficulty}`;
    button.style.setProperty("--best", best / 100);
    button.addEventListener("click", () => this.onPick(index));

    const part = (tag, className, text) => {
      const el = document.createElement(tag);
      el.className = className;
      el.textContent = text;
      return el;
    };
    const bar = part("span", "level-option__bar", "");
    bar.append(part("span", "level-option__bar-fill", ""));
    button.append(
      part("span", "level-option__number", String(index + 1)),
      part("span", "level-option__emoji", level.emoji),
      part("span", "level-option__name", level.name),
      part("span", "level-option__difficulty", difficultyLabel(level.difficulty)),
      bar,
      part("span", "level-option__best", completed ? TEXTS.completed : format(TEXTS.percent, { percent: best })),
    );
    return button;
  }
}
