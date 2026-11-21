// High-score table.
import { byId } from "./dom.js";
import { LEVELS } from "../data/levels.js";
import { MEDALS, TEXTS } from "../data/texts.js";

function reachedLabel(record) {
  if (typeof record.reached === "string") return record.reached;  // saved by an older version
  return LEVELS[record.reachedLevel]?.shortName ?? TEXTS.recordsFinished;
}

export class RecordsView {
  constructor() {
    this.body = byId("records-body");
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
      [MEDALS[i] ?? String(i + 1), record.name, reachedLabel(record), String(record.score)].forEach((value, column) => {
        const cell = document.createElement("td");
        cell.textContent = value;
        if (column === 3) cell.className = "records__number";
        row.append(cell);
      });
      return row;
    }));
  }
}
