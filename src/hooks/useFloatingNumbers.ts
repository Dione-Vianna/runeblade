import { useCallback, useState } from 'react';

import type { FloatingNumberProps } from '../components/FloatingNumber/FloatingNumber';

export function useFloatingNumbers() {
  const [numbers, setNumbers] = useState<
    Array<FloatingNumberProps & { id: string }>
  >([]);

  const addNumber = useCallback(
    (
      x: number,
      y: number,
      value: number,
      type: 'damage' | 'healing' | 'armor',
      duration = 1000
    ) => {
      const id = `${Date.now()}-${Math.random()}`;
      setNumbers(prev => [...prev, { id, x, y, value, type, duration }]);

      setTimeout(() => {
        setNumbers(prev => prev.filter(n => n.id !== id));
      }, duration);
    },
    []
  );

  return {
    numbers,
    addNumber,
  };
}
