import { describe, expect, it } from 'vitest';
import { gameConfig } from '../src/config/game.config';
import type { AABB, ClimbableZone } from '../src/physics/Collision';
import { dt, floor, ladder, noInput, roof, setup } from './movement.fixtures';

describe('bám và leo vùng chỉ định', () => {
  it('cần chồng lấp vùng leo và cạnh kích hoạt E', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, noInput);
    expect(movement.mode).toBe('grounded');
    body.position.x = 3;
    movement.step(world, dt, { ...noInput, enterClimb: true });
    expect(movement.activeClimbable).toBeNull();
    body.position.x = 0.3;
    movement.step(world, dt, { ...noInput, enterClimb: true });
    expect(movement.mode).toBe('climbing');
    expect(movement.activeClimbable?.id).toBe('ladder');
    expect(body.position.x).toBe(0);
    expect(body.isGrounded).toBe(false);
  });

  it('vùng leo không cản đi bộ và không cản truy vấn khoảng trống', () => {
    const { body, world, movement } = setup();
    for (let step = 0; step < 30; step += 1) movement.step(world, dt, { ...noInput, horizontal: 1 });
    expect(body.position.x).toBeCloseTo(3);
    expect(movement.mode).toBe('grounded');
    expect(world.canOccupy(body)).toBe(true);
  });

  it('tắt trọng lực, đứng yên trên thang không trôi xuống', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, enterClimb: true, vertical: 1 });
    const position = body.position.y;
    for (let step = 0; step < 120; step += 1) movement.step(world, dt, noInput);
    expect(body.position.y).toBe(position);
    expect(body.velocity.y).toBe(0);
    expect(body.velocity.x).toBe(0);
    expect(body.isGrounded).toBe(false);
    expect(movement.mode).toBe('climbing');
  });

  it('leo lên và xuống theo tốc độ cấu hình', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, enterClimb: true });
    for (let step = 0; step < 60; step += 1) movement.step(world, dt, { ...noInput, vertical: 1 });
    expect(body.position.y).toBeCloseTo(0.8 + gameConfig.player.climbSpeed);
    for (let step = 0; step < 30; step += 1) movement.step(world, dt, { ...noInput, vertical: -1 });
    expect(body.position.y).toBeCloseTo(0.8 + gameConfig.player.climbSpeed / 2);
  });

  it('giới hạn đỉnh và đáy thang, không đẩy body qua nền', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, enterClimb: true });
    for (let step = 0; step < 300; step += 1) {
      movement.step(world, dt, { ...noInput, vertical: 1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    expect(body.position.y + body.height / 2).toBeCloseTo(6);
    expect(body.velocity.y).toBe(0);
    for (let step = 0; step < 300; step += 1) {
      movement.step(world, dt, { ...noInput, vertical: -1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    expect(body.position.y - body.height / 2).toBeCloseTo(0);
    expect(body.velocity.y).toBe(0);
    expect(body.isGrounded).toBe(false);
    expect(movement.mode).toBe('climbing');
  });

  it('A/D rời thang khôi phục trọng lực và vận tốc ngang', () => {
    const { body, world, movement } = setup();
    body.position.y = 2;
    body.isGrounded = false;
    movement.step(world, dt, { ...noInput, enterClimb: true });
    movement.step(world, dt, { ...noInput, horizontal: 1 });
    expect(movement.activeClimbable).toBeNull();
    expect(movement.mode).toBe('airborne');
    expect(body.velocity.x).toBe(6);
    expect(body.velocity.y).toBeCloseTo(-28 * dt);
  });

  it('Space nhảy rời thang một lần và cạnh W không bị xử lý lại', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, enterClimb: true });
    movement.step(world, dt, { ...noInput, detachJump: true, jump: true });
    expect(movement.mode).toBe('airborne');
    expect(body.velocity.y).toBeCloseTo(11 - 28 * dt);
    for (let step = 0; step < 150; step += 1) movement.step(world, dt, noInput);
    expect(body.isGrounded).toBe(true);
    expect(body.velocity.y).toBe(0);
    expect(body.position.y).toBeCloseTo(0.8);
  });

  it('không thoát ngang xuyên tường đang sát người', () => {
    const wall: AABB = { position: { x: 0.5, y: 2 }, width: 0.2, height: 4 };
    const { body, world, movement } = setup([floor, wall]);
    movement.step(world, dt, { ...noInput, enterClimb: true });
    movement.step(world, dt, { ...noInput, horizontal: 1 });
    expect(movement.mode).toBe('climbing');
    expect(body.position.x).toBe(0);
    expect(world.canOccupy(body)).toBe(true);
  });

  it('quét đường căn giữa thang để không xuyên tường dù điểm đến trống', () => {
    const zone: ClimbableZone = { ...ladder, position: { x: 2, y: 3 }, width: 6 };
    const wall: AABB = { position: { x: 1, y: 1 }, width: 0.2, height: 2 };
    const { body, world, movement } = setup([floor, wall], [zone]);
    expect(world.canOccupy(body, { x: 2, y: 0.8 })).toBe(true);
    movement.step(world, dt, { ...noInput, enterClimb: true });
    expect(movement.mode).toBe('grounded');
    expect(body.position.x).toBe(0);
  });

  it('không mở rộng body để bám thang khi đang cúi dưới trần', () => {
    const { body, world, movement } = setup([floor, roof]);
    movement.step(world, dt, { ...noInput, crouch: true });
    movement.step(world, dt, { ...noInput, enterClimb: true });
    expect(movement.mode).toBe('grounded');
    expect(movement.stance).toBe('crouching');
    expect(body.height).toBe(0.9);
    expect(world.canOccupy(body)).toBe(true);
  });

  it('không leo xuyên trần hoặc sàn rắn đặt trên đường thang', () => {
    const ceiling: AABB = { position: { x: 0, y: 3 }, width: 2, height: 0.5 };
    const { body, world, movement } = setup([floor, ceiling]);
    movement.step(world, dt, { ...noInput, enterClimb: true });
    for (let step = 0; step < 180; step += 1) {
      movement.step(world, dt, { ...noInput, vertical: 1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    expect(body.position.y + body.height / 2).toBeCloseTo(2.75);
    expect(body.velocity.y).toBe(0);
    expect(body.isGrounded).toBe(false);
    expect(movement.mode).toBe('climbing');
  });

  it('rời vùng leo do đặt lại vị trí sẽ bật lại trọng lực', () => {
    const { body, world, movement } = setup();
    movement.step(world, dt, { ...noInput, enterClimb: true });
    body.position.x = 10;
    body.position.y = 3;
    movement.step(world, dt, noInput);
    expect(movement.mode).toBe('airborne');
    expect(movement.activeClimbable).toBeNull();
    expect(body.velocity.y).toBeCloseTo(-28 * dt);
  });

  it('có thể leo cao rồi rời sang sàn bên cạnh bằng va chạm thông thường', () => {
    const platform: AABB = { position: { x: 2.5, y: 3.25 }, width: 4, height: 0.5 };
    const { body, world, movement } = setup([floor, platform]);
    movement.step(world, dt, { ...noInput, enterClimb: true });
    for (let step = 0; step < 120; step += 1) movement.step(world, dt, { ...noInput, vertical: 1 });
    for (let step = 0; step < 20; step += 1) {
      movement.step(world, dt, { ...noInput, horizontal: 1 });
      expect(world.canOccupy(body)).toBe(true);
    }
    for (let step = 0; step < 60; step += 1) movement.step(world, dt, noInput);
    expect(movement.mode).toBe('grounded');
    expect(body.position.y - body.height / 2).toBeCloseTo(3.5);
  });

  it('bám/rời nhiều lần và pause/resume không giữ vận tốc leo cũ', () => {
    const { body, world, movement } = setup();
    for (let cycle = 0; cycle < 30; cycle += 1) {
      movement.step(world, dt, { ...noInput, enterClimb: true });
      expect(movement.mode).toBe('climbing');
      movement.resetInput();
      expect(body.velocity.y).toBe(0);
      movement.step(world, dt, { ...noInput, horizontal: 1 });
      expect(movement.mode).toBe('grounded');
      expect(world.canOccupy(body)).toBe(true);
    }
    movement.step(world, dt, { ...noInput, enterClimb: true, vertical: 1 });
    movement.resetInput();
    const y = body.position.y;
    movement.step(world, dt, noInput);
    expect(body.position.y).toBe(y);
    expect(body.isGrounded).toBe(false);
  });
});
