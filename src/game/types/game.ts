import type { Enemy } from './enemy';
import type { Player } from './player';

export type Turn = 'player' | 'enemy';

export type StatusEffectType =
  | 'poison'
  | 'bleed'
  | 'burn'
  | 'weakness'
  | 'strength'
  | 'regeneration'
  | 'vulnerable'
  | 'shield';

export interface StatusEffect {
  type: StatusEffectType;
  value: number;
  duration: number;
  description: string;
}

export interface GameConfig {
  difficulty: 'easy' | 'normal' | 'hard';
  damageMultiplier: number;
  healingMultiplier: number;
  startingHandSize: number;
  cardsPerTurn: number;
}

export interface LogEntry {
  id: string;
  message: string;
  type: 'action' | 'damage' | 'heal' | 'status' | 'system';
  timestamp: number;
}

export interface GameState {
  player: Player;
  enemy: Enemy | null;
  turn: Turn;
  isGameOver: boolean;
  isVictory: boolean;
  log: LogEntry[];
  round: number;
  config: GameConfig;
}
