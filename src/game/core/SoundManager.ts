/**
 * Sistema de som para RuneBlade
 * Usa Web Audio API para gerar sons sinteticamente
 */

type SoundType =
  | 'attack'
  | 'defense'
  | 'magic'
  | 'heal'
  | 'damage'
  | 'victory'
  | 'defeat'
  | 'cardPlay'
  | 'cardDiscard'
  | 'click'
  | 'buff'
  | 'debuff'
  | 'levelUp';

export class SoundManager {
  private audioContext: AudioContext | null = null;
  private _masterVolume = 1.0;
  private _soundVolume = 1.0;
  private _musicVolume = 0.3;
  private _isMuted = false;

  constructor() {
    if (typeof window !== 'undefined') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.init());
      } else {
        this.init();
      }
      document.addEventListener('click', () => this.init(), { once: true });
    }
  }

  private init(): void {
    if (this.audioContext) return;
    try {
      const AudioContextClass =
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
        console.log('Web Audio API inicializado com sucesso');
      }
    } catch {
      console.warn('Web Audio API não disponível');
    }
  }

  play(type: SoundType): void {
    if (!this.audioContext) {
      this.init();
    }

    if (!this.audioContext || this._isMuted) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    switch (type) {
      case 'attack':
        this.playAttackSound();
        break;
      case 'defense':
        this.playDefenseSound();
        break;
      case 'magic':
        this.playMagicSound();
        break;
      case 'heal':
        this.playHealSound();
        break;
      case 'damage':
        this.playDamageSound();
        break;
      case 'victory':
        this.playVictorySound();
        break;
      case 'defeat':
        this.playDefeatSound();
        break;
      case 'cardPlay':
        this.playCardPlaySound();
        break;
      case 'cardDiscard':
        this.playCardDiscardSound();
        break;
      case 'click':
        this.playClickSound();
        break;
      case 'buff':
        this.playBuffSound();
        break;
      case 'debuff':
        this.playDebuffSound();
        break;
      case 'levelUp':
        this.playLevelUpSound();
        break;
    }
  }

  private playAttackSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.15;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playDefenseSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(150, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.8, now);
    gain.gain.linearRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playMagicSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.3;
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + duration);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(300, now);
    osc2.frequency.exponentialRampToValueAtTime(600, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioContext.destination);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  private playHealSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.4;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1000, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playDamageSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.1;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playVictorySound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const notes = [523, 659, 784, 1047];
    const duration = 0.15;
    const delay = 0.1;
    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);
      gain.gain.setValueAtTime(this._soundVolume * this._masterVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  private playDefeatSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const notes = [392, 349, 330, 294];
    const duration = 0.2;
    const delay = 0.15;
    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);
      gain.gain.setValueAtTime(this._soundVolume * this._masterVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  private playCardPlaySound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.1;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playCardDiscardSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.08;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playClickSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.05;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playBuffSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.linearRampToValueAtTime(900, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playDebuffSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const duration = 0.2;
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(150, now + duration);
    gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
    osc.connect(gain);
    gain.connect(this.audioContext.destination);
    osc.start(now);
    osc.stop(now + duration);
  }

  private playLevelUpSound(): void {
    if (!this.audioContext) return;
    const now = this.audioContext.currentTime;
    const notes = [659, 784, 988, 1319];
    const duration = 0.1;
    const delay = 0.08;
    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);
      gain.gain.setValueAtTime(this._soundVolume * this._masterVolume * 0.6, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);
      osc.connect(gain);
      gain.connect(this.audioContext.destination);
      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  setMasterVolume(volume: number): void {
    this._masterVolume = Math.max(0, Math.min(1, volume));
  }

  setSoundVolume(volume: number): void {
    this._soundVolume = Math.max(0, Math.min(1, volume));
  }

  setMusicVolume(volume: number): void {
    this._musicVolume = Math.max(0, Math.min(1, volume));
  }

  get masterVolume(): number {
    return this._masterVolume;
  }

  get soundVolume(): number {
    return this._soundVolume;
  }

  get musicVolume(): number {
    return this._musicVolume;
  }

  getMasterVolume(): number {
    return this._masterVolume;
  }

  getSoundVolume(): number {
    return this._soundVolume;
  }

  getMusicVolume(): number {
    return this._musicVolume;
  }

  setMuted(muted: boolean): void {
    this._isMuted = muted;
  }

  get isMuted(): boolean {
    return this._isMuted;
  }

  isSoundMuted(): boolean {
    return this._isMuted;
  }

  toggleMute(): boolean {
    this._isMuted = !this._isMuted;
    return this._isMuted;
  }
}

export const soundManager = new SoundManager();
