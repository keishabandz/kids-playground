import { test, expect } from 'vitest';
import { createTraceState, applyPointer, progress, type SampledStrokes } from './tracingState';

// Two strokes of 6 checkpoints each (x from 0..1), at y=0 and y=1.
const mk = (y: number) => [0, 0.2, 0.4, 0.6, 0.8, 1].map((x) => ({ x, y }));
const S: SampledStrokes = [mk(0), mk(1)];
const TOL = 0.1;
const LA = 3;

const hit = (s: ReturnType<typeof createTraceState>, p: { x: number; y: number }) =>
  applyPointer(S, s, p, TOL, LA);

test('starts not started, not done', () => {
  expect(createTraceState()).toEqual({ strokeIndex: 0, frontier: -1, done: false });
});

test('far pointer does not advance', () => {
  expect(hit(createTraceState(), { x: 0.5, y: 0.5 }).frontier).toBe(-1);
});

test('touching the start begins the frontier', () => {
  expect(hit(createTraceState(), { x: 0, y: 0 })).toMatchObject({ strokeIndex: 0, frontier: 0 });
});

test('advances along the stroke in order', () => {
  let s = createTraceState();
  s = hit(s, { x: 0, y: 0 });
  s = hit(s, { x: 0.2, y: 0 });
  s = hit(s, { x: 0.4, y: 0 });
  expect(s.frontier).toBe(2);
});

test('forgives a small skip within lookahead', () => {
  let s = createTraceState();
  s = hit(s, { x: 0, y: 0 });   // frontier 0
  s = hit(s, { x: 0.4, y: 0 }); // skipped idx1, but idx2 is within lookahead -> frontier 2
  expect(s.frontier).toBe(2);
});

test('does NOT jump across a gap beyond lookahead', () => {
  let s = createTraceState();
  s = hit(s, { x: 0, y: 0 });   // frontier 0; lookahead 3 reaches idx<=3 (x=0.6)
  s = hit(s, { x: 1, y: 0 });   // x=1 is idx5, beyond frontier+lookahead -> no advance
  expect(s.frontier).toBe(0);
});

test('cannot finish a stroke without reaching its end', () => {
  let s = createTraceState();
  for (const x of [0, 0.2, 0.4, 0.6]) s = hit(s, { x, y: 0 }); // up to idx3
  expect(s.done).toBe(false);
  expect(s.strokeIndex).toBe(0); // still on stroke 0
});

test('reaching the end advances to the next stroke, then finishes', () => {
  let s = createTraceState();
  for (const x of [0, 0.2, 0.4, 0.6, 0.8, 1]) s = hit(s, { x, y: 0 }); // finish stroke 0
  expect(s).toMatchObject({ strokeIndex: 1, frontier: -1, done: false });
  for (const x of [0, 0.2, 0.4, 0.6, 0.8, 1]) s = hit(s, { x, y: 1 }); // finish stroke 1
  expect(s.done).toBe(true);
});

test('progress grows 0 -> 1', () => {
  let s = createTraceState();
  expect(progress(S, s)).toBe(0);
  for (const stroke of S) for (const p of stroke) s = hit(s, p);
  expect(progress(S, s)).toBe(1);
});
