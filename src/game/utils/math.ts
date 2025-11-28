/**
 * Limita um valor entre min e max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Calcula a porcentagem de um valor
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Arredonda para um número específico de casas decimais
 */
export function round(value: number, decimals: number = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

/**
 * Calcula dano final considerando armadura
 */
export function calculateDamage(
  baseDamage: number,
  armor: number,
  multiplier: number = 1
): { finalDamage: number; armorDamage: number; hpDamage: number } {
  const totalDamage = Math.floor(baseDamage * multiplier);
  const armorDamage = Math.min(armor, totalDamage);
  const hpDamage = totalDamage - armorDamage;

  return {
    finalDamage: totalDamage,
    armorDamage,
    hpDamage
  };
}

/**
 * Calcula cura final com multiplicador
 */
export function calculateHealing(
  baseHealing: number,
  currentHp: number,
  maxHp: number,
  multiplier: number = 1
): number {
  const totalHealing = Math.floor(baseHealing * multiplier);
  return Math.min(totalHealing, maxHp - currentHp);
}

/**
 * Interpolação linear
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Mapeia um valor de um range para outro
 */
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}
