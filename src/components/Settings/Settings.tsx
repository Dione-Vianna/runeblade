import { Monitor, Music, Settings2, Sword, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useSoundManager } from '../../hooks';
import './Settings.css';

type Tab = 'som' | 'jogo' | 'display';

export function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('som');
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
        <h2 className="settings__title"><Settings2 size={18} /> Configurações</h2>
        <button
          className={`settings__mute-btn ${isMuted ? 'settings__mute-btn--muted' : ''}`}
          onClick={handleToggleMute}
          title={isMuted ? 'Ativar som' : 'Silenciar som'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="settings__tabs">
        <button
          className={`settings__tab ${activeTab === 'som' ? 'settings__tab--active' : ''}`}
          onClick={() => setActiveTab('som')}
        >
          <Volume2 size={14} /> Som
        </button>
        <button
          className={`settings__tab ${activeTab === 'jogo' ? 'settings__tab--active' : ''}`}
          onClick={() => setActiveTab('jogo')}
        >
          🎮 Jogo
        </button>
        <button
          className={`settings__tab ${activeTab === 'display' ? 'settings__tab--active' : ''}`}
          onClick={() => setActiveTab('display')}
        >
          <Monitor size={14} /> Display
        </button>
      </div>

      <div className="settings__panel">
        {activeTab === 'som' && (
          <>
            <div className="settings__control">
              <label className="settings__label">
                <span className="settings__label-text"><Volume2 size={14} /> Volume Principal</span>
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
                <span className="settings__label-text"><Sword size={14} /> Volume de Efeitos</span>
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
                <span className="settings__label-text"><Music size={14} /> Volume de Música</span>
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
          </>
        )}

        {activeTab === 'jogo' && (
          <div className="settings__coming-soon">
            <span className="settings__coming-soon-icon">🚧</span>
            <p className="settings__coming-soon-title">Em breve</p>
            <p className="settings__coming-soon-desc">
              Dificuldade, velocidade de animação e outras opções de jogo.
            </p>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="settings__coming-soon">
            <span className="settings__coming-soon-icon">🚧</span>
            <p className="settings__coming-soon-title">Em breve</p>
            <p className="settings__coming-soon-desc">
              Tamanho de texto, alto contraste e outras opções de exibição.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
