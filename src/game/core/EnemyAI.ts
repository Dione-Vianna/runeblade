import type { Enemy, EnemyAction, GameState } from '../types';
import { chance, randomElement, weightedRandom } from '../utils';
import { CardEngine } from './CardEngine';

export class EnemyAI {
  /**
   * Escolhe e executa a ação do inimigo
   */
  static executeAction(state: GameState): GameState {
    if (!state.enemy) return state;

    const action = this.chooseAction(state.enemy, state);
    return this.applyAction(state, action);
  }

  /**
   * Escolhe uma ação baseada no comportamento do inimigo
   */
  static chooseAction(enemy: Enemy, state: GameState): EnemyAction {
    switch (enemy.behavior) {
      case 'aggressive':
        return this.aggressiveMode(enemy, state);
      case 'defensive':
        return this.defensiveMode(enemy, state);
      case 'balanced':
        return this.balancedMode(enemy, state);
      case 'random':
      default:
        return this.randomAction(enemy);
    }
  }

  /**
   * Modo agressivo - prioriza ataques
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static aggressiveMode(enemy: Enemy, _state: GameState): EnemyAction {
    const attacks = enemy.actions.filter(a => a.type === 'attack');
    const buffs = enemy.actions.filter(a => a.type === 'buff');

    // 80% chance de atacar, 20% de usar buff se disponível
    if (attacks.length > 0 && (buffs.length === 0 || chance(0.8))) {
      return randomElement(attacks) ?? enemy.actions[0];
    }

    if (buffs.length > 0) {
      return randomElement(buffs) ?? enemy.actions[0];
    }

    return randomElement(enemy.actions) ?? enemy.actions[0];
  }

  /**
   * Modo defensivo - prioriza defesa quando HP baixo
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private static defensiveMode(enemy: Enemy, _state: GameState): EnemyAction {
    const defenses = enemy.actions.filter(a => a.type === 'defend');
    const attacks = enemy.actions.filter(a => a.type === 'attack');

    const hpPercentage = enemy.hp / enemy.maxHp;

    // Se HP < 40%, prioriza defesa
    if (hpPercentage < 0.4 && defenses.length > 0 && chance(0.7)) {
      return randomElement(defenses) ?? enemy.actions[0];
    }

    // Se HP >= 40%, balanceia
    if (chance(0.6) && attacks.length > 0) {
      return randomElement(attacks) ?? enemy.actions[0];
    }

    return randomElement(enemy.actions) ?? enemy.actions[0];
  }

  /**
   * Modo balanceado - escolhe com pesos baseado na situação
   */
  private static balancedMode(enemy: Enemy, state: GameState): EnemyAction {
    const hpPercentage = enemy.hp / enemy.maxHp;
    const playerHpPercentage = state.player.hp / state.player.maxHp;

    const attacks = enemy.actions.filter(a => a.type === 'attack');
    const defenses = enemy.actions.filter(a => a.type === 'defend');
    const buffs = enemy.actions.filter(a => a.type === 'buff');
    const debuffs = enemy.actions.filter(a => a.type === 'debuff');

    // Calcula pesos baseados na situação
    const weights: { action: EnemyAction; weight: number }[] = [];

    // Ataques - maior peso se jogador tem pouca vida
    attacks.forEach(a => {
      let weight = 10;
      if (playerHpPercentage < 0.3) weight += 10;
      weights.push({ action: a, weight });
    });

    // Defesas - maior peso se inimigo tem pouca vida
    defenses.forEach(a => {
      let weight = 5;
      if (hpPercentage < 0.4) weight += 15;
      weights.push({ action: a, weight });
    });

    // Buffs - peso moderado
    buffs.forEach(a => {
      weights.push({ action: a, weight: 5 });
    });

    // Debuffs - maior peso se jogador está forte
    debuffs.forEach(a => {
      let weight = 3;
      if (playerHpPercentage > 0.7) weight += 5;
      weights.push({ action: a, weight });
    });

    if (weights.length === 0) {
      return randomElement(enemy.actions) ?? enemy.actions[0];
    }

    const actions = weights.map(w => w.action);
    const actionWeights = weights.map(w => w.weight);

    return weightedRandom(actions, actionWeights);
  }

  /**
   * Modo aleatório - escolhe qualquer ação
   */
  private static randomAction(enemy: Enemy): EnemyAction {
    return randomElement(enemy.actions) ?? enemy.actions[0];
  }

  /**
   * Aplica a ação escolhida ao estado do jogo
   */
  private static applyAction(state: GameState, action: EnemyAction): GameState {
    if (!state.enemy) return state;

    switch (action.type) {
      case 'attack':
        return CardEngine.applyDamageToPlayer(state, action.value);

      case 'defend':
        return CardEngine.applyArmorToEnemy(state, action.value);

      case 'buff':
        return {
          ...state,
          enemy: {
            ...state.enemy,
            attackPower: state.enemy.attackPower + action.value
          }
        };

      case 'debuff':
        // Aplica vulnerabilidade ao jogador
        return {
          ...state,
          player: {
            ...state.player,
            statusEffects: [
              ...state.player.statusEffects,
              {
                type: 'vulnerable',
                value: action.value,
                duration: 2,
                description: 'Recebe mais dano'
              }
            ]
          }
        };

      default:
        return state;
    }
  }

  /**
   * Determina a próxima intenção do inimigo (para exibir ao jogador)
   */
  static determineIntent(enemy: Enemy, state: GameState): EnemyAction {
    return this.chooseAction(enemy, state);
  }

  /**
   * Atualiza o inimigo com a próxima intenção
   */
  static updateEnemyIntent(state: GameState): GameState {
    if (!state.enemy) return state;

    const intent = this.determineIntent(state.enemy, state);

    return {
      ...state,
      enemy: {
        ...state.enemy,
        intent
      }
    };
  }
}
