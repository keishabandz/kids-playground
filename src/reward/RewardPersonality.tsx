import type { Personality } from '../letters/types';
import { behaviourClass, behaviourFace } from './behaviours';

export function RewardPersonality({ glyph, personality }: { glyph: string; personality: Personality }) {
  const face = behaviourFace[personality.behaviour];
  return (
    <div className="relative inline-flex items-end justify-center" style={{ width: 220, height: 280 }}>
      <span
        className={behaviourClass[personality.behaviour]}
        style={{ color: personality.color, fontSize: 220, fontWeight: 800, lineHeight: 1 }}
      >
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
      <div
        className={googly ? 'googly-eyes' : ''}
        style={{ width: 15, height: 15, marginTop: 16, background: '#222', borderRadius: '50%' }}
      />
    </div>
  );
}
