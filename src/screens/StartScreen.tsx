export function StartScreen({ onPlay }: { onPlay: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-full" style={{ background: '#fdf2f8' }}>
      <h1 className="text-3xl font-extrabold text-pink-500 mb-8">Kids Playground</h1>
      <button
        onClick={onPlay}
        className="flex items-center justify-center"
        style={{ width: 160, height: 160, borderRadius: 32, background: '#ff6b6b', fontSize: 90, fontWeight: 800, color: '#fff', boxShadow: '0 10px 24px rgba(0,0,0,.15)' }}
      >
        🔤
      </button>
      <p className="mt-6 text-xl text-slate-500">Tap to trace letters!</p>
    </div>
  );
}
