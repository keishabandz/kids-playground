import { test, expect } from 'vitest';
import { createTraceState, applyPointer, progress, totalCheckpoints, type SampledStrokes } from './tracingState';

// Two strokes, 4 checkpoints each => 8 total. threshold 0.7 => each needs >=3/4.
const S: SampledStrokes = [
  [{ x: 0, y: 0 }, { x: 0.33, y: 0 }, { x: 0.66, y: 0 }, { x: 1, y: 0 }],
  [{ x: 0, y: 1 }, { x: 0.33, y: 1 }, { x: 0.66, y: 1 }, { x: 1, y: 1 }],
];
const TOL = 0.1;
const TH = 0.7;

const hit = (s: ReturnType<typeof createTraceState>, p: { x: number; y: number }) =>
  applyPointer(S, s, p, TOL, TH);

test('starts empty, not done', () => {
  expect(createTraceState()).toEqual({ covered: [], done: false });
  expect(totalCheckpoints(S)).toBe(8);
});

test('far pointer covers nothing', () => {
  expect(hit(createTraceState(), { x: 0.5, y: 0.5 }).covered).toEqual([]);
});

test('every stroke must be covered — one fully-traced stroke is not enough', () => {
  let s = createTraceState();
  for (const p of S[0]) s = hit(s, p);       // stroke 0 fully
  for (const p of S[1].slice(0, 1)) s = hit(s, p); // stroke 1 barely
  expect(s.done).toBe(false);
});

test('completes when every stroke is >=70% covered (order-free)', () => {
  let s = createTraceState();
  // do the SECOND stroke first, 3/4
  for (const p of S[1].slice(0, 3)) s = hit(s, p);
  // then the first stroke, 3/4
  for (const p of S[0].slice(0, 3)) s = hit(s, p);
  expect(s.done).toBe(true);
});

test('a small skipped stroke blocks completion (the crossbar case)', () => {
  // 3 strokes; cover the two big ones fully but skip the small third entirely
  const T: SampledStrokes = [S[0], S[1], [{ x: 0.4, y: 0.5 }, { x: 0.6, y: 0.5 }]];
  let s = createTraceState();
  for (const p of [...T[0], ...T[1]]) s = applyPointer(T, s, p, TOL, TH);
  expect(s.done).toBe(false); // third stroke untouched
  for (const p of T[2]) s = applyPointer(T, s, p, TOL, TH);
  expect(s.done).toBe(true);
});

test('progress grows from 0 to 1', () => {
  let s = createTraceState();
  expect(progress(S, s)).toBe(0);
  for (const stroke of S) for (const p of stroke) s = hit(s, p);
  expect(progress(S, s)).toBe(1);
});
