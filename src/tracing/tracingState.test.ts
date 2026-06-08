import { test, expect } from 'vitest';
import type { Letter } from '../letters/types';
import { createTraceState, applyPointer, progress } from './tracingState';

// Simple 2-stroke letter: each stroke has 2 checkpoints.
const L: Letter = {
  glyph: 'T',
  strokes: [
    { checkpoints: [ { x: 0, y: 0 }, { x: 1, y: 0 } ] },
    { checkpoints: [ { x: 0.5, y: 0 }, { x: 0.5, y: 1 } ] },
  ],
  personalities: [],
};
const TOL = 0.15;

test('starts at first checkpoint of first stroke, not done', () => {
  const s = createTraceState();
  expect(s).toEqual({ strokeIndex: 0, checkpointIndex: 0, done: false });
});

test('pointer far from target does nothing', () => {
  const s = applyPointer(L, createTraceState(), { x: 0.9, y: 0.9 }, TOL);
  expect(s.checkpointIndex).toBe(0);
});

test('pointer near next checkpoint advances within stroke', () => {
  const s = applyPointer(L, createTraceState(), { x: 0.05, y: 0.05 }, TOL);
  expect(s).toMatchObject({ strokeIndex: 0, checkpointIndex: 1, done: false });
});

test('finishing a stroke advances to next stroke', () => {
  let s = createTraceState();
  s = applyPointer(L, s, { x: 0, y: 0 }, TOL);   // cp0
  s = applyPointer(L, s, { x: 1, y: 0 }, TOL);   // cp1 -> stroke done
  expect(s).toMatchObject({ strokeIndex: 1, checkpointIndex: 0, done: false });
});

test('covering all strokes marks done', () => {
  let s = createTraceState();
  for (const stroke of L.strokes) {
    for (const cp of stroke.checkpoints) s = applyPointer(L, s, cp, TOL);
  }
  expect(s.done).toBe(true);
});

test('progress goes 0 -> 1', () => {
  let s = createTraceState();
  expect(progress(L, s)).toBe(0);
  for (const stroke of L.strokes)
    for (const cp of stroke.checkpoints) s = applyPointer(L, s, cp, TOL);
  expect(progress(L, s)).toBe(1);
});
