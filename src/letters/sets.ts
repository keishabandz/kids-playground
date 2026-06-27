import type { Letter } from './types';
import { uppercase } from './alphabet';
import { lowercase } from './lowercase';
import { numbers } from './numbers';

export type SetId = 'uppercase' | 'lowercase' | 'numbers';

export type LetterSet = {
  id: SetId;
  label: string;
  tile: string;   // glyph shown on the home tile
  color: string;  // home tile color
  letters: Letter[];
};

export const SETS: LetterSet[] = [
  { id: 'uppercase', label: 'Big Letters', tile: 'A', color: '#ff6b6b', letters: uppercase },
  { id: 'lowercase', label: 'small letters', tile: 'a', color: '#4ecdc4', letters: lowercase },
  { id: 'numbers', label: 'Numbers', tile: '1', color: '#a855f7', letters: numbers },
];

export const getSet = (id: SetId): LetterSet => SETS.find((s) => s.id === id)!;
