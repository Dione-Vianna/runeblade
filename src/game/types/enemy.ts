import type { StatusEffect } from './game';

export type EnemyBehavior = 'aggressive' | 'defensive' | 'balanced' | 'random';
export type EnemyIntent = 'attack' | 'defend' | 'buff' | 'debuff' | 'special';

export interface EnemyAction {
  type: EnemyIntent;
  value: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  armor: number;
  behavior: EnemyBehavior;
  attackPower: number;
  statusEffects: StatusEffect[];
  intent: EnemyAction | null;
  image?: string;
  actions: EnemyAction[];
}
