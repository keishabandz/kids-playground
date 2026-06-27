import type { Point } from '../letters/types';

export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function lerp(a: Point, b: Point, t: number): Point {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/**
 * A square viewBox [x, y, side] tightly framing a letter's strokes (plus pad),
 * so the glyph fills its rendered box instead of floating in empty margins.
 */
export function squareBox(strokes: Point[][], pad = 0.08): [number, number, number] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const s of strokes) for (const p of s) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const side = Math.max(maxX - minX, maxY - minY) + pad * 2;
  return [cx - side / 2, cy - side / 2, side];
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
