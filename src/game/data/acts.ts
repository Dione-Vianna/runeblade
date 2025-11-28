import type { Act } from '../types';

/**
 * Definição dos Atos/Fases do jogo
 * Cada ato tem seu próprio pool de inimigos, elite e boss
 */

export const act1: Act = {
  id: 1,
  name: 'Floresta Sombria',
  description: 'Uma floresta antiga habitada por criaturas das trevas.',
  enemyPool: ['goblin', 'skeleton'],
  elitePool: ['orc'],
  bossId: 'dark-knight',
  nodeCount: 7,
  nodesPerRow: { min: 2, max: 4 }
};

export const act2: Act = {
  id: 2,
  name: 'Montanhas Gélidas',
  description: 'Picos congelados onde guerreiros e bestas aguardam.',
  enemyPool: ['orc', 'skeleton'],
  elitePool: ['dark-knight'],
  bossId: 'dragon',
  nodeCount: 8,
  nodesPerRow: { min: 2, max: 4 }
};

export const act3: Act = {
  id: 3,
  name: 'Fortaleza das Trevas',
  description: 'O covil final dos inimigos mais poderosos.',
  enemyPool: ['dark-knight', 'orc'],
  elitePool: ['dragon'],
  bossId: 'dragon', // Dragão Ancião como boss final
  nodeCount: 9,
  nodesPerRow: { min: 3, max: 5 }
};

export const allActs: Act[] = [act1, act2, act3];

export function getActById(id: number): Act | undefined {
  return allActs.find(act => act.id === id);
}
