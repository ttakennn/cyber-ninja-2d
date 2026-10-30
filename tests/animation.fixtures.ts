import type { AnimationClips, SpriteFrame } from '../src/animation/AnimationClip';
import type { PhysicsBody } from '../src/physics/Collision';

export const frames: readonly SpriteFrame[] = Array.from({ length: 4 }, (_, index) => ({
  x: index * 16, y: 0, width: 16, height: 32,
  sourceWidth: 16, sourceHeight: 32, offsetX: 0, offsetY: 0,
}));

export const clips: AnimationClips = {
  idle: { name: 'idle', frames: frames.slice(0, 2), fps: 10, loop: true },
  run: { name: 'run', frames, fps: 10, loop: true },
  jump: { name: 'jump', frames: frames.slice(0, 2), fps: 10, loop: false },
  fall: { name: 'fall', frames: frames.slice(0, 2), fps: 10, loop: true },
  land: { name: 'land', frames: frames.slice(0, 3), fps: 10, loop: false },
};

export function groundedBody(): PhysicsBody {
  return { position: { x: 0, y: 0.8 }, velocity: { x: 0, y: 0 }, width: 0.8, height: 1.6, isGrounded: true };
}
