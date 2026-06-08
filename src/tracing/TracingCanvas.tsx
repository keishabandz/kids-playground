import { useEffect, useMemo, useRef, useState } from 'react';
import type { Letter, Point } from '../letters/types';
import { angle, samplePolyline } from './geometry';
import { createTraceState, applyPointer, type SampledStrokes, type TraceState } from './tracingState';

const STEP = 0.06;       // checkpoint spacing
const TOLERANCE = 0.11;  // how close the finger must pass to advance
const LOOKAHEAD = 3;     // how many checkpoints it may jump ahead (forgives speed/wobble)

type Arrow = { x: number; y: number; deg: number };

function arrowsFor(points: Point[]): Arrow[] {
  const arrows: Arrow[] = [];
  for (let i = 0; i < points.length - 1; i += 4) {
    arrows.push({ x: points[i].x, y: points[i].y, deg: (angle(points[i], points[i + 1]) * 180) / Math.PI });
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

  // Reset trail when the active stroke changes (so the reveal restarts per stroke).
  const activeStroke = state.strokeIndex;
  useEffect(() => { setTrail([]); }, [activeStroke]);

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
    setState((st) => {
      const next = applyPointer(sampled, st, pt, TOLERANCE, LOOKAHEAD);
      if (next.strokeIndex === st.strokeIndex) setTrail((t) => [...t, pt]);
      return next;
    });
  }

  const dotFill = (i: number, j: number) => {
    if (state.done || i < state.strokeIndex) return color;        // completed strokes
    if (i === state.strokeIndex) return j <= state.frontier ? color : '#cbd5e1'; // active
    return '#e8eaf0';                                              // upcoming (dim)
  };

  // The glowing "go here next" dot on the active stroke.
  const active = sampled[state.strokeIndex];
  const nextTarget = active ? active[Math.min(active.length - 1, state.frontier + 1)] : undefined;

  return (
    <svg
      ref={ref}
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); handleMove(e); }}
      onPointerMove={handleMove}
      style={{ width: 'min(82vw, 70vh)', height: 'min(82vw, 70vh)', touchAction: 'none' }}
    >
      {sampled.map((stroke, i) => (
        <g key={i}>
          {stroke.map((c, j) => (
            <circle key={j} cx={c.x} cy={c.y} r={0.016} fill={dotFill(i, j)} />
          ))}
          {/* arrows only on the active stroke (guidance for the current part) */}
          {i === state.strokeIndex && arrowsFor(stroke).map((ar, k) => (
            <polygon
              key={`a${k}`}
              points="-0.012,-0.02 0.028,0 -0.012,0.02"
              fill="#60a5fa"
              transform={`translate(${ar.x} ${ar.y}) rotate(${ar.deg})`}
            />
          ))}
        </g>
      ))}
      {/* trace-to-reveal trail for the active stroke */}
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
      {/* glowing "go here next" guide dot */}
      {nextTarget && !state.done && (
        <circle cx={nextTarget.x} cy={nextTarget.y} r={0.05} fill="#22c55e">
          <animate attributeName="r" values="0.04;0.06;0.04" dur="0.9s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
