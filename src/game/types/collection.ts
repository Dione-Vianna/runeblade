import type { Card, CardRarity } from './card';

/**
 * Carta desbloqueada na coleção do jogador
 */
export interface UnlockedCard {
  cardId: string;
  unlockedAt: number; // timestamp
  timesUsed: number;
}

/**
 * Coleção completa do jogador
 */
export interface PlayerCollection {
  unlockedCards: UnlockedCard[];
  currentDeck: string[]; // IDs das cartas no deck atual
  maxDeckSize: number;
  minDeckSize: number;
}

/**
 * Item à venda na loja
 */
export interface ShopItem {
  id: string;
  card: Card;
  price: number;
  originalPrice: number;
  discount: number; // 0-100
  sold: boolean;
}

/**
 * Estado da loja
 */
export interface ShopState {
  items: ShopItem[];
  refreshCost: number;
  refreshCount: number;
  maxRefreshes: number;
}

/**
 * Preços base por raridade
 */
export const RARITY_PRICES: Record<CardRarity, number> = {
  common: 50,
  uncommon: 75,
  rare: 150,
  epic: 250,
  legendary: 400,
};

/**
 * Preço de venda (% do preço original)
 */
export const SELL_PERCENTAGE = 0.5;

/**
 * Custo para atualizar a loja
 */
export const SHOP_REFRESH_COST = 50;

/**
 * Número de itens na loja
 */
export const SHOP_ITEMS_COUNT = 5;

/**
 * Chance de desconto por raridade
 */
export const DISCOUNT_CHANCES: Record<CardRarity, number> = {
  common: 0.3,
  uncommon: 0.2,
  rare: 0.1,
  epic: 0.05,
  legendary: 0.02,
};
