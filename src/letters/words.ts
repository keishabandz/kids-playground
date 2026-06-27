import type { Letter } from './types';
import { lowercase } from './lowercase';

// Picture-word for each lowercase letter (initial-sound friendly).
const WORDS: Record<string, [string, string]> = {
  a: ['ant', '🐜'], b: ['ball', '⚽'], c: ['cat', '🐱'], d: ['dog', '🐶'],
  e: ['egg', '🥚'], f: ['fish', '🐟'], g: ['goat', '🐐'], h: ['hat', '🎩'],
  i: ['ice cream', '🍦'], j: ['juice', '🧃'], k: ['kite', '🪁'], l: ['lion', '🦁'],
  m: ['moon', '🌙'], n: ['nest', '🪺'], o: ['orange', '🍊'], p: ['pig', '🐷'],
  q: ['queen', '👑'], r: ['rabbit', '🐰'], s: ['sun', '☀️'], t: ['tree', '🌳'],
  u: ['umbrella', '☂️'], v: ['van', '🚐'], w: ['watermelon', '🍉'], x: ['x-ray', '🩻'],
  y: ['yo-yo', '🪀'], z: ['zebra', '🦓'],
};

// Same letterforms as lowercase, with a picture-word attached to each.
export const words: Letter[] = lowercase.map((l) => ({
  ...l,
  word: WORDS[l.glyph]?.[0],
  emoji: WORDS[l.glyph]?.[1],
}));
