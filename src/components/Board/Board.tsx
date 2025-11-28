import { useEffect, useState } from 'react';

import type { CardInstance, Enemy, Player } from '../../game/types';
import { useFloatingNumbers, useSoundManager } from '../../hooks';
import { EndTurnButton, RestartButton } from '../Buttons';
import { FloatingNumber } from '../FloatingNumber';
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
  const { numbers, addNumber } = useFloatingNumbers();
  const { play } = useSoundManager();
  const [prevPlayerHp, setPrevPlayerHp] = useState(player.hp);
  const [prevPlayerArmor, setPrevPlayerArmor] = useState(player.armor);
  const [prevEnemyHp, setPrevEnemyHp] = useState(enemy?.hp ?? 0);
  const [prevEnemyArmor, setPrevEnemyArmor] = useState(enemy?.armor ?? 0);
  const [damageAnimation, setDamageAnimation] = useState(false);
  const [healAnimation, setHealAnimation] = useState(false);
  const [enemyDamageAnimation, setEnemyDamageAnimation] = useState(false);

  // Detectar mudanças de HP/Armor e criar floating numbers
  useEffect(() => {
    const playerHpDiff = prevPlayerHp - player.hp;
    if (playerHpDiff > 0) {
      addNumber(window.innerWidth / 2 - 50, window.innerHeight / 2 + 100, playerHpDiff, 'damage');
      play('damage');
      setDamageAnimation(true);
      setTimeout(() => setDamageAnimation(false), 300);
    }

    const playerHealDiff = player.hp - prevPlayerHp;
    if (playerHealDiff > 0) {
      addNumber(window.innerWidth / 2 - 50, window.innerHeight / 2 + 100, playerHealDiff, 'healing');
      play('heal');
      setHealAnimation(true);
      setTimeout(() => setHealAnimation(false), 400);
    }

    const armorDiff = player.armor - prevPlayerArmor;
    if (armorDiff > 0) {
      addNumber(window.innerWidth / 2 - 50, window.innerHeight / 2 + 140, armorDiff, 'armor');
      play('defense');
    }

    setPrevPlayerHp(player.hp);
    setPrevPlayerArmor(player.armor);
  }, [player.hp, player.armor, addNumber, prevPlayerHp, prevPlayerArmor, play]);

  // Detectar mudanças do inimigo
  useEffect(() => {
    if (!enemy) return;

    const enemyHpDiff = prevEnemyHp - enemy.hp;
    if (enemyHpDiff > 0) {
      addNumber(window.innerWidth / 2 + 50, window.innerHeight / 4, enemyHpDiff, 'damage');
      play('attack');
      setEnemyDamageAnimation(true);
      setTimeout(() => setEnemyDamageAnimation(false), 300);
    }

    const enemyArmorDiff = enemy.armor - prevEnemyArmor;
    if (enemyArmorDiff > 0) {
      addNumber(window.innerWidth / 2 + 50, window.innerHeight / 4 + 40, enemyArmorDiff, 'armor');
      play('defense');
    }

    setPrevEnemyHp(enemy.hp);
    setPrevEnemyArmor(enemy.armor);
  }, [enemy?.hp, enemy?.armor, addNumber, prevEnemyHp, prevEnemyArmor, enemy, play]);

  return (
    <div className="board">
      {/* Floating Numbers */}
      <div className="board__floating-numbers">
        {numbers.map(num => (
          <FloatingNumber key={num.id} {...num} />
        ))}
      </div>

      {/* Área do inimigo */}
      <div className="board__enemy-area">
        {enemy && (
          <div className={`enemy-panel ${enemyDamageAnimation ? 'damage-taken' : ''}`}>
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
          <div className={`game-over ${isVictory ? 'game-over--victory victory-animation' : 'game-over--defeat defeat-animation'}`}>
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
        <div className={`player-panel ${damageAnimation ? 'damage-taken' : ''} ${healAnimation ? 'healing-received' : ''}`}>
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
