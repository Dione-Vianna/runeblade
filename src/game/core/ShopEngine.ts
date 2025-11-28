import { allCards } from '../data';
import type { Card, CardRarity, ShopItem } from '../types';
import {
  DISCOUNT_CHANCES,
  RARITY_PRICES,
  SELL_PERCENTAGE,
  SHOP_ITEMS_COUNT,
} from '../types/collection';
import { chance, generateId, randomInt, weightedRandom } from '../utils';

/**
 * Pesos de raridade para a loja (por ato)
 */
const RARITY_WEIGHTS: Record<number, Record<CardRarity, number>> = {
  1: { common: 50, uncommon: 35, rare: 12, epic: 3, legendary: 0 },
  2: { common: 35, uncommon: 40, rare: 18, epic: 6, legendary: 1 },
  3: { common: 20, uncommon: 35, rare: 30, epic: 12, legendary: 3 },
};

export class ShopEngine {
  /**
   * Gera itens para a loja
   */
  static generateShopItems(
    actId: number = 1,
    count: number = SHOP_ITEMS_COUNT,
    excludeCardIds: string[] = []
  ): ShopItem[] {
    const items: ShopItem[] = [];
    const usedCardIds = new Set(excludeCardIds);
    const weights = RARITY_WEIGHTS[actId] ?? RARITY_WEIGHTS[1];

    // Filtrar cartas disponíveis
    const availableCards = allCards.filter(c => !usedCardIds.has(c.id));

    for (let i = 0; i < count && availableCards.length > 0; i++) {
      // Selecionar raridade
      const rarities: CardRarity[] = ['common', 'uncommon', 'rare', 'epic', 'legendary'];
      const rarityWeights = rarities.map(r => weights[r]);
      const selectedRarity = weightedRandom(rarities, rarityWeights);

      // Filtrar por raridade
      let cardPool = availableCards.filter(
        c => c.rarity === selectedRarity && !usedCardIds.has(c.id)
      );

      // Se não há cartas dessa raridade, pegar qualquer uma
      if (cardPool.length === 0) {
        cardPool = availableCards.filter(c => !usedCardIds.has(c.id));
      }

      if (cardPool.length === 0) break;

      // Selecionar carta aleatória
      const randomIndex = randomInt(0, cardPool.length - 1);
      const card = cardPool[randomIndex];
      usedCardIds.add(card.id);

      // Gerar item
      const item = this.createShopItem(card);
      items.push(item);
    }

    return items;
  }

  /**
   * Cria um item de loja para uma carta
   */
  static createShopItem(card: Card): ShopItem {
    const basePrice = RARITY_PRICES[card.rarity];
    const hasDiscount = chance(DISCOUNT_CHANCES[card.rarity]);
    const discount = hasDiscount ? randomInt(10, 30) : 0;
    const finalPrice = Math.floor(basePrice * (1 - discount / 100));

    return {
      id: generateId(),
      card,
      price: finalPrice,
      originalPrice: basePrice,
      discount,
      sold: false,
    };
  }

  /**
   * Calcula o preço de venda de uma carta
   */
  static getSellPrice(card: Card): number {
    const basePrice = RARITY_PRICES[card.rarity];
    return Math.floor(basePrice * SELL_PERCENTAGE);
  }

  /**
   * Retorna o ícone de raridade
   */
  static getRarityIcon(rarity: CardRarity): string {
    switch (rarity) {
      case 'common':
        return '⚪';
      case 'uncommon':
        return '🟢';
      case 'rare':
        return '🔵';
      case 'epic':
        return '🟣';
      case 'legendary':
        return '🟡';
      default:
        return '⚪';
    }
  }

  /**
   * Retorna a cor de raridade
   */
  static getRarityColor(rarity: CardRarity): string {
    switch (rarity) {
      case 'common':
        return '#9d9d9d';
      case 'uncommon':
        return '#1eff00';
      case 'rare':
        return '#0070dd';
      case 'epic':
        return '#a335ee';
      case 'legendary':
        return '#ff8000';
      default:
        return '#9d9d9d';
    }
  }

  /**
   * Retorna o nome da raridade em português
   */
  static getRarityName(rarity: CardRarity): string {
    switch (rarity) {
      case 'common':
        return 'Comum';
      case 'uncommon':
        return 'Incomum';
      case 'rare':
        return 'Raro';
      case 'epic':
        return 'Épico';
      case 'legendary':
        return 'Lendário';
      default:
        return 'Comum';
    }
  }
}
