import { test, expect } from 'vitest';
import { createTraceState, applyPointer, progress, type SampledStrokes } from './tracingState';

// One stroke, 5 evenly spaced checkpoints along the x axis.
const ONE: SampledStrokes = [[
  { x: 0, y: 0 }, { x: 0.25, y: 0 }, { x: 0.5, y: 0 }, { x: 0.75, y: 0 }, { x: 1, y: 0 },
]];
const TOL = 0.1;
const END = 0.05;
const COV = 0.8;

const hit = (s: ReturnType<typeof createTraceState>, x: number, y = 0) =>
  applyPointer(ONE, s, { x, y }, TOL, END, COV);

test('starts empty, not done', () => {
  expect(createTraceState()).toEqual({ strokeIndex: 0, covered: [], done: false });
});

test('far pointer covers nothing', () => {
  expect(hit(createTraceState(), 0.5, 0.9).covered).toEqual([]);
});

test('skip-tolerant: 80% coverage + endpoint completes even with a gap', () => {
  let s = createTraceState();
  s = hit(s, 0);     // idx 0
  s = hit(s, 0.25);  // idx 1
  // skip idx 2 (the middle) — like a fast finger
  s = hit(s, 0.75);  // idx 3
  expect(s.done).toBe(false);
  s = hit(s, 1);     // idx 4 (endpoint) -> 4/5 = 0.8 + endpoint => done
  expect(s.done).toBe(true);
});

test('order does not matter (endpoint first is fine)', () => {
  let s = createTraceState();
  s = hit(s, 1);     // endpoint first
  s = hit(s, 0);
  s = hit(s, 0.25);
  s = hit(s, 0.75);  // 0,1,3,4 covered = 0.8 + endpoint
  expect(s.done).toBe(true);
});

test('cannot finish without reaching the endpoint', () => {
  let s = createTraceState();
  s = hit(s, 0);
  s = hit(s, 0.25);
  s = hit(s, 0.5);
  s = hit(s, 0.75); // 0..3 covered = 0.8 but endpoint missing
  expect(s.done).toBe(false);
  s = hit(s, 0.9);  // 0.1 from endpoint > END (0.05): still not covered
  expect(s.done).toBe(false);
  s = hit(s, 0.97); // within END of endpoint
  expect(s.done).toBe(true);
});

test('a too-short partial line cannot complete', () => {
  let s = createTraceState();
  s = hit(s, 0);
  s = hit(s, 0.25); // only 2/5 = 0.4 coverage, no endpoint
  expect(s.done).toBe(false);
});

test('multi-stroke advances then finishes', () => {
  const TWO: SampledStrokes = [
    [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 1, y: 0 }],
    [{ x: 0, y: 1 }, { x: 0.5, y: 1 }, { x: 1, y: 1 }],
  ];
  let s = createTraceState();
  for (const p of TWO[0]) s = applyPointer(TWO, s, p, TOL, END, 0.9);
  expect(s).toMatchObject({ strokeIndex: 1, done: false });
  for (const p of TWO[1]) s = applyPointer(TWO, s, p, TOL, END, 0.9);
  expect(s.done).toBe(true);
});

test('progress grows from 0 to 1', () => {
  let s = createTraceState();
  expect(progress(ONE, s)).toBe(0);
  for (const x of [0, 0.25, 0.5, 0.75, 1]) s = hit(s, x);
  expect(progress(ONE, s)).toBe(1);
});
