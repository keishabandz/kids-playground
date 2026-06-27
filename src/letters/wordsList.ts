// Simple 3-letter words to trace, each letter in turn. All letters use the
// existing lowercase letterforms.
export type TraceWord = { text: string; emoji: string };

export const WORDLIST: TraceWord[] = [
  { text: 'cat', emoji: '🐱' },
  { text: 'dog', emoji: '🐶' },
  { text: 'ant', emoji: '🐜' },
  { text: 'bat', emoji: '🦇' },
  { text: 'cow', emoji: '🐮' },
  { text: 'fox', emoji: '🦊' },
  { text: 'hen', emoji: '🐔' },
  { text: 'owl', emoji: '🦉' },
  { text: 'pig', emoji: '🐷' },
  { text: 'bee', emoji: '🐝' },
  { text: 'sun', emoji: '☀️' },
  { text: 'bus', emoji: '🚌' },
  { text: 'hat', emoji: '🎩' },
  { text: 'cup', emoji: '🥤' },
];
