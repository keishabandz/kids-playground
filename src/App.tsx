import { useState } from 'react';
import { StartScreen } from './screens/StartScreen';
import { LetterTracingScreen } from './screens/LetterTracingScreen';

export default function App() {
  const [screen, setScreen] = useState<'home' | 'trace'>('home');
  return screen === 'home'
    ? <StartScreen onPlay={() => setScreen('trace')} />
    : <LetterTracingScreen onHome={() => setScreen('home')} />;
}
