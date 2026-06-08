import type { Point } from '../letters/types';
import { distance } from './geometry';

/** Strokes as sampled checkpoint lists (output of samplePolyline per stroke). */
export type SampledStrokes = Point[][];

export type TraceState = {
  strokeIndex: number;
  checkpointIndex: number;
  done: boolean;
};

export function createTraceState(): TraceState {
  return { strokeIndex: 0, checkpointIndex: 0, done: false };
}

/** Pure: if `p` is within `tolerance` of the next expected checkpoint, advance. */
export function applyPointer(strokes: SampledStrokes, state: TraceState, p: Point, tolerance: number): TraceState {
  if (state.done) return state;
  const stroke = strokes[state.strokeIndex];
  const target = stroke[state.checkpointIndex];
  if (distance(p, target) > tolerance) return state;

  let strokeIndex = state.strokeIndex;
  let checkpointIndex = state.checkpointIndex + 1;
  if (checkpointIndex >= stroke.length) {
    strokeIndex += 1;
    checkpointIndex = 0;
  }
  if (strokeIndex >= strokes.length) {
    return { strokeIndex: state.strokeIndex, checkpointIndex: state.checkpointIndex, done: true };
  }
  return { strokeIndex, checkpointIndex, done: false };
}

/** Fraction of all checkpoints covered, 0..1. */
export function progress(strokes: SampledStrokes, state: TraceState): number {
  const total = strokes.reduce((n, s) => n + s.length, 0);
  if (total === 0) return 1;
  let covered = 0;
  for (let i = 0; i < state.strokeIndex; i++) covered += strokes[i].length;
  covered += state.checkpointIndex;
  if (state.done) covered = total;
  return covered / total;
}
