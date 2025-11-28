import { create } from 'zustand';
import { GameEngine } from '../core';
import type { CardInstance, GameConfig, GameState } from '../types';

interface GameStore extends GameState {
  // Ações
  startGame: (config?: Partial<GameConfig>) => void;
  resetGame: () => void;
  playCard: (card: CardInstance) => void;
  endTurn: () => void;

  // Engine
  engine: GameEngine;
}

export const useGameStore = create<GameStore>((set, get) => {
  const engine = new GameEngine();
  const initialState = engine.startGame();

  return {
    // Estado inicial
    ...initialState,
    engine,

    // Ações
    startGame: (config?: Partial<GameConfig>) => {
      const newState = get().engine.startGame(config);
      set({
        player: newState.player,
        enemy: newState.enemy,
        turn: newState.turn,
        isGameOver: newState.isGameOver,
        isVictory: newState.isVictory,
        log: newState.log,
        round: newState.round,
        config: newState.config
      });
    },

    resetGame: () => {
      const currentState: GameState = {
        player: get().player,
        enemy: get().enemy,
        turn: get().turn,
        isGameOver: get().isGameOver,
        isVictory: get().isVictory,
        log: get().log,
        round: get().round,
        config: get().config
      };
      const newState = get().engine.resetGame(currentState);
      set({
        player: newState.player,
        enemy: newState.enemy,
        turn: newState.turn,
        isGameOver: newState.isGameOver,
        isVictory: newState.isVictory,
        log: newState.log,
        round: newState.round,
        config: newState.config
      });
    },

    playCard: (card: CardInstance) => {
      const currentState: GameState = {
        player: get().player,
        enemy: get().enemy,
        turn: get().turn,
        isGameOver: get().isGameOver,
        isVictory: get().isVictory,
        log: get().log,
        round: get().round,
        config: get().config
      };
      const newState = get().engine.playCard(currentState, card);
      set({
        player: newState.player,
        enemy: newState.enemy,
        turn: newState.turn,
        isGameOver: newState.isGameOver,
        isVictory: newState.isVictory,
        log: newState.log,
        round: newState.round,
        config: newState.config
      });
    },

    endTurn: () => {
      const currentState: GameState = {
        player: get().player,
        enemy: get().enemy,
        turn: get().turn,
        isGameOver: get().isGameOver,
        isVictory: get().isVictory,
        log: get().log,
        round: get().round,
        config: get().config
      };
      const newState = get().engine.endPlayerTurn(currentState);
      set({
        player: newState.player,
        enemy: newState.enemy,
        turn: newState.turn,
        isGameOver: newState.isGameOver,
        isVictory: newState.isVictory,
        log: newState.log,
        round: newState.round,
        config: newState.config
      });
    }
  };
});

// Seletores para facilitar o uso
export const selectPlayer = (state: GameStore) => state.player;
export const selectEnemy = (state: GameStore) => state.enemy;
export const selectTurn = (state: GameStore) => state.turn;
export const selectIsGameOver = (state: GameStore) => state.isGameOver;
export const selectIsVictory = (state: GameStore) => state.isVictory;
export const selectLog = (state: GameStore) => state.log;
export const selectRound = (state: GameStore) => state.round;
export const selectConfig = (state: GameStore) => state.config;
export const selectHand = (state: GameStore) => state.player.hand;
export const selectMana = (state: GameStore) => state.player.mana;
export const selectMaxMana = (state: GameStore) => state.player.maxMana;
