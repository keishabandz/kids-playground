import type { Point } from '../letters/types';
import { distance } from './geometry';

/** Strokes as sampled checkpoint lists (output of samplePolyline per stroke). */
export type SampledStrokes = Point[][];

export type TraceState = {
  strokeIndex: number;
  /** Covered checkpoint indices within the CURRENT stroke (any order). */
  covered: number[];
  done: boolean;
};

export function createTraceState(): TraceState {
  return { strokeIndex: 0, covered: [], done: false };
}

/**
 * Coverage-based, skip-tolerant tracing.
 *
 * As the finger moves, any checkpoint of the current stroke within tolerance is
 * marked covered (order doesn't matter — wobble and speed are forgiven). A
 * stroke finishes when enough of it is covered (`coverage`) AND its endpoint is
 * reached (within the tighter `endTolerance`), so a sloppy partial line can't
 * complete it but a fast imperfect trace can. Strokes are still completed in
 * order, then the letter is done.
 */
export function applyPointer(
  strokes: SampledStrokes,
  state: TraceState,
  p: Point,
  tolerance: number,
  endTolerance: number = tolerance,
  coverage: number = 0.8,
): TraceState {
  if (state.done) return state;
  const stroke = strokes[state.strokeIndex];
  const last = stroke.length - 1;

  const covered = new Set(state.covered);
  for (let j = 0; j < stroke.length; j++) {
    const tol = j === last ? endTolerance : tolerance;
    if (distance(p, stroke[j]) <= tol) covered.add(j);
  }

  const strokeComplete = covered.has(last) && covered.size / stroke.length >= coverage;
  if (strokeComplete) {
    const nextStroke = state.strokeIndex + 1;
    if (nextStroke >= strokes.length) {
      return { strokeIndex: state.strokeIndex, covered: sorted(covered), done: true };
    }
    return { strokeIndex: nextStroke, covered: [], done: false };
  }
  return { strokeIndex: state.strokeIndex, covered: sorted(covered), done: false };
}

function sorted(set: Set<number>): number[] {
  return Array.from(set).sort((a, b) => a - b);
}

/** Fraction of all checkpoints covered, 0..1. */
export function progress(strokes: SampledStrokes, state: TraceState): number {
  const total = strokes.reduce((n, s) => n + s.length, 0);
  if (total === 0 || state.done) return 1;
  let done = 0;
  for (let i = 0; i < state.strokeIndex; i++) done += strokes[i].length;
  return (done + state.covered.length) / total;
}
