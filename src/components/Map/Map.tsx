import { MapEngine } from '../../game/core';
import type { GameMap, MapNode as MapNodeType, MapPath } from '../../game/types';
import './Map.css';

const encounterDescriptions: Record<string, string> = {
  start: 'Ponto de partida',
  enemy: 'Combate contra um monstro',
  elite: 'Combate difícil com recompensa especial',
  boss: 'Chefe do ato — muito perigoso',
  rest: 'Recupere vida ou melhore uma carta',
  shop: 'Compre cartas e relíquias',
  event: 'Encontro misterioso',
  treasure: 'Cofre com recompensas',
};

interface MapNodeProps {
  node: MapNodeType;
  onClick?: (node: MapNodeType) => void;
  isConnected?: boolean;
}

export function MapNode({ node, onClick, isConnected = false }: MapNodeProps) {
  const handleClick = () => {
    if (node.status === 'available' && onClick) {
      onClick(node);
    }
  };

  const icon = MapEngine.getEncounterIcon(node.type);
  const name = MapEngine.getEncounterName(node.type);
  const description = encounterDescriptions[node.type] ?? 'Desconhecido';

  return (
    <div
      className={`map-node map-node--${node.type} map-node--${node.status} ${isConnected ? 'map-node--connected' : ''}`}
      style={{
        left: `${node.x}%`,
        top: `${node.y}%`,
      }}
      onClick={handleClick}
    >
      <div className="map-node__icon">{icon}</div>
      <div className="map-node__pulse" />
      {node.status === 'completed' && (
        <div className="map-node__checkmark">✓</div>
      )}
      <div className="map-node__tooltip">
        <span className="map-node__tooltip-name">{name}</span>
        <span className="map-node__tooltip-desc">{description}</span>
      </div>
    </div>
  );
}

interface MapPathLineProps {
  path: MapPath;
  nodes: MapNodeType[];
}

export function MapPathLine({ path, nodes }: MapPathLineProps) {
  const fromNode = nodes.find(n => n.id === path.from);
  const toNode = nodes.find(n => n.id === path.to);

  if (!fromNode || !toNode) return null;

  const isCompleted = fromNode.status === 'completed';
  const isAvailable = fromNode.status === 'completed' && toNode.status === 'available';

  return (
    <svg className="map-path" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      <line
        x1={`${fromNode.x}%`}
        y1={`${fromNode.y}%`}
        x2={`${toNode.x}%`}
        y2={`${toNode.y}%`}
        className={`map-path__line ${isCompleted ? 'map-path__line--completed' : ''} ${isAvailable ? 'map-path__line--available' : ''}`}
      />
    </svg>
  );
}

interface MapViewProps {
  map: GameMap;
  onSelectNode: (node: MapNodeType) => void;
}

export function MapView({ map, onSelectNode }: MapViewProps) {
  const availableNodeIds = map.nodes
    .filter(n => n.status === 'available')
    .map(n => n.id);

  return (
    <div className="map-view">
      <div className="map-view__header">
        <h2 className="map-view__title">{map.name}</h2>
        <span className="map-view__act">Ato {map.act}</span>
      </div>

      <div className="map-view__container">
        {/* Renderizar caminhos primeiro (abaixo dos nós) */}
        {map.paths.map((path, index) => (
          <MapPathLine key={index} path={path} nodes={map.nodes} />
        ))}

        {/* Renderizar nós */}
        {map.nodes.map(node => (
          <MapNode
            key={node.id}
            node={node}
            onClick={onSelectNode}
            isConnected={availableNodeIds.includes(node.id)}
          />
        ))}
      </div>

      <div className="map-view__legend">
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">👹</span>
          <span>Inimigo</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">💀</span>
          <span>Elite</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">👑</span>
          <span>Chefe</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">🔥</span>
          <span>Descanso</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">🛒</span>
          <span>Loja</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">❓</span>
          <span>Evento</span>
        </div>
        <div className="map-view__legend-item">
          <span className="map-view__legend-icon">💎</span>
          <span>Tesouro</span>
        </div>
      </div>
    </div>
  );
}
