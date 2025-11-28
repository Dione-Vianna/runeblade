import { useSoundManager } from '../../hooks';
import './Settings.css';

export function Settings() {
  const {
    play,
    masterVolume,
    soundVolume,
    musicVolume,
    isMuted,
    setMasterVolume,
    setSoundVolume,
    setMusicVolume,
    toggleMute
  } = useSoundManager();

  const handleMasterVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMasterVolume(Number(e.target.value));
    play('click');
  };

  const handleSoundVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSoundVolume(Number(e.target.value));
    play('click');
  };

  const handleMusicVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMusicVolume(Number(e.target.value));
    play('click');
  };

  const handleToggleMute = () => {
    toggleMute();
  };

  return (
    <div className="settings">
      <div className="settings__header">
        <h2 className="settings__title">⚙️ Configurações de Som</h2>
        <button
          className={`settings__mute-btn ${isMuted ? 'settings__mute-btn--muted' : ''}`}
          onClick={handleToggleMute}
          title={isMuted ? 'Ativar som' : 'Silenciar som'}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      <div className="settings__control">
        <label className="settings__label">
          <span className="settings__label-text">🔊 Volume Principal</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={masterVolume}
            onChange={handleMasterVolumeChange}
            className="settings__slider"
            disabled={isMuted}
          />
          <span className="settings__value">{Math.round(masterVolume * 100)}%</span>
        </label>
      </div>

      <div className="settings__control">
        <label className="settings__label">
          <span className="settings__label-text">⚔️ Volume de Efeitos</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={soundVolume}
            onChange={handleSoundVolumeChange}
            className="settings__slider"
            disabled={isMuted}
          />
          <span className="settings__value">{Math.round(soundVolume * 100)}%</span>
        </label>
      </div>

      <div className="settings__control">
        <label className="settings__label">
          <span className="settings__label-text">🎵 Volume de Música</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={musicVolume}
            onChange={handleMusicVolumeChange}
            className="settings__slider"
            disabled={isMuted}
          />
          <span className="settings__value">{Math.round(musicVolume * 100)}%</span>
        </label>
      </div>

      <p className="settings__hint">
        💡 Dica: Use os controles acima para ajustar o volume de diferentes tipos de som
      </p>
    </div>
  );
}
