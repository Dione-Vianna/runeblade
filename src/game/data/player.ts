import type { CardInstance, Player } from '../types';
import { generateId, shuffle } from '../utils';
import { starterDeck } from './cards';

// Configuração inicial padrão do jogador
export const defaultPlayerConfig = {
  hp: 80,
  maxHp: 80,
  armor: 0,
  mana: 3,
  maxMana: 3
};

/**
 * Converte cartas base em instâncias únicas com instanceId
 */
export function createCardInstances(cards: typeof starterDeck): CardInstance[] {
  return cards.map(card => ({
    ...card,
    instanceId: generateId()
  }));
}

/**
 * Cria um novo jogador com deck inicial
 */
export function createPlayer(config = defaultPlayerConfig): Player {
  const deckInstances = shuffle(createCardInstances(starterDeck));

  return {
    hp: config.hp,
    maxHp: config.maxHp,
    armor: config.armor,
    mana: config.mana,
    maxMana: config.maxMana,
    deck: deckInstances,
    hand: [],
    discardPile: [],
    statusEffects: []
  };
}

/**
 * Reseta o jogador para o estado inicial
 */
export function resetPlayer(player: Player): Player {
  const allCards = [...player.deck, ...player.hand, ...player.discardPile];
  const shuffledDeck = shuffle(allCards);

  return {
    ...player,
    hp: player.maxHp,
    armor: 0,
    mana: player.maxMana,
    deck: shuffledDeck,
    hand: [],
    discardPile: [],
    statusEffects: []
  };
}

/**
 * Compra cartas do deck para a mão
 */
export function drawCards(player: Player, count: number): Player {
  const newPlayer = { ...player };
  const cardsToDraw = Math.min(count, newPlayer.deck.length + newPlayer.discardPile.length);

  for (let i = 0; i < cardsToDraw; i++) {
    // Se o deck estiver vazio, embaralha o descarte
    if (newPlayer.deck.length === 0) {
      if (newPlayer.discardPile.length === 0) break;
      newPlayer.deck = shuffle([...newPlayer.discardPile]);
      newPlayer.discardPile = [];
    }

    const card = newPlayer.deck.pop();
    if (card) {
      newPlayer.hand = [...newPlayer.hand, card];
    }
  }

  return {
    ...newPlayer,
    deck: [...newPlayer.deck],
    hand: [...newPlayer.hand],
    discardPile: [...newPlayer.discardPile]
  };
}

/**
 * Descarta todas as cartas da mão
 */
export function discardHand(player: Player): Player {
  return {
    ...player,
    discardPile: [...player.discardPile, ...player.hand],
    hand: []
  };
}

/**
 * Descarta uma carta específica da mão
 */
export function discardCard(player: Player, cardInstanceId: string): Player {
  const cardIndex = player.hand.findIndex(c => c.instanceId === cardInstanceId);

  if (cardIndex === -1) return player;

  const card = player.hand[cardIndex];
  const newHand = [...player.hand];
  newHand.splice(cardIndex, 1);

  return {
    ...player,
    hand: newHand,
    discardPile: [...player.discardPile, card]
  };
}
