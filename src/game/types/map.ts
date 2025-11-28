// Tipos de encontros no mapa
export type EncounterType =
  | 'enemy' // Batalha normal
  | 'elite' // Inimigo elite (mais difícil, melhor recompensa)
  | 'boss' // Chefe da fase
  | 'rest' // Fogueira (curar ou melhorar carta)
  | 'shop' // Loja (comprar/remover cartas)
  | 'event' // Evento aleatório
  | 'treasure' // Baú do tesouro
  | 'start'; // Início

export type NodeStatus = 'locked' | 'available' | 'completed' | 'current';

export interface MapNode {
  id: string;
  type: EncounterType;
  row: number; // Linha no mapa (0 = início, max = boss)
  column: number; // Coluna na linha
  x: number; // Posição X para renderização
  y: number; // Posição Y para renderização
  connections: string[]; // IDs dos nós conectados (próxima linha)
  status: NodeStatus;
  enemyId?: string; // ID do inimigo para batalhas
  reward?: MapReward;
}

export interface MapPath {
  from: string;
  to: string;
}

export interface MapReward {
  gold?: number;
  cardChoices?: number; // Quantidade de cartas para escolher
  healing?: number;
  maxHpBonus?: number;
}

export interface GameMap {
  id: string;
  name: string;
  act: number; // Ato/Fase (1, 2, 3...)
  nodes: MapNode[];
  paths: MapPath[];
  currentNodeId: string | null;
  completedNodeIds: string[];
  bossDefeated: boolean;
}

export interface Act {
  id: number;
  name: string;
  description: string;
  background?: string;
  enemyPool: string[]; // IDs de inimigos normais
  elitePool: string[]; // IDs de elites
  bossId: string; // ID do boss
  nodeCount: number; // Quantidade de linhas
  nodesPerRow: { min: number; max: number };
}

export interface MapState {
  currentAct: number;
  maps: GameMap[];
  unlockedActs: number[];
  totalGold: number;
}

// Configuração da geração do mapa
export interface MapGenerationConfig {
  rows: number;
  nodesPerRow: { min: number; max: number };
  encounterWeights: Record<EncounterType, number>;
  eliteMinRow: number; // Elites só aparecem após essa linha
  restMinRow: number; // Fogueiras só aparecem após essa linha
  guaranteedShop: boolean; // Garantir pelo menos uma loja
}
