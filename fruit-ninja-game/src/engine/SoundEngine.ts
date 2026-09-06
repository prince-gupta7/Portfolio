/**
 * Procedural Web Audio Synthesizer for Fruit Ninja
 * Generates all sound effects and background ambient music without external audio files.
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private isMuted: boolean = false;
  private isMusicMuted: boolean = false;
  private ambientTimer: number | null = null;
  private fuseNode: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.musicGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setSoundVolume(volume: number) {
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public setMusicVolume(volume: number) {
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.05);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.85, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public toggleMusic(): boolean {
    this.isMusicMuted = !this.isMusicMuted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(this.isMusicMuted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
    return this.isMusicMuted;
  }

  /**
   * Blade swoosh whoosh sound
   */
  public playSlashWhoosh(speed = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.18;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      const baseFreq = 800 + Math.min(speed * 300, 1800);
      filter.frequency.setValueAtTime(baseFreq, now);
      filter.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.08);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.18);
      filter.Q.setValueAtTime(4.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.45 * Math.min(speed, 1.5), now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.19);
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Fruit slice sound (juicy squish + crisp cut)
   */
  public playFruitSlice(type = 'default', isCritical = false) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sharp cut tone
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = isCritical ? 'sawtooth' : 'triangle';
      
      const pitch = isCritical ? 980 : (type === 'watermelon' ? 440 : 620 + Math.random() * 150);
      osc.frequency.setValueAtTime(pitch, now);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.3, now + 0.12);

      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(oscGain);
      oscGain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.13);

      // 2. Juicy squish (filtered resonant noise burst)
      const bufferSize = this.ctx.sampleRate * 0.14;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const squishFilter = this.ctx.createBiquadFilter();
      squishFilter.type = 'lowpass';
      squishFilter.frequency.setValueAtTime(1600, now);
      squishFilter.frequency.exponentialRampToValueAtTime(320, now + 0.14);
      squishFilter.Q.setValueAtTime(6.0, now);

      const squishGain = this.ctx.createGain();
      squishGain.gain.setValueAtTime(0.6, now);
      squishGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(squishFilter);
      squishFilter.connect(squishGain);
      squishGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.15);

      // 3. Critical strike extra ping
      if (isCritical) {
        const critOsc = this.ctx.createOscillator();
        const critGain = this.ctx.createGain();
        critOsc.type = 'sine';
        critOsc.frequency.setValueAtTime(1480, now);
        critOsc.frequency.exponentialRampToValueAtTime(2200, now + 0.2);
        critGain.gain.setValueAtTime(0.35, now);
        critGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        critOsc.connect(critGain);
        critGain.connect(this.sfxGain);
        critOsc.start(now);
        critOsc.stop(now + 0.26);
      }
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Combo announcement chord (pentatonic progression based on combo size)
   */
  public playComboFanfare(comboCount: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic scale frequencies
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5, 1174.66, 1318.51];
      const baseIdx = Math.min(comboCount - 3, notes.length - 3);
      const chord = [notes[baseIdx], notes[baseIdx + 1], notes[baseIdx + 2]];

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.001, now + idx * 0.05);
        gain.gain.linearRampToValueAtTime(0.28, now + idx * 0.05 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.5);
      });
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Bomb fuse sizzling sound
   */
  public startBombFuse() {
    if (this.isMuted || this.fuseNode) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Crackling noise with random spikes
        data[i] = (Math.random() * 2 - 1) * (Math.random() > 0.85 ? 1.0 : 0.2);
      }

      const source = this.ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.sfxGain);

      source.start();
      this.fuseNode = { source, gain };
    } catch {
      // Audio fallback silent catch
    }
  }

  public stopBombFuse() {
    if (this.fuseNode) {
      try {
        this.fuseNode.source.stop();
        this.fuseNode.source.disconnect();
      } catch {
        // Ignore
      }
      this.fuseNode = null;
    }
  }

  /**
   * Massive bomb explosion sound
   */
  public playBombExplosion() {
    this.stopBombFuse();
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sub-bass boom
      const boomOsc = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boomOsc.type = 'sine';
      boomOsc.frequency.setValueAtTime(140, now);
      boomOsc.frequency.exponentialRampToValueAtTime(25, now + 0.65);

      boomGain.gain.setValueAtTime(1.0, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      boomOsc.connect(boomGain);
      boomGain.connect(this.sfxGain);
      boomOsc.start(now);
      boomOsc.stop(now + 0.72);

      // 2. White noise explosion burst
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.frequency.exponentialRampToValueAtTime(120, now + 0.8);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.85, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.sfxGain);

      noise.start(now);
      noise.stop(now + 0.82);
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Power-up: Freeze banana time-freeze chime
   */
  public playFreezeEffect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const arpeggio = [1046.5, 1318.51, 1567.98, 2093.0];
      arpeggio.forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + i * 0.06);

        gain.gain.setValueAtTime(0.001, now + i * 0.06);
        gain.gain.linearRampToValueAtTime(0.25, now + i * 0.06 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.6);

        osc.connect(gain);
        gain.connect(this.sfxGain);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.65);
      });
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Power-up: Dragonfruit Frenzy gong
   */
  public playFrenzyGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const gongOsc = this.ctx.createOscillator();
      const gongGain = this.ctx.createGain();
      gongOsc.type = 'triangle';
      gongOsc.frequency.setValueAtTime(180, now);
      gongOsc.frequency.exponentialRampToValueAtTime(85, now + 1.2);

      gongGain.gain.setValueAtTime(0.6, now);
      gongGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      gongOsc.connect(gongGain);
      gongGain.connect(this.sfxGain);
      gongOsc.start(now);
      gongOsc.stop(now + 1.25);
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * UI Click / Selection swoosh
   */
  public playMenuClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Fruit drop / Miss sound (subtle thud)
   */
  public playFruitMiss() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.sfxGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch {
      // Audio fallback silent catch
    }
  }

  /**
   * Ambient Zen background chime music generator
   */
  public startAmbientZenMusic() {
    if (this.ambientTimer !== null) return;
    this.initContext();

    const pentatonicNotes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];

    const playZenChime = () => {
      if (this.isMusicMuted || !this.ctx || !this.musicGain) return;
      try {
        const now = this.ctx.currentTime;
        const note = pentatonicNotes[Math.floor(Math.random() * pentatonicNotes.length)];
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);

        osc.connect(gain);
        gain.connect(this.musicGain);
        osc.start(now);
        osc.stop(now + 2.9);
      } catch {
        // Ignore
      }
    };

    // Schedule zen chimes every 2-4 seconds
    const loop = () => {
      playZenChime();
      const nextDelay = 1800 + Math.random() * 2200;
      this.ambientTimer = window.setTimeout(loop, nextDelay);
    };

    loop();
  }

  public stopAmbientMusic() {
    if (this.ambientTimer !== null) {
      clearTimeout(this.ambientTimer);
      this.ambientTimer = null;
    }
  }

  public destroy() {
    this.stopAmbientMusic();
    this.stopBombFuse();
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close().catch(() => {});
    }
    this.ctx = null;
  }
}

export const soundEngine = new SoundEngine();
