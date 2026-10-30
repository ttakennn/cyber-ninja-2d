import { afterEach, describe, expect, it } from 'vitest';
import { Player } from '../src/entities/Player';

// Three.js geometry can be created in Node; no renderer, canvas, or WebGL is used.
const players: Player[] = [];
const createPlayer = (): Player => {
  const player = new Player();
  players.push(player);
  return player;
};
afterEach(() => {
  for (const player of players) player.dispose();
  players.length = 0;
});

describe('player gameplay state', () => {
  it('reverses direction immediately and stops without drift', () => {
    const player = createPlayer();
    player.move(1);
    expect(player.body.velocity.x).toBe(6);
    player.move(-1);
    expect(player.body.velocity.x).toBe(-6);
    player.move(0);
    expect(player.body.velocity.x).toBe(0);
  });

  it('requires ground contact to jump', () => {
    const player = createPlayer();
    expect(player.jump()).toBe(false);
    player.body.isGrounded = true;
    expect(player.jump()).toBe(true);
    expect(player.body.velocity.y).toBe(11);
    expect(player.jump()).toBe(false);
  });

  it('reports idle, both movement directions, jump, fall, and one-step landing', () => {
    const player = createPlayer();
    player.body.isGrounded = true;
    player.updateState(false);
    expect(player.state).toBe('idle');
    player.move(-1);
    player.updateState(false);
    expect(player.state).toBe('moveLeft');
    player.move(1);
    player.updateState(false);
    expect(player.state).toBe('moveRight');
    player.jump();
    player.updateState(false);
    expect(player.state).toBe('jump');
    player.body.velocity.y = -1;
    player.updateState(false);
    expect(player.state).toBe('fall');
    player.body.isGrounded = true;
    player.body.velocity.y = 0;
    player.updateState(true);
    expect(player.state).toBe('land');
    player.move(0);
    player.updateState(false);
    expect(player.state).toBe('idle');
  });
});
