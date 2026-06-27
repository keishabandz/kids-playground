import { useEffect, useMemo, useRef, useState } from 'react';
import type { Letter, Point } from '../letters/types';
import { angle, samplePolyline, squareBox } from './geometry';
import { createTraceState, applyPointer, type SampledStrokes, type TraceState } from './tracingState';

const STEP = 0.04;          // checkpoint spacing (fine, for smooth fill)
const TOLERANCE = 0.12;     // forgiving radius for mid-stroke checkpoints
const END_TOLERANCE = 0.06; // tight radius for a stroke's endpoint — must reach the tip
const LOOKAHEAD = 5;        // checkpoints it may jump ahead (forgives speed/wobble)

const TRACK_W = 0.09;       // grey guide-track thickness
const INK_W = 0.078;        // filled ink thickness

function ptsStr(points: Point[]): string {
  return points.map((p) => `${p.x},${p.y}`).join(' ');
}

export function TracingCanvas({ letter, color, onComplete, size = 'min(82vw, 70vh)', fit = false }:
  { letter: Letter; color: string; onComplete: () => void; size?: string; fit?: boolean }) {
  const ref = useRef<SVGSVGElement>(null);
  const [state, setState] = useState<TraceState>(createTraceState);
  const firedRef = useRef(false);

  const sampled: SampledStrokes = useMemo(
    () => letter.strokes.map((stroke) => samplePolyline(stroke.points, STEP)),
    [letter],
  );

  // When `fit`, crop the viewBox tight to the glyph so it fills the box.
  const [bx, by, side] = useMemo(
    () => (fit ? squareBox(sampled) : [0, 0, 1]),
    [sampled, fit],
  );

  useEffect(() => {
    if (state.done && !firedRef.current) {
      firedRef.current = true;
      onComplete();
    }
  }, [state.done, onComplete]);

  function toUnit(e: React.PointerEvent): Point {
    const r = ref.current!.getBoundingClientRect();
    // Map screen position back to normalized 0..1 coords, accounting for crop.
    return {
      x: bx + ((e.clientX - r.left) / r.width) * side,
      y: by + ((e.clientY - r.top) / r.height) * side,
    };
  }

  function handleMove(e: React.PointerEvent) {
    if (e.buttons === 0 && e.pointerType === 'mouse') return;
    const pt = toUnit(e);
    setState((st) => applyPointer(sampled, st, pt, TOLERANCE, END_TOLERANCE, LOOKAHEAD));
  }

  const active = state.strokeIndex;

  // Ink (filled portion) for a stroke, snapped to its guide path.
  const inkPoints = (i: number): Point[] => {
    if (state.done || i < active) return sampled[i];                 // completed strokes: full
    if (i === active && state.frontier >= 0) return sampled[i].slice(0, state.frontier + 1);
    return [];                                                       // upcoming: none
  };

  // Direction arrows along the active stroke only.
  const activePts = sampled[active] ?? [];
  const arrows = activePts.filter((_, i) => i % 8 === 2 && i < activePts.length - 2)
    .map((p, idx) => {
      const i = activePts.indexOf(p);
      return { x: p.x, y: p.y, deg: (angle(p, activePts[i + 1]) * 180) / Math.PI, key: idx };
    });

  // The moving star: the next point the finger should reach on the active stroke.
  const star = !state.done && activePts.length
    ? activePts[Math.min(activePts.length - 1, state.frontier + 1)]
    : undefined;

  return (
    <svg
      ref={ref}
      viewBox={`${bx} ${by} ${side} ${side}`}
      preserveAspectRatio="xMidYMid meet"
      onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); handleMove(e); }}
      onPointerMove={handleMove}
      style={{ width: size, height: size, touchAction: 'none' }}
    >
      {/* grey guide track for the whole letter */}
      {sampled.map((s, i) => (
        <polyline key={`t${i}`} points={ptsStr(s)} fill="none" stroke="#e5e7eb"
                  strokeWidth={TRACK_W} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {/* colored ink, snapped to the path, filling as the child traces */}
      {sampled.map((_s, i) => {
        const ip = inkPoints(i);
        if (ip.length === 1) return <circle key={`k${i}`} cx={ip[0].x} cy={ip[0].y} r={INK_W / 2} fill={color} />;
        if (ip.length > 1) return <polyline key={`k${i}`} points={ptsStr(ip)} fill="none" stroke={color}
                                            strokeWidth={INK_W} strokeLinecap="round" strokeLinejoin="round" />;
        return null;
      })}
      {/* direction arrows on the active stroke */}
      {!state.done && arrows.map((ar) => (
        <polygon key={`a${ar.key}`} points="-0.01,-0.016 0.024,0 -0.01,0.016" fill="#3b82f6"
                 opacity={0.7} transform={`translate(${ar.x} ${ar.y}) rotate(${ar.deg})`} />
      ))}
      {/* moving star guide ("start at the star, follow it") */}
      {star && (
        <text x={star.x} y={star.y} fontSize={0.14} textAnchor="middle" dominantBaseline="central">
          ⭐
          <animate attributeName="font-size" values="0.12;0.17;0.12" dur="0.9s" repeatCount="indefinite" />
        </text>
      )}
    </svg>
  );
}
