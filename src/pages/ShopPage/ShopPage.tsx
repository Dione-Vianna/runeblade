import { useCallback, useState } from 'react';

import { GameButton } from '../../components/Buttons';
import { Layout } from '../../components/Layout';
import { ShopEngine } from '../../game/core';
import { allCards } from '../../game/data';
import { useCollectionStore } from '../../game/state';
import type { Card, CardRarity, CardType, ShopItem } from '../../game/types';
import { RARITY_PRICES, SELL_PERCENTAGE } from '../../game/types/collection';
import './ShopPage.css';

// ==================== SHOP ITEM COMPONENT ====================

interface ShopItemCardProps {
  item: ShopItem;
  canAfford: boolean;
  onBuy: (itemId: string) => void;
}

function ShopItemCard({ item, canAfford, onBuy }: ShopItemCardProps) {
  const { card, price, originalPrice, discount, sold } = item;

  const getTypeIcon = (type: CardType): string => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'magic': return '✨';
      case 'buff': return '⬆️';
      case 'debuff': return '⬇️';
      default: return '🃏';
    }
  };

  return (
    <div
      className={`shop-item shop-item--${card.rarity} ${sold ? 'shop-item--sold' : ''} ${!canAfford && !sold ? 'shop-item--disabled' : ''}`}
    >
      {discount > 0 && !sold && (
        <div className="shop-item__discount">-{discount}%</div>
      )}
      {sold && <div className="shop-item__sold-badge">VENDIDO</div>}

      <div className="shop-item__type-icon">{getTypeIcon(card.type)}</div>
      <div className="shop-item__name">{card.name}</div>
      <div
        className="shop-item__rarity"
        style={{ color: ShopEngine.getRarityColor(card.rarity) }}
      >
        {ShopEngine.getRarityIcon(card.rarity)} {ShopEngine.getRarityName(card.rarity)}
      </div>
      <div className="shop-item__description">{card.description}</div>
      <div className="shop-item__cost">💎 {card.cost} mana</div>

      <div className="shop-item__price">
        {discount > 0 && (
          <span className="shop-item__original-price">💰 {originalPrice}</span>
        )}
        <span className="shop-item__final-price">💰 {price}</span>
      </div>

      <button
        className="shop-item__buy-btn"
        onClick={() => onBuy(item.id)}
        disabled={sold || !canAfford}
      >
        {sold ? 'Vendido' : canAfford ? 'Comprar' : 'Sem ouro'}
      </button>
    </div>
  );
}

// ==================== DECK CARD COMPONENT ====================

interface DeckCardProps {
  card: Card;
  count: number;
  canSell: boolean;
  onSell: (cardId: string) => void;
}

function DeckCard({ card, count, canSell, onSell }: DeckCardProps) {
  const getTypeIcon = (type: CardType): string => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'magic': return '✨';
      case 'buff': return '⬆️';
      case 'debuff': return '⬇️';
      default: return '🃏';
    }
  };

  const sellPrice = Math.floor(RARITY_PRICES[card.rarity] * SELL_PERCENTAGE);

  return (
    <div className={`deck-card deck-card--${card.rarity}`}>
      <span className="deck-card__icon">{getTypeIcon(card.type)}</span>
      <div className="deck-card__info">
        <div className="deck-card__name">
          {card.name} {count > 1 && `x${count}`}
        </div>
        <div className="deck-card__cost">💎 {card.cost} mana</div>
      </div>
      <button
        className="deck-card__sell-btn"
        onClick={() => onSell(card.id)}
        disabled={!canSell}
        title={canSell ? `Vender por ${sellPrice} ouro` : 'Deck no tamanho mínimo'}
      >
        💰 {sellPrice}
      </button>
    </div>
  );
}

// ==================== COLLECTION CARD COMPONENT ====================

interface CollectionCardProps {
  card: Card;
  isUnlocked: boolean;
  isInDeck: boolean;
  onClick: (card: Card) => void;
}

function CollectionCard({ card, isUnlocked, isInDeck, onClick }: CollectionCardProps) {
  const getTypeIcon = (type: CardType): string => {
    switch (type) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'magic': return '✨';
      case 'buff': return '⬆️';
      case 'debuff': return '⬇️';
      default: return '🃏';
    }
  };

  return (
    <div
      className={`collection-card ${!isUnlocked ? 'collection-card--locked' : ''} ${isInDeck ? 'collection-card--in-deck' : ''}`}
      onClick={() => isUnlocked && onClick(card)}
      title={isUnlocked ? card.description : 'Carta bloqueada'}
    >
      <div className="collection-card__icon">
        {isUnlocked ? getTypeIcon(card.type) : '🔒'}
      </div>
      <div className="collection-card__name">
        {isUnlocked ? card.name : '???'}
      </div>
      <div
        className="collection-card__rarity"
        style={{ color: isUnlocked ? ShopEngine.getRarityColor(card.rarity) : '#555' }}
      >
        {ShopEngine.getRarityIcon(card.rarity)}
      </div>
    </div>
  );
}

// ==================== MAIN SHOP PAGE ====================

interface ShopPageProps {
  gold: number;
  actId: number;
  onSpendGold: (amount: number) => boolean;
  onAddGold: (amount: number) => void;
  onClose: () => void;
}

export function ShopPage({ gold, actId, onSpendGold, onAddGold, onClose }: ShopPageProps) {
  const {
    currentShop,
    currentDeck,
    minDeckSize,
    maxDeckSize,
    openShop,
    buyCard,
    sellCard,
    refreshShop,
    isCardUnlocked,
    addCardToDeck,
  } = useCollectionStore();

  const [filterRarity, setFilterRarity] = useState<CardRarity | 'all'>('all');

  // Inicializar loja se não existir
  if (!currentShop) {
    const items = ShopEngine.generateShopItems(actId, 5, currentDeck);
    openShop(items);
  }

  // Comprar carta
  const handleBuy = useCallback(
    (itemId: string) => {
      buyCard(itemId, gold, onSpendGold);
    },
    [buyCard, gold, onSpendGold]
  );

  // Vender carta
  const handleSell = useCallback(
    (cardId: string) => {
      sellCard(cardId, onAddGold);
    },
    [sellCard, onAddGold]
  );

  // Atualizar loja
  const handleRefresh = useCallback(() => {
    refreshShop(
      () => ShopEngine.generateShopItems(actId, 5, currentDeck),
      gold,
      onSpendGold
    );
  }, [refreshShop, actId, currentDeck, gold, onSpendGold]);

  // Adicionar carta ao deck
  const handleAddToDeck = useCallback(
    (card: Card) => {
      if (currentDeck.length < maxDeckSize) {
        addCardToDeck(card.id);
      }
    },
    [addCardToDeck, currentDeck.length, maxDeckSize]
  );

  // Agrupar cartas do deck
  const deckCardCounts = currentDeck.reduce(
    (acc, cardId) => {
      acc[cardId] = (acc[cardId] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const uniqueDeckCards = [...new Set(currentDeck)]
    .map(id => allCards.find(c => c.id === id))
    .filter((c): c is Card => c !== undefined);

  // Filtrar coleção
  const filteredCollection = allCards.filter(
    card => filterRarity === 'all' || card.rarity === filterRarity
  );

  const refreshCost = currentShop
    ? currentShop.refreshCost * (currentShop.refreshCount + 1)
    : 50;
  const canRefresh =
    currentShop &&
    currentShop.refreshCount < currentShop.maxRefreshes &&
    gold >= refreshCost;

  return (
    <Layout>
      <div className="shop-page">
        <div className="shop-page__header">
          <h1 className="shop-page__title">🛒 Loja</h1>
          <div className="shop-page__gold">
            <span>💰</span>
            <span>{gold}</span>
          </div>
        </div>

        <div className="shop-page__content">
          <div className="shop-page__main">
            {/* Itens à venda */}
            <div className="shop-items">
              <div className="shop-items__header">
                <h2 className="shop-items__title">Cartas à Venda</h2>
                <div className="shop-items__refresh">
                  <GameButton
                    variant="secondary"
                    onClick={handleRefresh}
                    disabled={!canRefresh}
                  >
                    🔄 Atualizar (💰 {refreshCost})
                  </GameButton>
                  {currentShop && (
                    <span style={{ color: '#888', fontSize: '0.85rem' }}>
                      {currentShop.maxRefreshes - currentShop.refreshCount} restantes
                    </span>
                  )}
                </div>
              </div>

              <div className="shop-items__grid">
                {currentShop?.items.map(item => (
                  <ShopItemCard
                    key={item.id}
                    item={item}
                    canAfford={gold >= item.price}
                    onBuy={handleBuy}
                  />
                ))}
              </div>
            </div>

            {/* Coleção */}
            <div className="collection">
              <div className="collection__header">
                <h2 className="collection__title">
                  📚 Coleção ({allCards.filter(c => isCardUnlocked(c.id)).length}/{allCards.length})
                </h2>
                <div className="collection__filter">
                  {(['all', 'common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map(
                    rarity => (
                      <button
                        key={rarity}
                        className={`collection__filter-btn ${filterRarity === rarity ? 'collection__filter-btn--active' : ''}`}
                        onClick={() => setFilterRarity(rarity)}
                      >
                        {rarity === 'all' ? 'Todas' : ShopEngine.getRarityIcon(rarity)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="collection__grid">
                {filteredCollection.map(card => (
                  <CollectionCard
                    key={card.id}
                    card={card}
                    isUnlocked={isCardUnlocked(card.id)}
                    isInDeck={currentDeck.includes(card.id)}
                    onClick={handleAddToDeck}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Deck atual */}
          <div className="shop-page__sidebar">
            <div className="deck-manager">
              <div className="deck-manager__header">
                <h3 className="deck-manager__title">📦 Deck Atual</h3>
                <div className="deck-manager__count">
                  {currentDeck.length} / {maxDeckSize} cartas (mín: {minDeckSize})
                </div>
              </div>

              <div className="deck-manager__cards">
                {uniqueDeckCards.map(card => (
                  <DeckCard
                    key={card.id}
                    card={card}
                    count={deckCardCounts[card.id]}
                    canSell={currentDeck.length > minDeckSize}
                    onSell={handleSell}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="shop-page__actions">
          <GameButton variant="primary" onClick={onClose}>
            ✅ Sair da Loja
          </GameButton>
        </div>
      </div>
    </Layout>
  );
}
