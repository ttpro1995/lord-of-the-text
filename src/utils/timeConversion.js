// Time constants and conversion utilities for tick-based gameplay

export const SECONDS_PER_TICK = 60;

/**
 * Convert seconds to tick units using ceiling rounding
 * @param {number} seconds - Duration in seconds
 * @returns {number} Duration in ticks (always rounds up)
 */
export function toTicksFromSeconds(seconds) {
  return Math.ceil(seconds / SECONDS_PER_TICK);
}