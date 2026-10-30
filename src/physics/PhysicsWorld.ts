import { overlaps, overlapsX, overlapsY } from './Collision';
import type { AABB, ClimbableZone, PhysicsBody, Vector2 } from './Collision';

export interface CollisionResult {
  landed: boolean;
}

export function tryJump(body: PhysicsBody, jumpVelocity: number): boolean {
  if (!body.isGrounded) return false;
  body.velocity.y = jumpVelocity;
  body.isGrounded = false;
  return true;
}

export class PhysicsWorld {
  constructor(
    public readonly gravity: number,
    private readonly colliders: readonly AABB[],
    private readonly climbables: readonly ClimbableZone[] = [],
  ) {}

  canOccupy(body: AABB, position: Readonly<Vector2> = body.position, width = body.width, height = body.height): boolean {
    if (![position.x, position.y, width, height].every(Number.isFinite) || width <= 0 || height <= 0) return false;
    // Sai số rất nhỏ ở mặt tiếp xúc không được xem là xuyên hình sau khi đổi chiều cao.
    return !this.colliders.some((collider) =>
      Math.abs(position.x - collider.position.x) < (width + collider.width) / 2 - 1e-9 &&
      Math.abs(position.y - collider.position.y) < (height + collider.height) / 2 - 1e-9);
  }

  tryResize(body: PhysicsBody, width: number, height: number): boolean {
    const position = { x: body.position.x, y: body.position.y - body.height / 2 + height / 2 };
    if (!this.canOccupy(body, position, width, height)) return false;
    body.position.y = position.y;
    body.width = width;
    body.height = height;
    return true;
  }

  findClimbable(body: AABB): ClimbableZone | undefined {
    return this.climbables.find((zone) => overlaps(body, zone));
  }

  step(body: PhysicsBody, delta: number, applyGravity = true): CollisionResult {
    const wasGrounded = body.isGrounded;
    if (applyGravity) body.velocity.y += this.gravity * delta;
    this.moveHorizontal(body, body.velocity.x * delta);
    body.isGrounded = false;
    this.moveY(body, body.velocity.y * delta);
    return { landed: !wasGrounded && body.isGrounded };
  }

  moveHorizontal(body: PhysicsBody, distance: number): void {
    const start = body.position.x;
    let end = start + distance;
    let blocked = false;

    for (const collider of this.colliders) {
      if (!overlapsY(body, collider)) continue;
      const separation = (body.width + collider.width) / 2;
      const left = collider.position.x - separation;
      const right = collider.position.x + separation;
      // Sweep across faces so even a large displacement cannot skip a wall.
      if (distance > 0 && start <= left && end >= left) {
        end = left;
        blocked = true;
      } else if (distance < 0 && start >= right && end <= right) {
        end = right;
        blocked = true;
      }
    }

    body.position.x = end;
    if (blocked) body.velocity.x = 0;
  }

  private moveY(body: PhysicsBody, distance: number): void {
    const start = body.position.y;
    let end = start + distance;
    let blocked = false;

    for (const collider of this.colliders) {
      if (!overlapsX(body, collider)) continue;
      const separation = (body.height + collider.height) / 2;
      const top = collider.position.y + separation;
      const bottom = collider.position.y - separation;
      if (distance < 0 && start >= top && end <= top) {
        end = top;
        body.isGrounded = true;
        blocked = true;
      } else if (distance > 0 && start <= bottom && end >= bottom) {
        end = bottom;
        blocked = true;
      }
    }

    body.position.y = end;
    if (blocked) body.velocity.y = 0;
  }
}
