import { useEffect, useMemo, useRef, useState } from 'react';
import type { Letter, Point } from '../letters/types';
import { angle, samplePolyline } from './geometry';
import { createTraceState, applyPointer, type SampledStrokes, type TraceState } from './tracingState';

const STEP = 0.06;          // checkpoint spacing — dense enough to force following the path
const TOLERANCE = 0.10;     // how close the finger must stay to the next checkpoint
const END_TOLERANCE = 0.045; // must reach this close to a stroke's end to finish it

type Arrow = { x: number; y: number; deg: number };

function arrowsFor(points: Point[]): Arrow[] {
  const arrows: Arrow[] = [];
  for (let i = 0; i < points.length - 1; i += 4) {
    const a = points[i];
    const b = points[i + 1];
    arrows.push({ x: a.x, y: a.y, deg: (angle(a, b) * 180) / Math.PI });
  }
  return arrows;
}

export function TracingCanvas({ letter, color, onComplete }:
  { letter: Letter; color: string; onComplete: () => void }) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<TraceState>(createTraceState);
  const [trail, setTrail] = useState<Point[]>([]);
  const firedRef = useRef(false);

  const sampled: SampledStrokes = useMemo(
    () => letter.strokes.map((stroke) => samplePolyline(stroke.points, STEP)),
    [letter],
  );

  // Fire completion exactly once, outside the state updater (StrictMode-safe).
  useEffect(() => {
    if (state.done && !firedRef.current) {
      firedRef.current = true;
      onComplete();
    }
  }, [state.done, onComplete]);

  function toUnit(e: React.PointerEvent): Point {
    const r = ref.current!.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height };
  }

  function handleMove(e: React.PointerEvent) {
    if (e.buttons === 0 && e.pointerType === 'mouse') return;
    const pt = toUnit(e);
    setTrail((t) => [...t, pt]);
    setState((st) => applyPointer(sampled, st, pt, TOLERANCE, END_TOLERANCE));
  }

  // The start marker sits at the beginning of the current stroke.
  const startDot = state.checkpointIndex === 0 ? sampled[state.strokeIndex]?.[0] : undefined;

  return (
    <svg
      ref={ref}
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); handleMove(e); }}
      onPointerMove={handleMove}
      style={{ width: 'min(82vw, 70vh)', height: 'min(82vw, 70vh)', touchAction: 'none' }}
    >
      {/* dotted outline */}
      {sampled.map((stroke, i) => (
        <g key={i}>
          {stroke.map((c, j) => (
            <circle key={j} cx={c.x} cy={c.y} r={0.014} fill="#cbd5e1" />
          ))}
          {/* direction arrows */}
          {arrowsFor(stroke).map((ar, k) => (
            <polygon
              key={`a${k}`}
              points="-0.012,-0.02 0.028,0 -0.012,0.02"
              fill="#60a5fa"
              transform={`translate(${ar.x} ${ar.y}) rotate(${ar.deg})`}
            />
          ))}
        </g>
      ))}
      {/* trace-to-reveal trail */}
      {trail.length > 1 && (
        <polyline
          fill="none"
          stroke={color}
          strokeOpacity={0.85}
          strokeWidth={0.06}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={trail.map((pt) => `${pt.x},${pt.y}`).join(' ')}
        />
      )}
      {/* "start here" marker for the current stroke */}
      {startDot && (
        <circle cx={startDot.x} cy={startDot.y} r={0.045} fill="#22c55e">
          <animate attributeName="r" values="0.04;0.055;0.04" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
