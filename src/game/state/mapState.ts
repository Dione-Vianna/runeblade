import { create } from 'zustand';

import { MapEngine } from '../core';
import { getActById } from '../data';
import type { GameMap, MapNode, MapState } from '../types';

interface MapStore extends MapState {
  // Ações
  startNewRun: (actId?: number) => void;
  selectNode: (nodeId: string) => void;
  completeNode: () => void;
  advanceToNextAct: () => void;
  getCurrentMap: () => GameMap | null;
  getCurrentNode: () => MapNode | null;
  getAvailableNodes: () => MapNode[];
  addGold: (amount: number) => void;
  spendGold: (amount: number) => boolean;
}

export const useMapStore = create<MapStore>((set, get) => ({
  // Estado inicial
  currentAct: 1,
  maps: [],
  unlockedActs: [1],
  totalGold: 0,

  // Ações
  startNewRun: (actId = 1) => {
    const act = getActById(actId);
    if (!act) return;

    const newMap = MapEngine.generateMap(act);

    set({
      currentAct: actId,
      maps: [newMap],
      totalGold: 0,
    });
  },

  selectNode: (nodeId: string) => {
    const currentMap = get().getCurrentMap();
    if (!currentMap) return;

    const updatedMap = MapEngine.moveToNode(currentMap, nodeId);

    set(state => ({
      maps: state.maps.map(m => (m.id === currentMap.id ? updatedMap : m)),
    }));
  },

  completeNode: () => {
    const currentMap = get().getCurrentMap();
    if (!currentMap) return;

    const currentNode = MapEngine.getCurrentNode(currentMap);
    if (currentNode?.reward?.gold) {
      get().addGold(currentNode.reward.gold);
    }

    const updatedMap = MapEngine.completeCurrentNode(currentMap);

    set(state => ({
      maps: state.maps.map(m => (m.id === currentMap.id ? updatedMap : m)),
    }));
  },

  advanceToNextAct: () => {
    const nextActId = get().currentAct + 1;
    const nextAct = getActById(nextActId);

    if (!nextAct) {
      // Jogo completado!
      return;
    }

    const newMap = MapEngine.generateMap(nextAct);

    set(state => ({
      currentAct: nextActId,
      maps: [...state.maps, newMap],
      unlockedActs: state.unlockedActs.includes(nextActId)
        ? state.unlockedActs
        : [...state.unlockedActs, nextActId],
    }));
  },

  getCurrentMap: () => {
    const { maps, currentAct } = get();
    return maps.find(m => m.act === currentAct) ?? null;
  },

  getCurrentNode: () => {
    const currentMap = get().getCurrentMap();
    if (!currentMap) return null;
    return MapEngine.getCurrentNode(currentMap);
  },

  getAvailableNodes: () => {
    const currentMap = get().getCurrentMap();
    if (!currentMap) return [];
    return MapEngine.getAvailableNodes(currentMap);
  },

  addGold: (amount: number) => {
    set(state => ({
      totalGold: state.totalGold + amount,
    }));
  },

  spendGold: (amount: number) => {
    const { totalGold } = get();
    if (totalGold < amount) return false;

    set(state => ({
      totalGold: state.totalGold - amount,
    }));
    return true;
  },
}));

// Seletores
export const selectCurrentAct = (state: MapStore) => state.currentAct;
export const selectTotalGold = (state: MapStore) => state.totalGold;
export const selectUnlockedActs = (state: MapStore) => state.unlockedActs;
