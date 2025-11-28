import type { Card, GameState } from '../types';
import { calculateDamage, calculateHealing } from '../utils';

// ==================== CARTAS DE ATAQUE ====================

const basicAttack: Card = {
  id: 'attack-basic',
  name: 'Golpe',
  type: 'attack',
  rarity: 'common',
  cost: 1,
  value: 6,
  description: 'Causa 6 de dano.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const { armorDamage, hpDamage } = calculateDamage(
      6,
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
};

const heavyStrike: Card = {
  id: 'attack-heavy',
  name: 'Golpe Pesado',
  type: 'attack',
  rarity: 'common',
  cost: 2,
  value: 12,
  description: 'Causa 12 de dano.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const { armorDamage, hpDamage } = calculateDamage(
      12,
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
};

const quickSlash: Card = {
  id: 'attack-quick',
  name: 'Corte Rápido',
  type: 'attack',
  rarity: 'uncommon',
  cost: 1,
  value: 4,
  description: 'Causa 4 de dano duas vezes.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    let enemy = { ...state.enemy };

    for (let i = 0; i < 2; i++) {
      const { armorDamage, hpDamage } = calculateDamage(
        4,
        enemy.armor,
        state.config.damageMultiplier
      );
      enemy = {
        ...enemy,
        armor: enemy.armor - armorDamage,
        hp: Math.max(0, enemy.hp - hpDamage)
      };
    }

    return { ...state, enemy };
  }
};

const piercingBlow: Card = {
  id: 'attack-piercing',
  name: 'Golpe Perfurante',
  type: 'attack',
  rarity: 'rare',
  cost: 2,
  value: 8,
  description: 'Causa 8 de dano. Ignora armadura.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const damage = Math.floor(8 * state.config.damageMultiplier);

    return {
      ...state,
      enemy: {
        ...state.enemy,
        hp: Math.max(0, state.enemy.hp - damage)
      }
    };
  }
};

const ragingBlow: Card = {
  id: 'attack-raging',
  name: 'Golpe Furioso',
  type: 'attack',
  rarity: 'epic',
  cost: 3,
  value: 20,
  description: 'Causa 20 de dano.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const { armorDamage, hpDamage } = calculateDamage(
      20,
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
};

// ==================== CARTAS DE DEFESA ====================

const basicDefense: Card = {
  id: 'defense-basic',
  name: 'Defender',
  type: 'defense',
  rarity: 'common',
  cost: 1,
  value: 5,
  description: 'Ganha 5 de armadura.',
  effect: (state: GameState): GameState => {
    return {
      ...state,
      player: {
        ...state.player,
        armor: state.player.armor + 5
      }
    };
  }
};

const ironWall: Card = {
  id: 'defense-iron-wall',
  name: 'Muralha de Ferro',
  type: 'defense',
  rarity: 'uncommon',
  cost: 2,
  value: 12,
  description: 'Ganha 12 de armadura.',
  effect: (state: GameState): GameState => {
    return {
      ...state,
      player: {
        ...state.player,
        armor: state.player.armor + 12
      }
    };
  }
};

const shieldBash: Card = {
  id: 'defense-shield-bash',
  name: 'Golpe de Escudo',
  type: 'defense',
  rarity: 'rare',
  cost: 2,
  value: 8,
  description: 'Ganha 8 de armadura e causa 8 de dano.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const { armorDamage, hpDamage } = calculateDamage(
      8,
      state.enemy.armor,
      state.config.damageMultiplier
    );

    return {
      ...state,
      player: {
        ...state.player,
        armor: state.player.armor + 8
      },
      enemy: {
        ...state.enemy,
        armor: state.enemy.armor - armorDamage,
        hp: Math.max(0, state.enemy.hp - hpDamage)
      }
    };
  }
};

// ==================== CARTAS DE MAGIA ====================

const fireball: Card = {
  id: 'magic-fireball',
  name: 'Bola de Fogo',
  type: 'magic',
  rarity: 'uncommon',
  cost: 2,
  value: 10,
  description: 'Causa 10 de dano mágico.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const damage = Math.floor(10 * state.config.damageMultiplier);

    return {
      ...state,
      enemy: {
        ...state.enemy,
        hp: Math.max(0, state.enemy.hp - damage)
      }
    };
  }
};

const healingLight: Card = {
  id: 'magic-heal',
  name: 'Luz Curativa',
  type: 'magic',
  rarity: 'uncommon',
  cost: 2,
  value: 8,
  description: 'Restaura 8 de vida.',
  effect: (state: GameState): GameState => {
    const healing = calculateHealing(
      8,
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
};

const lightning: Card = {
  id: 'magic-lightning',
  name: 'Relâmpago',
  type: 'magic',
  rarity: 'rare',
  cost: 3,
  value: 15,
  description: 'Causa 15 de dano mágico.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const damage = Math.floor(15 * state.config.damageMultiplier);

    return {
      ...state,
      enemy: {
        ...state.enemy,
        hp: Math.max(0, state.enemy.hp - damage)
      }
    };
  }
};

const arcaneBlast: Card = {
  id: 'magic-arcane-blast',
  name: 'Explosão Arcana',
  type: 'magic',
  rarity: 'epic',
  cost: 4,
  value: 25,
  description: 'Causa 25 de dano mágico.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const damage = Math.floor(25 * state.config.damageMultiplier);

    return {
      ...state,
      enemy: {
        ...state.enemy,
        hp: Math.max(0, state.enemy.hp - damage)
      }
    };
  }
};

// ==================== CARTAS DE BUFF ====================

const battleCry: Card = {
  id: 'buff-battle-cry',
  name: 'Grito de Guerra',
  type: 'buff',
  rarity: 'uncommon',
  cost: 1,
  value: 2,
  description: 'Ganha Força +2 por 3 turnos.',
  effect: (state: GameState): GameState => {
    const newEffect = {
      type: 'strength' as const,
      value: 2,
      duration: 3,
      description: 'Dano aumentado em 2'
    };

    return {
      ...state,
      player: {
        ...state.player,
        statusEffects: [...state.player.statusEffects, newEffect]
      }
    };
  }
};

const regenerate: Card = {
  id: 'buff-regenerate',
  name: 'Regeneração',
  type: 'buff',
  rarity: 'rare',
  cost: 2,
  value: 3,
  description: 'Regenera 3 de vida por turno por 3 turnos.',
  effect: (state: GameState): GameState => {
    const newEffect = {
      type: 'regeneration' as const,
      value: 3,
      duration: 3,
      description: 'Regenera 3 de vida por turno'
    };

    return {
      ...state,
      player: {
        ...state.player,
        statusEffects: [...state.player.statusEffects, newEffect]
      }
    };
  }
};

// ==================== CARTAS DE DEBUFF ====================

const poison: Card = {
  id: 'debuff-poison',
  name: 'Veneno',
  type: 'debuff',
  rarity: 'uncommon',
  cost: 1,
  value: 3,
  description: 'Aplica Veneno (3 dano por turno, 3 turnos).',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const newEffect = {
      type: 'poison' as const,
      value: 3,
      duration: 3,
      description: 'Recebe 3 de dano por turno'
    };

    return {
      ...state,
      enemy: {
        ...state.enemy,
        statusEffects: [...state.enemy.statusEffects, newEffect]
      }
    };
  }
};

const weaken: Card = {
  id: 'debuff-weaken',
  name: 'Enfraquecer',
  type: 'debuff',
  rarity: 'uncommon',
  cost: 1,
  value: 2,
  description: 'Aplica Fraqueza (dano reduzido) por 2 turnos.',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const newEffect = {
      type: 'weakness' as const,
      value: 2,
      duration: 2,
      description: 'Dano reduzido'
    };

    return {
      ...state,
      enemy: {
        ...state.enemy,
        statusEffects: [...state.enemy.statusEffects, newEffect]
      }
    };
  }
};

const bleed: Card = {
  id: 'debuff-bleed',
  name: 'Sangramento',
  type: 'debuff',
  rarity: 'rare',
  cost: 2,
  value: 4,
  description: 'Aplica Sangramento (4 dano por turno, 4 turnos).',
  effect: (state: GameState): GameState => {
    if (!state.enemy) return state;

    const newEffect = {
      type: 'bleed' as const,
      value: 4,
      duration: 4,
      description: 'Recebe 4 de dano por turno'
    };

    return {
      ...state,
      enemy: {
        ...state.enemy,
        statusEffects: [...state.enemy.statusEffects, newEffect]
      }
    };
  }
};

// ==================== EXPORTAÇÕES ====================

export const allCards: Card[] = [
  // Ataques
  basicAttack,
  heavyStrike,
  quickSlash,
  piercingBlow,
  ragingBlow,
  // Defesas
  basicDefense,
  ironWall,
  shieldBash,
  // Magias
  fireball,
  healingLight,
  lightning,
  arcaneBlast,
  // Buffs
  battleCry,
  regenerate,
  // Debuffs
  poison,
  weaken,
  bleed
];

export const starterDeck: Card[] = [
  basicAttack,
  basicAttack,
  basicAttack,
  basicAttack,
  basicDefense,
  basicDefense,
  basicDefense,
  basicDefense,
  heavyStrike,
  healingLight
];

export function getCardById(id: string): Card | undefined {
  return allCards.find(card => card.id === id);
}

export function getCardsByType(type: Card['type']): Card[] {
  return allCards.filter(card => card.type === type);
}

export function getCardsByRarity(rarity: Card['rarity']): Card[] {
  return allCards.filter(card => card.rarity === rarity);
}
