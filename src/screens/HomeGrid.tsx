import type { LetterSet, SetId } from '../letters/sets';

export function HomeGrid({ sets, onPick }: { sets: LetterSet[]; onPick: (id: SetId) => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <h1 className="text-3xl font-extrabold text-pink-500 mb-10">Kids Playground</h1>
      <div className="flex gap-6 flex-wrap justify-center px-4">
        {sets.map((set) => (
          <button key={set.id} onClick={() => onPick(set.id)} className="flex flex-col items-center">
            <div
              style={{
                width: 150, height: 150, borderRadius: 32, background: set.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 84, fontWeight: 800, color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.15)',
              }}
            >
              {set.tile}
            </div>
            <span className="mt-3 text-xl text-slate-600 font-bold">{set.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
