import { useCallback, useState } from 'react';

import { createEnemyInstance, getEnemyById } from './game/data/enemies';
import { useCollectionStore } from './game/state';
import type { MapNode } from './game/types';
import { useGameEngine, useMapEngine } from './hooks';
import { GamePage, MapPage, ShopPage } from './pages';

type Screen = 'map' | 'battle' | 'rest' | 'shop' | 'event' | 'treasure';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('map');
  const [currentBattleNode, setCurrentBattleNode] = useState<MapNode | null>(null);
  const [currentShopNode, setCurrentShopNode] = useState<MapNode | null>(null);

  const { completeNode, totalGold, addGold, spendGold, currentAct } = useMapEngine();
  const { startGame, isGameOver, isVictory, player } = useGameEngine();
  const { closeShop } = useCollectionStore();

  // Iniciar batalha
  const handleStartBattle = useCallback(
    (node: MapNode) => {
      if (node.enemyId) {
        const enemyTemplate = getEnemyById(node.enemyId);
        if (enemyTemplate) {
          const enemy = createEnemyInstance(enemyTemplate);
          // Iniciar jogo com o inimigo específico
          startGame();
          setCurrentBattleNode(node);
          setCurrentScreen('battle');
        }
      }
    },
    [startGame]
  );

  // Voltar ao mapa após batalha
  const handleReturnToMap = useCallback(() => {
    if (isVictory && currentBattleNode) {
      // Adicionar ouro da recompensa
      if (currentBattleNode.reward?.gold) {
        addGold(currentBattleNode.reward.gold);
      }
      completeNode();
    }
    setCurrentBattleNode(null);
    setCurrentScreen('map');
  }, [isVictory, currentBattleNode, completeNode, addGold]);

  // Abrir loja
  const handleShop = useCallback(
    (node: MapNode) => {
      setCurrentShopNode(node);
      setCurrentScreen('shop');
    },
    []
  );

  // Fechar loja
  const handleCloseShop = useCallback(() => {
    closeShop();
    if (currentShopNode) {
      completeNode();
    }
    setCurrentShopNode(null);
    setCurrentScreen('map');
  }, [closeShop, completeNode, currentShopNode]);

  // Gastar ouro
  const handleSpendGold = useCallback(
    (amount: number): boolean => {
      return spendGold(amount);
    },
    [spendGold]
  );

  // Descanso (curar)
  const handleRest = useCallback(
    (_node: MapNode) => {
      // Por enquanto, auto-completar e curar 30%
      const healAmount = Math.floor(player.maxHp * 0.3);
      console.log(`Descansando... Curando ${healAmount} HP`);
      completeNode();
      setCurrentScreen('map');
    },
    [player.maxHp, completeNode]
  );

  // Tesouro
  const handleTreasure = useCallback(
    (node: MapNode) => {
      // Adicionar ouro do tesouro
      if (node.reward?.gold) {
        addGold(node.reward.gold);
      }
      completeNode();
      setCurrentScreen('map');
    },
    [completeNode, addGold]
  );

  // Evento aleatório
  const handleEvent = useCallback(
    (_node: MapNode) => {
      console.log('Evento aleatório!');
      completeNode();
      setCurrentScreen('map');
    },
    [completeNode]
  );

  // Renderizar tela atual
  if (currentScreen === 'battle') {
    return (
      <GamePage
        onBattleEnd={handleReturnToMap}
        showReturnButton={isGameOver}
      />
    );
  }

  if (currentScreen === 'shop') {
    return (
      <ShopPage
        gold={totalGold}
        actId={currentAct}
        onSpendGold={handleSpendGold}
        onAddGold={addGold}
        onClose={handleCloseShop}
      />
    );
  }

  return (
    <MapPage
      onStartBattle={handleStartBattle}
      onRest={handleRest}
      onShop={handleShop}
      onTreasure={handleTreasure}
      onEvent={handleEvent}
    />
  );
}

export default App;
