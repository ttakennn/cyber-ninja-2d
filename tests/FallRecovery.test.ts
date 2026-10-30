import { Texture } from 'three';
import { describe, expect, it } from 'vitest';
import { parseSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { FallRecovery } from '../src/core/FallRecovery';
import { Player } from '../src/entities/Player';
import { InputManager } from '../src/input/InputManager';
import { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { GameCamera } from '../src/rendering/GameCamera';
import metadata from '../public/assets/characters/ninja/animations.json';
import map01 from '../src/world/levels/map-01-graybox.json';
import { dt, noInput } from './movement.fixtures';

const sheet = parseSpriteSheet(metadata);
function key(target: EventTarget, code: string, repeat = false): void {
  const event = new Event('keydown', { cancelable: true });
  Object.assign(event, { code, repeat, ctrlKey: false, metaKey: false, altKey: false });
  target.dispatchEvent(event);
}

describe('hồi về spawn khi rơi khỏi level', () => {
  it('chỉ bật ở level có deathY và chỉ khi tâm thấp hơn biên', () => {
    const player = new Player(map01.spawn);
    const input = new InputManager(new EventTarget());
    const camera = new GameCamera();
    const disabled = new FallRecovery(map01.spawn);
    player.setPosition(49, -100);
    expect(disabled.update(player, input, camera)).toBe(false);
    expect(player.body.position.y).toBe(-100);
    const recovery = new FallRecovery(map01.spawn, -8);
    player.setPosition(49, -8);
    expect(recovery.update(player, input, camera)).toBe(false);
    player.body.position.y = -8.001;
    expect(recovery.update(player, input, camera)).toBe(true);
    expect(player.body.position).toEqual(map01.spawn);
    expect(recovery.count).toBe(1);
    player.dispose();
    input.dispose();
  });

  it.each(['crouch', 'climb'] as const)('reset đầy đủ từ %s, sprite/interpolation và camera không kéo vệt', async (mode) => {
    const player = new Player(map01.spawn);
    await player.loadSprite({ load: async () => ({ ...sheet, texture: new Texture(), imageWidth: 3136, imageHeight: 1968 }) });
    const world = new PhysicsWorld(-28, map01.solids, map01.climbables.map((zone) => ({ ...zone, kind: 'ladder' as const })));
    if (mode === 'crouch') {
      player.body.isGrounded = true;
      player.updateMovement(world, dt, { ...noInput, crouch: true });
      expect(player.movement.stance).toBe('crouching');
    } else {
      player.setPosition(29, -1.7);
      player.updateMovement(world, dt, { ...noInput, enterClimb: true });
      player.updateMovement(world, dt, { ...noInput, vertical: -1 });
      expect(player.movement.activeClimbable).not.toBeNull();
    }
    player.updateAnimation(dt, false);
    player.animator.facing = 'left';
    player.capturePreviousPosition();
    player.body.position.x = 49;
    player.body.position.y = -9;
    player.body.velocity.x = 6;
    player.body.velocity.y = -20;
    const camera = new GameCamera(map01.cameraBounds, true);
    camera.follow({ x: 70, y: 7 });
    const target = new EventTarget();
    const input = new InputManager(target);
    key(target, 'KeyD'); key(target, 'KeyS'); key(target, 'KeyE'); key(target, 'Space');
    const recovery = new FallRecovery(map01.spawn, map01.deathY);
    expect(recovery.update(player, input, camera)).toBe(true);
    expect(player.body.position).toEqual(map01.spawn);
    expect(player.body.velocity).toEqual({ x: 0, y: 0 });
    expect([player.body.width, player.body.height]).toEqual([0.8, 1.6]);
    expect(player.movement.stance).toBe('standing');
    expect(player.movement.activeClimbable).toBeNull();
    expect(player.movement.standingBlocked).toBe(false);
    expect(player.movement.mode).toBe('airborne');
    expect(player.state).toBe('fall');
    expect(player.animator.controller.name).toBe('fall');
    expect(player.animator.controller.frameIndex).toBe(0);
    expect(player.animator.renderFacing).toBe('right');
    expect(player.animator.climbDirection).toBe('idle');
    for (const alpha of [0, 0.5, 1]) {
      player.syncVisual(alpha);
      expect(player.visual.position.toArray()).toEqual([2, -1.7, 1]);
      expect(player.renderHeight).toBe(1.6);
      expect(player.visual.children[1]!.position.y).toBe(-0.8);
    }
    expect(camera.camera.position.toArray()).toEqual([8, 0, 10]);
    expect(input.horizontal).toBe(0);
    expect(input.vertical).toBe(0);
    expect(input.wasPressed('jump')).toBe(false);
    expect(input.wasPressed('climb')).toBe(false);
    key(target, 'KeyD', true);
    expect(input.horizontal).toBe(0);
    for (let step = 0; step < 180; step += 1) {
      const landed = player.updateMovement(world, dt, noInput);
      player.updateState(landed);
      player.updateAnimation(dt, landed);
      expect(recovery.update(player, input, camera)).toBe(false);
    }
    expect(recovery.count).toBe(1);
    expect(player.state).toBe('idle');
    expect(player.body.position).toEqual(map01.spawn);
    player.updateMovement(world, dt, { ...noInput, horizontal: 1, jump: true });
    player.updateState(false);
    player.updateAnimation(dt, false);
    expect(player.state).toBe('jump');
    expect(player.animator.controller.name).toBe('jump');
    player.dispose();
    input.dispose();
  });

  it('rơi thực qua khoảng hở dẫn tới đúng một lần hồi sinh', () => {
    const player = new Player({ x: 49, y: 2.8 });
    const world = new PhysicsWorld(-28, map01.solids);
    const input = new InputManager(new EventTarget());
    const camera = new GameCamera(map01.cameraBounds, true);
    const recovery = new FallRecovery(map01.spawn, map01.deathY);
    for (let step = 0; step < 180; step += 1) {
      player.capturePreviousPosition();
      player.updateMovement(world, dt, noInput);
      recovery.update(player, input, camera);
    }
    expect(recovery.count).toBe(1);
    expect(player.body.position).toEqual(map01.spawn);
    player.dispose();
    input.dispose();
  });
});
