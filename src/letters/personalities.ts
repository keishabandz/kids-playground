import type { BehaviourId, Personality } from './types';

// A rotating palette so every glyph gets its own distinct, predictable set
// (cycled in fixed order).
const PALETTE = [
  '#ff4d4d', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6', '#14b8a6',
  '#22c55e', '#84cc16', '#06b6d4', '#d946ef', '#fb7185', '#fbbf24',
  '#6366f1', '#10b981', '#f43f5e', '#0ea5e9', '#8b5cf6', '#e879f9',
];
const BEHAVIOURS: BehaviourId[] = ['googly-dance', 'silly-tongue', 'star-bounce'];

export function personalitiesFor(i: number): Personality[] {
  return BEHAVIOURS.map((behaviour, k) => ({
    behaviour,
    color: PALETTE[(i * 3 + k) % PALETTE.length],
  }));
}
