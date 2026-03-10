import { HeartPulse, Shield, Sword } from 'lucide-react';
import { useEffect, useState } from 'react';

export interface FloatingNumberProps {
  x: number;
  y: number;
  value: number;
  type: 'damage' | 'healing' | 'armor';
  duration?: number;
}

export function FloatingNumber({
  x,
  y,
  value,
  type,
  duration = 1000,
}: FloatingNumberProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  const displayValue = type === 'damage' ? `-${value}` : `+${value}`;
  const icon = type === 'damage' ? <Sword size={14} /> : type === 'healing' ? <HeartPulse size={14} /> : <Shield size={14} />;

  return (
    <div
      className={`floating-number floating-number--${type}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {icon} {displayValue}
    </div>
  );
}
