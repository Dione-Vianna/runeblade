import type { CardInstance, GameState, StatusEffect } from '../types';
import { calculateDamage, calculateHealing } from '../utils';

export class CardEngine {
  /**
   * Aplica o efeito de uma carta ao estado do jogo
   */
  static applyCard(card: CardInstance, state: GameState): GameState {
    // Verifica se o jogador tem mana suficiente
    if (state.player.mana < card.cost) {
      return state;
    }

    // Subtrai a mana
    let newState: GameState = {
      ...state,
      player: {
        ...state.player,
        mana: state.player.mana - card.cost
      }
    };

    // Aplica modificadores de força do jogador
    const strengthBuff = state.player.statusEffects
      .filter(e => e.type === 'strength')
      .reduce((sum, e) => sum + e.value, 0);

    // Aplica o efeito da carta com modificadores
    if (card.type === 'attack' && strengthBuff > 0) {
      newState = this.applyAttackWithBonus(card, newState, strengthBuff);
    } else {
      newState = card.effect(newState);
    }

    return newState;
  }

  /**
   * Aplica ataque com bônus de força
   */
  private static applyAttackWithBonus(
    card: CardInstance,
    state: GameState,
    strengthBonus: number
  ): GameState {
    if (!state.enemy) return state;

    const totalDamage = card.value + strengthBonus;
    const { armorDamage, hpDamage } = calculateDamage(
      totalDamage,
      state.enemy.armor,
      state.config.damageMultiplier
    );

    return {
      ...state,
      enemy: {
        ...state.enemy,
        armor: state.enemy.armor - armorDamage,
        hp: Math.max(0, state.enemy.hp - hpDamage)
      }
    };
  }

  /**
   * Aplica dano ao jogador (usado pelo inimigo)
   */
  static applyDamageToPlayer(
    state: GameState,
    damage: number
  ): GameState {
    // Verifica debuff de fraqueza no inimigo
    const weaknessDebuff = state.enemy?.statusEffects
      .filter(e => e.type === 'weakness')
      .reduce((sum, e) => sum + e.value, 0) ?? 0;

    const actualDamage = Math.max(1, damage - weaknessDebuff);

    const { armorDamage, hpDamage } = calculateDamage(
      actualDamage,
      state.player.armor,
      1
    );

    return {
      ...state,
      player: {
        ...state.player,
        armor: state.player.armor - armorDamage,
        hp: Math.max(0, state.player.hp - hpDamage)
      }
    };
  }

  /**
   * Aplica armadura ao inimigo
   */
  static applyArmorToEnemy(state: GameState, armor: number): GameState {
    if (!state.enemy) return state;

    return {
      ...state,
      enemy: {
        ...state.enemy,
        armor: state.enemy.armor + armor
      }
    };
  }

  /**
   * Aplica dano ao inimigo
   */
  static applyDamageToEnemy(state: GameState, damage: number): GameState {
    if (!state.enemy) return state;

    const { armorDamage, hpDamage } = calculateDamage(
      damage,
      state.enemy.armor,
      state.config.damageMultiplier
    );

    return {
      ...state,
      enemy: {
        ...state.enemy,
        armor: state.enemy.armor - armorDamage,
        hp: Math.max(0, state.enemy.hp - hpDamage)
      }
    };
  }

  /**
   * Cura o jogador
   */
  static healPlayer(state: GameState, amount: number): GameState {
    const healing = calculateHealing(
      amount,
      state.player.hp,
      state.player.maxHp,
      state.config.healingMultiplier
    );

    return {
      ...state,
      player: {
        ...state.player,
        hp: state.player.hp + healing
      }
    };
  }

  /**
   * Processa efeitos de status no início do turno
   */
  static processStatusEffects(
    state: GameState,
    target: 'player' | 'enemy'
  ): GameState {
    if (target === 'player') {
      return this.processPlayerStatusEffects(state);
    } else {
      return this.processEnemyStatusEffects(state);
    }
  }

  private static processPlayerStatusEffects(state: GameState): GameState {
    let newHp = state.player.hp;
    const newEffects: StatusEffect[] = [];

    for (const effect of state.player.statusEffects) {
      // Aplica efeito
      switch (effect.type) {
        case 'regeneration':
          newHp = Math.min(state.player.maxHp, newHp + effect.value);
          break;
        case 'poison':
        case 'bleed':
        case 'burn':
          newHp = Math.max(0, newHp - effect.value);
          break;
      }

      // Reduz duração
      if (effect.duration > 1) {
        newEffects.push({
          ...effect,
          duration: effect.duration - 1
        });
      }
    }

    return {
      ...state,
      player: {
        ...state.player,
        hp: newHp,
        statusEffects: newEffects
      }
    };
  }

  private static processEnemyStatusEffects(state: GameState): GameState {
    if (!state.enemy) return state;

    let newHp = state.enemy.hp;
    const newEffects: StatusEffect[] = [];

    for (const effect of state.enemy.statusEffects) {
      // Aplica efeito
      switch (effect.type) {
        case 'poison':
        case 'bleed':
        case 'burn':
          newHp = Math.max(0, newHp - effect.value);
          break;
      }

      // Reduz duração
      if (effect.duration > 1) {
        newEffects.push({
          ...effect,
          duration: effect.duration - 1
        });
      }
    }

    return {
      ...state,
      enemy: {
        ...state.enemy,
        hp: newHp,
        statusEffects: newEffects
      }
    };
  }

  /**
   * Reseta a armadura do jogador no início do turno
   */
  static resetPlayerArmor(state: GameState): GameState {
    return {
      ...state,
      player: {
        ...state.player,
        armor: 0
      }
    };
  }

  /**
   * Reseta a armadura do inimigo no início do turno
   */
  static resetEnemyArmor(state: GameState): GameState {
    if (!state.enemy) return state;

    return {
      ...state,
      enemy: {
        ...state.enemy,
        armor: 0
      }
    };
  }

  /**
   * Restaura a mana do jogador
   */
  static restorePlayerMana(state: GameState): GameState {
    return {
      ...state,
      player: {
        ...state.player,
        mana: state.player.maxMana
      }
    };
  }
}
