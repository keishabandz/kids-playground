/** Normalized coordinate in the unit square; (0,0) top-left, (1,1) bottom-right. */
export type Point = { x: number; y: number };

/** One pen stroke: ordered checkpoints the child must pass through in order. */
export type Stroke = { checkpoints: Point[] };

export type BehaviourId = 'googly-dance' | 'silly-tongue' | 'star-bounce';

/** One reward look: an animation behaviour + the color the glyph turns. */
export type Personality = { behaviour: BehaviourId; color: string };

export type Letter = {
  glyph: string;
  strokes: Stroke[];
  /** This letter's own ordered set, cycled in fixed order on each reward. */
  personalities: Personality[];
};
