import { useState } from 'react';
import type { Letter } from '../letters/types';
import { TracingCanvas } from '../tracing/TracingCanvas';
import { RewardPersonality } from '../reward/RewardPersonality';
import { nextPersonality } from '../reward/personalityCursor';

export function LetterTracingScreen({ letters, onHome, onFinish }:
  { letters: Letter[]; onHome: () => void; onFinish: () => void }) {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<'trace' | 'reward'>('trace');
  const [traceKey, setTraceKey] = useState(0);
  const [counts, setCounts] = useState<Record<string, number>>({});

  const letter = letters[index];
  const personality = nextPersonality(letter.personalities, counts[letter.glyph] ?? 0);
  const isLast = index === letters.length - 1;

  function handleComplete() {
    setPhase('reward');
  }
  function next() {
    setCounts((c) => ({ ...c, [letter.glyph]: (c[letter.glyph] ?? 0) + 1 }));
    if (isLast) { onFinish(); return; }
    setIndex((i) => i + 1);
    setPhase('trace');
    setTraceKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <button onClick={onHome} aria-label="home" className="absolute top-3 left-3 text-3xl">🏠</button>
      <span className="absolute top-4 right-4 text-xl font-bold text-slate-400">
        {letter.glyph} · {index + 1}/{letters.length}
      </span>
      {phase === 'trace' ? (
        <TracingCanvas key={traceKey} letter={letter} color={personality.color} onComplete={handleComplete} />
      ) : (
        <button onClick={next} className="flex flex-col items-center">
          <RewardPersonality glyph={letter.glyph} personality={personality} />
          <span className="mt-2 text-2xl text-pink-500 font-bold">
            {isLast ? '🎉 I did it!' : 'Next! 👉'}
          </span>
        </button>
      )}
    </div>
  );
}
