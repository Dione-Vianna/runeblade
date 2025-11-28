import type {
  Act,
  EncounterType,
  GameMap,
  MapGenerationConfig,
  MapNode,
  MapPath,
  MapReward,
} from '../types';
import { chance, generateId, randomElement, randomInt, weightedRandom } from '../utils';

const DEFAULT_CONFIG: MapGenerationConfig = {
  rows: 7,
  nodesPerRow: { min: 2, max: 4 },
  encounterWeights: {
    enemy: 50,
    elite: 10,
    rest: 12,
    shop: 8,
    event: 15,
    treasure: 5,
    boss: 0, // Boss é sempre a última linha
    start: 0, // Start é sempre a primeira linha
  },
  eliteMinRow: 2,
  restMinRow: 2,
  guaranteedShop: true,
};

export class MapEngine {
  /**
   * Gera um mapa completo para um ato
   */
  static generateMap(act: Act, config: Partial<MapGenerationConfig> = {}): GameMap {
    const finalConfig: MapGenerationConfig = {
      ...DEFAULT_CONFIG,
      rows: act.nodeCount,
      nodesPerRow: act.nodesPerRow,
      ...config,
    };

    const nodes: MapNode[] = [];
    const paths: MapPath[] = [];

    // Gerar nós por linha
    for (let row = 0; row < finalConfig.rows; row++) {
      const isStartRow = row === 0;
      const isBossRow = row === finalConfig.rows - 1;
      const isPreBossRow = row === finalConfig.rows - 2;

      let nodesInRow: number;

      if (isStartRow || isBossRow) {
        nodesInRow = 1;
      } else if (isPreBossRow) {
        nodesInRow = randomInt(2, 3); // Menos nós antes do boss
      } else {
        nodesInRow = randomInt(finalConfig.nodesPerRow.min, finalConfig.nodesPerRow.max);
      }

      const rowNodes: MapNode[] = [];

      for (let col = 0; col < nodesInRow; col++) {
        const encounterType = this.determineEncounterType(
          row,
          finalConfig,
          isStartRow,
          isBossRow
        );

        const node: MapNode = {
          id: generateId(),
          type: encounterType,
          row,
          column: col,
          x: this.calculateNodeX(col, nodesInRow),
          y: this.calculateNodeY(row, finalConfig.rows),
          connections: [],
          status: isStartRow ? 'available' : 'locked',
          enemyId: this.getEnemyIdForNode(encounterType, act),
          reward: this.generateReward(encounterType, row, finalConfig.rows),
        };

        rowNodes.push(node);
        nodes.push(node);
      }

      // Conectar com a linha anterior
      if (row > 0) {
        const prevRowNodes = nodes.filter(n => n.row === row - 1);
        this.connectRows(prevRowNodes, rowNodes, paths);
      }
    }

    // Garantir pelo menos uma loja se configurado
    if (finalConfig.guaranteedShop) {
      this.ensureShopExists(nodes, finalConfig);
    }

    return {
      id: generateId(),
      name: act.name,
      act: act.id,
      nodes,
      paths,
      currentNodeId: null,
      completedNodeIds: [],
      bossDefeated: false,
    };
  }

  /**
   * Determina o tipo de encontro para um nó
   */
  private static determineEncounterType(
    row: number,
    config: MapGenerationConfig,
    isStart: boolean,
    isBoss: boolean
  ): EncounterType {
    if (isStart) return 'start';
    if (isBoss) return 'boss';

    // Filtrar tipos disponíveis baseado na linha
    const availableTypes: EncounterType[] = ['enemy', 'event', 'treasure'];
    const weights: number[] = [
      config.encounterWeights.enemy,
      config.encounterWeights.event,
      config.encounterWeights.treasure,
    ];

    if (row >= config.eliteMinRow) {
      availableTypes.push('elite');
      weights.push(config.encounterWeights.elite);
    }

    if (row >= config.restMinRow) {
      availableTypes.push('rest');
      weights.push(config.encounterWeights.rest);
    }

    if (row >= 1) {
      availableTypes.push('shop');
      weights.push(config.encounterWeights.shop);
    }

    return weightedRandom(availableTypes, weights);
  }

  /**
   * Obtém o ID do inimigo para um nó de batalha
   */
  private static getEnemyIdForNode(type: EncounterType, act: Act): string | undefined {
    switch (type) {
      case 'enemy':
        return randomElement(act.enemyPool);
      case 'elite':
        return randomElement(act.elitePool);
      case 'boss':
        return act.bossId;
      default:
        return undefined;
    }
  }

  /**
   * Gera recompensa para um nó
   */
  private static generateReward(
    type: EncounterType,
    row: number,
    totalRows: number
  ): MapReward | undefined {
    const progress = row / totalRows;

    switch (type) {
      case 'enemy':
        return {
          gold: randomInt(10, 20) + Math.floor(progress * 10),
          cardChoices: 3,
        };
      case 'elite':
        return {
          gold: randomInt(25, 40) + Math.floor(progress * 15),
          cardChoices: 3,
        };
      case 'boss':
        return {
          gold: randomInt(50, 80),
          cardChoices: 3,
          maxHpBonus: 5,
        };
      case 'treasure':
        return {
          gold: randomInt(30, 50),
          cardChoices: chance(0.5) ? 1 : 0,
        };
      case 'rest':
        return {
          healing: 30, // Porcentagem do HP máximo
        };
      default:
        return undefined;
    }
  }

  /**
   * Calcula posição X do nó (0-100%)
   */
  private static calculateNodeX(column: number, totalInRow: number): number {
    if (totalInRow === 1) return 50;
    const spacing = 80 / (totalInRow - 1);
    return 10 + column * spacing;
  }

  /**
   * Calcula posição Y do nó (0-100%)
   */
  private static calculateNodeY(row: number, totalRows: number): number {
    return 90 - (row / (totalRows - 1)) * 80;
  }

  /**
   * Conecta duas linhas de nós
   */
  private static connectRows(
    prevRow: MapNode[],
    currentRow: MapNode[],
    paths: MapPath[]
  ): void {
    // Cada nó da linha anterior deve ter pelo menos uma conexão
    for (const prevNode of prevRow) {
      // Encontrar nós próximos na linha atual
      const nearbyNodes = currentRow.filter(node => {
        const distance = Math.abs(
          this.calculateNodeX(node.column, currentRow.length) -
          this.calculateNodeX(prevNode.column, prevRow.length)
        );
        return distance <= 40; // Máximo 40% de distância
      });

      if (nearbyNodes.length === 0) {
        // Se não há nós próximos, conectar ao mais próximo
        const closest = currentRow.reduce((a, b) =>
          Math.abs(a.x - prevNode.x) < Math.abs(b.x - prevNode.x) ? a : b
        );
        prevNode.connections.push(closest.id);
        paths.push({ from: prevNode.id, to: closest.id });
      } else {
        // Conectar a 1-2 nós próximos
        const connectCount = Math.min(nearbyNodes.length, randomInt(1, 2));
        const toConnect = nearbyNodes.slice(0, connectCount);

        for (const node of toConnect) {
          if (!prevNode.connections.includes(node.id)) {
            prevNode.connections.push(node.id);
            paths.push({ from: prevNode.id, to: node.id });
          }
        }
      }
    }

    // Garantir que cada nó da linha atual tenha pelo menos uma conexão de entrada
    for (const currentNode of currentRow) {
      const hasIncoming = prevRow.some(prev => prev.connections.includes(currentNode.id));

      if (!hasIncoming) {
        // Encontrar nó mais próximo na linha anterior
        const closest = prevRow.reduce((a, b) =>
          Math.abs(a.x - currentNode.x) < Math.abs(b.x - currentNode.x) ? a : b
        );

        if (!closest.connections.includes(currentNode.id)) {
          closest.connections.push(currentNode.id);
          paths.push({ from: closest.id, to: currentNode.id });
        }
      }
    }
  }

  /**
   * Garante que existe pelo menos uma loja no mapa
   */
  private static ensureShopExists(nodes: MapNode[], config: MapGenerationConfig): void {
    const hasShop = nodes.some(n => n.type === 'shop');

    if (!hasShop) {
      // Encontrar um nó no meio do mapa para transformar em loja
      const middleRow = Math.floor(config.rows / 2);
      const candidates = nodes.filter(
        n => n.row === middleRow && n.type === 'enemy'
      );

      if (candidates.length > 0) {
        const nodeToConvert = randomElement(candidates);
        if (nodeToConvert) {
          nodeToConvert.type = 'shop';
          nodeToConvert.enemyId = undefined;
        }
      }
    }
  }

  /**
   * Retorna os nós disponíveis para movimento
   */
  static getAvailableNodes(map: GameMap): MapNode[] {
    return map.nodes.filter(n => n.status === 'available');
  }

  /**
   * Move para um nó e atualiza o estado do mapa
   */
  static moveToNode(map: GameMap, nodeId: string): GameMap {
    const targetNode = map.nodes.find(n => n.id === nodeId);

    if (!targetNode || targetNode.status !== 'available') {
      return map;
    }

    // Atualizar status dos nós
    const updatedNodes = map.nodes.map(node => {
      if (node.id === nodeId) {
        return { ...node, status: 'current' as const };
      }
      if (node.status === 'available' || node.status === 'current') {
        return { ...node, status: 'locked' as const };
      }
      return node;
    });

    return {
      ...map,
      nodes: updatedNodes,
      currentNodeId: nodeId,
    };
  }

  /**
   * Completa o nó atual e desbloqueia os próximos
   */
  static completeCurrentNode(map: GameMap): GameMap {
    if (!map.currentNodeId) return map;

    const currentNode = map.nodes.find(n => n.id === map.currentNodeId);
    if (!currentNode) return map;

    const isBoss = currentNode.type === 'boss';

    // Atualizar status dos nós
    const updatedNodes = map.nodes.map(node => {
      if (node.id === map.currentNodeId) {
        return { ...node, status: 'completed' as const };
      }
      // Desbloquear nós conectados
      if (currentNode.connections.includes(node.id)) {
        return { ...node, status: 'available' as const };
      }
      return node;
    });

    return {
      ...map,
      nodes: updatedNodes,
      currentNodeId: null,
      completedNodeIds: [...map.completedNodeIds, map.currentNodeId],
      bossDefeated: isBoss,
    };
  }

  /**
   * Verifica se o mapa foi completado
   */
  static isMapCompleted(map: GameMap): boolean {
    return map.bossDefeated;
  }

  /**
   * Retorna o nó atual
   */
  static getCurrentNode(map: GameMap): MapNode | null {
    if (!map.currentNodeId) return null;
    return map.nodes.find(n => n.id === map.currentNodeId) ?? null;
  }

  /**
   * Retorna ícone para o tipo de encontro
   */
  static getEncounterIcon(type: EncounterType): string {
    switch (type) {
      case 'start':
        return '🏠';
      case 'enemy':
        return '👹';
      case 'elite':
        return '💀';
      case 'boss':
        return '👑';
      case 'rest':
        return '🔥';
      case 'shop':
        return '🛒';
      case 'event':
        return '❓';
      case 'treasure':
        return '💎';
      default:
        return '❓';
    }
  }

  /**
   * Retorna nome para o tipo de encontro
   */
  static getEncounterName(type: EncounterType): string {
    switch (type) {
      case 'start':
        return 'Início';
      case 'enemy':
        return 'Inimigo';
      case 'elite':
        return 'Elite';
      case 'boss':
        return 'Chefe';
      case 'rest':
        return 'Descanso';
      case 'shop':
        return 'Loja';
      case 'event':
        return 'Evento';
      case 'treasure':
        return 'Tesouro';
      default:
        return 'Desconhecido';
    }
  }
}
