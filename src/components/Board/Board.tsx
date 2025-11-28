import type { CardInstance, Enemy, Player } from '../../game/types';
import { EndTurnButton, RestartButton } from '../Buttons';
import { Hand } from '../Hand';
import { ArmorDisplay, HealthBar, ManaBar, StatusEffects } from '../Status';
import './Board.css';

interface BoardProps {
  player: Player;
  enemy: Enemy | null;
  isPlayerTurn: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  round: number;
  onPlayCard: (card: CardInstance) => void;
  onEndTurn: () => void;
  onRestart: () => void;
  canPlayCard: (card: CardInstance) => boolean;
}

export function Board({
  player,
  enemy,
  isPlayerTurn,
  isGameOver,
  isVictory,
  round,
  onPlayCard,
  onEndTurn,
  onRestart,
  canPlayCard
}: BoardProps) {
  return (
    <div className="board">
      {/* Área do inimigo */}
      <div className="board__enemy-area">
        {enemy && (
          <div className="enemy-panel">
            <div className="enemy-panel__portrait">
              <span className="enemy-panel__emoji">👹</span>
            </div>
            <div className="enemy-panel__info">
              <h2 className="enemy-panel__name">{enemy.name}</h2>
              <HealthBar current={enemy.hp} max={enemy.maxHp} type="health" />
              <div className="enemy-panel__stats">
                <ArmorDisplay armor={enemy.armor} />
                <StatusEffects effects={enemy.statusEffects} />
              </div>
              {enemy.intent && (
                <div className="enemy-panel__intent">
                  <span className="enemy-panel__intent-label">Próxima ação:</span>
                  <span className="enemy-panel__intent-action">
                    {enemy.intent.type === 'attack' && `⚔️ ${enemy.intent.value}`}
                    {enemy.intent.type === 'defend' && `🛡️ ${enemy.intent.value}`}
                    {enemy.intent.type === 'buff' && '⬆️ Buff'}
                    {enemy.intent.type === 'debuff' && '⬇️ Debuff'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Área central - informações do turno */}
      <div className="board__center">
        <div className="turn-info">
          <span className="turn-info__round">Turno {round}</span>
          <span className={`turn-info__current ${isPlayerTurn ? 'turn-info__current--player' : 'turn-info__current--enemy'}`}>
            {isPlayerTurn ? '🎮 Sua vez' : '👹 Turno do inimigo'}
          </span>
        </div>

        {isGameOver && (
          <div className={`game-over ${isVictory ? 'game-over--victory' : 'game-over--defeat'}`}>
            <h2 className="game-over__title">
              {isVictory ? '🏆 Vitória!' : '💀 Derrota'}
            </h2>
            <p className="game-over__message">
              {isVictory
                ? 'Você derrotou o inimigo!'
                : 'Você foi derrotado...'}
            </p>
            <RestartButton onClick={onRestart} />
          </div>
        )}

        {!isGameOver && isPlayerTurn && (
          <EndTurnButton onClick={onEndTurn} disabled={!isPlayerTurn} />
        )}
      </div>

      {/* Área do jogador */}
      <div className="board__player-area">
        <div className="player-panel">
          <div className="player-panel__portrait">
            <span className="player-panel__emoji">🧙</span>
          </div>
          <div className="player-panel__info">
            <h2 className="player-panel__name">Herói</h2>
            <HealthBar current={player.hp} max={player.maxHp} type="health" />
            <div className="player-panel__stats">
              <ManaBar current={player.mana} max={player.maxMana} />
              <ArmorDisplay armor={player.armor} />
            </div>
            <StatusEffects effects={player.statusEffects} />
          </div>
        </div>

        <div className="player-deck-info">
          <div className="deck-pile">
            <span className="deck-pile__icon">📚</span>
            <span className="deck-pile__count">{player.deck.length}</span>
            <span className="deck-pile__label">Deck</span>
          </div>
          <div className="deck-pile deck-pile--discard">
            <span className="deck-pile__icon">🗑️</span>
            <span className="deck-pile__count">{player.discardPile.length}</span>
            <span className="deck-pile__label">Descarte</span>
          </div>
        </div>
      </div>

      {/* Mão do jogador */}
      <div className="board__hand-area">
        <Hand
          cards={player.hand}
          onPlayCard={onPlayCard}
          canPlayCard={canPlayCard}
          disabled={!isPlayerTurn || isGameOver}
        />
      </div>
    </div>
  );
}
