import { Dumbbell, Droplets, Flame, Gem, HeartPulse, Shield, Skull, Swords, Target, Zap } from 'lucide-react';

import type { StatusEffect } from '../../game/types';
import './Status.css';

interface HealthBarProps {
  current: number;
  max: number;
  type?: 'health' | 'mana' | 'armor';
  showText?: boolean;
}

export function HealthBar({ current, max, type = 'health', showText = true }: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));

  return (
    <div className={`health-bar health-bar--${type}`}>
      <div
        className="health-bar__fill"
        style={{ width: `${percentage}%` }}
      />
      {showText && (
        <span className="health-bar__text">
          {current}/{max}
        </span>
      )}
    </div>
  );
}

interface ManaBarProps {
  current: number;
  max: number;
}

export function ManaBar({ current, max }: ManaBarProps) {
  const manaOrbs = [];

  for (let i = 0; i < max; i++) {
    manaOrbs.push(
      <div
        key={i}
        className={`mana-orb ${i < current ? 'mana-orb--filled' : 'mana-orb--empty'}`}
      />
    );
  }

  return (
    <div className="mana-bar">
      <span className="mana-bar__icon"><Gem size={14} /></span>
      <div className="mana-bar__orbs">{manaOrbs}</div>
      <span className="mana-bar__text">{current}/{max}</span>
    </div>
  );
}

interface ArmorDisplayProps {
  armor: number;
}

export function ArmorDisplay({ armor }: ArmorDisplayProps) {
  if (armor === 0) return null;

  return (
    <div className="armor-display">
      <span className="armor-display__icon"><Shield size={14} /></span>
      <span className="armor-display__value">{armor}</span>
    </div>
  );
}

interface StatusEffectsProps {
  effects: StatusEffect[];
}

export function StatusEffects({ effects }: StatusEffectsProps) {
  if (effects.length === 0) return null;

  const getEffectIcon = (type: StatusEffect['type']) => {
    switch (type) {
      case 'poison': return <Skull size={12} />;
      case 'bleed': return <Droplets size={12} />;
      case 'burn': return <Flame size={12} />;
      case 'weakness': return <Zap size={12} />;
      case 'strength': return <Dumbbell size={12} />;
      case 'regeneration': return <HeartPulse size={12} />;
      case 'vulnerable': return <Target size={12} />;
      case 'shield': return <Shield size={12} />;
      default: return <Swords size={12} />;
    }
  };

  return (
    <div className="status-effects">
      {effects.map((effect, index) => (
        <div
          key={`${effect.type}-${index}`}
          className={`status-effect status-effect--${effect.type}`}
          title={effect.description}
        >
          <span className="status-effect__icon">{getEffectIcon(effect.type)}</span>
          <span className="status-effect__value">{effect.value}</span>
          <span className="status-effect__duration">{effect.duration}</span>
        </div>
      ))}
    </div>
  );
}
