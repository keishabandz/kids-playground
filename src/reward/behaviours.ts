import type { BehaviourId } from '../letters/types';

/** Maps a behaviour to the CSS class that animates the glyph. */
export const behaviourClass: Record<BehaviourId, string> = {
  'googly-dance': 'beh-dance',
  'silly-tongue': 'beh-wobble',
  'star-bounce': 'beh-bounce',
};

/** Which face to show for each behaviour. */
export const behaviourFace: Record<BehaviourId, 'googly' | 'tongue' | 'stars'> = {
  'googly-dance': 'googly',
  'silly-tongue': 'tongue',
  'star-bounce': 'stars',
};
