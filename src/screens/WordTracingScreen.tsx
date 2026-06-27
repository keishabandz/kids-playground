import { useState } from 'react';
import { lowercase } from '../letters/lowercase';
import { WORDLIST } from '../letters/wordsList';
import { TracingCanvas } from '../tracing/TracingCanvas';

// Look up a lowercase letterform by its glyph.
const byGlyph = Object.fromEntries(lowercase.map((l) => [l.glyph, l]));

export function WordTracingScreen({ onHome, onFinish }: { onHome: () => void; onFinish: () => void }) {
  const [wi, setWi] = useState(0);          // word index
  const [li, setLi] = useState(0);          // letter index within the word
  const [phase, setPhase] = useState<'trace' | 'reward'>('trace');
  const [traceKey, setTraceKey] = useState(0);

  const word = WORDLIST[wi];
  const glyphs = word.text.split('');
  const letter = byGlyph[glyphs[li]];
  const color = letter.personalities[0].color;
  const isLastWord = wi === WORDLIST.length - 1;

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

      {/* picture + the word, filling in letter by letter */}
      <div className="absolute top-10 left-0 right-0 flex flex-col items-center pointer-events-none">
        <span style={{ fontSize: 56, lineHeight: 1 }}>{word.emoji}</span>
        <div className="mt-1 flex gap-2">
          {glyphs.map((g, i) => (
            <span key={i} style={{
              fontSize: 48, fontWeight: 800,
              color: phase === 'reward' || i < li ? '#10b981' : i === li ? '#ec4899' : '#cbd5e1',
            }}>{g}</span>
          ))}
        </div>
      </div>

      {phase === 'trace' ? (
        <TracingCanvas key={traceKey} letter={letter} color={color} onComplete={handleComplete} />
      ) : (
        <button onClick={nextWord} className="flex flex-col items-center">
          <span style={{ fontSize: 96 }}>{word.emoji}</span>
          <span className="text-5xl font-extrabold" style={{ color: '#10b981' }}>{word.text}</span>
          <span className="mt-3 text-2xl text-pink-500 font-bold">
            {isLastWord ? '🎉 I did it!' : 'Next word! 👉'}
          </span>
        </button>
      )}
    </div>
  );
}
