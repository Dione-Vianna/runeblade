import { Layout, MapView } from '../../components';
import { GameButton } from '../../components/Buttons';
import type { MapNode } from '../../game/types';
import { useMapEngine } from '../../hooks';
import './MapPage.css';

interface MapPageProps {
  onStartBattle: (node: MapNode) => void;
  onRest?: (node: MapNode) => void;
  onShop?: (node: MapNode) => void;
  onEvent?: (node: MapNode) => void;
  onTreasure?: (node: MapNode) => void;
}

export function MapPage({
  onStartBattle,
  onRest,
  onShop,
  onEvent,
  onTreasure,
}: MapPageProps) {
  const {
    currentMap,
    currentNode,
    totalGold,
    isMapCompleted,
    hasStarted,
    startNewRun,
    selectNode,
    completeNode,
    advanceToNextAct,
  } = useMapEngine();

  const handleNodeSelect = (node: MapNode) => {
    selectNode(node);

    // Redirecionar baseado no tipo de encontro
    switch (node.type) {
      case 'start':
        // Auto-completar o nó inicial
        setTimeout(() => completeNode(), 100);
        break;
      case 'enemy':
      case 'elite':
      case 'boss':
        onStartBattle(node);
        break;
      case 'rest':
        if (onRest) onRest(node);
        else completeNode(); // Auto-completar se não houver handler
        break;
      case 'shop':
        if (onShop) onShop(node);
        else completeNode();
        break;
      case 'event':
        if (onEvent) onEvent(node);
        else completeNode();
        break;
      case 'treasure':
        if (onTreasure) onTreasure(node);
        else completeNode();
        break;
    }
  };

  // Tela inicial - sem jogo iniciado
  if (!hasStarted) {
    return (
      <Layout>
        <div className="map-page map-page--menu">
          <div className="map-page__menu">
            <h1 className="map-page__title">⚔️ RuneBlade ⚔️</h1>
            <p className="map-page__subtitle">Um RPG de Cartas Roguelike</p>

            <div className="map-page__menu-buttons">
              <GameButton variant="primary" onClick={() => startNewRun(1)}>
                🗡️ Nova Jornada
              </GameButton>
            </div>

            <div className="map-page__acts">
              <h3>Atos Disponíveis:</h3>
              <div className="map-page__act-list">
                <div className="map-page__act-item">
                  <span className="map-page__act-icon">🌲</span>
                  <span>Ato 1: Floresta Sombria</span>
                </div>
                <div className="map-page__act-item map-page__act-item--locked">
                  <span className="map-page__act-icon">🏔️</span>
                  <span>Ato 2: Montanhas Gélidas</span>
                  <span className="map-page__lock">🔒</span>
                </div>
                <div className="map-page__act-item map-page__act-item--locked">
                  <span className="map-page__act-icon">🏰</span>
                  <span>Ato 3: Fortaleza das Trevas</span>
                  <span className="map-page__lock">🔒</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Mapa completado
  if (isMapCompleted) {
    return (
      <Layout>
        <div className="map-page map-page--victory">
          <div className="map-page__victory">
            <h1 className="map-page__victory-title">🏆 Ato Completado!</h1>
            <p className="map-page__victory-text">
              Você derrotou o chefe e conquistou esta região!
            </p>
            <div className="map-page__victory-stats">
              <div className="map-page__stat">
                <span className="map-page__stat-icon">💰</span>
                <span className="map-page__stat-value">{totalGold}</span>
                <span className="map-page__stat-label">Ouro Total</span>
              </div>
            </div>
            <div className="map-page__victory-buttons">
              <GameButton variant="primary" onClick={advanceToNextAct}>
                ➡️ Próximo Ato
              </GameButton>
              <GameButton variant="secondary" onClick={() => startNewRun(1)}>
                🔄 Recomeçar
              </GameButton>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Mapa normal
  return (
    <Layout>
      <div className="map-page">
        <div className="map-page__header">
          <div className="map-page__gold">
            <span className="map-page__gold-icon">💰</span>
            <span className="map-page__gold-value">{totalGold}</span>
          </div>
        </div>

        {currentMap && (
          <MapView map={currentMap} onSelectNode={handleNodeSelect} />
        )}

        {currentNode && (
          <div className="map-page__current-node">
            <span>Nó atual: {currentNode.type}</span>
          </div>
        )}
      </div>
    </Layout>
  );
}
