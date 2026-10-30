import { PlayerMovementController } from '../src/entities/PlayerMovementController';
import type { MovementInput } from '../src/entities/PlayerMovementController';
import type { AABB, ClimbableZone, PhysicsBody } from '../src/physics/Collision';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';

export const dt = 1 / 60;
export const floor: AABB = { position: { x: 0, y: -1 }, width: 100, height: 2 };
export const roof: AABB = { position: { x: 0, y: 1.35 }, width: 4, height: 0.5 };
export const ladder: ClimbableZone = { id: 'ladder', kind: 'ladder', position: { x: 0, y: 3 }, width: 1, height: 6 };
export const noInput: MovementInput = {
  horizontal: 0, vertical: 0, crouch: false, enterClimb: false, jump: false, detachJump: false,
};

export function setup(solids: readonly AABB[] = [floor], zones: readonly ClimbableZone[] = [ladder]) {
  const body: PhysicsBody = {
    position: { x: 0, y: 0.8 }, velocity: { x: 0, y: 0 }, width: 0.8, height: 1.6, isGrounded: true,
  };
  return { body, world: new PhysicsWorld(-28, solids, zones), movement: new PlayerMovementController(body) };
}
