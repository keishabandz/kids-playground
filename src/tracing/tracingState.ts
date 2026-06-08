import type { Point } from '../letters/types';
import { distance } from './geometry';

/** Strokes as sampled checkpoint lists (output of samplePolyline per stroke). */
export type SampledStrokes = Point[][];

export type TraceState = {
  /** The stroke currently being traced. */
  strokeIndex: number;
  /** Furthest checkpoint index reached in the active stroke; -1 = not started. */
  frontier: number;
  done: boolean;
};

export function createTraceState(): TraceState {
  return { strokeIndex: 0, frontier: -1, done: false };
}

/**
 * Guided, one-stroke-at-a-time tracing with a forgiving frontier.
 *
 * Within the active stroke the finger pushes a "frontier" from start to end. It
 * may jump up to `lookahead` checkpoints ahead (forgiving speed and wobble) but
 * can't skip arbitrarily far. A stroke is only finished when the frontier
 * reaches its END — so the reward can NEVER fire before the child finishes the
 * line. Strokes advance in order; the letter is done at the last stroke's end.
 */
export function applyPointer(
  strokes: SampledStrokes,
  state: TraceState,
  p: Point,
  tolerance: number,
  endTolerance: number = tolerance,
  lookahead: number = 3,
): TraceState {
  if (state.done) return state;
  const stroke = strokes[state.strokeIndex];
  const last = stroke.length - 1;

  let frontier = state.frontier;
  const to = Math.min(last, frontier + lookahead);
  for (let k = frontier + 1; k <= to; k++) {
    // The endpoint needs a tight radius so the finger must actually reach the
    // tip; mid-stroke checkpoints stay forgiving.
    const tol = k === last ? endTolerance : tolerance;
    if (distance(p, stroke[k]) <= tol) frontier = Math.max(frontier, k);
  }

  if (frontier >= last) {
    const nextStroke = state.strokeIndex + 1;
    if (nextStroke >= strokes.length) {
      return { strokeIndex: state.strokeIndex, frontier: last, done: true };
    }
    return { strokeIndex: nextStroke, frontier: -1, done: false };
  }
  return { strokeIndex: state.strokeIndex, frontier, done: false };
}

/** Fraction of all checkpoints traced so far, 0..1. */
export function progress(strokes: SampledStrokes, state: TraceState): number {
  const total = strokes.reduce((n, s) => n + s.length, 0);
  if (total === 0 || state.done) return 1;
  let done = 0;
  for (let i = 0; i < state.strokeIndex; i++) done += strokes[i].length;
  done += Math.max(0, state.frontier + 1);
  return done / total;
}
