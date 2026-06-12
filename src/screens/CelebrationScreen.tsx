import type { Letter } from '../letters/types';
import { RewardPersonality } from '../reward/RewardPersonality';

export function CelebrationScreen({ letters, onHome, onAgain }:
  { letters: Letter[]; onHome: () => void; onAgain: () => void }) {
  // Duplicate the row so the horizontal scroll loops seamlessly.
  const row = [...letters, ...letters];
  return (
    <div className="flex flex-col items-center justify-center h-full overflow-hidden" style={{ background: '#fdf2f8' }}>
      <h1 className="text-4xl font-extrabold text-pink-500 mb-2">You did it! 🎉</h1>
      <p className="text-xl text-slate-500 mb-6">Look at them all dance!</p>

      <div className="marquee w-full">
        <div className="marquee-inner">
          {row.map((l, i) => (
            <div key={i} className="shrink-0">
              <RewardPersonality glyph={l.glyph} personality={l.personalities[0]} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={onAgain}
                className="text-xl font-bold text-white px-6 py-3 rounded-2xl"
                style={{ background: '#4ecdc4', boxShadow: '0 6px 16px rgba(0,0,0,.12)' }}>
          🔁 Again
        </button>
        <button onClick={onHome}
                className="text-xl font-bold text-white px-6 py-3 rounded-2xl"
                style={{ background: '#ff6b6b', boxShadow: '0 6px 16px rgba(0,0,0,.12)' }}>
          🏠 Home
        </button>
      </div>
    </div>
  );
}
