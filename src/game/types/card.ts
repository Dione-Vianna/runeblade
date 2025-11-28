import type { GameState } from './game';

export type CardType = 'attack' | 'defense' | 'magic' | 'buff' | 'debuff';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  rarity: CardRarity;
  cost: number;
  description: string;
  value: number;
  image?: string;
  effect: (state: GameState) => GameState;
}

export interface CardInstance extends Card {
  instanceId: string;
}
