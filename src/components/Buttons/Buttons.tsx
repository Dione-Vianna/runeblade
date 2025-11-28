import { useSoundManager } from '../../hooks';
import './Buttons.css';

interface EndTurnButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function EndTurnButton({ onClick, disabled = false }: EndTurnButtonProps) {
  const { play } = useSoundManager();

  const handleClick = () => {
    play('click');
    onClick();
  };

  return (
    <button
      className={`btn btn--end-turn ${disabled ? 'btn--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      <span className="btn__text">Finalizar Turno</span>
      <span className="btn__icon">⏭️</span>
    </button>
  );
}

interface RestartButtonProps {
  onClick: () => void;
}

export function RestartButton({ onClick }: RestartButtonProps) {
  const { play } = useSoundManager();

  const handleClick = () => {
    play('click');
    onClick();
  };

  return (
    <button className="btn btn--restart" onClick={handleClick}>
      <span className="btn__icon">🔄</span>
      <span className="btn__text">Reiniciar</span>
    </button>
  );
}

interface GameButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export function GameButton({
  onClick,
  children,
  variant = 'primary',
  disabled = false
}: GameButtonProps) {
  const { play } = useSoundManager();

  const handleClick = () => {
    play('click');
    onClick();
  };

  return (
    <button
      className={`btn btn--${variant} ${disabled ? 'btn--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
