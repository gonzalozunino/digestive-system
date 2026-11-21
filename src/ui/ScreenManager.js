// Shows one overlay screen at a time (or none while playing).
import { byId } from "./dom.js";

export class ScreenManager {
  constructor(ids) {
    this.screens = new Map(ids.map(id => [id, byId(id)]));
  }

  show(id) {
    for (const [key, element] of this.screens) element.hidden = key !== id;
  }

  hideAll() {
    this.show(null);
  }
}
