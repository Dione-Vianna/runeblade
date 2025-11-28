import { getRandomEnemy } from '../data/enemies';
import { createPlayer, discardCard, discardHand, drawCards } from '../data/player';
import type { CardInstance, GameConfig, GameState, LogEntry } from '../types';
import { generateId } from '../utils';
import { CardEngine } from './CardEngine';
import { EnemyAI } from './EnemyAI';
import { TurnManager } from './TurnManager';

const defaultConfig: GameConfig = {
  difficulty: 'normal',
  damageMultiplier: 1,
  healingMultiplier: 1,
  startingHandSize: 5,
  cardsPerTurn: 1
};

export class GameEngine {
  private turnManager: TurnManager;

  constructor() {
    this.turnManager = new TurnManager();
  }

  /**
   * Cria um novo estado de jogo inicial
   */
  createInitialState(config: Partial<GameConfig> = {}): GameState {
    const gameConfig = { ...defaultConfig, ...config };
    const player = createPlayer();
    const enemy = getRandomEnemy('tier1');

    // Compra mão inicial
    const playerWithHand = drawCards(player, gameConfig.startingHandSize);

    const state: GameState = {
      player: playerWithHand,
      enemy,
      turn: 'player',
      isGameOver: false,
      isVictory: false,
      log: [],
      round: 1,
      config: gameConfig
    };

    // Determina intenção inicial do inimigo
    return EnemyAI.updateEnemyIntent(state);
  }

  /**
   * Inicia um novo jogo
   */
  startGame(config?: Partial<GameConfig>): GameState {
    this.turnManager.reset();
    const state = this.createInitialState(config);
    return this.addLogEntry(state, 'Batalha iniciada!', 'system');
  }

  /**
   * Reseta o jogo para o estado inicial
   */
  resetGame(state: GameState): GameState {
    return this.startGame(state.config);
  }

  /**
   * Processa a ação do jogador (jogar uma carta)
   */
  playCard(state: GameState, card: CardInstance): GameState {
    // Verifica se é turno do jogador
    if (state.turn !== 'player') {
      return state;
    }

    // Verifica se o jogador tem mana suficiente
    if (state.player.mana < card.cost) {
      return this.addLogEntry(state, 'Mana insuficiente!', 'system');
    }

    // Aplica o efeito da carta
    let newState = CardEngine.applyCard(card, state);

    // Move a carta para o descarte
    newState = {
      ...newState,
      player: discardCard(newState.player, card.instanceId)
    };

    // Adiciona log
    newState = this.addLogEntry(newState, `Você usou ${card.name}!`, 'action');

    // Verifica vitória
    newState = this.checkGameEnd(newState);

    return newState;
  }

  /**
   * Finaliza o turno do jogador
   */
  endPlayerTurn(state: GameState): GameState {
    if (state.turn !== 'player' || state.isGameOver) {
      return state;
    }

    let newState = state;

    // Descarta todas as cartas da mão
    newState = {
      ...newState,
      player: discardHand(newState.player)
    };

    // Muda para turno do inimigo
    this.turnManager.nextTurn();
    newState = {
      ...newState,
      turn: 'enemy'
    };

    newState = this.addLogEntry(newState, 'Turno do inimigo!', 'system');

    // Processa turno do inimigo
    newState = this.processEnemyTurn(newState);

    return newState;
  }

  /**
   * Processa o turno do inimigo
   */
  private processEnemyTurn(state: GameState): GameState {
    if (!state.enemy || state.isGameOver) {
      return state;
    }

    let newState = state;

    // Processa efeitos de status do inimigo
    newState = CardEngine.processStatusEffects(newState, 'enemy');

    // Verifica se o inimigo morreu por efeitos de status
    newState = this.checkGameEnd(newState);
    if (newState.isGameOver) {
      return newState;
    }

    // Inimigo executa sua ação
    const actionDescription = newState.enemy?.intent?.description ?? 'ataque';
    newState = this.addLogEntry(newState, `${newState.enemy?.name} usa ${actionDescription}!`, 'action');
    newState = EnemyAI.executeAction(newState);

    // Verifica se o jogador morreu
    newState = this.checkGameEnd(newState);
    if (newState.isGameOver) {
      return newState;
    }

    // Inicia novo turno do jogador
    newState = this.startPlayerTurn(newState);

    return newState;
  }

  /**
   * Inicia o turno do jogador
   */
  private startPlayerTurn(state: GameState): GameState {
    let newState = state;

    // Muda para turno do jogador
    this.turnManager.nextTurn();
    newState = {
      ...newState,
      turn: 'player',
      round: newState.round + 1
    };

    // Reseta armadura do jogador
    newState = CardEngine.resetPlayerArmor(newState);

    // Processa efeitos de status do jogador
    newState = CardEngine.processStatusEffects(newState, 'player');

    // Verifica se o jogador morreu por efeitos de status
    newState = this.checkGameEnd(newState);
    if (newState.isGameOver) {
      return newState;
    }

    // Restaura mana
    newState = CardEngine.restorePlayerMana(newState);

    // Compra novas cartas
    newState = {
      ...newState,
      player: drawCards(newState.player, newState.config.startingHandSize)
    };

    // Atualiza intenção do inimigo para o próximo turno
    newState = EnemyAI.updateEnemyIntent(newState);

    newState = this.addLogEntry(newState, `Turno ${newState.round} - Sua vez!`, 'system');

    return newState;
  }

  /**
   * Verifica condições de fim de jogo
   */
  private checkGameEnd(state: GameState): GameState {
    // Verifica vitória (inimigo morto)
    if (state.enemy && state.enemy.hp <= 0) {
      return {
        ...state,
        isGameOver: true,
        isVictory: true,
        log: [
          ...state.log,
          this.createLogEntry(`${state.enemy.name} foi derrotado! Você venceu!`, 'system')
        ]
      };
    }

    // Verifica derrota (jogador morto)
    if (state.player.hp <= 0) {
      return {
        ...state,
        isGameOver: true,
        isVictory: false,
        log: [
          ...state.log,
          this.createLogEntry('Você foi derrotado!', 'system')
        ]
      };
    }

    return state;
  }

  /**
   * Adiciona uma entrada ao log do jogo
   */
  private addLogEntry(
    state: GameState,
    message: string,
    type: LogEntry['type']
  ): GameState {
    return {
      ...state,
      log: [...state.log, this.createLogEntry(message, type)]
    };
  }

  /**
   * Cria uma entrada de log
   */
  private createLogEntry(message: string, type: LogEntry['type']): LogEntry {
    return {
      id: generateId(),
      message,
      type,
      timestamp: Date.now()
    };
  }

  /**
   * Retorna o gerenciador de turnos
   */
  getTurnManager(): TurnManager {
    return this.turnManager;
  }
}

// Singleton instance
export const gameEngine = new GameEngine();
