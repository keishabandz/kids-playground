import { test, expect } from 'vitest';
import { distance, lerp, samplePolyline } from './geometry';

test('distance is euclidean', () => {
  expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
});
test('distance is zero for same point', () => {
  expect(distance({ x: 0.2, y: 0.2 }, { x: 0.2, y: 0.2 })).toBe(0);
});

test('lerp midpoint', () => {
  expect(lerp({ x: 0, y: 0 }, { x: 1, y: 1 }, 0.5)).toEqual({ x: 0.5, y: 0.5 });
});

test('samplePolyline keeps endpoints and densifies', () => {
  const pts = samplePolyline([{ x: 0, y: 0 }, { x: 1, y: 0 }], 0.25);
  expect(pts[0]).toEqual({ x: 0, y: 0 });
  expect(pts[pts.length - 1]).toEqual({ x: 1, y: 0 });
  // length 1 at step 0.25 => 4 segments => 5 points
  expect(pts.length).toBe(5);
});

test('samplePolyline spans multiple anchors', () => {
  const pts = samplePolyline([{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], 0.5);
  expect(pts[0]).toEqual({ x: 0, y: 0 });
  expect(pts[pts.length - 1]).toEqual({ x: 1, y: 1 });
  // each unit segment => 2 sub-segments => 2+2 added to the start point = 5
  expect(pts.length).toBe(5);
});
