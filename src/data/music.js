// Background music: a 4-bar loop in 16th-note steps, in a different key and tempo for each level
// (LEVEL_TRACKS, by position; a topic level may set its own `music`). Notes are MIDI numbers.

export const LEVEL_TRACKS = [
  { rootNote: 57, bpm: 126 },
  { rootNote: 55, bpm: 132 },
  { rootNote: 52, bpm: 138 },
  { rootNote: 54, bpm: 144 },
  { rootNote: 50, bpm: 150 },
];

export const MUSIC = {
  stepsPerBeat: 4,
  stepsPerBar: 16,
  loopSteps: 64,
  lookahead: 0.12,      // seconds scheduled ahead
  schedulerMs: 25,
  progression: [0, -4, 3, -2],   // i - VI - III - VII
  kick: { every: 4, offset: 0, from: 150, to: 40, duration: 0.14, volume: 0.9 },
  snare: { every: 8, offset: 4, duration: 0.12, volume: 0.25, highpass: 1500 },
  hat: { every: 2, offset: 1, duration: 0.03, volume: 0.12, highpass: 7000 },
  bass: { every: 2, offset: 0, octave: -12, upOnStep: 2, duration: 0.14, wave: "triangle", volume: 0.45 },
  arpeggio: {
    steps: [0, 3, 6, 8, 10, 12, 14],
    intervals: [0, 3, 7, 12, 7, 3, 0, 15],
    octave: 12, duration: 0.1, wave: "square", volume: 0.12,
  },
};
