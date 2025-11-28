import type { Turn } from '../types';

export interface TurnManagerState {
  currentTurn: Turn;
  turnCount: number;
}

export class TurnManager {
  private currentTurn: Turn = 'player';
  private turnCount: number = 1;

  constructor(startingTurn: Turn = 'player') {
    this.currentTurn = startingTurn;
    this.turnCount = 1;
  }

  getCurrentTurn(): Turn {
    return this.currentTurn;
  }

  getTurnCount(): number {
    return this.turnCount;
  }

  isPlayerTurn(): boolean {
    return this.currentTurn === 'player';
  }

  isEnemyTurn(): boolean {
    return this.currentTurn === 'enemy';
  }

  nextTurn(): Turn {
    if (this.currentTurn === 'player') {
      this.currentTurn = 'enemy';
    } else {
      this.currentTurn = 'player';
      this.turnCount++;
    }
    return this.currentTurn;
  }

  reset(): void {
    this.currentTurn = 'player';
    this.turnCount = 1;
  }

  getState(): TurnManagerState {
    return {
      currentTurn: this.currentTurn,
      turnCount: this.turnCount
    };
  }

  setState(state: TurnManagerState): void {
    this.currentTurn = state.currentTurn;
    this.turnCount = state.turnCount;
  }
}

// Singleton instance para uso global
export const turnManager = new TurnManager();
