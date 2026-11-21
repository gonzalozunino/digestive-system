// Sound effects, described as lists of synthesized notes.
// tone: freq (Hz), duration (s), wave, volume, optional slideTo (Hz) and delay (s).
// noise: duration, volume, highpass (Hz).

const arpeggio = (freqs, { step, ...note }) =>
  freqs.map((freq, i) => ({ kind: "tone", freq, delay: i * step, ...note }));

export const SOUNDS = {
  jump: [{ kind: "tone", freq: 320, duration: 0.12, wave: "square", volume: 0.12, slideTo: 640 }],
  collect: [
    { kind: "tone", freq: 988, duration: 0.07, wave: "square", volume: 0.12 },
    { kind: "tone", freq: 1319, duration: 0.12, wave: "square", volume: 0.12, delay: 0.06 },
  ],
  heart: arpeggio([523, 659, 784, 1047], { step: 0.07, duration: 0.12, wave: "triangle", volume: 0.2 }),
  hit: [
    { kind: "noise", duration: 0.35, volume: 0.5, highpass: 200 },
    { kind: "tone", freq: 200, duration: 0.35, wave: "sawtooth", volume: 0.25, slideTo: 50 },
  ],
  correct: arpeggio([523, 659, 784, 1047, 1319], { step: 0.075, duration: 0.16, wave: "square", volume: 0.13 }),
  wrong: [
    { kind: "tone", freq: 330, duration: 0.22, wave: "sawtooth", volume: 0.2, slideTo: 220 },
    { kind: "tone", freq: 220, duration: 0.35, wave: "sawtooth", volume: 0.2, slideTo: 110, delay: 0.2 },
  ],
  portal: [{ kind: "tone", freq: 400, duration: 0.4, wave: "sine", volume: 0.25, slideTo: 1200 }],
  levelComplete: arpeggio([392, 523, 659, 784, 659, 784, 1047], { step: 0.1, duration: 0.18, wave: "square", volume: 0.12 }),
  gameOver: arpeggio([392, 330, 262, 196], { step: 0.22, duration: 0.3, wave: "triangle", volume: 0.25 }),
  click: [{ kind: "tone", freq: 660, duration: 0.05, wave: "square", volume: 0.08 }],
};
