import { useState } from 'react';
import { HomeGrid } from './screens/HomeGrid';
import { LetterTracingScreen } from './screens/LetterTracingScreen';
import { CelebrationScreen } from './screens/CelebrationScreen';
import { DanceScreen } from './screens/DanceScreen';
import { SETS, getSet, type SetId } from './letters/sets';

type View = { s: 'home' } | { s: 'trace'; id: SetId } | { s: 'celebrate'; id: SetId } | { s: 'dance' };

export default function App() {
  const [view, setView] = useState<View>({ s: 'home' });

  if (view.s === 'home') {
    return <HomeGrid sets={SETS} onPick={(id) => setView({ s: 'trace', id })} onDance={() => setView({ s: 'dance' })} />;
  }

  if (view.s === 'dance') {
    return <DanceScreen onHome={() => setView({ s: 'home' })} />;
  }

  const set = getSet(view.id);
  if (view.s === 'trace') {
    return (
      <LetterTracingScreen
        key={view.id}
        letters={set.letters}
        onHome={() => setView({ s: 'home' })}
        onFinish={() => setView({ s: 'celebrate', id: view.id })}
      />
    );
  }

  return (
    <CelebrationScreen
      letters={set.letters}
      onHome={() => setView({ s: 'home' })}
      onAgain={() => setView({ s: 'trace', id: view.id })}
    />
  );
}
