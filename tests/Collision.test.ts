import { describe, expect, it } from 'vitest';
import { overlaps } from '../src/physics/Collision';
import type { AABB } from '../src/physics/Collision';

const rect = (x: number, y: number): AABB => ({ position: { x, y }, width: 2, height: 2 });

describe('center-based AABB collision', () => {
  it('detects overlap and containment', () => {
    expect(overlaps(rect(0, 0), rect(1, 1))).toBe(true);
    expect(overlaps(rect(0, 0), { position: { x: 0, y: 0 }, width: 0.5, height: 0.5 })).toBe(true);
  });

  it('rejects rectangles separated on either axis', () => {
    expect(overlaps(rect(0, 0), rect(3, 0))).toBe(false);
    expect(overlaps(rect(0, 0), rect(0, 3))).toBe(false);
  });

  it('does not count touching edges or corners as penetration', () => {
    expect(overlaps(rect(0, 0), rect(2, 0))).toBe(false);
    expect(overlaps(rect(0, 0), rect(2, 2))).toBe(false);
  });
});
