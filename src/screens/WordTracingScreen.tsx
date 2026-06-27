import { useState } from 'react';
import { lowercase } from '../letters/lowercase';
import { WORDLIST } from '../letters/wordsList';
import { TracingCanvas } from '../tracing/TracingCanvas';
import { LetterGlyph } from '../tracing/LetterGlyph';

const byGlyph = Object.fromEntries(lowercase.map((l) => [l.glyph, l]));

export function WordTracingScreen({ onHome, onFinish }: { onHome: () => void; onFinish: () => void }) {
  const [wi, setWi] = useState(0);   // word index
  const [li, setLi] = useState(0);   // active letter index within the word
  const [phase, setPhase] = useState<'trace' | 'reward'>('trace');
  const [traceKey, setTraceKey] = useState(0);

  const word = WORDLIST[wi];
  const glyphs = word.text.split('');
  const isLastWord = wi === WORDLIST.length - 1;

  // each letter as big as possible while the whole word still fits across
  const size = `min(${Math.floor(96 / glyphs.length)}vw, 78vh)`;
  const rewardSize = `min(${Math.floor(64 / glyphs.length)}vw, 34vh)`;
  const colorFor = (i: number) => byGlyph[glyphs[i]].personalities[0].color;

  function handleComplete() {
    if (li < glyphs.length - 1) {
      setLi((i) => i + 1);
      setTraceKey((k) => k + 1);
    } else {
      setPhase('reward');
    }
  }
  function nextWord() {
    if (isLastWord) { onFinish(); return; }
    setWi((i) => i + 1);
    setLi(0);
    setPhase('trace');
    setTraceKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <button onClick={onHome} aria-label="home" className="absolute top-3 left-3 text-3xl">🏠</button>
      <span className="absolute top-4 right-4 text-xl font-bold text-slate-400">{wi + 1}/{WORDLIST.length}</span>

      <span className="absolute top-3 left-0 right-0 text-center pointer-events-none" style={{ fontSize: 44 }}>
        {word.emoji}
      </span>

      {phase === 'trace' ? (
        // the whole word laid out: completed letters inked, the active one
        // traceable (star + arrows), upcoming letters faint.
        <div className="flex items-end justify-center w-full" style={{ gap: 'min(1.5vw, 10px)', marginTop: '7vh' }}>
          {glyphs.map((g, i) =>
            i === li ? (
              <TracingCanvas
                key={traceKey}
                letter={byGlyph[g]}
                color={colorFor(i)}
                size={size}
                fit
                onComplete={handleComplete}
              />
            ) : (
              <LetterGlyph
                key={i}
                letter={byGlyph[g]}
                color={colorFor(i)}
                size={size}
                done={i < li}
                dim={i > li}
              />
            ),
          )}
        </div>
      ) : (
        <button onClick={nextWord} className="flex flex-col items-center" style={{ marginTop: '8vh' }}>
          <div className="flex items-end" style={{ gap: 'min(1.5vw, 10px)' }}>
            {glyphs.map((g, i) => (
              <LetterGlyph key={i} letter={byGlyph[g]} color={colorFor(i)} size={rewardSize} done />
            ))}
          </div>
          <span className="mt-3 text-4xl font-extrabold" style={{ color: '#10b981' }}>{word.text}</span>
          <span className="mt-2 text-2xl text-pink-500 font-bold">
            {isLastWord ? '🎉 I did it!' : 'Next word! 👉'}
          </span>
        </button>
      )}
    </div>
  );
}
