import { Board, Layout } from '../../components';
import { GameButton } from '../../components/Buttons';
import { useGameEngine } from '../../hooks';
import './GamePage.css';

interface GamePageProps {
  onBattleEnd?: () => void;
  showReturnButton?: boolean;
}

export function GamePage({ onBattleEnd, showReturnButton = false }: GamePageProps) {
  const {
    player,
    enemy,
    isPlayerTurn,
    isGameOver,
    isVictory,
    round,
    playCard,
    endTurn,
    resetGame,
    canPlayCard,
  } = useGameEngine();

  const handleRestart = () => {
    if (onBattleEnd) {
      onBattleEnd();
    } else {
      resetGame();
    }
  };

  return (
    <Layout>
      <Board
        player={player}
        enemy={enemy}
        isPlayerTurn={isPlayerTurn}
        isGameOver={isGameOver}
        isVictory={isVictory}
        round={round}
        onPlayCard={playCard}
        onEndTurn={endTurn}
        onRestart={handleRestart}
        canPlayCard={canPlayCard}
      />
      {showReturnButton && isGameOver && onBattleEnd && (
        <div className="game-page__return">
          <GameButton variant="primary" onClick={onBattleEnd}>
            {isVictory ? '🗺️ Voltar ao Mapa' : '🗺️ Voltar ao Mapa'}
          </GameButton>
        </div>
      )}
    </Layout>
  );
}
