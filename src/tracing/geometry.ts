import type { Point } from '../letters/types';

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Angle (radians) from a to b, for orienting direction arrows. */
export function angle(a: Point, b: Point): number {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

/**
 * Sample an anchor polyline into points spaced ~`step` apart (normalized units),
 * always including the first and last anchor. Denser sampling forces the tracer
 * to actually follow the path rather than skipping between sparse checkpoints.
 */
export function samplePolyline(anchors: Point[], step: number): Point[] {
  if (anchors.length === 0) return [];
  const out: Point[] = [anchors[0]];
  for (let i = 1; i < anchors.length; i++) {
    const a = anchors[i - 1];
    const b = anchors[i];
    const segments = Math.max(1, Math.round(distance(a, b) / step));
    for (let k = 1; k <= segments; k++) out.push(lerp(a, b, k / segments));
  }
  return out;
}
