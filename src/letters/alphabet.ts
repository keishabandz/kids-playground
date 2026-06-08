import type { BehaviourId, Letter, Personality, Point, Stroke } from './types';

const p = (x: number, y: number): Point => ({ x, y });
const s = (...points: Point[]): Stroke => ({ points });

// Each letter's personality set is built from a rotating palette so every
// letter has its own distinct, predictable set (cycled in fixed order).
const PALETTE = [
  '#ff4d4d', '#f59e0b', '#ec4899', '#a855f7', '#3b82f6', '#14b8a6',
  '#22c55e', '#84cc16', '#06b6d4', '#d946ef', '#fb7185', '#fbbf24',
  '#6366f1', '#10b981', '#f43f5e', '#0ea5e9', '#8b5cf6', '#e879f9',
];
const BEHAVIOURS: BehaviourId[] = ['googly-dance', 'silly-tongue', 'star-bounce'];

function personalitiesFor(i: number): Personality[] {
  return BEHAVIOURS.map((behaviour, k) => ({
    behaviour,
    color: PALETTE[(i * 3 + k) % PALETTE.length],
  }));
}

// Simplified uppercase letterforms in normalized 0..1 coords, drawn the way a
// child is taught (top-to-bottom, left-to-right). Curves are polyline approxes.
const shapes: { glyph: string; strokes: Stroke[] }[] = [
  { glyph: 'A', strokes: [s(p(0.5, 0.12), p(0.25, 0.88)), s(p(0.5, 0.12), p(0.75, 0.88)), s(p(0.34, 0.55), p(0.66, 0.55))] },
  { glyph: 'B', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.62, 0.2), p(0.62, 0.45), p(0.3, 0.5)), s(p(0.3, 0.5), p(0.68, 0.56), p(0.68, 0.82), p(0.3, 0.88))] },
  { glyph: 'C', strokes: [s(p(0.72, 0.28), p(0.5, 0.14), p(0.3, 0.22), p(0.22, 0.5), p(0.3, 0.78), p(0.5, 0.86), p(0.72, 0.72))] },
  { glyph: 'D', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.6, 0.2), p(0.72, 0.5), p(0.6, 0.8), p(0.3, 0.88))] },
  { glyph: 'E', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.68, 0.12)), s(p(0.3, 0.5), p(0.6, 0.5)), s(p(0.3, 0.88), p(0.68, 0.88))] },
  { glyph: 'F', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.68, 0.12)), s(p(0.3, 0.5), p(0.6, 0.5))] },
  { glyph: 'G', strokes: [s(p(0.72, 0.28), p(0.5, 0.14), p(0.3, 0.22), p(0.22, 0.5), p(0.3, 0.78), p(0.5, 0.86), p(0.72, 0.74), p(0.72, 0.55), p(0.55, 0.55))] },
  { glyph: 'H', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.7, 0.12), p(0.7, 0.88)), s(p(0.3, 0.5), p(0.7, 0.5))] },
  { glyph: 'I', strokes: [s(p(0.35, 0.12), p(0.65, 0.12)), s(p(0.5, 0.12), p(0.5, 0.88)), s(p(0.35, 0.88), p(0.65, 0.88))] },
  { glyph: 'J', strokes: [s(p(0.6, 0.12), p(0.6, 0.7), p(0.5, 0.84), p(0.35, 0.84), p(0.28, 0.72))] },
  { glyph: 'K', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.68, 0.12), p(0.3, 0.5)), s(p(0.3, 0.5), p(0.68, 0.88))] },
  { glyph: 'L', strokes: [s(p(0.32, 0.12), p(0.32, 0.88), p(0.68, 0.88))] },
  { glyph: 'M', strokes: [s(p(0.25, 0.88), p(0.25, 0.12), p(0.5, 0.55), p(0.75, 0.12), p(0.75, 0.88))] },
  { glyph: 'N', strokes: [s(p(0.28, 0.88), p(0.28, 0.12), p(0.72, 0.88), p(0.72, 0.12))] },
  { glyph: 'O', strokes: [s(p(0.5, 0.12), p(0.28, 0.28), p(0.22, 0.5), p(0.28, 0.72), p(0.5, 0.88), p(0.72, 0.72), p(0.78, 0.5), p(0.72, 0.28), p(0.5, 0.12))] },
  { glyph: 'P', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.64, 0.2), p(0.64, 0.42), p(0.3, 0.5))] },
  { glyph: 'Q', strokes: [s(p(0.5, 0.12), p(0.28, 0.28), p(0.22, 0.5), p(0.28, 0.72), p(0.5, 0.88), p(0.72, 0.72), p(0.78, 0.5), p(0.72, 0.28), p(0.5, 0.12)), s(p(0.58, 0.66), p(0.78, 0.9))] },
  { glyph: 'R', strokes: [s(p(0.3, 0.12), p(0.3, 0.88)), s(p(0.3, 0.12), p(0.64, 0.2), p(0.64, 0.42), p(0.3, 0.5)), s(p(0.4, 0.5), p(0.7, 0.88))] },
  { glyph: 'S', strokes: [s(p(0.7, 0.25), p(0.5, 0.14), p(0.32, 0.22), p(0.34, 0.42), p(0.55, 0.52), p(0.68, 0.62), p(0.66, 0.8), p(0.48, 0.87), p(0.3, 0.76))] },
  { glyph: 'T', strokes: [s(p(0.25, 0.12), p(0.75, 0.12)), s(p(0.5, 0.12), p(0.5, 0.88))] },
  { glyph: 'U', strokes: [s(p(0.28, 0.12), p(0.28, 0.65), p(0.4, 0.84), p(0.6, 0.84), p(0.72, 0.65), p(0.72, 0.12))] },
  { glyph: 'V', strokes: [s(p(0.28, 0.12), p(0.5, 0.88), p(0.72, 0.12))] },
  { glyph: 'W', strokes: [s(p(0.22, 0.12), p(0.36, 0.88), p(0.5, 0.4), p(0.64, 0.88), p(0.78, 0.12))] },
  { glyph: 'X', strokes: [s(p(0.3, 0.12), p(0.7, 0.88)), s(p(0.7, 0.12), p(0.3, 0.88))] },
  { glyph: 'Y', strokes: [s(p(0.3, 0.12), p(0.5, 0.5)), s(p(0.7, 0.12), p(0.5, 0.5)), s(p(0.5, 0.5), p(0.5, 0.88))] },
  { glyph: 'Z', strokes: [s(p(0.3, 0.12), p(0.7, 0.12), p(0.3, 0.88), p(0.7, 0.88))] },
];

export const alphabet: Letter[] = shapes.map((shape, i) => ({
  glyph: shape.glyph,
  strokes: shape.strokes,
  personalities: personalitiesFor(i),
}));
