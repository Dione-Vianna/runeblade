import type { ReactNode } from 'react';
import { useState } from 'react';
import { Settings } from '../Settings';
import './Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="layout">
      <header className="layout__header">
        <h1 className="layout__title">⚔️ RuneBlade ⚔️</h1>
        <button
          className="layout__settings-btn"
          onClick={() => setShowSettings(!showSettings)}
          title="Configurações de Som"
        >
          ⚙️
        </button>
      </header>

      {showSettings && (
        <div className="layout__settings-modal">
          <div className="layout__settings-overlay" onClick={() => setShowSettings(false)} />
          <div className="layout__settings-content">
            <button
              className="layout__settings-close"
              onClick={() => setShowSettings(false)}
              title="Fechar"
            >
              ✕
            </button>
            <Settings />
          </div>
        </div>
      )}

      <main className="layout__main">
        {children}
      </main>
    </div>
  );
}
