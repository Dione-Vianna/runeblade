import { useCallback } from 'react';
import {
  selectEnemy,
  selectHand,
  selectIsGameOver,
  selectIsVictory,
  selectLog,
  selectMana,
  selectMaxMana,
  selectPlayer,
  selectRound,
  selectTurn,
  useGameStore
} from '../game/state';
import type { CardInstance, GameConfig } from '../game/types';

export function useGameEngine() {
  // Estado do jogo
  const player = useGameStore(selectPlayer);
  const enemy = useGameStore(selectEnemy);
  const turn = useGameStore(selectTurn);
  const isGameOver = useGameStore(selectIsGameOver);
  const isVictory = useGameStore(selectIsVictory);
  const log = useGameStore(selectLog);
  const round = useGameStore(selectRound);
  const hand = useGameStore(selectHand);
  const mana = useGameStore(selectMana);
  const maxMana = useGameStore(selectMaxMana);

  // Ações do store
  const startGame = useGameStore(state => state.startGame);
  const resetGame = useGameStore(state => state.resetGame);
  const playCardAction = useGameStore(state => state.playCard);
  const endTurnAction = useGameStore(state => state.endTurn);

  // Callbacks otimizados
  const handleStartGame = useCallback((config?: Partial<GameConfig>) => {
    startGame(config);
  }, [startGame]);

  const handleResetGame = useCallback(() => {
    resetGame();
  }, [resetGame]);

  const handlePlayCard = useCallback((card: CardInstance) => {
    if (turn !== 'player' || isGameOver) return;
    if (mana < card.cost) return;
    playCardAction(card);
  }, [turn, isGameOver, mana, playCardAction]);

  const handleEndTurn = useCallback(() => {
    if (turn !== 'player' || isGameOver) return;
    endTurnAction();
  }, [turn, isGameOver, endTurnAction]);

  const canPlayCard = useCallback((card: CardInstance): boolean => {
    return turn === 'player' && !isGameOver && mana >= card.cost;
  }, [turn, isGameOver, mana]);

  const isPlayerTurn = turn === 'player';
  const isEnemyTurn = turn === 'enemy';

  return {
    // Estado
    player,
    enemy,
    turn,
    isGameOver,
    isVictory,
    log,
    round,
    hand,
    mana,
    maxMana,
    isPlayerTurn,
    isEnemyTurn,

    // Ações
    startGame: handleStartGame,
    resetGame: handleResetGame,
    playCard: handlePlayCard,
    endTurn: handleEndTurn,

    // Helpers
    canPlayCard
  };
}
