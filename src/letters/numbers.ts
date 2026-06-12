import type { Letter, Stroke } from './types';
import { arc, p, s } from './shapes';
import { personalitiesFor } from './personalities';

// Numbers 1–10. "10" is two glyphs side by side (a 1 and a 0).
const shapes: { glyph: string; strokes: Stroke[] }[] = [
  { glyph: '1', strokes: [s(p(0.4, 0.26), p(0.5, 0.14), p(0.5, 0.86))] },
  { glyph: '2', strokes: [s(p(0.32, 0.3), p(0.45, 0.16), p(0.6, 0.18), p(0.66, 0.34), p(0.58, 0.5), p(0.34, 0.72), p(0.32, 0.86), p(0.7, 0.86))] },
  { glyph: '3', strokes: [s(p(0.34, 0.22), p(0.55, 0.14), p(0.66, 0.28), p(0.5, 0.45), p(0.66, 0.6), p(0.58, 0.8), p(0.34, 0.82))] },
  { glyph: '4', strokes: [s(p(0.6, 0.14), p(0.28, 0.62), p(0.74, 0.62)), s(p(0.6, 0.32), p(0.6, 0.86))] },
  { glyph: '5', strokes: [s(p(0.64, 0.16), p(0.36, 0.16), p(0.34, 0.46), p(0.52, 0.42), p(0.66, 0.52), p(0.64, 0.72), p(0.5, 0.84), p(0.32, 0.78))] },
  { glyph: '6', strokes: [s(p(0.62, 0.18), p(0.42, 0.3), p(0.34, 0.55), ...arc(0.5, 0.66, 0.18, 180, 540, 12))] },
  { glyph: '7', strokes: [s(p(0.32, 0.16), p(0.7, 0.16), p(0.44, 0.86))] },
  { glyph: '8', strokes: [s(...arc(0.5, 0.32, 0.15, 270, 630, 12)), s(...arc(0.5, 0.66, 0.2, 270, -90, 12))] },
  { glyph: '9', strokes: [s(...arc(0.5, 0.34, 0.16, -90, 270, 12)), s(p(0.64, 0.34), p(0.52, 0.86))] },
  { glyph: '10', strokes: [s(p(0.16, 0.28), p(0.24, 0.18), p(0.24, 0.86)), s(...arc(0.64, 0.52, 0.18, 270, -90, 14))] },
];

export const numbers: Letter[] = shapes.map((shape, i) => ({
  glyph: shape.glyph,
  strokes: shape.strokes,
  personalities: personalitiesFor(i + 11), // offset for distinct colors
}));
