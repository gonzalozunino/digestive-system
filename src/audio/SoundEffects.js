// Plays the sound effects described in data/sounds.js.
import { SOUNDS } from "../data/sounds.js";

export class SoundEffects {
  constructor(engine, sounds = SOUNDS) {
    this.engine = engine;
    this.sounds = sounds;
  }

  play(name) {
    const notes = this.sounds[name];
    if (!notes) return;
    for (const { kind, ...note } of notes) {
      if (kind === "noise") this.engine.noise(note);
      else this.engine.tone(note);
    }
  }
}
