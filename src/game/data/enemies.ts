import type { Enemy, EnemyAction } from '../types';

// ==================== AÇÕES DOS INIMIGOS ====================

const goblinActions: EnemyAction[] = [
  { type: 'attack', value: 5, description: 'Golpe fraco' },
  { type: 'attack', value: 8, description: 'Mordida' },
  { type: 'defend', value: 3, description: 'Esquivar' }
];

const orcActions: EnemyAction[] = [
  { type: 'attack', value: 10, description: 'Golpe de machado' },
  { type: 'attack', value: 15, description: 'Investida' },
  { type: 'defend', value: 8, description: 'Postura defensiva' },
  { type: 'buff', value: 3, description: 'Fúria' }
];

const skeletonActions: EnemyAction[] = [
  { type: 'attack', value: 6, description: 'Golpe de osso' },
  { type: 'attack', value: 4, description: 'Arranhar' },
  { type: 'debuff', value: 2, description: 'Toque gélido' }
];

const darkKnightActions: EnemyAction[] = [
  { type: 'attack', value: 12, description: 'Golpe sombrio' },
  { type: 'attack', value: 18, description: 'Lâmina das trevas' },
  { type: 'defend', value: 15, description: 'Escudo sombrio' },
  { type: 'buff', value: 5, description: 'Poder das trevas' },
  { type: 'debuff', value: 3, description: 'Maldição' }
];

const dragonActions: EnemyAction[] = [
  { type: 'attack', value: 15, description: 'Mordida' },
  { type: 'attack', value: 25, description: 'Sopro de fogo' },
  { type: 'attack', value: 30, description: 'Investida devastadora' },
  { type: 'defend', value: 20, description: 'Escamas de aço' },
  { type: 'buff', value: 5, description: 'Fúria draconiana' }
];

// ==================== INIMIGOS ====================

const goblin: Enemy = {
  id: 'goblin',
  name: 'Goblin',
  hp: 25,
  maxHp: 25,
  armor: 0,
  behavior: 'aggressive',
  attackPower: 5,
  statusEffects: [],
  intent: null,
  actions: goblinActions
};

const orc: Enemy = {
  id: 'orc',
  name: 'Orc Guerreiro',
  hp: 45,
  maxHp: 45,
  armor: 5,
  behavior: 'balanced',
  attackPower: 10,
  statusEffects: [],
  intent: null,
  actions: orcActions
};

const skeleton: Enemy = {
  id: 'skeleton',
  name: 'Esqueleto',
  hp: 20,
  maxHp: 20,
  armor: 0,
  behavior: 'random',
  attackPower: 6,
  statusEffects: [],
  intent: null,
  actions: skeletonActions
};

const darkKnight: Enemy = {
  id: 'dark-knight',
  name: 'Cavaleiro das Trevas',
  hp: 70,
  maxHp: 70,
  armor: 10,
  behavior: 'balanced',
  attackPower: 12,
  statusEffects: [],
  intent: null,
  actions: darkKnightActions
};

const dragon: Enemy = {
  id: 'dragon',
  name: 'Dragão Ancião',
  hp: 150,
  maxHp: 150,
  armor: 20,
  behavior: 'aggressive',
  attackPower: 20,
  statusEffects: [],
  intent: null,
  actions: dragonActions
};

// ==================== EXPORTAÇÕES ====================

export const allEnemies: Enemy[] = [
  goblin,
  orc,
  skeleton,
  darkKnight,
  dragon
];

export const tierEnemies = {
  tier1: [goblin, skeleton],
  tier2: [orc],
  tier3: [darkKnight],
  bosses: [dragon]
};

export function getEnemyById(id: string): Enemy | undefined {
  return allEnemies.find(enemy => enemy.id === id);
}

export function createEnemyInstance(enemy: Enemy): Enemy {
  return {
    ...enemy,
    hp: enemy.maxHp,
    armor: enemy.armor,
    statusEffects: [],
    intent: null
  };
}

export function getRandomEnemy(tier: 'tier1' | 'tier2' | 'tier3' | 'bosses' = 'tier1'): Enemy {
  const enemies = tierEnemies[tier];
  const randomIndex = Math.floor(Math.random() * enemies.length);
  return createEnemyInstance(enemies[randomIndex]);
}
