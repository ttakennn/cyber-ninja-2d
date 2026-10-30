export interface Vector2 {
  x: number;
  y: number;
}

// All rectangles use their center as position. Z never enters physics.
export interface AABB {
  readonly position: Readonly<Vector2>;
  readonly width: number;
  readonly height: number;
}

export interface PhysicsBody extends AABB {
  position: Vector2;
  width: number;
  height: number;
  velocity: Vector2;
  isGrounded: boolean;
}

export interface ClimbableZone extends AABB {
  readonly id: string;
  readonly kind: 'ladder' | 'scaffolding';
}

export function overlapsX(a: AABB, b: AABB): boolean {
  return Math.abs(a.position.x - b.position.x) < (a.width + b.width) / 2;
}

export function overlapsY(a: AABB, b: AABB): boolean {
  return Math.abs(a.position.y - b.position.y) < (a.height + b.height) / 2;
}

// Touching edges are contact, not penetration.
export function overlaps(a: AABB, b: AABB): boolean {
  return overlapsX(a, b) && overlapsY(a, b);
}
