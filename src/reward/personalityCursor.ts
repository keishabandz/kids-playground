/** The next entry in a letter's set given how many times it's been shown. Wraps. */
export function nextPersonality<T>(set: T[], shownCount: number): T {
  return set[shownCount % set.length];
}
