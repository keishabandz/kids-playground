import { test, expect } from 'vitest';
import { createTraceState, applyPointer, progress, type SampledStrokes } from './tracingState';

// 2 strokes, each already sampled into 2 checkpoints.
const S: SampledStrokes = [
  [ { x: 0, y: 0 }, { x: 1, y: 0 } ],
  [ { x: 0.5, y: 0 }, { x: 0.5, y: 1 } ],
];
const TOL = 0.15;

test('starts at first checkpoint of first stroke, not done', () => {
  expect(createTraceState()).toEqual({ strokeIndex: 0, checkpointIndex: 0, done: false });
});

test('pointer far from target does nothing', () => {
  const s = applyPointer(S, createTraceState(), { x: 0.9, y: 0.9 }, TOL);
  expect(s.checkpointIndex).toBe(0);
});

test('pointer near next checkpoint advances within stroke', () => {
  const s = applyPointer(S, createTraceState(), { x: 0.05, y: 0.05 }, TOL);
  expect(s).toMatchObject({ strokeIndex: 0, checkpointIndex: 1, done: false });
});

test('finishing a stroke advances to next stroke', () => {
  let s = createTraceState();
  s = applyPointer(S, s, { x: 0, y: 0 }, TOL);
  s = applyPointer(S, s, { x: 1, y: 0 }, TOL);
  expect(s).toMatchObject({ strokeIndex: 1, checkpointIndex: 0, done: false });
});

test('covering all strokes marks done', () => {
  let s = createTraceState();
  for (const stroke of S) for (const cp of stroke) s = applyPointer(S, s, cp, TOL);
  expect(s.done).toBe(true);
});

test('progress goes 0 -> 1', () => {
  let s = createTraceState();
  expect(progress(S, s)).toBe(0);
  for (const stroke of S) for (const cp of stroke) s = applyPointer(S, s, cp, TOL);
  expect(progress(S, s)).toBe(1);
});

test('out-of-order pointer cannot skip ahead (must follow path)', () => {
  // jumping straight to the far checkpoint of stroke 1 does nothing
  const s = applyPointer(S, createTraceState(), { x: 0.5, y: 1 }, TOL);
  expect(s).toMatchObject({ strokeIndex: 0, checkpointIndex: 0 });
});

test('stroke endpoint requires the tighter endTolerance', () => {
  // One stroke, two checkpoints; the 2nd is the endpoint.
  const one = [[ { x: 0, y: 0 }, { x: 1, y: 0 } ]];
  let s = applyPointer(one, createTraceState(), { x: 0, y: 0 }, 0.15, 0.05); // hit start
  expect(s.checkpointIndex).toBe(1);
  // 0.1 away from the endpoint: allowed by tolerance (0.15) but NOT endTolerance (0.05)
  s = applyPointer(one, s, { x: 0.9, y: 0 }, 0.15, 0.05);
  expect(s.done).toBe(false);
  // within endTolerance of the endpoint: now it finishes
  s = applyPointer(one, s, { x: 0.97, y: 0 }, 0.15, 0.05);
  expect(s.done).toBe(true);
});
