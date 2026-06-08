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
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <button onClick={onHome} aria-label="home" className="absolute top-3 left-3 text-3xl">🏠</button>
      {phase === 'trace' ? (
        <TracingCanvas key={traceKey} letter={letterA} color={personality.color} onComplete={handleComplete} />
      ) : (
        <button onClick={again} className="flex flex-col items-center">
          <RewardPersonality glyph={letterA.glyph} personality={personality} />
          <span className="mt-2 text-2xl text-pink-500 font-bold">Again? 👉</span>
        </button>
      )}
    </div>
  );
}
