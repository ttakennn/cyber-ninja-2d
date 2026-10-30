import { describe, expect, it } from 'vitest';
import { gameConfig } from '../src/config/game.config';
import type { AABB } from '../src/physics/Collision';
import { dt, floor, noInput, roof, setup } from './movement.fixtures';

describe('truy vấn khoảng trống và đổi collider', () => {
  it('phân biệt khối rắn với vùng leo, cho phép tiếp xúc cạnh', () => {
    const { body, world } = setup();
    expect(world.canOccupy(body)).toBe(true);
    expect(world.canOccupy(body, { x: 0, y: 0.7 })).toBe(false);
    expect(world.canOccupy(body, body.position, 0, 1)).toBe(false);
    expect(world.canOccupy(body, { x: NaN, y: 1 })).toBe(false);
    expect(world.findClimbable(body)?.id).toBe('ladder');
  });

  it('không sửa collider khi đề xuất đứng hoặc nới rộng bị chặn', () => {
    const { body, world } = setup([floor, roof]);
    expect(world.tryResize(body, 0.8, 0.9)).toBe(true);
    const before = structuredClone(body);
    expect(world.tryResize(body, 0.8, 1.6)).toBe(false);
    expect(body).toEqual(before);
    const wall: AABB = { position: { x: 1, y: 0.5 }, width: 0.2, height: 1 };
    const nearWall = setup([floor, wall]);
    expect(nearWall.world.tryResize(nearWall.body, 2, 0.9)).toBe(false);
    expect(nearWall.body.width).toBe(0.8);
    expect(nearWall.body.height).toBe(1.6);
  });
});

describe('cúi người', () => {
  it('đổi tư thế và chiều cao khi có nền, giữ nguyên vị trí chân', () => {
    const { body, world, movement } = setup();
    const feet = body.position.y - body.height / 2;
    movement.step(world, dt, { ...noInput, crouch: true });
    expect(movement.stance).toBe('crouching');
    expect(movement.mode).toBe('grounded');
    expect(body.height).toBe(0.9);
    expect(body.width).toBe(0.8);
    expect(body.position.y - body.height / 2).toBeCloseTo(feet);
    expect(body.velocity.y).toBe(0);
  });

  it('không bắt đầu cúi trên không', () => {
    const { body, world, movement } = setup();
    body.position.y = 3;
    body.isGrounded = false;
    movement.step(world, dt, { ...noInput, crouch: true });
    expect(movement.stance).toBe('standing');
    expect(body.height).toBe(1.6);
    expect(body.velocity.y).toBeLessThan(0);
  });

  it('dùng tốc độ thấp hơn và chặn nhảy trong khi cúi', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, crouch: true, horizontal: 1, jump: true });
    expect(body.velocity.x).toBe(gameConfig.player.crouchSpeed);
    expect(body.position.x).toBeCloseTo(gameConfig.player.crouchSpeed * dt);
    expect(movement.jump()).toBe(false);
    expect(body.isGrounded).toBe(true);
    expect(body.velocity.y).toBe(0);
  });

  it('đứng khi nhả S ở chỗ trống và có thể nhảy ngay trong bước đó', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, crouch: true });
    movement.step(world, dt, { ...noInput, jump: true });
    expect(movement.stance).toBe('standing');
    expect(body.height).toBe(1.6);
    expect(body.isGrounded).toBe(false);
    expect(body.velocity.y).toBeCloseTo(11 - 28 * dt);
  });

  it('giữ cúi khi nhả S dưới trần và tự đứng sau khi đi ra khỏi hầm', () => {
    const { body, world, movement } = setup([floor, roof]);
    movement.step(world, dt, { ...noInput, crouch: true });
    for (let step = 0; step < 20; step += 1) {
      movement.step(world, dt, noInput);
      expect(movement.stance).toBe('crouching');
      expect(movement.standingBlocked).toBe(true);
      expect(world.canOccupy(body)).toBe(true);
    }
    for (let step = 0; step < 90; step += 1) {
      movement.step(world, dt, { ...noInput, horizontal: 1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    expect(body.position.x).toBeGreaterThan(2.4);
    expect(movement.stance).toBe('standing');
    expect(movement.standingBlocked).toBe(false);
    expect(body.height).toBe(1.6);
    expect(body.position.y - body.height / 2).toBeCloseTo(0);
  });

  it('không xuyên vật cản bên cạnh trong tư thế cúi', () => {
    const wall: AABB = { position: { x: 1.1, y: 0.5 }, width: 0.4, height: 1 };
    const { body, world, movement } = setup([floor, wall]);
    for (let step = 0; step < 100; step += 1) {
      movement.step(world, dt, { ...noInput, crouch: true, horizontal: 1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    expect(body.position.x).toBeCloseTo(0.5);
    expect(body.velocity.x).toBe(0);
    expect(body.isGrounded).toBe(true);
  });

  it('cúi/đứng nhanh nhiều lần không trôi chân hoặc rơi qua nền', () => {
    const { body, world, movement } = setup();
    for (let step = 0; step < 600; step += 1) {
      movement.step(world, dt, { ...noInput, crouch: step % 2 === 0 });
      expect(body.position.y - body.height / 2).toBeCloseTo(0, 10);
      expect(body.isGrounded).toBe(true);
      expect(world.canOccupy(body)).toBe(true);
    }
  });

  it('khôi phục đứng khi rời mép nền, không cho cúi mới trên không', () => {
    const smallFloor: AABB = { position: { x: 0, y: -1 }, width: 1, height: 2 };
    const { body, world, movement } = setup([smallFloor]);
    for (let step = 0; step < 30; step += 1) movement.step(world, dt, { ...noInput, crouch: true, horizontal: 1 });
    expect(body.isGrounded).toBe(false);
    expect(movement.stance).toBe('standing');
    expect(body.height).toBe(1.6);
    expect(body.velocity.y).toBeLessThan(0);
  });
});
