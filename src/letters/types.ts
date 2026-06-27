/** Normalized coordinate in the unit square; (0,0) top-left, (1,1) bottom-right. */
export type Point = { x: number; y: number };

/**
 * One pen stroke, defined by its anchor points (corners) in draw order.
 * The first anchor is where the child starts; arrows point toward the next.
 * Anchors are densely sampled into checkpoints for hit-detection.
 */
export type Stroke = { points: Point[] };

export type BehaviourId = 'googly-dance' | 'silly-tongue' | 'star-bounce';

/** One reward look: an animation behaviour + the color the glyph turns. */
export type Personality = { behaviour: BehaviourId; color: string };

export type Letter = {
  glyph: string;
  strokes: Stroke[];
  /** This letter's own ordered set, cycled in fixed order on each reward. */
  personalities: Personality[];
  /** Optional picture-word association (e.g. "ant"), shown in the Words set. */
  word?: string;
  emoji?: string;
};
