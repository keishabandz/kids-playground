import type { Letter, Stroke } from './types';
import { arc, p, s } from './shapes';
import { personalitiesFor } from './personalities';

// Simplified lowercase print forms. Baseline ~0.85, x-height top ~0.45,
// ascenders to ~0.14, descenders to ~0.96. Curves via arc().
const shapes: { glyph: string; strokes: Stroke[] }[] = [
  { glyph: 'a', strokes: [s(...arc(0.48, 0.64, 0.2, -40, 250, 14)), s(p(0.66, 0.46), p(0.66, 0.85))] },
  { glyph: 'b', strokes: [s(p(0.34, 0.14), p(0.34, 0.85)), s(...arc(0.52, 0.65, 0.2, 180, 540, 14))] },
  { glyph: 'c', strokes: [s(...arc(0.54, 0.64, 0.22, -55, 235, 14))] },
  { glyph: 'd', strokes: [s(...arc(0.5, 0.65, 0.2, -40, 250, 14)), s(p(0.7, 0.14), p(0.7, 0.85))] },
  { glyph: 'e', strokes: [s(p(0.31, 0.62), p(0.69, 0.62)), s(...arc(0.5, 0.62, 0.2, 0, 255, 14))] },
  { glyph: 'f', strokes: [s(p(0.6, 0.2), p(0.5, 0.16), p(0.44, 0.26), p(0.44, 0.85)), s(p(0.3, 0.48), p(0.6, 0.48))] },
  { glyph: 'g', strokes: [s(...arc(0.5, 0.62, 0.18, -40, 250, 14)), s(p(0.66, 0.46), p(0.66, 0.92), p(0.5, 0.98), p(0.36, 0.92))] },
  { glyph: 'h', strokes: [s(p(0.34, 0.14), p(0.34, 0.85)), s(p(0.34, 0.56), p(0.5, 0.46), p(0.66, 0.56), p(0.66, 0.85))] },
  { glyph: 'i', strokes: [s(p(0.5, 0.42), p(0.5, 0.85)), s(p(0.5, 0.24), p(0.5, 0.3))] },
  { glyph: 'j', strokes: [s(p(0.56, 0.42), p(0.56, 0.9), p(0.46, 0.97), p(0.36, 0.92)), s(p(0.56, 0.24), p(0.56, 0.3))] },
  { glyph: 'k', strokes: [s(p(0.36, 0.14), p(0.36, 0.85)), s(p(0.62, 0.46), p(0.36, 0.66)), s(p(0.44, 0.61), p(0.64, 0.85))] },
  { glyph: 'l', strokes: [s(p(0.5, 0.14), p(0.5, 0.85))] },
  { glyph: 'm', strokes: [s(p(0.3, 0.85), p(0.3, 0.46)), s(p(0.3, 0.52), p(0.42, 0.45), p(0.5, 0.52), p(0.5, 0.85)), s(p(0.5, 0.52), p(0.62, 0.45), p(0.7, 0.52), p(0.7, 0.85))] },
  { glyph: 'n', strokes: [s(p(0.36, 0.85), p(0.36, 0.46)), s(p(0.36, 0.52), p(0.5, 0.45), p(0.64, 0.52), p(0.64, 0.85))] },
  { glyph: 'o', strokes: [s(...arc(0.5, 0.63, 0.24, 270, -90, 16))] },
  { glyph: 'p', strokes: [s(p(0.34, 0.46), p(0.34, 0.96)), s(...arc(0.52, 0.63, 0.2, 180, 540, 14))] },
  { glyph: 'q', strokes: [s(...arc(0.5, 0.63, 0.2, -40, 250, 14)), s(p(0.7, 0.46), p(0.7, 0.96))] },
  { glyph: 'r', strokes: [s(p(0.4, 0.85), p(0.4, 0.46)), s(p(0.4, 0.56), p(0.52, 0.46), p(0.66, 0.48))] },
  { glyph: 's', strokes: [s(p(0.64, 0.5), p(0.5, 0.45), p(0.4, 0.52), p(0.5, 0.63), p(0.6, 0.72), p(0.5, 0.83), p(0.36, 0.78))] },
  { glyph: 't', strokes: [s(p(0.5, 0.24), p(0.5, 0.78), p(0.6, 0.85)), s(p(0.34, 0.46), p(0.66, 0.46))] },
  { glyph: 'u', strokes: [s(p(0.36, 0.46), p(0.36, 0.74), p(0.46, 0.84), p(0.58, 0.84), p(0.66, 0.74), p(0.66, 0.46)), s(p(0.66, 0.46), p(0.66, 0.85))] },
  { glyph: 'v', strokes: [s(p(0.34, 0.46), p(0.5, 0.85), p(0.66, 0.46))] },
  { glyph: 'w', strokes: [s(p(0.28, 0.46), p(0.4, 0.85), p(0.5, 0.6), p(0.6, 0.85), p(0.72, 0.46))] },
  { glyph: 'x', strokes: [s(p(0.36, 0.46), p(0.64, 0.85)), s(p(0.64, 0.46), p(0.36, 0.85))] },
  { glyph: 'y', strokes: [s(p(0.36, 0.46), p(0.5, 0.72)), s(p(0.64, 0.46), p(0.5, 0.72), p(0.42, 0.96))] },
  { glyph: 'z', strokes: [s(p(0.36, 0.46), p(0.64, 0.46), p(0.36, 0.85), p(0.64, 0.85))] },
];

export const lowercase: Letter[] = shapes.map((shape, i) => ({
  glyph: shape.glyph,
  strokes: shape.strokes,
  personalities: personalitiesFor(i + 5), // offset so colors differ from uppercase
}));
