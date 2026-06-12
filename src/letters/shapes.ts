import type { Point, Stroke } from './types';

export const p = (x: number, y: number): Point => ({ x, y });
export const s = (...points: Point[]): Stroke => ({ points });

/**
 * Points along a circular arc. Angles in degrees: 0 = right, 90 = down (y grows
 * downward), 180 = left, 270 = up. Used to build curved glyphs (o, c, bowls…).
 */
export const arc = (cx: number, cy: number, r: number, a0: number, a1: number, steps = 12): Point[] => {
  const out: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const a = ((a0 + (a1 - a0) * (i / steps)) * Math.PI) / 180;
    out.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
  }
  return out;
};
