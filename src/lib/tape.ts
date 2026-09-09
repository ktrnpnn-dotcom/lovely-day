/** Cassette-style rewind / fast-forward noise via Web Audio. */
export class TapeMachine {
  private ctx: AudioContext | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  running = false;

  private ensureContext() {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  async start(direction: 1 | -1) {
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    this.stop(true);

    const length = Math.floor(ctx.sampleRate * 1.4);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.018 * white) / 1.018;
      data[i] = Math.max(-1, Math.min(1, last * 4.2));
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.playbackRate.value = direction < 0 ? 0.68 : 1.38;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 240;

    const band = ctx.createBiquadFilter();
    band.type = "bandpass";
    band.frequency.value = direction < 0 ? 820 : 1760;
    band.Q.value = 2.4;

    const gain = ctx.createGain();
    gain.gain.value = 0;

    const wow = ctx.createOscillator();
    wow.type = "sine";
    wow.frequency.value = 6.4;
    const wowGain = ctx.createGain();
    wowGain.gain.value = 220;
    wow.connect(wowGain);
    wowGain.connect(band.frequency);

    const flutter = ctx.createOscillator();
    flutter.type = "triangle";
    flutter.frequency.value = 14;
    const flutterGain = ctx.createGain();
    flutterGain.gain.value = 0.045;
    flutter.connect(flutterGain);
    flutterGain.connect(source.playbackRate);

    source.connect(highpass);
    highpass.connect(band);
    band.connect(gain);
    gain.connect(ctx.destination);

    wow.start();
    flutter.start();
    source.start();
    gain.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.06);

    this.source = source;
    this.gain = gain;
    this.oscillators = [wow, flutter];
    this.running = true;
  }

  stop(immediate = false) {
    const ctx = this.ctx;
    const gain = this.gain;
    const source = this.source;
    const oscillators = this.oscillators;
    this.source = null;
    this.gain = null;
    this.oscillators = [];
    this.running = false;

    if (!ctx || !gain) {
      try {
        source?.stop();
      } catch {
        /* already stopped */
      }
      for (const osc of oscillators) {
        try {
          osc.stop();
        } catch {
          /* already stopped */
        }
      }
      return;
    }

    const halt = () => {
      try {
        source?.stop();
      } catch {
        /* already stopped */
      }
      for (const osc of oscillators) {
        try {
          osc.stop();
        } catch {
          /* already stopped */
        }
      }
    };

    if (immediate) {
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.value = 0;
      halt();
      return;
    }

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.09);
    window.setTimeout(halt, 110);
  }
}

export const tapeMachine = new TapeMachine();
