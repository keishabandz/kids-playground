import { useEffect, useRef, useState } from 'react';

const CHARACTERS = ['pig', 'sheep', 'rabbit', 'dog', 'pony'];
// Pose indices into each character's 6 frames: 1 stand, 2 arms-up, 3 wave,
// 4 leg-kick, 5 jump, 6 hands-on-hip. This sequence is the looping choreography.
const SEQ = [2, 5, 3, 4, 6, 5, 2, 4];
const BEAT_MS = 350;

export function DanceScreen({ onHome }: { onHome: () => void }) {
  const [beat, setBeat] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const acRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Steady beat drives the flip-book choreography (dances with or without music).
  useEffect(() => {
    const id = setInterval(() => setBeat((b) => b + 1), BEAT_MS);
    return () => clearInterval(id);
  }, []);

  // When music plays, drive a "loudness" CSS var so the troupe bounces to it.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const an = analyserRef.current;
      if (an && stageRef.current) {
        const buf = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(buf);
        const avg = buf.reduce((s, v) => s + v, 0) / buf.length;
        stageRef.current.style.setProperty('--level', Math.min(1, avg / 90).toFixed(3));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  function pickMusic() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const audio = audioRef.current!;
    audio.src = URL.createObjectURL(file); // local only — never uploaded
    if (!acRef.current) {
      try {
        const ac = new AudioContext();
        const src = ac.createMediaElementSource(audio);
        const an = ac.createAnalyser();
        an.fftSize = 64;
        src.connect(an);
        an.connect(ac.destination);
        acRef.current = ac;
        analyserRef.current = an;
      } catch { /* analyser optional */ }
    }
    acRef.current?.resume();
    audio.play();
    setHasMusic(true);
    setPlaying(true);
  }

  function toggle() {
    const audio = audioRef.current!;
    if (!hasMusic) { pickMusic(); return; }
    if (audio.paused) { acRef.current?.resume(); audio.play(); setPlaying(true); }
    else { audio.pause(); setPlaying(false); }
  }

  return (
    <div
      ref={stageRef}
      className="dance-stage"
      style={{ ['--level' as string]: 0 } as React.CSSProperties}
    >
      <button onClick={onHome} aria-label="home" className="absolute top-3 left-3 text-3xl z-10">🏠</button>
      <div className="dance-notes" aria-hidden>🎵 🎶 ⭐ 🎵 🎶</div>

      <div className="dancers">
        {CHARACTERS.map((c, i) => {
          const pose = SEQ[(beat + i) % SEQ.length];
          return (
            <img
              key={c}
              src={`/dance/${c}-${pose}.png`}
              alt={c}
              className="dancer"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          );
        })}
      </div>

      <div className="dance-controls">
        <button onClick={toggle} className="dance-btn" style={{ background: '#ec4899' }}>
          {playing ? '⏸ Pause' : hasMusic ? '▶ Play' : '🎵 Add music'}
        </button>
        {hasMusic && (
          <button onClick={pickMusic} className="dance-btn" style={{ background: '#6366f1' }}>
            🔁 Change song
          </button>
        )}
      </div>

      <audio ref={audioRef} loop />
      <input ref={fileRef} type="file" accept="audio/*" hidden onChange={onFile} />
    </div>
  );
}
