import { useCallback, useMemo } from 'react';

import { MapEngine } from '../game/core';
import { selectCurrentAct, selectTotalGold, useMapStore } from '../game/state';
import type { MapNode } from '../game/types';

export function useMapEngine() {
  // Estado do mapa - usar seletores reativos
  const currentAct = useMapStore(selectCurrentAct);
  const totalGold = useMapStore(selectTotalGold);
  const maps = useMapStore(state => state.maps);

  // Ações
  const startNewRun = useMapStore(state => state.startNewRun);
  const selectNodeAction = useMapStore(state => state.selectNode);
  const completeNodeAction = useMapStore(state => state.completeNode);
  const advanceToNextAct = useMapStore(state => state.advanceToNextAct);
  const addGold = useMapStore(state => state.addGold);
  const spendGold = useMapStore(state => state.spendGold);

  // Computed - usar useMemo para reatividade
  const currentMap = useMemo(() => {
    return maps.find(m => m.act === currentAct) ?? null;
  }, [maps, currentAct]);

  const currentNode = useMemo(() => {
    if (!currentMap) return null;
    return MapEngine.getCurrentNode(currentMap);
  }, [currentMap]);

  const availableNodes = useMemo(() => {
    if (!currentMap) return [];
    return MapEngine.getAvailableNodes(currentMap);
  }, [currentMap]);

  const isMapCompleted = currentMap?.bossDefeated ?? false;
  const hasStarted = currentMap !== null;

  // Handlers
  const handleStartNewRun = useCallback(
    (actId?: number) => {
      startNewRun(actId);
    },
    [startNewRun]
  );

  const handleSelectNode = useCallback(
    (node: MapNode) => {
      if (node.status === 'available') {
        selectNodeAction(node.id);
      }
    },
    [selectNodeAction]
  );

  const handleCompleteNode = useCallback(() => {
    completeNodeAction();
  }, [completeNodeAction]);

  const handleAdvanceToNextAct = useCallback(() => {
    advanceToNextAct();
  }, [advanceToNextAct]);

  return {
    // Estado
    currentAct,
    totalGold,
    currentMap,
    currentNode,
    availableNodes,
    isMapCompleted,
    hasStarted,

    // Ações
    startNewRun: handleStartNewRun,
    selectNode: handleSelectNode,
    completeNode: handleCompleteNode,
    advanceToNextAct: handleAdvanceToNextAct,
    addGold,
    spendGold,
  };
}
