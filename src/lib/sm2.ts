import { Scroll } from "./types";

/**
 * SM-2 spaced repetition algorithm
 * quality: 0-5 rating
 *   0-2 = incorrect (reset)
 *   3   = correct with difficulty
 *   4   = correct
 *   5   = perfect
 */
export function reviewScroll(scroll: Scroll, quality: number): Scroll {
  const now = Date.now();
  let { easeFactor, interval, repetitions } = scroll;

  if (quality < 3) {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  } else {
    // Passed
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  const nextReview = now + interval * 24 * 60 * 60 * 1000;

  return {
    ...scroll,
    easeFactor,
    interval,
    repetitions,
    nextReview,
    lastReview: now,
  };
}

export function getScrollsDueForReview(scrolls: Scroll[]): Scroll[] {
  const now = Date.now();
  return scrolls.filter((s) => s.nextReview <= now);
}

export function createScroll(front: string, back: string): Scroll {
  return {
    id: crypto.randomUUID(),
    front,
    back,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: Date.now(),
    lastReview: null,
  };
}
