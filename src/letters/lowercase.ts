import type { Letter, Stroke } from './types';
import { arc, p, s } from './shapes';
import { personalitiesFor } from './personalities';

// Lowercase print forms. Reference lines: x-height top ~0.42, baseline ~0.82,
// ascender top ~0.14, descender bottom ~0.95.
//
// arc() angle convention (y grows downward): 0=right(E), 90=bottom(S),
// 180=left(W), 270/-90=top(N). DECREASING angle = counterclockwise (the way a
// child writes o/c/a). An "open-E" bowl (gap on the right) goes from upper-right
// counterclockwise through top, left, bottom to lower-right; the stem closes it.
const shapes: { glyph: string; strokes: Stroke[] }[] = [
  // a: open-right bowl (C) + straight stem on the right that closes it
  { glyph: 'a', strokes: [s(...arc(0.47, 0.6, 0.2, -40, -320, 20)), s(p(0.62, 0.42), p(0.62, 0.82))] },
  // b: tall stem on the left + bowl that opens left (against the stem)
  { glyph: 'b', strokes: [s(p(0.34, 0.14), p(0.34, 0.82)), s(...arc(0.48, 0.62, 0.18, -140, 140, 20))] },
  // c: open-right curve
  { glyph: 'c', strokes: [s(...arc(0.5, 0.62, 0.22, -55, -305, 20))] },
  // d: open-right bowl on the left + tall stem on the right
  { glyph: 'd', strokes: [s(...arc(0.5, 0.62, 0.18, -40, -320, 20)), s(p(0.64, 0.14), p(0.64, 0.82))] },
  // e: crossbar then a c-curve around it
  { glyph: 'e', strokes: [s(p(0.32, 0.59), p(0.68, 0.59), ...arc(0.5, 0.6, 0.2, -18, -300, 18))] },
  // f: rounded hook + stem, then crossbar
  { glyph: 'f', strokes: [s(p(0.62, 0.26), p(0.57, 0.19), p(0.5, 0.16), p(0.45, 0.2), p(0.43, 0.28), p(0.43, 0.82)), s(p(0.3, 0.45), p(0.62, 0.45))] },
  // g: open-right bowl + descender stem with a smooth left hook
  { glyph: 'g', strokes: [s(...arc(0.47, 0.6, 0.18, -40, -320, 20)), s(p(0.61, 0.42), p(0.61, 0.84), p(0.57, 0.93), p(0.48, 0.96), p(0.39, 0.92))] },
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
  // o: full circle
  { glyph: 'o', strokes: [s(...arc(0.5, 0.62, 0.22, 270, -90, 20))] },
  // p: descender stem on the left + bowl that opens left
  { glyph: 'p', strokes: [s(p(0.34, 0.42), p(0.34, 0.95)), s(...arc(0.48, 0.6, 0.18, -140, 140, 20))] },
  // q: open-right bowl + descender stem on the right
  { glyph: 'q', strokes: [s(...arc(0.47, 0.6, 0.18, -40, -320, 20)), s(p(0.61, 0.42), p(0.61, 0.95))] },
  // r: stem + small shoulder
  { glyph: 'r', strokes: [s(p(0.4, 0.82), p(0.4, 0.42)), s(p(0.4, 0.52), p(0.5, 0.44), p(0.63, 0.45))] },
  // s: smooth double curve (dense polyline)
  { glyph: 's', strokes: [s(p(0.62, 0.46), p(0.56, 0.43), p(0.49, 0.43), p(0.43, 0.46), p(0.42, 0.52), p(0.47, 0.57), p(0.53, 0.6), p(0.58, 0.65), p(0.58, 0.71), p(0.54, 0.77), p(0.47, 0.8), p(0.39, 0.78), p(0.35, 0.74))] },
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
