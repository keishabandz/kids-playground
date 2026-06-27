import type { Letter } from './types';
import { uppercase } from './alphabet';
import { lowercase } from './lowercase';
import { numbers } from './numbers';
import { words } from './words';

export type SetId = 'uppercase' | 'lowercase' | 'numbers' | 'words';

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
  { id: 'words', label: 'First Words', tile: '🐜', color: '#10b981', letters: words },
];

export const getSet = (id: SetId): LetterSet => SETS.find((s) => s.id === id)!;
