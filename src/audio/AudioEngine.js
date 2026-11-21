// Thin wrapper over the Web Audio API: mixer buses plus two synth voices (tone and noise).
// Browsers only allow audio after a user gesture, so call unlock() from an input handler.

export class AudioEngine {
  constructor({ masterVolume, musicVolume, sfxVolume }) {
    this.volumes = { masterVolume, musicVolume, sfxVolume };
    this.ctx = null;
    this.muted = false;
  }

  get ready() { return this.ctx !== null; }
  get now() { return this.ctx?.currentTime ?? 0; }

  unlock() {
    if (this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.master = this.#gain(ctx, this.muted ? 0 : this.volumes.masterVolume, ctx.destination);
      this.buses = {
        music: this.#gain(ctx, this.volumes.musicVolume, this.master),
        sfx: this.#gain(ctx, this.volumes.sfxVolume, this.master),
      };
      this.noiseBuffer = this.#makeNoise(ctx);
      this.ctx = ctx;
    } catch {
      this.ctx = null;  // no audio support: the game stays silent
    }
  }

  setMuted(muted) {
    this.muted = muted;
    if (this.master) this.master.gain.value = muted ? 0 : this.volumes.masterVolume;
  }

  /** Plays a tone. `at` is an absolute AudioContext time; otherwise it starts now + delay. */
  tone({ freq, duration, wave = "square", volume = 0.3, slideTo = null, delay = 0, at = null, bus = "sfx" }) {
    if (!this.ctx) return;
    const t = at ?? this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain).connect(this.buses[bus]);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  }

  /** Plays filtered white noise (drums, hits). */
  noise({ duration, volume = 0.3, highpass = 1000, delay = 0, at = null, bus = "sfx" }) {
    if (!this.ctx) return;
    const t = at ?? this.ctx.currentTime + delay;
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "highpass";
    filter.frequency.value = highpass;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    source.connect(filter).connect(gain).connect(this.buses[bus]);
    source.start(t);
    source.stop(t + duration + 0.02);
  }

  #gain(ctx, value, destination) {
    const node = ctx.createGain();
    node.gain.value = value;
    node.connect(destination);
    return node;
  }

  #makeNoise(ctx) {
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    return buffer;
  }
}
