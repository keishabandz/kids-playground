import { test, expect } from 'vitest';
import { distance } from './geometry';

test('distance is euclidean', () => {
  expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
});
test('distance is zero for same point', () => {
  expect(distance({ x: 0.2, y: 0.2 }, { x: 0.2, y: 0.2 })).toBe(0);
});
