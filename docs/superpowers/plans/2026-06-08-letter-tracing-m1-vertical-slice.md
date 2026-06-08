# Letter Tracing — M1 Vertical Slice Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship one letter (A) fully playable end-to-end on a real phone — trace → reward → "do it again" — as the "is it fun?" discernment gate.

**Architecture:** Vite + React + TypeScript + Tailwind, pure client-side, deployed to Vercel as an installable PWA. Letter geometry is normalized 0–1 so the SVG tracing surface scales crisply to any screen. The tracing engine is a pure state machine (TDD'd) wrapped by an SVG component; rewards are a per-letter ordered set of CSS animation "behaviours" advanced by a pure cursor.

**Tech Stack:** Vite 6, React 19, TypeScript 5, Tailwind v4 (`@tailwindcss/vite`), Vitest, `vite-plugin-pwa`.

**Scope note:** This plan covers **M1 only** (letter A). M2 (all A–Z + home grid), M3 (polish/juice), M4 (release-hardening) get their own plans after the M1 playtest.

---

## File Structure

| File | Responsibility |
|---|---|
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | Scaffold + PWA config |
| `src/main.tsx`, `src/App.tsx`, `src/index.css` | App shell, Tailwind import, animation keyframes |
| `src/letters/types.ts` | `Point`, `Stroke`, `Personality`, `Letter`, `BehaviourId` |
| `src/letters/letterA.ts` | Letter A: strokes + personality set |
| `src/tracing/geometry.ts` | `distance()` |
| `src/tracing/tracingState.ts` | Pure state machine: `createTraceState`, `applyPointer`, `progress` |
| `src/tracing/TracingCanvas.tsx` | SVG surface: dotted outline, start dot, pointer capture, trace-to-reveal, `onComplete` |
| `src/reward/behaviours.ts` | `BehaviourId` → CSS class registry |
| `src/reward/personalityCursor.ts` | Pure `nextPersonality()` (advances per letter, wraps) |
| `src/reward/RewardPersonality.tsx` | Renders one personality (glyph + behaviour + color) |
| `src/screens/StartScreen.tsx` | Minimal tap-to-start (single A tile) |
| `src/screens/LetterTracingScreen.tsx` | Wires letterA → TracingCanvas → reward → replay |
| `public/manifest icons` | PWA icons |
| `*.test.ts` | Vitest unit tests for the three pure modules |

---

## Task 0: Scaffold project + tooling

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

- [ ] **Step 1: Create the Vite React-TS project in place**

Run:
```bash
cd /Users/kshitija/kids-playground
npm create vite@latest . -- --template react-ts
npm install
```
Expected: scaffold files created, deps installed. If prompted about the non-empty dir, choose "Ignore files and continue".

- [ ] **Step 2: Add Tailwind v4, Vitest, and PWA plugin**

Run:
```bash
npm install -D @tailwindcss/vite vitest @vite-pwa/assets-generator vite-plugin-pwa
```

- [ ] **Step 3: Configure Vite (Tailwind + PWA + Vitest)**

Replace `vite.config.ts` with:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Kids Playground',
        short_name: 'Playground',
        description: 'Trace letters and watch them come alive!',
        theme_color: '#fdf2f8',
        background_color: '#fdf2f8',
        display: 'standalone',
        orientation: 'any',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: { environment: 'node' },
});
```

- [ ] **Step 4: Wire Tailwind into the stylesheet**

Replace `src/index.css` with:
```css
@import "tailwindcss";

html, body, #root { height: 100%; margin: 0; }
body { overscroll-behavior: none; -webkit-user-select: none; user-select: none; touch-action: none; }
```

- [ ] **Step 5: Verify dev server boots**

Run: `npm run dev`
Expected: server starts on a localhost port with no errors. Stop it (Ctrl-C) after confirming.

- [ ] **Step 6: Add a smoke test and verify the test runner**

Create `src/smoke.test.ts`:
```ts
import { test, expect } from 'vitest';
test('test runner works', () => { expect(1 + 1).toBe(2); });
```
Add to `package.json` scripts: `"test": "vitest run"`.
Run: `npm test`
Expected: 1 passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite+React+TS+Tailwind+PWA+Vitest"
```

---

## Task 1: Letter types + letter A data

**Files:**
- Create: `src/letters/types.ts`, `src/letters/letterA.ts`

- [ ] **Step 1: Define the domain types**

Create `src/letters/types.ts`:
```ts
/** Normalized coordinate in the unit square; (0,0) top-left, (1,1) bottom-right. */
export type Point = { x: number; y: number };

/** One pen stroke: ordered checkpoints the child must pass through in order. */
export type Stroke = { checkpoints: Point[] };

export type BehaviourId = 'googly-dance' | 'silly-tongue' | 'star-bounce';

/** One reward look: an animation behaviour + the color the glyph turns. */
export type Personality = { behaviour: BehaviourId; color: string };

export type Letter = {
  glyph: string;
  strokes: Stroke[];
  /** This letter's own ordered set, cycled in fixed order on each reward. */
  personalities: Personality[];
};
```

- [ ] **Step 2: Define letter A**

Create `src/letters/letterA.ts`:
```ts
import type { Letter } from './types';

// A = three strokes: left diagonal, right diagonal, crossbar.
// Coordinates normalized 0..1. Checkpoints are coarse on purpose (forgiving).
export const letterA: Letter = {
  glyph: 'A',
  strokes: [
    { checkpoints: [ { x: 0.5, y: 0.1 }, { x: 0.3, y: 0.5 }, { x: 0.1, y: 0.9 } ] }, // left diagonal
    { checkpoints: [ { x: 0.5, y: 0.1 }, { x: 0.7, y: 0.5 }, { x: 0.9, y: 0.9 } ] }, // right diagonal
    { checkpoints: [ { x: 0.3, y: 0.6 }, { x: 0.5, y: 0.6 }, { x: 0.7, y: 0.6 } ] }, // crossbar
  ],
  personalities: [
    { behaviour: 'googly-dance', color: '#ff4d4d' },
    { behaviour: 'silly-tongue', color: '#f59e0b' },
    { behaviour: 'star-bounce',  color: '#ec4899' },
  ],
};
```

- [ ] **Step 3: Commit**

```bash
git add src/letters
git commit -m "feat: letter domain types and letter A data"
```

---

## Task 2: Geometry helper (TDD)

**Files:**
- Create: `src/tracing/geometry.ts`, `src/tracing/geometry.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/tracing/geometry.test.ts`:
```ts
import { test, expect } from 'vitest';
import { distance } from './geometry';

test('distance is euclidean', () => {
  expect(distance({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
});
test('distance is zero for same point', () => {
  expect(distance({ x: 0.2, y: 0.2 }, { x: 0.2, y: 0.2 })).toBe(0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/tracing/geometry.test.ts`
Expected: FAIL — cannot find module './geometry'.

- [ ] **Step 3: Implement**

Create `src/tracing/geometry.ts`:
```ts
import type { Point } from '../letters/types';
export function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/tracing/geometry.test.ts`
Expected: 2 passed.

- [ ] **Step 5: Commit**

```bash
git add src/tracing/geometry.ts src/tracing/geometry.test.ts
git commit -m "feat: distance geometry helper"
```

---

## Task 3: Tracing state machine (TDD)

**Files:**
- Create: `src/tracing/tracingState.ts`, `src/tracing/tracingState.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/tracing/tracingState.test.ts`:
```ts
import { test, expect } from 'vitest';
import type { Letter } from '../letters/types';
import { createTraceState, applyPointer, progress } from './tracingState';

// Simple 2-stroke letter: each stroke has 2 checkpoints.
const L: Letter = {
  glyph: 'T',
  strokes: [
    { checkpoints: [ { x: 0, y: 0 }, { x: 1, y: 0 } ] },
    { checkpoints: [ { x: 0.5, y: 0 }, { x: 0.5, y: 1 } ] },
  ],
  personalities: [],
};
const TOL = 0.15;

test('starts at first checkpoint of first stroke, not done', () => {
  const s = createTraceState();
  expect(s).toEqual({ strokeIndex: 0, checkpointIndex: 0, done: false });
});

test('pointer far from target does nothing', () => {
  const s = applyPointer(L, createTraceState(), { x: 0.9, y: 0.9 }, TOL);
  expect(s.checkpointIndex).toBe(0);
});

test('pointer near next checkpoint advances within stroke', () => {
  const s = applyPointer(L, createTraceState(), { x: 0.05, y: 0.05 }, TOL);
  expect(s).toMatchObject({ strokeIndex: 0, checkpointIndex: 1, done: false });
});

test('finishing a stroke advances to next stroke', () => {
  let s = createTraceState();
  s = applyPointer(L, s, { x: 0, y: 0 }, TOL);   // cp0
  s = applyPointer(L, s, { x: 1, y: 0 }, TOL);   // cp1 -> stroke done
  expect(s).toMatchObject({ strokeIndex: 1, checkpointIndex: 0, done: false });
});

test('covering all strokes marks done', () => {
  let s = createTraceState();
  for (const stroke of L.strokes) {
    for (const cp of stroke.checkpoints) s = applyPointer(L, s, cp, TOL);
  }
  expect(s.done).toBe(true);
});

test('progress goes 0 -> 1', () => {
  let s = createTraceState();
  expect(progress(L, s)).toBe(0);
  for (const stroke of L.strokes)
    for (const cp of stroke.checkpoints) s = applyPointer(L, s, cp, TOL);
  expect(progress(L, s)).toBe(1);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/tracing/tracingState.test.ts`
Expected: FAIL — cannot find module './tracingState'.

- [ ] **Step 3: Implement**

Create `src/tracing/tracingState.ts`:
```ts
import type { Letter, Point } from '../letters/types';
import { distance } from './geometry';

export type TraceState = {
  strokeIndex: number;
  checkpointIndex: number;
  done: boolean;
};

export function createTraceState(): TraceState {
  return { strokeIndex: 0, checkpointIndex: 0, done: false };
}

/** Pure: if `p` is within `tolerance` of the next expected checkpoint, advance. */
export function applyPointer(letter: Letter, state: TraceState, p: Point, tolerance: number): TraceState {
  if (state.done) return state;
  const stroke = letter.strokes[state.strokeIndex];
  const target = stroke.checkpoints[state.checkpointIndex];
  if (distance(p, target) > tolerance) return state;

  let strokeIndex = state.strokeIndex;
  let checkpointIndex = state.checkpointIndex + 1;
  if (checkpointIndex >= stroke.checkpoints.length) {
    strokeIndex += 1;
    checkpointIndex = 0;
  }
  if (strokeIndex >= letter.strokes.length) {
    return { strokeIndex: state.strokeIndex, checkpointIndex: state.checkpointIndex, done: true };
  }
  return { strokeIndex, checkpointIndex, done: false };
}

/** Fraction of all checkpoints covered, 0..1. */
export function progress(letter: Letter, state: TraceState): number {
  const total = letter.strokes.reduce((n, s) => n + s.checkpoints.length, 0);
  if (total === 0) return 1;
  let covered = 0;
  for (let i = 0; i < state.strokeIndex; i++) covered += letter.strokes[i].checkpoints.length;
  covered += state.checkpointIndex;
  if (state.done) covered = total;
  return covered / total;
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/tracing/tracingState.test.ts`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add src/tracing/tracingState.ts src/tracing/tracingState.test.ts
git commit -m "feat: forgiving tracing state machine"
```

---

## Task 4: Personality cursor (TDD)

**Files:**
- Create: `src/reward/personalityCursor.ts`, `src/reward/personalityCursor.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/reward/personalityCursor.test.ts`:
```ts
import { test, expect } from 'vitest';
import { nextPersonality } from './personalityCursor';

const set = ['a', 'b', 'c'];

test('returns items in fixed order then wraps', () => {
  expect(nextPersonality(set, 0)).toBe('a');
  expect(nextPersonality(set, 1)).toBe('b');
  expect(nextPersonality(set, 2)).toBe('c');
  expect(nextPersonality(set, 3)).toBe('a'); // wraps
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npx vitest run src/reward/personalityCursor.test.ts`
Expected: FAIL — cannot find module './personalityCursor'.

- [ ] **Step 3: Implement**

Create `src/reward/personalityCursor.ts`:
```ts
/** The next entry in a letter's set given how many times it's been shown. Wraps. */
export function nextPersonality<T>(set: T[], shownCount: number): T {
  return set[shownCount % set.length];
}
```

- [ ] **Step 4: Run to verify pass**

Run: `npx vitest run src/reward/personalityCursor.test.ts`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add src/reward/personalityCursor.ts src/reward/personalityCursor.test.ts
git commit -m "feat: per-letter personality cursor"
```

---

## Task 5: Reward behaviours + RewardPersonality component

**Files:**
- Create: `src/reward/behaviours.ts`, `src/reward/RewardPersonality.tsx`
- Modify: `src/index.css` (append keyframes + behaviour classes)

- [ ] **Step 1: Behaviour registry**

Create `src/reward/behaviours.ts`:
```ts
import type { BehaviourId } from '../letters/types';

/** Maps a behaviour to the CSS class that animates the glyph + which face to show. */
export const behaviourClass: Record<BehaviourId, string> = {
  'googly-dance': 'beh-dance',
  'silly-tongue': 'beh-wobble',
  'star-bounce': 'beh-bounce',
};

export const behaviourFace: Record<BehaviourId, 'googly' | 'tongue' | 'stars'> = {
  'googly-dance': 'googly',
  'silly-tongue': 'tongue',
  'star-bounce': 'stars',
};
```

- [ ] **Step 2: Append animations to the stylesheet**

Append to `src/index.css`:
```css
/* Reward behaviours */
.beh-dance  { animation: dance 1s ease-in-out infinite; transform-origin: 50% 90%; }
.beh-wobble { animation: wobble 1.1s ease-in-out infinite; transform-origin: 50% 90%; }
.beh-bounce { animation: bounce 0.7s ease-in-out infinite; }
@keyframes dance  { 0%,100%{transform:rotate(-7deg) translateY(0)} 50%{transform:rotate(7deg) translateY(-14px)} }
@keyframes wobble { 0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-5deg) scale(1.04)} 75%{transform:rotate(5deg) scale(.97)} }
@keyframes bounce { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-18px) scale(1.05)} }
.googly-eyes { animation: googly .8s ease-in-out infinite; }
@keyframes googly { 0%,100%{transform:translate(0,2px)} 25%{transform:translate(7px,-7px)} 50%{transform:translate(0,3px)} 75%{transform:translate(-7px,-5px)} }
```

- [ ] **Step 3: RewardPersonality component**

Create `src/reward/RewardPersonality.tsx`:
```tsx
import type { Personality } from '../letters/types';
import { behaviourClass, behaviourFace } from './behaviours';

export function RewardPersonality({ glyph, personality }: { glyph: string; personality: Personality }) {
  const face = behaviourFace[personality.behaviour];
  return (
    <div className="relative inline-flex items-end justify-center" style={{ width: 220, height: 280 }}>
      <span className={behaviourClass[personality.behaviour]}
            style={{ color: personality.color, fontSize: 220, fontWeight: 800, lineHeight: 1 }}>
        {glyph}
      </span>
      <Face kind={face} />
    </div>
  );
}

function Face({ kind }: { kind: 'googly' | 'tongue' | 'stars' }) {
  if (kind === 'stars') {
    return <div className="absolute" style={{ top: 80, fontSize: 44 }}>🤩</div>;
  }
  return (
    <div className="absolute flex flex-col items-center" style={{ top: 86 }}>
      <div className="flex gap-5">
        <Eye googly={kind === 'googly'} />
        <Eye googly={kind === 'googly'} />
      </div>
      {kind === 'tongue' && (
        <div style={{ width: 26, height: 40, marginTop: 10, background: '#ff7a9c', borderRadius: '0 0 14px 14px' }} />
      )}
    </div>
  );
}

function Eye({ googly }: { googly: boolean }) {
  return (
    <div style={{ width: 40, height: 40, background: '#fff', border: '3px solid #222', borderRadius: '50%', overflow: 'hidden', display: 'flex', justifyContent: 'center' }}>
      <div className={googly ? 'googly-eyes' : ''}
           style={{ width: 15, height: 15, marginTop: 16, background: '#222', borderRadius: '50%' }} />
    </div>
  );
}
```

- [ ] **Step 4: Verify it builds**

Run: `npm run build`
Expected: build succeeds with no type errors.

- [ ] **Step 5: Commit**

```bash
git add src/reward src/index.css
git commit -m "feat: reward personalities (dance/tongue/bounce)"
```

---

## Task 6: TracingCanvas (SVG surface)

**Files:**
- Create: `src/tracing/TracingCanvas.tsx`

- [ ] **Step 1: Implement the SVG tracing surface**

Create `src/tracing/TracingCanvas.tsx`:
```tsx
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
    <svg ref={ref} viewBox="0 0 1 1" preserveAspectRatio="xMidYMid meet"
         onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); handleMove(e); }}
         onPointerMove={handleMove}
         style={{ width: 'min(80vw, 70vh)', height: 'min(80vw, 70vh)', touchAction: 'none' }}>
      {/* dotted outline */}
      {letter.strokes.map((stroke, i) => (
        <polyline key={i} fill="none" stroke="#cbd5e1" strokeWidth={0.04}
                  strokeLinecap="round" strokeDasharray="0.001 0.06"
                  points={stroke.checkpoints.map((c) => `${c.x},${c.y}`).join(' ')} />
      ))}
      {/* trace-to-reveal trail */}
      {trail.length > 1 && (
        <polyline fill="none" stroke={color} strokeOpacity={0.85} strokeWidth={0.05}
                  strokeLinecap="round" strokeLinejoin="round"
                  points={trail.map((p) => `${p.x},${p.y}`).join(' ')} />
      )}
      {/* start dot (hidden once any progress) */}
      {progress(letter, state) === 0 && (
        <circle cx={start.x} cy={start.y} r={0.05} fill="#22c55e" />
      )}
    </svg>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/tracing/TracingCanvas.tsx
git commit -m "feat: SVG tracing surface with trace-to-reveal"
```

---

## Task 7: Screens — wire the slice together

**Files:**
- Create: `src/screens/StartScreen.tsx`, `src/screens/LetterTracingScreen.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Tracing screen**

Create `src/screens/LetterTracingScreen.tsx`:
```tsx
import { useState } from 'react';
import { letterA } from '../letters/letterA';
import { TracingCanvas } from '../tracing/TracingCanvas';
import { RewardPersonality } from '../reward/RewardPersonality';
import { nextPersonality } from '../reward/personalityCursor';

export function LetterTracingScreen({ onHome }: { onHome: () => void }) {
  const [shown, setShown] = useState(0);
  const [phase, setPhase] = useState<'trace' | 'reward'>('trace');
  const [traceKey, setTraceKey] = useState(0);

  const personality = nextPersonality(letterA.personalities, shown);

  function handleComplete() {
    setPhase('reward');
    setShown((n) => n + 1);
  }
  function again() {
    setPhase('trace');
    setTraceKey((k) => k + 1); // reset the canvas
  }

  return (
    <div className="flex flex-col items-center justify-center h-full"
         style={{ background: '#fdf2f8' }}>
      <button onClick={onHome} aria-label="home"
              className="absolute top-3 left-3 text-3xl">🏠</button>
      {phase === 'trace' ? (
        <TracingCanvas key={traceKey} letter={letterA} color={personality.color}
                       onComplete={handleComplete} />
      ) : (
        <button onClick={again} className="flex flex-col items-center">
          <RewardPersonality glyph={letterA.glyph} personality={personality} />
          <span className="mt-2 text-2xl text-pink-500 font-bold">Again? 👉</span>
        </button>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Start screen**

Create `src/screens/StartScreen.tsx`:
```tsx
export function StartScreen({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full"
         style={{ background: '#fdf2f8' }}>
      <h1 className="text-3xl font-extrabold text-pink-500 mb-8">Kids Playground</h1>
      <button onClick={onPlay}
              className="flex items-center justify-center"
              style={{ width: 160, height: 160, borderRadius: 32, background: '#ff6b6b',
                       fontSize: 90, fontWeight: 800, color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.15)' }}>
        🔤
      </button>
      <p className="mt-6 text-xl text-slate-500">Tap to trace letters!</p>
    </div>
  );
}
```

- [ ] **Step 3: App shell**

Replace `src/App.tsx`:
```tsx
import { useState } from 'react';
import { StartScreen } from './screens/StartScreen';
import { LetterTracingScreen } from './screens/LetterTracingScreen';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'trace'>('home');
  return screen === 'home'
    ? <StartScreen onPlay={() => setScreen('trace')} />
    : <LetterTracingScreen onHome={() => setScreen('home')} />;
}
```

- [ ] **Step 4: Verify build + full test suite**

Run: `npm run build && npm test`
Expected: build succeeds; all unit tests pass (9 total).

- [ ] **Step 5: Manual local check (desktop)**

Run: `npm run dev`, open the URL, click 🔤, drag from the green dot along the A. On completion the letter should sprout a face and dance; "Again?" returns to tracing. Stop the server after confirming.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx src/screens
git commit -m "feat: wire start + letter A tracing + reward loop"
```

---

## Task 8: PWA icons + child-safe shell

**Files:**
- Create: `public/favicon.svg`, generated `public/pwa-192.png`, `public/pwa-512.png`, `public/apple-touch-icon.png`
- Modify: `index.html`

- [ ] **Step 1: Source icon**

Create `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#fdf2f8"/>
  <text x="256" y="360" font-family="system-ui,sans-serif" font-size="320" font-weight="800"
        text-anchor="middle" fill="#ff6b6b">A</text>
</svg>
```

- [ ] **Step 2: Generate PNG icons from the SVG**

Run:
```bash
npx pwa-asset-generator public/favicon.svg public --icon-only --favicon --padding "10%" \
  --type png --opaque false --manifest false || true
```
Then ensure these exist (rename generated files if needed): `public/pwa-192.png`, `public/pwa-512.png`, `public/apple-touch-icon.png`. If the generator's filenames differ, copy the closest sizes:
```bash
ls public/*.png
```
Expected: 192px, 512px, and an apple-touch (180px) PNG present. If `pwa-asset-generator` is unavailable, fall back to a single 512 PNG duplicated to the three names is NOT acceptable for store quality — instead install and rerun: `npm i -D pwa-asset-generator`.

- [ ] **Step 3: Head tags for iOS + theme**

Replace the contents of `<head>` in `index.html` with (keep the existing `<script type="module" src="/src/main.tsx">` and title):
```html
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />
<meta name="theme-color" content="#fdf2f8" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<title>Kids Playground</title>
```

- [ ] **Step 4: Verify production build serves the PWA**

Run: `npm run build && npm run preview`
Open the preview URL; confirm in DevTools → Application that a manifest and service worker are registered, with no console errors. Stop the server.

- [ ] **Step 5: Commit**

```bash
git add public index.html
git commit -m "feat: PWA icons, manifest head tags, child-safe viewport"
```

---

## Task 9: Deploy to Vercel + real-device gate

**Files:** none (deploy)

- [ ] **Step 1: Deploy**

Run:
```bash
npx vercel --prod --yes
```
Follow prompts (link/create project under the user's account). Capture the production URL.
> NOTE: deploying is an outward-facing action — confirm with the user before running this step.

- [ ] **Step 2: Real-device verification (the discernment gate)**

On a real iPhone (Safari) **and** an Android phone (Chrome):
- Open the URL; tap 🔤; trace A with a finger.
- Confirm: trace-to-reveal follows the finger; completion triggers the dancing face; "Again?" loops; 🏠 returns home.
- Confirm: rotate the device — layout still works in portrait and landscape.
- Confirm: "Add to Home Screen" installs with the A icon and opens full-screen (no browser chrome).
- Confirm: no accidental scroll/zoom/exit; no console errors.

- [ ] **Step 3: Hand to the playtester**

Give the URL to the child. Observe: does she trace it, enjoy the reward, and ask to do it again? Note what bored or delighted her.

- [ ] **Step 4: Commit any config produced by deploy**

```bash
git add -A
git commit -m "chore: vercel deploy config" || echo "nothing to commit"
```

---

## Self-Review

**Spec coverage:**
- Mobile-first, any device → normalized SVG + viewport tags + Task 9 cross-device gate ✓
- Forgiving, no fail state → generous `TOLERANCE`, no failure path ✓
- Trace-to-reveal → trail polyline in TracingCanvas ✓
- Per-letter set, fixed order → `nextPersonality` + `letterA.personalities` ✓
- Reward = googly/tongue/star comes alive → Task 5 ✓
- Letter Zoo → **deferred to M2** (vertical slice needs only the single-letter loop; "Again?" stands in) — *intentional scope cut, noted.*
- Home grid → **M2**; minimal StartScreen stands in for M1 ✓
- PWA install, child-safe → Task 8 ✓
- Store-quality polish/60fps → CSS transforms (GPU-friendly); real-device check in Task 9; deeper juice is M3 ✓
- TDD on deterministic logic → Tasks 2–4 ✓

**Placeholder scan:** none — all steps contain real code/commands.

**Type consistency:** `Point`, `Stroke`, `Personality`, `Letter`, `BehaviourId` defined in Task 1 and used consistently; `TraceState` defined in Task 3 and imported in Task 6; `nextPersonality` signature matches usage in Task 7.

**Note on M1 scope cut:** Letter Zoo and the multi-tile home are deliberately deferred to M2 so the vertical slice proves the core trace→reward fun first. Flag to user in handoff.
