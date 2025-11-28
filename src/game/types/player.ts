import type { CardInstance } from './card';
import type { StatusEffect } from './game';

export interface Player {
  hp: number;
  maxHp: number;
  armor: number;
  mana: number;
  maxMana: number;
  deck: CardInstance[];
  hand: CardInstance[];
  discardPile: CardInstance[];
  statusEffects: StatusEffect[];
}
