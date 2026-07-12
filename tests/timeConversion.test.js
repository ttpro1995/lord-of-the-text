import { describe, it, expect } from 'vitest';
import { toTicksFromSeconds, SECONDS_PER_TICK } from '../src/utils/timeConversion.js';

describe('timeConversion', () => {
  describe('SECONDS_PER_TICK constant', () => {
    it('should be 60 seconds per tick', () => {
      expect(SECONDS_PER_TICK).toBe(60);
    });
  });

  describe('toTicksFromSeconds', () => {
    it('should convert 30 seconds to 1 tick', () => {
      expect(toTicksFromSeconds(30)).toBe(1);
    });

    it('should convert 60 seconds to 1 tick', () => {
      expect(toTicksFromSeconds(60)).toBe(1);
    });

    it('should convert 90 seconds to 2 ticks', () => {
      expect(toTicksFromSeconds(90)).toBe(2);
    });

    it('should convert 1 second to 1 tick (ceil rounding)', () => {
      expect(toTicksFromSeconds(1)).toBe(1);
    });

    it('should convert 0 seconds to 0 ticks', () => {
      expect(toTicksFromSeconds(0)).toBe(0);
    });

    it('should handle large values correctly', () => {
      expect(toTicksFromSeconds(300)).toBe(5);
    });

    it('should handle fractional seconds with ceiling', () => {
      expect(toTicksFromSeconds(30.1)).toBe(1);
    });
  });
});