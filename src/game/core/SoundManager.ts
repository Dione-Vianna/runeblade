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
  private masterVolume = 0.3;
  private soundVolume = 0.4;
  private musicVolume = 0.2;
  private isMuted = false;

  /**
   * Inicializa o contexto de áudio
   */
  init(): void {
    if (this.audioContext) return;

    try {
      const AudioContextClass =
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).AudioContext ||
        (window as unknown as { AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch {
      console.warn('Web Audio API não disponível');
    }
  }

  /**
   * Toca um som específico
   */
  play(type: SoundType): void {
    if (!this.audioContext || this.isMuted) return;

    // Retomar contexto se estiver suspenso
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

  /**
   * Toca som de ataque
   */
  private playAttackSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.15;

    // Tom grave para impacto
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de defesa
   */
  private playDefenseSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.2;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(150, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.8, now);
    gain.gain.linearRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de magia
   */
  private playMagicSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.3;

    // Dois osciladores para efeito mágico
    const osc1 = this.audioContext.createOscillator();
    const osc2 = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(800, now + duration);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(300, now);
    osc2.frequency.exponentialRampToValueAtTime(600, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioContext.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  /**
   * Toca som de cura
   */
  private playHealSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.4;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.linearRampToValueAtTime(1000, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de dano
   */
  private playDamageSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.1;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.7, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de vitória
   */
  private playVictorySound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const notes = [523, 659, 784, 1047]; // C, E, G, C (uma oitava acima)
    const duration = 0.15;
    const delay = 0.1;

    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);

      gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  /**
   * Toca som de derrota
   */
  private playDefeatSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const notes = [392, 349, 330, 294]; // G, F, E, D (descendo)
    const duration = 0.2;
    const delay = 0.15;

    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);

      gain.gain.setValueAtTime(this.soundVolume * this.masterVolume, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  /**
   * Toca som de carta jogada
   */
  private playCardPlaySound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.1;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.6, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de carta descartada
   */
  private playCardDiscardSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.08;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de clique
   */
  private playClickSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.05;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1000, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de buff
   */
  private playBuffSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.2;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.linearRampToValueAtTime(900, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de debuff
   */
  private playDebuffSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const duration = 0.2;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.linearRampToValueAtTime(150, now + duration);

    gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  /**
   * Toca som de level up
   */
  private playLevelUpSound(): void {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const notes = [659, 784, 988, 1319]; // E, G, B, E (arpejo ascendente)
    const duration = 0.1;
    const delay = 0.08;

    for (let i = 0; i < notes.length; i++) {
      const noteTime = now + i * delay;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[i], noteTime);

      gain.gain.setValueAtTime(this.soundVolume * this.masterVolume * 0.6, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.01, noteTime + duration);

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      osc.start(noteTime);
      osc.stop(noteTime + duration);
    }
  }

  /**
   * Define o volume mestre
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Define o volume de efeitos sonoros
   */
  setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Define o volume da música
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Obtém o volume mestre
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Obtém o volume de efeitos
   */
  getSoundVolume(): number {
    return this.soundVolume;
  }

  /**
   * Obtém o volume de música
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }

  /**
   * Ativa ou desativa o som
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
  }

  /**
   * Retorna se está mutado
   */
  isSoundMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Alterna mute
   */
  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
}

// Instância global do SoundManager
export const soundManager = new SoundManager();
