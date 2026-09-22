/**
 * Web Audio Procedural Music & Sound Engine for "The Great Date Glitch"
 * 
 * Features:
 * - 100% self-contained synthesized retro rom-com BGM & sound effects (no external audio assets)
 * - Multi-theme procedural music generator:
 *   - "lobby": Playful, upbeat rom-com intro (Cmaj7 - Am7 - Dm7 - G7)
 *   - "story": Cozy lo-fi virtual bistro (Fmaj7 - Em7 - Dm7 - Cmaj7)
 *   - "choice": Playful comedic tension & ticking timer (Am - Dm - E7)
 *   - "outcome": Warm, heartwarming romantic harmony
 *   - "midnight": Dreamy, intimate late-night frequency (Dmaj7 - Gmaj7)
 * - Rich sound effects (clicks, chimes, glitches, buzzers, barks, reveals, fanfares)
 * - Independent SFX and BGM controls with animated audio visualizer state
 */

export type MusicTheme = 'lobby' | 'story' | 'choice' | 'outcome' | 'midnight';

interface NoteEvent {
  note: number; // frequency in Hz
  time: number; // beat offset
  duration: number; // in beats
  gain?: number;
  type?: OscillatorType;
}

// Standard musical notes (Hz)
const N = {
  // Bass Octave 2-3
  C2: 65.41, D2: 73.42, E2: 82.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  // Mid Octave 4
  C4: 261.63, Cs4: 277.18, D4: 293.66, Ds4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99,
  G4: 392.00, Gs4: 415.30, A4: 440.00, As4: 466.16, B4: 493.88,
  // High Octave 5
  C5: 523.25, Cs5: 554.37, D5: 587.33, Ds5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99,
  G5: 783.99, Gs5: 830.61, A5: 880.00, As5: 932.33, B5: 987.77,
  // High Octave 6
  C6: 1046.50, D6: 1174.66, E6: 1318.51, G6: 1567.98,
};

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private musicGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  private soundMuted: boolean = false;
  private musicMuted: boolean = false;
  private musicPlaying: boolean = false;

  private currentTheme: MusicTheme = 'lobby';
  private timerId: number | null = null;
  private nextBeatTime: number = 0;
  private currentStep: number = 0;
  private bpm: number = 100;

  // Listeners for UI state reactivity
  private stateListeners: Array<() => void> = [];

  constructor() {
    // Default muted until user interacts to adhere to browser autoplay policy
    this.soundMuted = false;
    this.musicMuted = true; // music starts muted until player clicks or un-mutes
  }

  public subscribe(listener: () => void) {
    this.stateListeners.push(listener);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.stateListeners.forEach((l) => l());
  }

  private initAudio() {
    if (this.ctx) return;
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      this.ctx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(1.0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Music Bus with soft warm lowpass filter
      const musicFilter = this.ctx.createBiquadFilter();
      musicFilter.type = 'lowpass';
      musicFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.setValueAtTime(this.musicMuted ? 0 : 0.22, this.ctx.currentTime);
      this.musicGain.connect(musicFilter);
      musicFilter.connect(this.masterGain);

      // SFX Bus
      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(this.soundMuted ? 0 : 0.35, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);
    } catch (e) {
      console.warn('Web Audio initialization error:', e);
    }
  }

  public ensureContext() {
    this.initAudio();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // =========================================================================
  // AUDIO CONTROLS & GETTERS
  // =========================================================================

  public isMuted(): boolean {
    return this.soundMuted;
  }

  public isMusicMuted(): boolean {
    return this.musicMuted;
  }

  public isMusicPlaying(): boolean {
    return this.musicPlaying && !this.musicMuted;
  }

  public getCurrentTheme(): MusicTheme {
    return this.currentTheme;
  }

  public getThemeDisplayName(theme?: MusicTheme): string {
    const t = theme || this.currentTheme;
    switch (t) {
      case 'lobby':
        return 'First Spark (Upbeat Rom-Com)';
      case 'story':
        return 'Virtual Bistro (Cozy Lo-Fi)';
      case 'choice':
        return 'Glitch in Motion (Playful Suspense)';
      case 'outcome':
        return 'Cannoli Harmony (Sweet Romance)';
      case 'midnight':
        return 'Midnight Frequency (Deep Talk)';
      default:
        return 'Romantic Comedy';
    }
  }

  public toggleMute(): boolean {
    this.ensureContext();
    this.soundMuted = !this.soundMuted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(this.soundMuted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
    this.notify();
    return this.soundMuted;
  }

  public toggleMusic(): boolean {
    this.ensureContext();
    this.musicMuted = !this.musicMuted;

    if (!this.musicMuted) {
      if (!this.musicPlaying) {
        this.startMusic(this.currentTheme);
      } else if (this.musicGain && this.ctx) {
        this.musicGain.gain.setTargetAtTime(0.22, this.ctx.currentTime, 0.1);
      }
    } else {
      if (this.musicGain && this.ctx) {
        this.musicGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
      }
    }

    this.notify();
    return this.musicMuted;
  }

  public setSoundMuted(muted: boolean) {
    this.soundMuted = muted;
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setTargetAtTime(muted ? 0 : 0.35, this.ctx.currentTime, 0.05);
    }
    this.notify();
  }

  public setMusicMuted(muted: boolean) {
    this.musicMuted = muted;
    if (this.musicGain && this.ctx) {
      this.musicGain.gain.setTargetAtTime(muted ? 0 : 0.22, this.ctx.currentTime, 0.1);
    }
    if (!muted && !this.musicPlaying) {
      this.startMusic(this.currentTheme);
    }
    this.notify();
  }

  // =========================================================================
  // PROCEDURAL BGM ENGINE
  // =========================================================================

  public startMusic(theme: MusicTheme = 'lobby') {
    this.ensureContext();
    this.currentTheme = theme;
    this.currentStep = 0;

    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }

    if (!this.ctx) return;
    this.musicPlaying = true;
    this.nextBeatTime = this.ctx.currentTime + 0.05;

    // Lookahead scheduler loop (every 25ms, schedules ahead by 100ms)
    this.timerId = window.setInterval(() => {
      this.scheduleBeats();
    }, 25);

    this.notify();
  }

  public stopMusic() {
    if (this.timerId !== null) {
      window.clearInterval(this.timerId);
      this.timerId = null;
    }
    this.musicPlaying = false;
    this.notify();
  }

  public switchTheme(theme: MusicTheme) {
    if (this.currentTheme === theme && this.musicPlaying) return;
    this.currentTheme = theme;
    if (this.musicPlaying) {
      this.currentStep = 0;
    } else if (!this.musicMuted) {
      this.startMusic(theme);
    }
    this.notify();
  }

  private scheduleBeats() {
    if (!this.ctx || !this.musicGain) return;

    // Lookahead window: 120ms ahead
    const lookahead = 0.12;
    const secondsPerBeat = 60.0 / this.getThemeBpm(this.currentTheme);

    while (this.nextBeatTime < this.ctx.currentTime + lookahead) {
      this.playPatternStep(this.currentStep, this.nextBeatTime, secondsPerBeat);
      this.nextBeatTime += secondsPerBeat * 0.5; // Eighth-note steps
      this.currentStep = (this.currentStep + 1) % 32; // 16 beats (4 bars of 4/4)
    }
  }

  private getThemeBpm(theme: MusicTheme): number {
    switch (theme) {
      case 'lobby':
        return 106;
      case 'story':
        return 92;
      case 'choice':
        return 116;
      case 'outcome':
        return 98;
      case 'midnight':
        return 78;
    }
  }

  /**
   * Generates melodic and harmonic events based on the active romantic comedy theme.
   */
  private playPatternStep(step: number, time: number, spb: number) {
    if (!this.ctx || !this.musicGain || this.musicMuted) return;

    const theme = this.currentTheme;

    // 1. Bassline (Every quarter or dotted eighth)
    if (step % 2 === 0) {
      const bassNote = this.getBassNote(theme, Math.floor(step / 2));
      if (bassNote) {
        this.synthesizeBass(bassNote, time, spb * 0.9);
      }
    }

    // 2. Chords (On upbeat & downbeat syncopations)
    if (step === 0 || step === 4 || step === 8 || step === 12 || step === 16 || step === 20 || step === 24 || step === 28) {
      const chordNotes = this.getChordNotes(theme, Math.floor(step / 8));
      chordNotes.forEach((freq, i) => {
        this.synthesizeKeys(freq, time + i * 0.015, spb * 1.8, 0.05);
      });
    }

    // 3. Arpeggio / Melody (Playful, romantic conversational bells)
    const melody = this.getMelodyNote(theme, step);
    if (melody) {
      this.synthesizePluck(melody.freq, time, spb * melody.len, melody.gain || 0.07);
    }

    // 4. Subtle Cozy Percussion (Soft shaker & warm lo-fi kick)
    if (step % 4 === 0) {
      this.synthesizeKick(time);
    }
    if (step % 2 === 1) {
      this.synthesizeHat(time);
    }
  }

  private getBassNote(theme: MusicTheme, beat: number): number | null {
    // 16 beats total (4 bars of 4 beats)
    const bar = Math.floor(beat / 4);
    const bInBar = beat % 4;

    switch (theme) {
      case 'lobby': {
        // C - Am - Dm - G7 (Walking rom-com bass)
        const roots = [N.C3, N.A2, N.D3, N.G2];
        const fifths = [N.G2, N.E2, N.A2, N.D3];
        return bInBar === 0 ? roots[bar] : bInBar === 2 ? fifths[bar] : null;
      }
      case 'story': {
        // Fmaj7 - Em7 - Dm7 - Cmaj7 (Smooth lo-fi café)
        const roots = [N.F2, N.E2, N.D2, N.C3];
        return bInBar === 0 || bInBar === 2 ? roots[bar] : null;
      }
      case 'choice': {
        // Am - Dm - E7 - Am (Staccato comedic tension)
        const roots = [N.A2, N.D3, N.E2, N.A2];
        return roots[bar];
      }
      case 'outcome': {
        // C - G/B - Am - F (Romantic celebratory progression)
        const roots = [N.C3, N.B2, N.A2, N.F2];
        return bInBar === 0 || bInBar === 2 ? roots[bar] : null;
      }
      case 'midnight': {
        // Dmaj7 - Bm7 - G - A (Dreamy nighttime frequency)
        const roots = [N.D3, N.B2, N.G2, N.A2];
        return bInBar === 0 ? roots[bar] : null;
      }
    }
  }

  private getChordNotes(theme: MusicTheme, bar: number): number[] {
    switch (theme) {
      case 'lobby': {
        // Cmaj7 -> Am7 -> Dm7 -> G9
        const chords = [
          [N.E4, N.G4, N.B4], // Cmaj7
          [N.C4, N.E4, N.G4], // Am7
          [N.F4, N.A4, N.C5], // Dm7
          [N.F4, N.A4, N.B4], // G9
        ];
        return chords[bar % 4];
      }
      case 'story': {
        // Fmaj7 -> Em7 -> Dm7 -> Cmaj7
        const chords = [
          [N.A4, N.C5, N.E5], // Fmaj7
          [N.G4, N.B4, N.E5], // Em7
          [N.F4, N.A4, N.D5], // Dm7
          [N.E4, N.G4, N.C5], // Cmaj7
        ];
        return chords[bar % 4];
      }
      case 'choice': {
        // Am -> Dm -> E7 -> Am
        const chords = [
          [N.C4, N.E4, N.A4],
          [N.D4, N.F4, N.A4],
          [N.D4, N.Gs4, N.B4],
          [N.C4, N.E4, N.A4],
        ];
        return chords[bar % 4];
      }
      case 'outcome': {
        // C -> G -> Am -> F
        const chords = [
          [N.E4, N.G4, N.C5],
          [N.D4, N.G4, N.B4],
          [N.C4, N.E4, N.A4],
          [N.C4, N.F4, N.A4],
        ];
        return chords[bar % 4];
      }
      case 'midnight': {
        // Dmaj7 -> Bm7 -> Gmaj7 -> A7
        const chords = [
          [N.Fs4, N.A4, N.Cs4],
          [N.D4, N.Fs4, N.A4],
          [N.B4, N.D5, N.G4],
          [N.Cs4, N.E4, N.A4],
        ];
        return chords[bar % 4];
      }
    }
  }

  private getMelodyNote(theme: MusicTheme, step: number): { freq: number; len: number; gain?: number } | null {
    // Sparse, memorable romantic comedic motifs
    switch (theme) {
      case 'lobby': {
        const pattern: Record<number, number> = {
          0: N.C5,
          3: N.E5,
          6: N.G5,
          10: N.A5,
          14: N.G5,
          16: N.E5,
          20: N.D5,
          24: N.C5,
          28: N.D5,
        };
        return pattern[step] ? { freq: pattern[step], len: 0.8, gain: 0.08 } : null;
      }
      case 'story': {
        const pattern: Record<number, number> = {
          2: N.C5,
          5: N.E5,
          9: N.D5,
          13: N.C5,
          18: N.A4,
          22: N.G4,
          26: N.C5,
        };
        return pattern[step] ? { freq: pattern[step], len: 1.2, gain: 0.07 } : null;
      }
      case 'choice': {
        // Ticking pizzicato motif
        const pattern: Record<number, number> = {
          1: N.E5,
          3: N.E5,
          7: N.F5,
          9: N.E5,
          11: N.D5,
          15: N.C5,
          19: N.B4,
          23: N.C5,
          27: N.E5,
          31: N.Gs5,
        };
        return pattern[step] ? { freq: pattern[step], len: 0.4, gain: 0.09 } : null;
      }
      case 'outcome': {
        const pattern: Record<number, number> = {
          0: N.G5,
          4: N.A5,
          8: N.C6,
          12: N.B5,
          16: N.G5,
          20: N.E5,
          24: N.F5,
          28: N.G5,
        };
        return pattern[step] ? { freq: pattern[step], len: 1.0, gain: 0.1 } : null;
      }
      case 'midnight': {
        const pattern: Record<number, number> = {
          4: N.Fs5,
          12: N.E5,
          20: N.D5,
          28: N.Cs5,
        };
        return pattern[step] ? { freq: pattern[step], len: 2.0, gain: 0.06 } : null;
      }
    }
  }

  // =========================================================================
  // SYNTHESIS VOICES
  // =========================================================================

  private synthesizeKeys(freq: number, time: number, duration: number, peakGain: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(peakGain, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch {
      // Audio node failure protection
    }
  }

  private synthesizePluck(freq: number, time: number, duration: number, peakGain: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 3, time);
      filter.frequency.exponentialRampToValueAtTime(freq * 0.8, time + duration);

      gain.gain.setValueAtTime(peakGain, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch {
      // Audio node failure protection
    }
  }

  private synthesizeBass(freq: number, time: number, duration: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, time);

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + duration + 0.05);
    } catch {
      // Audio node failure protection
    }
  }

  private synthesizeKick(time: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, time);
      osc.frequency.exponentialRampToValueAtTime(40, time + 0.08);

      gain.gain.setValueAtTime(0.09, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.1);
    } catch {
      // Ignore
    }
  }

  private synthesizeHat(time: number) {
    if (!this.ctx || !this.musicGain) return;
    try {
      // High filtered pop
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, time);

      filter.type = 'highpass';
      filter.frequency.setValueAtTime(4000, time);

      gain.gain.setValueAtTime(0.02, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.musicGain);

      osc.start(time);
      osc.stop(time + 0.035);
    } catch {
      // Ignore
    }
  }

  // =========================================================================
  // SOUND EFFECTS (SFX)
  // =========================================================================

  /** Standard UI tap */
  public playClick() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(540, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Ignore audio failure
    }
  }

  /** Choice selection tap */
  public playSelect() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.06); // A5

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Ignore
    }
  }

  /** Lock in / Confirm decision with whoosh & chime */
  public playSubmit() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [523.25, 659.25, 783.99, 1046.50]; // Cmaj
      chord.forEach((f, i) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.04);

        gain.gain.setValueAtTime(0.12, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.25);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.26);
      });
    } catch {
      // Ignore
    }
  }

  /** Gentle romantic chime */
  public playChime() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(this.ctx.currentTime + idx * 0.06);
        osc.stop(this.ctx.currentTime + idx * 0.06 + 0.38);
      });
    } catch {
      // Ignore
    }
  }

  /** Comical 80s apartment building intercom buzzer */
  public playBuzzer() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.setValueAtTime(138, now + 0.1);
      osc.frequency.setValueAtTime(142, now + 0.2);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.setValueAtTime(0.16, now + 0.25);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.33);
    } catch {
      // Ignore
    }
  }

  /** Playful Barnaby Frenchie dog chirp / muffled bark */
  public playBark() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.09);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Ignore
    }
  }

  /** Comic glitch sound */
  public playGlitch() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(880, now + 0.03);
      osc.frequency.setValueAtTime(110, now + 0.07);
      osc.frequency.setValueAtTime(550, now + 0.11);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.16);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start(now);
      osc.stop(now + 0.17);
    } catch {
      // Ignore
    }
  }

  /** Dramatic suspense chord for outcome reveal */
  public playReveal() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.00, 493.88, 587.33, 739.99, 987.77];
      notes.forEach((freq) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.75);
      });
    } catch {
      // Ignore
    }
  }

  /** Victory fanfare for chapter or game ending */
  public playFanfare() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const now = this.ctx.currentTime;
      const chord = [
        { f: 523.25, t: 0 },
        { f: 659.25, t: 0.08 },
        { f: 783.99, t: 0.16 },
        { f: 1046.50, t: 0.24 },
        { f: 1318.51, t: 0.36 },
      ];

      chord.forEach(({ f, t }) => {
        if (!this.ctx || !this.sfxGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + t);

        gain.gain.setValueAtTime(0.14, now + t);
        gain.gain.exponentialRampToValueAtTime(0.001, now + t + 0.45);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now + t);
        osc.stop(now + t + 0.48);
      });
    } catch {
      // Ignore
    }
  }

  /** Subtle dialogue speech click */
  public playType() {
    if (this.soundMuted) return;
    this.ensureContext();
    if (!this.ctx || !this.sfxGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.sfxGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Ignore
    }
  }
}

export const audioEngine = new AudioEngine();
export const sound = audioEngine;
