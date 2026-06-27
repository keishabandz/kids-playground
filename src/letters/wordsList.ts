// One short, traceable word for each letter a-z (all lowercase a-z letters, no
// spaces/punctuation so every character has a letterform). Longer words shrink
// to fit. "x" uses fox (the x sound) — the standard alphabet choice.
export type TraceWord = { text: string; emoji: string };

export const WORDLIST: TraceWord[] = [
  { text: 'ant', emoji: '🐜' },
  { text: 'bat', emoji: '🦇' },
  { text: 'cat', emoji: '🐱' },
  { text: 'dog', emoji: '🐶' },
  { text: 'egg', emoji: '🥚' },
  { text: 'fish', emoji: '🐟' },
  { text: 'goat', emoji: '🐐' },
  { text: 'hat', emoji: '🎩' },
  { text: 'ice', emoji: '🧊' },
  { text: 'jet', emoji: '✈️' },
  { text: 'key', emoji: '🔑' },
  { text: 'lion', emoji: '🦁' },
  { text: 'map', emoji: '🗺️' },
  { text: 'net', emoji: '🥅' },
  { text: 'owl', emoji: '🦉' },
  { text: 'pig', emoji: '🐷' },
  { text: 'queen', emoji: '👑' },
  { text: 'rat', emoji: '🐀' },
  { text: 'sun', emoji: '☀️' },
  { text: 'tree', emoji: '🌳' },
  { text: 'up', emoji: '⬆️' },
  { text: 'van', emoji: '🚐' },
  { text: 'web', emoji: '🕸️' },
  { text: 'fox', emoji: '🦊' },   // x
  { text: 'yam', emoji: '🍠' },
  { text: 'zebra', emoji: '🦓' },
];
