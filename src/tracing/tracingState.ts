import type { Point } from '../letters/types';
import { distance } from './geometry';

/** Strokes as sampled checkpoint lists (output of samplePolyline per stroke). */
export type SampledStrokes = Point[][];

export type TraceState = {
  /** Flat checkpoint indices (across all strokes) that have been covered. */
  covered: number[];
  done: boolean;
};

export function createTraceState(): TraceState {
  return { covered: [], done: false };
}

export function totalCheckpoints(strokes: SampledStrokes): number {
  return strokes.reduce((n, s) => n + s.length, 0);
}

/**
 * Order-free, per-stroke coverage tracing. Every checkpoint within `tolerance`
 * of the finger is marked covered; the letter is done once EVERY stroke is at
 * least `threshold` covered.
 *
 * Per-stroke (not global) is what makes this correct: each part of the letter
 * must actually be traced, in any order and direction, so a small stroke like
 * A's crossbar can't be skipped — yet it's forgiving of order, speed and wobble.
 */
export function applyPointer(
  strokes: SampledStrokes,
  state: TraceState,
  p: Point,
  tolerance: number,
  threshold: number = 0.7,
): TraceState {
  if (state.done) return state;
  const covered = new Set(state.covered);
  let idx = 0;
  for (const stroke of strokes) {
    for (const cp of stroke) {
      if (distance(p, cp) <= tolerance) covered.add(idx);
      idx++;
    }
  }
  // Done only when every stroke is individually covered enough.
  let done = strokes.length > 0;
  let k = 0;
  for (const stroke of strokes) {
    let c = 0;
    for (let j = 0; j < stroke.length; j++) { if (covered.has(k)) c++; k++; }
    if (stroke.length > 0 && c / stroke.length < threshold) done = false;
  }
  return { covered: Array.from(covered).sort((a, b) => a - b), done };
}

/** Fraction of all checkpoints covered, 0..1. */
export function progress(strokes: SampledStrokes, state: TraceState): number {
  const total = totalCheckpoints(strokes);
  if (total === 0 || state.done) return 1;
  return state.covered.length / total;
}
