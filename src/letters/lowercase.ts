import type { Letter, Stroke } from './types';
import { arc, p, s } from './shapes';
import { personalitiesFor } from './personalities';

// Lowercase print forms. Reference lines: x-height top ~0.42, baseline ~0.82,
// ascender top ~0.14, descender bottom ~0.95. Round letters use arc() so they
// read as proper circles. Single-story a and g (school print).
const shapes: { glyph: string; strokes: Stroke[] }[] = [
  // a: closed round bowl + straight stem on its right edge
  { glyph: 'a', strokes: [s(...arc(0.46, 0.62, 0.2, 270, -90, 18)), s(p(0.66, 0.42), p(0.66, 0.82))] },
  // b: tall stem + full bowl on the lower right
  { glyph: 'b', strokes: [s(p(0.34, 0.14), p(0.34, 0.82)), s(...arc(0.52, 0.62, 0.18, 180, 540, 16))] },
  // c: open circle
  { glyph: 'c', strokes: [s(...arc(0.52, 0.62, 0.22, -50, 230, 14))] },
  // d: closed round bowl on the left + tall stem on its right edge
  { glyph: 'd', strokes: [s(...arc(0.5, 0.62, 0.18, 270, -90, 18)), s(p(0.68, 0.14), p(0.68, 0.82))] },
  // e: crossbar then a c-curve around
  { glyph: 'e', strokes: [s(p(0.33, 0.6), p(0.67, 0.6), ...arc(0.5, 0.61, 0.2, -8, 235, 12))] },
  // f: curved hook + stem, then crossbar
  { glyph: 'f', strokes: [s(p(0.63, 0.22), p(0.53, 0.15), p(0.43, 0.21), p(0.43, 0.82)), s(p(0.3, 0.45), p(0.62, 0.45))] },
  // g: closed round bowl + straight descender with a left hook
  { glyph: 'g', strokes: [s(...arc(0.5, 0.6, 0.18, 270, -90, 18)), s(p(0.68, 0.42), p(0.68, 0.9), p(0.56, 0.96), p(0.42, 0.91))] },
  // h: tall stem + arch
  { glyph: 'h', strokes: [s(p(0.34, 0.14), p(0.34, 0.82)), s(p(0.34, 0.55), p(0.42, 0.46), p(0.54, 0.44), p(0.64, 0.51), p(0.66, 0.82))] },
  // i: stem + dot
  { glyph: 'i', strokes: [s(p(0.5, 0.42), p(0.5, 0.82)), s(p(0.5, 0.26), p(0.5, 0.31))] },
  // j: descender stem + dot
  { glyph: 'j', strokes: [s(p(0.55, 0.42), p(0.55, 0.9), p(0.46, 0.96), p(0.37, 0.91)), s(p(0.55, 0.26), p(0.55, 0.31))] },
  // k: tall stem + two diagonals
  { glyph: 'k', strokes: [s(p(0.36, 0.14), p(0.36, 0.82)), s(p(0.62, 0.46), p(0.36, 0.63)), s(p(0.45, 0.59), p(0.64, 0.82))] },
  // l: tall stem
  { glyph: 'l', strokes: [s(p(0.5, 0.14), p(0.5, 0.82))] },
  // m: stem + two arches
  { glyph: 'm', strokes: [s(p(0.28, 0.82), p(0.28, 0.43)), s(p(0.28, 0.5), p(0.37, 0.44), p(0.46, 0.47), p(0.49, 0.56), p(0.49, 0.82)), s(p(0.49, 0.5), p(0.59, 0.44), p(0.68, 0.47), p(0.72, 0.56), p(0.72, 0.82))] },
  // n: stem + arch
  { glyph: 'n', strokes: [s(p(0.34, 0.82), p(0.34, 0.43)), s(p(0.34, 0.5), p(0.44, 0.44), p(0.56, 0.46), p(0.64, 0.54), p(0.64, 0.82))] },
  // o: circle
  { glyph: 'o', strokes: [s(...arc(0.5, 0.62, 0.22, 270, -90, 16))] },
  // p: descender stem + bowl
  { glyph: 'p', strokes: [s(p(0.34, 0.42), p(0.34, 0.95)), s(...arc(0.52, 0.6, 0.18, 180, 540, 16))] },
  // q: closed round bowl + descender stem on its right edge
  { glyph: 'q', strokes: [s(...arc(0.5, 0.6, 0.18, 270, -90, 18)), s(p(0.68, 0.42), p(0.68, 0.95))] },
  // r: stem + small shoulder
  { glyph: 'r', strokes: [s(p(0.4, 0.82), p(0.4, 0.42)), s(p(0.4, 0.52), p(0.5, 0.44), p(0.63, 0.45))] },
  // s: smooth s-curve
  { glyph: 's', strokes: [s(p(0.64, 0.5), p(0.52, 0.44), p(0.4, 0.48), p(0.4, 0.56), p(0.5, 0.62), p(0.6, 0.68), p(0.6, 0.76), p(0.48, 0.82), p(0.36, 0.77))] },
  // t: stem with a little base curve + crossbar
  { glyph: 't', strokes: [s(p(0.5, 0.24), p(0.5, 0.76), p(0.6, 0.82)), s(p(0.34, 0.42), p(0.66, 0.42))] },
  // u: u-bowl then right stem
  { glyph: 'u', strokes: [s(p(0.34, 0.42), p(0.34, 0.72), p(0.42, 0.8), p(0.56, 0.8), p(0.64, 0.72), p(0.66, 0.42), p(0.66, 0.82))] },
  // v
  { glyph: 'v', strokes: [s(p(0.34, 0.42), p(0.5, 0.82), p(0.66, 0.42))] },
  // w
  { glyph: 'w', strokes: [s(p(0.28, 0.42), p(0.4, 0.82), p(0.5, 0.56), p(0.6, 0.82), p(0.72, 0.42))] },
  // x
  { glyph: 'x', strokes: [s(p(0.36, 0.42), p(0.64, 0.82)), s(p(0.64, 0.42), p(0.36, 0.82))] },
  // y: short v + descender
  { glyph: 'y', strokes: [s(p(0.36, 0.42), p(0.5, 0.7)), s(p(0.64, 0.42), p(0.5, 0.7), p(0.42, 0.95))] },
  // z
  { glyph: 'z', strokes: [s(p(0.36, 0.42), p(0.64, 0.42), p(0.36, 0.82), p(0.64, 0.82))] },
];

export const lowercase: Letter[] = shapes.map((shape, i) => ({
  glyph: shape.glyph,
  strokes: shape.strokes,
  personalities: personalitiesFor(i + 5),
}));
