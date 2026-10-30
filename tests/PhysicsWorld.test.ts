import { describe, expect, it } from 'vitest';
import type { AABB, PhysicsBody } from '../src/physics/Collision';
import { PhysicsWorld, tryJump } from '../src/physics/PhysicsWorld';

const dt = 1 / 60;
const floor: AABB = { position: { x: 0, y: -1 }, width: 100, height: 2 };
const createBody = (x = 0, y = 3): PhysicsBody => ({
  position: { x, y }, velocity: { x: 0, y: 0 }, width: 0.8, height: 1.6, isGrounded: false,
});

describe('PhysicsWorld', () => {
  it('integrates gravity with the simulation delta', () => {
    const body = createBody();
    new PhysicsWorld(-28, []).step(body, dt);
    expect(body.velocity.y).toBeCloseTo(-28 * dt);
    expect(body.position.y).toBeCloseTo(3 - 28 * dt * dt);
  });

  it('lands exactly on the ground and clears downward velocity', () => {
    const body = createBody();
    const world = new PhysicsWorld(-28, [floor]);
    let landings = 0;
    for (let step = 0; step < 180; step += 1) {
      if (world.step(body, dt).landed) landings += 1;
    }
    expect(body.position.y).toBe(0.8);
    expect(body.velocity.y).toBe(0);
    expect(body.isGrounded).toBe(true);
    expect(landings).toBe(1);
  });

  it('stays grounded without vertical jitter for repeated steps', () => {
    const body = createBody(0, 0.8);
    body.isGrounded = true;
    const world = new PhysicsWorld(-28, [floor]);
    for (let step = 0; step < 300; step += 1) {
      expect(world.step(body, dt).landed).toBe(false);
      expect(body.position.y).toBe(0.8);
      expect(body.velocity.y).toBe(0);
      expect(body.isGrounded).toBe(true);
    }
  });

  it('allows a grounded jump, blocks airborne jumps, and allows jumping after landing', () => {
    const body = createBody(0, 0.8);
    const world = new PhysicsWorld(-28, [floor]);
    body.isGrounded = true;
    expect(tryJump(body, 11)).toBe(true);
    expect(body.velocity.y).toBe(11);
    expect(body.isGrounded).toBe(false);
    world.step(body, dt);
    const airborneVelocity = body.velocity.y;
    expect(tryJump(body, 11)).toBe(false);
    expect(body.velocity.y).toBe(airborneVelocity);
    for (let step = 0; step < 120; step += 1) world.step(body, dt);
    expect(body.isGrounded).toBe(true);
    expect(tryJump(body, 11)).toBe(true);
  });

  it.each([1, -1])('blocks horizontal movement from direction %s', (direction) => {
    const wall: AABB = { position: { x: direction * 3, y: 2 }, width: 1, height: 4 };
    const body = createBody(0, 0.8);
    const world = new PhysicsWorld(-28, [floor, wall]);
    for (let step = 0; step < 60; step += 1) {
      body.velocity.x = direction * 6;
      world.step(body, dt);
    }
    expect(body.position.x).toBeCloseTo(direction * 2.1);
    expect(body.velocity.x).toBe(0);
    expect(body.position.y).toBe(0.8);
    expect(body.isGrounded).toBe(true);
  });

  it('sweeps fast falls and fast horizontal movement instead of tunneling', () => {
    const falling = createBody(0, 10);
    falling.velocity.y = -1000;
    new PhysicsWorld(-28, [floor]).step(falling, dt);
    expect(falling.position.y).toBe(0.8);
    expect(falling.velocity.y).toBe(0);

    const running = createBody();
    running.velocity.x = 1000;
    const wall: AABB = { position: { x: 3, y: 3 }, width: 0.2, height: 6 };
    new PhysicsWorld(0, [wall]).step(running, dt);
    expect(running.position.x).toBe(2.5);
    expect(running.velocity.x).toBe(0);
  });

  it('resolves the nearest surface regardless of collider order', () => {
    const upper: AABB = { position: { x: 0, y: 2 }, width: 4, height: 1 };
    for (const colliders of [[floor, upper], [upper, floor]]) {
      const body = createBody(0, 10);
      body.velocity.y = -1000;
      new PhysicsWorld(-28, colliders).step(body, dt);
      expect(body.position.y).toBe(3.3);
    }
  });

  it('stops upward velocity at a ceiling without marking the body grounded', () => {
    const ceiling: AABB = { position: { x: 0, y: 4 }, width: 10, height: 1 };
    const body = createBody(0, 2);
    body.velocity.y = 100;
    new PhysicsWorld(0, [ceiling]).step(body, dt);
    expect(body.position.y).toBe(2.7);
    expect(body.velocity.y).toBe(0);
    expect(body.isGrounded).toBe(false);
  });

  it('loses ground contact when walking off a platform', () => {
    const platform: AABB = { position: { x: 0, y: -1 }, width: 2, height: 2 };
    const body = createBody(1.35, 0.8);
    body.isGrounded = true;
    body.velocity.x = 6;
    new PhysicsWorld(-28, [platform]).step(body, dt);
    expect(body.isGrounded).toBe(false);
    expect(body.position.y).toBeLessThan(0.8);
  });
});
