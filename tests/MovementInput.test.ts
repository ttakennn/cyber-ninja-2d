import { afterEach, describe, expect, it } from 'vitest';
import { InputManager } from '../src/input/InputManager';
import type { PlayerMovementController } from '../src/entities/PlayerMovementController';
import type { PhysicsWorld } from '../src/physics/PhysicsWorld';
import { dt, setup } from './movement.fixtures';

const inputs: InputManager[] = [];
afterEach(() => {
  for (const input of inputs) input.dispose();
  inputs.length = 0;
});

function keyboard() {
  const target = new EventTarget();
  const input = new InputManager(target);
  inputs.push(input);
  const key = (type: string, code: string, repeat = false) => {
    const event = new Event(type, { cancelable: true });
    Object.assign(event, { code, repeat, ctrlKey: false, altKey: false, metaKey: false });
    target.dispatchEvent(event);
    return event;
  };
  return { target, input, key };
}

function drive(movement: PlayerMovementController, world: PhysicsWorld, input: InputManager): void {
  movement.step(world, dt, {
    horizontal: input.horizontal, vertical: input.vertical,
    crouch: input.isDown('crouch'), enterClimb: input.wasPressed('climb'),
    jump: input.wasPressed('jump'), detachJump: input.wasPressed('detachJump'),
  });
  input.endStep();
}

describe('ngữ cảnh bàn phím cúi và leo', () => {
  it('S/Down dùng chung action, Up và Down đối nhau, E và F4 có cạnh bấm', () => {
    const { input, key } = keyboard();
    expect(key('keydown', 'KeyS').defaultPrevented).toBe(true);
    expect(input.vertical).toBe(-1);
    key('keydown', 'ArrowUp');
    expect(input.vertical).toBe(0);
    key('keyup', 'KeyS');
    expect(input.vertical).toBe(1);
    key('keydown', 'ArrowDown');
    expect(input.isDown('crouch')).toBe(true);
    key('keydown', 'KeyE');
    key('keydown', 'F4');
    expect(input.wasPressed('climb')).toBe(true);
    expect(input.wasPressed('toggleCollision')).toBe(true);
    input.endStep();
    key('keydown', 'KeyE', true);
    expect(input.wasPressed('climb')).toBe(false);
  });

  it('giữ W khi bấm E sẽ leo, không nhận nhầm thành nhảy', () => {
    const { input, key } = keyboard();
    const { body, world, movement } = setup();
    key('keydown', 'KeyW');
    key('keydown', 'KeyE');
    drive(movement, world, input);
    expect(movement.mode).toBe('climbing');
    expect(body.velocity.y).toBeCloseTo(2.8);
    expect(body.velocity.y).toBeLessThan(11);
  });

  it('Space vẫn tạo cạnh nhảy rời khi W đang giữ và không nhảy lặp sau tiếp đất', () => {
    const { input, key } = keyboard();
    const { body, world, movement } = setup();
    key('keydown', 'KeyW');
    key('keydown', 'KeyE');
    drive(movement, world, input);
    key('keydown', 'Space');
    expect(input.wasPressed('jump')).toBe(false);
    expect(input.wasPressed('detachJump')).toBe(true);
    drive(movement, world, input);
    expect(movement.mode).toBe('airborne');
    expect(body.velocity.y).toBeCloseTo(11 - 28 * dt);
    for (let step = 0; step < 150; step += 1) {
      key('keydown', 'Space', true);
      drive(movement, world, input);
    }
    expect(body.isGrounded).toBe(true);
    expect(body.velocity.y).toBe(0);
    expect(movement.activeClimbable).toBeNull();
  });

  it('W/Up vẫn nhảy ngoài thang', () => {
    const { input, key } = keyboard();
    const { body, world, movement } = setup();
    key('keydown', 'ArrowUp');
    drive(movement, world, input);
    expect(movement.mode).toBe('airborne');
    expect(body.velocity.y).toBeCloseTo(11 - 28 * dt);
  });

  it('blur xóa input leo; vẫn đứng yên trên thang và có thể rời bằng A', () => {
    const { target, input, key } = keyboard();
    const { body, world, movement } = setup();
    key('keydown', 'KeyE');
    key('keydown', 'KeyW');
    drive(movement, world, input);
    const y = body.position.y;
    target.dispatchEvent(new Event('blur'));
    drive(movement, world, input);
    expect(input.vertical).toBe(0);
    expect(body.position.y).toBe(y);
    expect(body.velocity.y).toBe(0);
    key('keydown', 'KeyA');
    drive(movement, world, input);
    expect(movement.activeClimbable).toBeNull();
  });

  it('blur xóa giữ cúi và cho đứng nếu đầu đủ khoảng trống', () => {
    const { target, input, key } = keyboard();
    const { world, movement } = setup();
    key('keydown', 'KeyS');
    drive(movement, world, input);
    expect(movement.stance).toBe('crouching');
    target.dispatchEvent(new Event('blur'));
    drive(movement, world, input);
    expect(movement.stance).toBe('standing');
  });
});
