import type { CardInstance } from '../../game/types';
import { Card } from '../Card';
import './Hand.css';

interface HandProps {
  cards: CardInstance[];
  onPlayCard: (card: CardInstance) => void;
  canPlayCard: (card: CardInstance) => boolean;
  disabled?: boolean;
  playingCardId?: string | null;
  flyTarget?: 'enemy' | 'self' | null;
}

export function Hand({ cards, onPlayCard, canPlayCard, disabled = false, playingCardId, flyTarget }: HandProps) {
  const total = cards.length;
  const stepDeg = total > 6 ? 2.5 : 4;

  return (
    <div className="hand">
      <div className="hand__cards">
        {cards.map((card, index) => {
          const rotation = (index - (total - 1) / 2) * stepDeg;
          const yOffset = Math.abs(rotation) * 2;
          return (
          <div
            key={card.instanceId}
            className={`hand__card${card.instanceId === playingCardId ? flyTarget === 'enemy' ? ' hand__card--fly-to-enemy' : ' hand__card--fly-to-self' : ''}`}
            style={{
              '--rotation': `${rotation}deg`,
              '--y-offset': `${yOffset}px`,
            } as React.CSSProperties}
          >
            <Card
              card={card}
              onClick={onPlayCard}
              disabled={disabled}
              isPlayable={canPlayCard(card)}
            />
          </div>
          );
        })}
      </div>
      {cards.length === 0 && (
        <div className="hand__empty">Sem cartas na mão</div>
      )}
    </div>
  );
}
