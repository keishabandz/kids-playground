import { useMemo } from 'react';
import type { Letter } from '../letters/types';
import { samplePolyline } from './geometry';

/**
 * Static (non-interactive) render of a letter's guide track — grey by default,
 * fully inked in `color` when `done`. Matches TracingCanvas's track/ink look so
 * a completed letter in a word row looks the same as a traced one.
 */
export function LetterGlyph({ letter, color, done, size, dim }:
  { letter: Letter; color: string; done?: boolean; size: string; dim?: boolean }) {
  const sampled = useMemo(
    () => letter.strokes.map((stroke) => samplePolyline(stroke.points, 0.04)),
    [letter],
  );
  const pts = (s: { x: number; y: number }[]) => s.map((p) => `${p.x},${p.y}`).join(' ');
  return (
    <svg viewBox="0 0 1 1" preserveAspectRatio="xMidYMid meet"
         style={{ width: size, height: size, opacity: dim ? 0.45 : 1 }}>
      {sampled.map((s, i) => (
        <polyline key={`t${i}`} points={pts(s)} fill="none" stroke="#e5e7eb"
                  strokeWidth={0.09} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {done && sampled.map((s, i) => (
        <polyline key={`k${i}`} points={pts(s)} fill="none" stroke={color}
                  strokeWidth={0.078} strokeLinecap="round" strokeLinejoin="round" />
      ))}
    </svg>
  );
}
