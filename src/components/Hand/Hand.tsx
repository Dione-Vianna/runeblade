import type { CardInstance } from '../../game/types';
import { Card } from '../Card';
import './Hand.css';

interface HandProps {
  cards: CardInstance[];
  onPlayCard: (card: CardInstance) => void;
  canPlayCard: (card: CardInstance) => boolean;
  disabled?: boolean;
}

export function Hand({ cards, onPlayCard, canPlayCard, disabled = false }: HandProps) {
  return (
    <div className="hand">
      <div className="hand__cards">
        {cards.map((card, index) => (
          <div
            key={card.instanceId}
            className="hand__card"
            style={{
              '--index': index,
              '--total': cards.length
            } as React.CSSProperties}
          >
            <Card
              card={card}
              onClick={onPlayCard}
              disabled={disabled}
              isPlayable={canPlayCard(card)}
            />
          </div>
        ))}
      </div>
      {cards.length === 0 && (
        <div className="hand__empty">Sem cartas na mão</div>
      )}
    </div>
  );
}
