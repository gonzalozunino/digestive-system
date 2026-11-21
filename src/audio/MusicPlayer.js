// Step sequencer that plays the loop described in data/music.js in a level's key and tempo.
import { MUSIC } from "../data/music.js";

const midiToHz = note => 440 * Math.pow(2, (note - 69) / 12);
const onStep = (step, { every, offset }) => step % every === offset;

export class MusicPlayer {
  constructor(engine, song = MUSIC) {
    this.engine = engine;
    this.song = song;
    this.timer = null;
  }

  get playing() { return this.timer !== null; }

  /** @param {{rootNote:number, bpm:number}} track @param {number} tempo multiplier */
  start(track, tempo = 1) {
    if (!this.engine.ready || this.playing) return;
    this.rootNote = track.rootNote;
    this.stepLength = 60 / (track.bpm * tempo) / this.song.stepsPerBeat;
    this.step = 0;
    this.nextTime = this.engine.now + 0.06;
    this.timer = setInterval(() => this.#schedule(), this.song.schedulerMs);
  }

  stop() {
    clearInterval(this.timer);
    this.timer = null;
  }

  #schedule() {
    while (this.nextTime < this.engine.now + this.song.lookahead) {
      this.#playStep(this.step, this.nextTime);
      this.nextTime += this.stepLength;
      this.step = (this.step + 1) % this.song.loopSteps;
    }
  }

  #playStep(step, at) {
    const { kick, snare, hat, bass, arpeggio, progression, stepsPerBar } = this.song;
    const bar = Math.floor(step / stepsPerBar) % progression.length;
    const inBar = step % stepsPerBar;
    const root = this.rootNote + progression[bar];
    const music = { at, bus: "music" };

    if (onStep(inBar, kick)) this.engine.tone({ ...music, freq: kick.from, slideTo: kick.to, duration: kick.duration, wave: "sine", volume: kick.volume });
    if (onStep(inBar, snare)) this.engine.noise({ ...music, duration: snare.duration, volume: snare.volume, highpass: snare.highpass });
    if (onStep(inBar, hat)) this.engine.noise({ ...music, duration: hat.duration, volume: hat.volume, highpass: hat.highpass });
    if (onStep(inBar, bass)) {
      const up = inBar % 4 === bass.upOnStep ? 12 : 0;
      this.engine.tone({ ...music, freq: midiToHz(root + bass.octave + up), duration: bass.duration, wave: bass.wave, volume: bass.volume });
    }
    if (arpeggio.steps.includes(inBar)) {
      const interval = arpeggio.intervals[Math.floor(inBar / 2) % arpeggio.intervals.length];
      this.engine.tone({ ...music, freq: midiToHz(root + arpeggio.octave + interval), duration: arpeggio.duration, wave: arpeggio.wave, volume: arpeggio.volume });
    }
  }
}
