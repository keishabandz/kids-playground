import { useRef, useState } from 'react';
import type { Letter, Point } from '../letters/types';
import { createTraceState, applyPointer, progress, type TraceState } from './tracingState';

const TOLERANCE = 0.16; // generous, toddler-forgiving

export function TracingCanvas({ letter, color, onComplete }:
  { letter: Letter; color: string; onComplete: () => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<TraceState>(createTraceState);
  const [trail, setTrail] = useState<Point[]>([]);

  function toUnit(e: React.PointerEvent): Point {
    const r = ref.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  function handleMove(e: React.PointerEvent) {
    if (e.buttons === 0 && e.pointerType === 'mouse') return;
    const p = toUnit(e);
    setTrail((t) => [...t, p]);
    setState((s) => {
      const next = applyPointer(letter, s, p, TOLERANCE);
      if (next.done && !s.done) setTimeout(onComplete, 0);
      return next;
    });
  }

  const start = letter.strokes[0].checkpoints[0];
  return (
    <svg
      ref={ref}
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); handleMove(e); }}
      onPointerMove={handleMove}
      style={{ width: 'min(80vw, 70vh)', height: 'min(80vw, 70vh)', touchAction: 'none' }}
    >
      {/* dotted outline */}
      {letter.strokes.map((stroke, i) => (
        <polyline
          key={i}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth={0.04}
          strokeLinecap="round"
          strokeDasharray="0.001 0.06"
          points={stroke.checkpoints.map((c) => `${c.x},${c.y}`).join(' ')}
        />
      ))}
      {/* trace-to-reveal trail */}
      {trail.length > 1 && (
        <polyline
          fill="none"
          stroke={color}
          strokeOpacity={0.85}
          strokeWidth={0.05}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={trail.map((p) => `${p.x},${p.y}`).join(' ')}
        />
      )}
      {/* start dot (hidden once any progress) */}
      {progress(letter, state) === 0 && (
        <circle cx={start.x} cy={start.y} r={0.05} fill="#22c55e" />
      )}
    </svg>
  );
}
