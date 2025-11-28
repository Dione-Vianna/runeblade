import type { CardInstance } from '../../game/types';
import './Card.css';

interface CardProps {
  card: CardInstance;
  onClick?: (card: CardInstance) => void;
  disabled?: boolean;
  isPlayable?: boolean;
}

export function Card({ card, onClick, disabled = false, isPlayable = true }: CardProps) {
  const handleClick = () => {
    if (!disabled && isPlayable && onClick) {
      onClick(card);
    }
  };

  const getTypeColor = () => {
    switch (card.type) {
      case 'attack': return 'card--attack';
      case 'defense': return 'card--defense';
      case 'magic': return 'card--magic';
      case 'buff': return 'card--buff';
      case 'debuff': return 'card--debuff';
      default: return '';
    }
  };

  const getRarityClass = () => {
    switch (card.rarity) {
      case 'common': return 'card--common';
      case 'uncommon': return 'card--uncommon';
      case 'rare': return 'card--rare';
      case 'epic': return 'card--epic';
      case 'legendary': return 'card--legendary';
      default: return '';
    }
  };

  const getTypeIcon = () => {
    switch (card.type) {
      case 'attack': return '⚔️';
      case 'defense': return '🛡️';
      case 'magic': return '✨';
      case 'buff': return '⬆️';
      case 'debuff': return '⬇️';
      default: return '❓';
    }
  };

  return (
    <div
      className={`card ${getTypeColor()} ${getRarityClass()} ${disabled ? 'card--disabled' : ''} ${!isPlayable ? 'card--unplayable' : ''}`}
      onClick={handleClick}
    >
      <div className="card__header">
        <span className="card__cost">{card.cost}</span>
        <span className="card__type-icon">{getTypeIcon()}</span>
      </div>

      <div className="card__name">{card.name}</div>

      <div className="card__value">{card.value}</div>

      <div className="card__description">{card.description}</div>

      <div className="card__footer">
        <span className="card__rarity">{card.rarity}</span>
      </div>
    </div>
  );
}
