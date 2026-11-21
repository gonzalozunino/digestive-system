// Pause card.
import { byId, focusSoon } from "./dom.js";

export class PauseView {
  constructor({ onResume, onQuit }) {
    this.resumeButton = byId("pause-resume");
    this.resumeButton.addEventListener("click", onResume);
    byId("pause-quit").addEventListener("click", onQuit);
  }

  focus() { focusSoon(this.resumeButton); }
}
