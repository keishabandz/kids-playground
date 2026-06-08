import type { Letter } from './types';

// A = three strokes: left diagonal, right diagonal, crossbar.
// Coordinates normalized 0..1. Checkpoints are coarse on purpose (forgiving).
export const letterA: Letter = {
  glyph: 'A',
  strokes: [
    { checkpoints: [ { x: 0.5, y: 0.1 }, { x: 0.3, y: 0.5 }, { x: 0.1, y: 0.9 } ] }, // left diagonal
    { checkpoints: [ { x: 0.5, y: 0.1 }, { x: 0.7, y: 0.5 }, { x: 0.9, y: 0.9 } ] }, // right diagonal
    { checkpoints: [ { x: 0.3, y: 0.6 }, { x: 0.5, y: 0.6 }, { x: 0.7, y: 0.6 } ] }, // crossbar
  ],
  personalities: [
    { behaviour: 'googly-dance', color: '#ff4d4d' },
    { behaviour: 'silly-tongue', color: '#f59e0b' },
    { behaviour: 'star-bounce',  color: '#ec4899' },
  ],
};
