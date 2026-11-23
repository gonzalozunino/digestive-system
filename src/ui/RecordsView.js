// High-score table of the current topic.
import { byId } from "./dom.js";
import { MEDALS, TEXTS } from "../data/texts.js";
import { format } from "../utils/text.js";

export class RecordsView {
  /** @param levels the topic's levels, to name the level of each record */
  constructor(levels) {
    this.body = byId("records-body");
    this.levels = new Map(levels.map(level => [level.id, level]));
  }

  #levelLabel(record) {
    const level = this.levels.get(record.levelId);
    return level ? format(TEXTS.recordLevel, { level: level.shortName, percent: record.percent }) : "—";
  }

  render(records, highlightIndex = -1) {
    if (!records.length) {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 4;
      cell.className = "records__empty";
      cell.textContent = TEXTS.recordsEmpty;
      row.append(cell);
      this.body.replaceChildren(row);
      return;
    }
    this.body.replaceChildren(...records.map((record, i) => {
      const row = document.createElement("tr");
      if (i === highlightIndex) row.className = "records__row--mine";
      [MEDALS[i] ?? String(i + 1), record.name, this.#levelLabel(record), String(record.score)].forEach((value, column) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (column === 3) cell.className = "records__number";
        row.append(cell);
      });
      return row;
    }));
  }
}
