import { test, expect } from 'vitest';
import { nextPersonality } from './personalityCursor';

const set = ['a', 'b', 'c'];

test('returns items in fixed order then wraps', () => {
  expect(nextPersonality(set, 0)).toBe('a');
  expect(nextPersonality(set, 1)).toBe('b');
  expect(nextPersonality(set, 2)).toBe('c');
  expect(nextPersonality(set, 3)).toBe('a'); // wraps
});
