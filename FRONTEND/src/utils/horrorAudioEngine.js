/**
 * Self-contained Web Audio API procedural horror soundscape & spatial SFX synthesizer.
 * Zero external audio files needed — creates dark temple drones, hollow jungle winds,
 * tritone cavern bells, ghostly whispers, stone clicks, and portal transitions.
 */
class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.delayIn = null;
    this.noiseBuffer = null;

    this.ambienceGain = null;
    this.droneNodes = [];
    this.lfoNodes = [];
    this.windSource = null;

    this.ambientTimer = null;
    this.isEnabled = true;
    this.isPlayingAmbience = false;
    this.volume = 0.68;

    this.lastHoverAt = 0;
    this.lastClickAt = 0;
    this.lastCreakAt = 0;
  }

  ensureContext() {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();

      this.compressor = this.ctx.createDynamicsCompressor();
      this.compressor.threshold.setValueAtTime(-16, this.ctx.currentTime);
      this.compressor.knee.setValueAtTime(18, this.ctx.currentTime);
      this.compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
      this.compressor.attack.setValueAtTime(0.01, this.ctx.currentTime);
      this.compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(
        this.isEnabled ? this.volume : 0,
        this.ctx.currentTime
      );

      this.masterGain.connect(this.compressor);
      this.compressor.connect(this.ctx.destination);

      // Dark ancient-cavern stereo feedback delay bus
      this.delayIn = this.ctx.createGain();
      this.delayIn.gain.setValueAtTime(0.45, this.ctx.currentTime);

      const delayL = this.ctx.createDelay(1.0);
      delayL.delayTime.setValueAtTime(0.29, this.ctx.currentTime);
      const delayR = this.ctx.createDelay(1.0);
      delayR.delayTime.setValueAtTime(0.43, this.ctx.currentTime);

      const dampFilter = this.ctx.createBiquadFilter();
      dampFilter.type = 'lowpass';
      dampFilter.frequency.setValueAtTime(1150, this.ctx.currentTime);

      const feedback = this.ctx.createGain();
      feedback.gain.setValueAtTime(0.36, this.ctx.currentTime);

      this.delayIn.connect(delayL);
      delayL.connect(dampFilter);
      dampFilter.connect(delayR);
      delayR.connect(feedback);
      feedback.connect(delayL);

      dampFilter.connect(this.masterGain);
      delayR.connect(this.masterGain);

      this.noiseBuffer = this.buildBrownPinkNoiseBuffer(this.ctx, 4.0);
    }

    return this.ctx;
  }

  buildBrownPinkNoiseBuffer(ctx, durationSec) {
    const length = Math.floor(ctx.sampleRate * durationSec);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i += 1) {
      const white = Math.random() * 2 - 1;
      lastOut = (lastOut + 0.03 * white) / 1.03;
      data[i] = Math.max(-1, Math.min(1, lastOut * 2.8 + white * 0.18));
    }
    return buffer;
  }

  getState() {
    return this.ctx ? this.ctx.state : 'uninitialized';
  }

  async unlockAndStart() {
    const ctx = this.ensureContext();
    if (!ctx) return false;
    try {
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
      if (this.isEnabled && !this.isPlayingAmbience) {
        this.startAmbience();
      }
      return ctx.state === 'running';
    } catch {
      return false;
    }
  }

  setEnabled(nextEnabled) {
    this.isEnabled = nextEnabled;
    const ctx = this.ctx;
    if (ctx && this.masterGain) {
      const now = ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setTargetAtTime(
        nextEnabled ? this.volume : 0,
        now,
        0.18
      );
    }

    if (nextEnabled) {
      this.unlockAndStart();
    } else {
      this.stopAmbience();
    }
  }

  setVolume(nextVol) {
    this.volume = Math.max(0, Math.min(1, nextVol));
    if (this.ctx && this.masterGain && this.isEnabled) {
      this.masterGain.gain.setTargetAtTime(
        this.volume,
        this.ctx.currentTime,
        0.08
      );
    }
  }

  startAmbience() {
    const ctx = this.ctx;
    if (!ctx || this.isPlayingAmbience || !this.isEnabled) return;
    if (ctx.state !== 'running') return;

    this.isPlayingAmbience = true;
    const now = ctx.currentTime;

    this.ambienceGain = ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.0001, now);
    this.ambienceGain.gain.exponentialRampToValueAtTime(0.32, now + 1.8);
    this.ambienceGain.connect(this.masterGain);

    // 1. Abyssal subterranean drone (detuned low fifth + sub)
    const freqs = [41.2, 55.0, 55.65, 82.4];
    const types = ['sine', 'triangle', 'sine', 'sine'];
    const gains = [0.22, 0.14, 0.14, 0.06];

    const droneFilter = ctx.createBiquadFilter();
    droneFilter.type = 'lowpass';
    droneFilter.frequency.setValueAtTime(190, now);
    droneFilter.Q.setValueAtTime(2.5, now);
    droneFilter.connect(this.ambienceGain);

    const droneLfo = ctx.createOscillator();
    droneLfo.type = 'sine';
    droneLfo.frequency.setValueAtTime(0.08, now);
    const droneLfoGain = ctx.createGain();
    droneLfoGain.gain.setValueAtTime(70, now);
    droneLfo.connect(droneLfoGain);
    droneLfoGain.connect(droneFilter.frequency);
    droneLfo.start(now);
    this.lfoNodes.push(droneLfo);

    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      osc.type = types[idx];
      osc.frequency.setValueAtTime(f, now);
      const g = ctx.createGain();
      g.gain.setValueAtTime(gains[idx], now);
      osc.connect(g);
      g.connect(droneFilter);
      osc.start(now);
      this.droneNodes.push(osc);
    });

    // 2. Hollow jungle ruin wind loop
    if (this.noiseBuffer) {
      const wind = ctx.createBufferSource();
      wind.buffer = this.noiseBuffer;
      wind.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.frequency.setValueAtTime(240, now);
      windFilter.Q.setValueAtTime(3.2, now);

      const windLfo = ctx.createOscillator();
      windLfo.type = 'sine';
      windLfo.frequency.setValueAtTime(0.09, now);
      const windLfoDepth = ctx.createGain();
      windLfoDepth.gain.setValueAtTime(140, now);
      windLfo.connect(windLfoDepth);
      windLfoDepth.connect(windFilter.frequency);
      windLfo.start(now);

      const windGain = ctx.createGain();
      windGain.gain.setValueAtTime(0.28, now);

      wind.connect(windFilter);
      windFilter.connect(windGain);
      windGain.connect(this.ambienceGain);
      windGain.connect(this.delayIn);

      wind.start(now);
      this.windSource = wind;
      this.lfoNodes.push(windLfo);
    }

    this.scheduleNextSpookyEvent(2600);
  }

  stopAmbience() {
    this.isPlayingAmbience = false;
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }

    const ctx = this.ctx;
    if (!ctx) return;
    const stopAt = ctx.currentTime + 0.35;

    if (this.ambienceGain) {
      this.ambienceGain.gain.cancelScheduledValues(ctx.currentTime);
      this.ambienceGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.08);
    }

    const drones = this.droneNodes;
    const lfos = this.lfoNodes;
    const wind = this.windSource;
    this.droneNodes = [];
    this.lfoNodes = [];
    this.windSource = null;

    setTimeout(() => {
      drones.forEach((n) => {
        try {
          n.stop();
          n.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      lfos.forEach((n) => {
        try {
          n.stop();
          n.disconnect();
        } catch {
          // ignore
        }
      });
      if (wind) {
        try {
          wind.stop(stopAt);
          wind.disconnect();
        } catch {
          // ignore
        }
      }
    }, 380);
  }

  scheduleNextSpookyEvent(initialDelayMs) {
    if (!this.isPlayingAmbience || !this.isEnabled) return;
    const delayMs = initialDelayMs ?? 5500 + Math.random() * 7500;
    this.ambientTimer = setTimeout(() => {
      if (this.isPlayingAmbience && this.isEnabled && this.ctx?.state === 'running') {
        const pick = Math.random();
        if (pick < 0.34) this.triggerEerieTempleChime();
        else if (pick < 0.65) this.triggerGhostWhisper();
        else if (pick < 0.85) this.triggerDistantThunder();
        else this.triggerHauntedNightCry();
      }
      this.scheduleNextSpookyEvent();
    }, delayMs);
  }

  triggerEerieTempleChime() {
    const ctx = this.ctx;
    if (!ctx || !this.isEnabled || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    // Tritone + minor second temple bell partials
    const partials = [293.66, 415.3, 622.25, 880.0];
    partials.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq + (Math.random() - 0.5) * 3, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.985, now + 3.4);

      const g = ctx.createGain();
      const peak = 0.055 / (idx + 1);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(peak, now + 0.04);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 3.2 - idx * 0.4);

      osc.connect(g);
      g.connect(this.masterGain);
      g.connect(this.delayIn);
      osc.start(now);
      osc.stop(now + 3.5);
    });
  }

  triggerGhostWhisper() {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuffer || !this.isEnabled || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(6.5, now);
    filter.frequency.setValueAtTime(980, now);
    filter.frequency.exponentialRampToValueAtTime(340, now + 1.8);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.11, now + 0.45);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.1);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.delayIn);
    g.connect(this.masterGain);
    src.start(now);
    src.stop(now + 2.2);
  }

  triggerDistantThunder() {
    const ctx = this.ctx;
    if (!ctx || !this.noiseBuffer || !this.isEnabled || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);
    filter.frequency.exponentialRampToValueAtTime(42, now + 2.5);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.24, now + 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.6);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.masterGain);
    g.connect(this.delayIn);
    src.start(now);
    src.stop(now + 2.7);
  }

  triggerHauntedNightCry() {
    const ctx = this.ctx;
    if (!ctx || !this.isEnabled || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(740, now);
    osc.frequency.exponentialRampToValueAtTime(493.88, now + 0.9);
    osc.frequency.exponentialRampToValueAtTime(523.25, now + 1.35);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.042, now + 0.25);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.55);

    osc.connect(g);
    g.connect(this.delayIn);
    osc.start(now);
    osc.stop(now + 1.6);
  }

  playHover() {
    if (!this.isEnabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastHoverAt < 95) return;
    this.lastHoverAt = nowMs;

    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    // Subtle ghostly obsidian tick + airy breath
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.085);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.045, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.095);

    osc.connect(g);
    g.connect(this.delayIn);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playClick() {
    if (!this.isEnabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastClickAt < 65) return;
    this.lastClickAt = nowMs;

    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    // Stone slab thud + hollow bronze chime
    const thud = ctx.createOscillator();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(118, now);
    thud.frequency.exponentialRampToValueAtTime(46, now + 0.14);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.14, now);
    thudGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);

    thud.connect(thudGain);
    thudGain.connect(this.masterGain);
    thud.start(now);
    thud.stop(now + 0.18);

    const metallic = ctx.createOscillator();
    metallic.type = 'sine';
    metallic.frequency.setValueAtTime(587.33, now);
    metallic.frequency.exponentialRampToValueAtTime(293.66, now + 0.22);

    const metalGain = ctx.createGain();
    metalGain.gain.setValueAtTime(0.055, now);
    metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

    metallic.connect(metalGain);
    metalGain.connect(this.delayIn);
    metallic.start(now);
    metallic.stop(now + 0.26);
  }

  playRouteTransition() {
    if (!this.isEnabled) return;
    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    if (this.noiseBuffer) {
      const src = ctx.createBufferSource();
      src.buffer = this.noiseBuffer;

      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.setValueAtTime(2.6, now);
      bp.frequency.setValueAtTime(160, now);
      bp.frequency.exponentialRampToValueAtTime(860, now + 0.24);
      bp.frequency.exponentialRampToValueAtTime(120, now + 0.85);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.16, now + 0.18);
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.92);

      src.connect(bp);
      bp.connect(g);
      g.connect(this.masterGain);
      g.connect(this.delayIn);
      src.start(now);
      src.stop(now + 0.95);
    }

    const portalSub = ctx.createOscillator();
    portalSub.type = 'sine';
    portalSub.frequency.setValueAtTime(73.4, now);
    portalSub.frequency.exponentialRampToValueAtTime(36.7, now + 0.7);
    const subG = ctx.createGain();
    subG.gain.setValueAtTime(0.12, now);
    subG.gain.exponentialRampToValueAtTime(0.0001, now + 0.75);

    portalSub.connect(subG);
    subG.connect(this.masterGain);
    portalSub.start(now);
    portalSub.stop(now + 0.8);
  }

  playDepthCreak() {
    if (!this.isEnabled) return;
    const nowMs = performance.now();
    if (nowMs - this.lastCreakAt < 1800) return;
    this.lastCreakAt = nowMs;

    const ctx = this.ctx;
    if (!ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime;

    // Eerie temple stone shift rumble
    const sub = ctx.createOscillator();
    sub.type = 'sawtooth';
    sub.frequency.setValueAtTime(64, now);
    sub.frequency.exponentialRampToValueAtTime(42, now + 0.55);

    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(140, now);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(0.08, now + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    sub.connect(lp);
    lp.connect(g);
    g.connect(this.delayIn);
    sub.start(now);
    sub.stop(now + 0.65);
  }
}

export const horrorAudio = new HorrorAudioEngine();
