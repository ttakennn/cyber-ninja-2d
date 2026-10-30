import playground from '../world/levels/playground.json';

export const gameConfig = {
  simulation: {
    fixedDelta: 1 / 60,
    maxFrameDelta: 0.25,
    maxStepsPerFrame: 8,
  },
  viewport: {
    referenceWidth: 16,
    height: 9,
    maxPixelRatio: 2,
    background: 0x0b101b,
  },
  physics: {
    gravity: -28,
  },
  player: {
    width: 0.8,
    height: 1.6,
    runSpeed: 6,
    crouchWidth: 0.8,
    crouchHeight: 0.9,
    crouchSpeed: 2.4,
    climbSpeed: 2.8,
    climbAnimationDistancePerCycle: 0.8,
    climbAnimationVelocityEpsilon: 0.000001,
    jumpVelocity: 11,
    spawn: playground.spawn,
    color: 0x58e7db,
    spriteMetadata: 'assets/characters/ninja/animations.json',
  },
} as const;
