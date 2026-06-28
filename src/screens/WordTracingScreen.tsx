import { useMemo, useState } from 'react';
import { lowercase } from '../letters/lowercase';
import { WORDLIST } from '../letters/wordsList';
import { TracingCanvas } from '../tracing/TracingCanvas';
import { LetterGlyph } from '../tracing/LetterGlyph';

const byGlyph = Object.fromEntries(lowercase.map((l) => [l.glyph, l]));
const CONFETTI = ['#ff4d4d', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#06b6d4'];

function Confetti() {
  const pieces = useMemo(
    () => Array.from({ length: 28 }, () => ({
      left: Math.random() * 100,
      bg: CONFETTI[Math.floor(Math.random() * CONFETTI.length)],
      dur: 2.2 + Math.random() * 2,
      delay: Math.random() * 1.2,
    })),
    [],
  );
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p, i) => (
        <i key={i} style={{ left: `${p.left}%`, background: p.bg, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` }} />
      ))}
    </div>
  );
}

export function WordTracingScreen({ onHome, onFinish }: { onHome: () => void; onFinish: () => void }) {
  const [wi, setWi] = useState(0);   // word index
  const [li, setLi] = useState(0);   // current letter index within the word
  const [phase, setPhase] = useState<'trace' | 'reward'>('trace');
  const [traceKey, setTraceKey] = useState(0);

  const word = WORDLIST[wi];
  const glyphs = word.text.split('');
  const isLastWord = wi === WORDLIST.length - 1;
  const colorFor = (i: number) => byGlyph[glyphs[i]].personalities[0].color;

  function advanceLetter() {
    if (li < glyphs.length - 1) {
      setLi((i) => i + 1);
      setTraceKey((k) => k + 1);
    } else {
      setPhase('reward');
    }
  }
  function skipWord() {
    if (isLastWord) { onFinish(); return; }
    setWi((i) => i + 1);
    setLi(0);
    setPhase('trace');
    setTraceKey((k) => k + 1);
  }

  // top strip: the whole word in grey, colouring in as letters are done
  const wordStrip = (
    <div className="absolute top-3 left-0 right-0 flex items-center justify-center gap-3 pointer-events-none">
      <span style={{ fontSize: 38 }}>{word.emoji}</span>
      <div className="flex gap-1">
        {glyphs.map((g, i) => (
          <span key={i} style={{
            fontSize: 40, fontWeight: 800,
            color: phase === 'reward' || i < li ? colorFor(i) : i === li ? '#94a3b8' : '#cbd5e1',
          }}>{g}</span>
        ))}
      </div>
      <button onClick={skipWord} aria-label="skip word" className="skip-btn-sm pointer-events-auto">▶</button>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <button onClick={onHome} aria-label="home" className="absolute top-3 left-3 text-3xl z-10">🏠</button>
      <span className="absolute top-4 right-4 text-xl font-bold text-slate-400">{wi + 1}/{WORDLIST.length}</span>

      {phase === 'trace' ? (
        <>
          {wordStrip}
          <div className="flex flex-col items-center" style={{ marginTop: '6vh' }}>
            <TracingCanvas
              key={`${wi}-${li}-${traceKey}`}
              letter={byGlyph[glyphs[li]]}
              color={colorFor(li)}
              size="min(74vw, 58vh)"
              fit
              onComplete={advanceLetter}
            />
            <button onClick={advanceLetter} aria-label="skip letter" className="skip-btn mt-3">▶</button>
          </div>
        </>
      ) : (
        <>
          <Confetti />
          <div className="flex items-end" style={{ gap: 'min(2vw, 14px)' }}>
            {glyphs.map((g, i) => (
              <LetterGlyph key={i} letter={byGlyph[g]} color={colorFor(i)} size="min(22vw, 26vh)" done />
            ))}
          </div>
          <span className="emoji-dance my-4" style={{ fontSize: 120 }}>{word.emoji}</span>
          <button onClick={skipWord} className="text-3xl font-extrabold text-pink-500">
            {isLastWord ? '🎉 I did it!' : 'Next word! 👉'}
          </button>
        </>
      )}
    </div>
  );
}
