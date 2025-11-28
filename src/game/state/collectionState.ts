import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { allCards, starterDeck } from '../data';
import type { Card, PlayerCollection, ShopItem, ShopState, UnlockedCard } from '../types';
import { RARITY_PRICES, SELL_PERCENTAGE, SHOP_REFRESH_COST } from '../types/collection';

interface CollectionStore extends PlayerCollection {
  // Estado da loja atual
  currentShop: ShopState | null;

  // Ações da coleção
  unlockCard: (cardId: string) => void;
  addCardToDeck: (cardId: string) => boolean;
  removeCardFromDeck: (cardId: string) => boolean;
  resetDeck: () => void;
  isCardUnlocked: (cardId: string) => boolean;
  getUnlockedCards: () => Card[];
  getDeckCards: () => Card[];

  // Ações da loja
  openShop: (items: ShopItem[]) => void;
  closeShop: () => void;
  buyCard: (itemId: string, gold: number, onSpendGold: (amount: number) => boolean) => boolean;
  sellCard: (cardId: string, onAddGold: (amount: number) => void) => boolean;
  refreshShop: (
    generateItems: () => ShopItem[],
    gold: number,
    onSpendGold: (amount: number) => boolean
  ) => boolean;

  // Estatísticas
  incrementCardUsage: (cardId: string) => void;
}

// Cartas iniciais desbloqueadas (do starterDeck)
const initialUnlockedCards: UnlockedCard[] = [
  ...new Set(starterDeck.map(c => c.id)),
].map(id => ({
  cardId: id,
  unlockedAt: Date.now(),
  timesUsed: 0,
}));

export const useCollectionStore = create<CollectionStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      unlockedCards: initialUnlockedCards,
      currentDeck: starterDeck.map(c => c.id),
      maxDeckSize: 20,
      minDeckSize: 8,
      currentShop: null,

      // Desbloquear carta
      unlockCard: (cardId: string) => {
        const { unlockedCards } = get();
        if (unlockedCards.some(c => c.cardId === cardId)) return;

        set({
          unlockedCards: [
            ...unlockedCards,
            {
              cardId,
              unlockedAt: Date.now(),
              timesUsed: 0,
            },
          ],
        });
      },

      // Adicionar carta ao deck
      addCardToDeck: (cardId: string) => {
        const { currentDeck, maxDeckSize, isCardUnlocked } = get();

        if (!isCardUnlocked(cardId)) return false;
        if (currentDeck.length >= maxDeckSize) return false;

        set({ currentDeck: [...currentDeck, cardId] });
        return true;
      },

      // Remover carta do deck
      removeCardFromDeck: (cardId: string) => {
        const { currentDeck, minDeckSize } = get();

        if (currentDeck.length <= minDeckSize) return false;

        const index = currentDeck.indexOf(cardId);
        if (index === -1) return false;

        const newDeck = [...currentDeck];
        newDeck.splice(index, 1);
        set({ currentDeck: newDeck });
        return true;
      },

      // Resetar deck para inicial
      resetDeck: () => {
        set({ currentDeck: starterDeck.map(c => c.id) });
      },

      // Verificar se carta está desbloqueada
      isCardUnlocked: (cardId: string) => {
        return get().unlockedCards.some(c => c.cardId === cardId);
      },

      // Obter cartas desbloqueadas
      getUnlockedCards: () => {
        const { unlockedCards } = get();
        return unlockedCards
          .map(uc => allCards.find(c => c.id === uc.cardId))
          .filter((c): c is Card => c !== undefined);
      },

      // Obter cartas do deck
      getDeckCards: () => {
        const { currentDeck } = get();
        return currentDeck
          .map(id => allCards.find(c => c.id === id))
          .filter((c): c is Card => c !== undefined);
      },

      // Abrir loja
      openShop: (items: ShopItem[]) => {
        set({
          currentShop: {
            items,
            refreshCost: SHOP_REFRESH_COST,
            refreshCount: 0,
            maxRefreshes: 3,
          },
        });
      },

      // Fechar loja
      closeShop: () => {
        set({ currentShop: null });
      },

      // Comprar carta
      buyCard: (itemId: string, gold: number, onSpendGold: (amount: number) => boolean) => {
        const { currentShop, unlockCard, addCardToDeck } = get();
        if (!currentShop) return false;

        const item = currentShop.items.find(i => i.id === itemId);
        if (!item || item.sold) return false;
        if (gold < item.price) return false;

        // Tentar gastar o ouro
        if (!onSpendGold(item.price)) return false;

        // Marcar como vendido
        const updatedItems = currentShop.items.map(i =>
          i.id === itemId ? { ...i, sold: true } : i
        );

        set({
          currentShop: { ...currentShop, items: updatedItems },
        });

        // Desbloquear e adicionar ao deck
        unlockCard(item.card.id);
        addCardToDeck(item.card.id);

        return true;
      },

      // Vender carta
      sellCard: (cardId: string, onAddGold: (amount: number) => void) => {
        const { removeCardFromDeck } = get();
        const card = allCards.find(c => c.id === cardId);
        if (!card) return false;

        // Remover do deck
        if (!removeCardFromDeck(cardId)) return false;

        // Calcular preço de venda
        const basePrice = RARITY_PRICES[card.rarity];
        const sellPrice = Math.floor(basePrice * SELL_PERCENTAGE);

        onAddGold(sellPrice);
        return true;
      },

      // Atualizar loja
      refreshShop: (
        generateItems: () => ShopItem[],
        gold: number,
        onSpendGold: (amount: number) => boolean
      ) => {
        const { currentShop } = get();
        if (!currentShop) return false;
        if (currentShop.refreshCount >= currentShop.maxRefreshes) return false;

        const refreshCost = currentShop.refreshCost * (currentShop.refreshCount + 1);
        if (gold < refreshCost) return false;

        if (!onSpendGold(refreshCost)) return false;

        const newItems = generateItems();
        set({
          currentShop: {
            ...currentShop,
            items: newItems,
            refreshCount: currentShop.refreshCount + 1,
          },
        });

        return true;
      },

      // Incrementar uso de carta
      incrementCardUsage: (cardId: string) => {
        set(state => ({
          unlockedCards: state.unlockedCards.map(uc =>
            uc.cardId === cardId ? { ...uc, timesUsed: uc.timesUsed + 1 } : uc
          ),
        }));
      },
    }),
    {
      name: 'runeblade-collection',
      partialize: state => ({
        unlockedCards: state.unlockedCards,
        currentDeck: state.currentDeck,
      }),
    }
  )
);

// Seletores
export const selectUnlockedCards = (state: CollectionStore) => state.unlockedCards;
export const selectCurrentDeck = (state: CollectionStore) => state.currentDeck;
export const selectCurrentShop = (state: CollectionStore) => state.currentShop;
