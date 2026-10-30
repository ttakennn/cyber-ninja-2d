import { afterEach, describe, expect, it } from 'vitest';
import { InputManager } from '../src/input/InputManager';

const inputs: InputManager[] = [];
const setup = (): { target: EventTarget; input: InputManager } => {
  const target = new EventTarget();
  const input = new InputManager(target);
  inputs.push(input);
  return { target, input };
};
const key = (target: EventTarget, type: string, code: string, repeat = false): Event => {
  const event = new Event(type, { cancelable: true });
  Object.assign(event, { code, repeat, ctrlKey: false, metaKey: false, altKey: false });
  target.dispatchEvent(event);
  return event;
};
afterEach(() => {
  for (const input of inputs) input.dispose();
  inputs.length = 0;
});

describe('keyboard input', () => {
  it('tracks continuous movement and cancels opposing directions', () => {
    const { target, input } = setup();
    expect(key(target, 'keydown', 'KeyA').defaultPrevented).toBe(true);
    expect(input.horizontal).toBe(-1);
    input.endStep();
    expect(input.horizontal).toBe(-1);
    key(target, 'keydown', 'KeyD');
    expect(input.horizontal).toBe(0);
    key(target, 'keyup', 'KeyA');
    expect(input.horizontal).toBe(1);
    expect(input.wasReleased('moveLeft')).toBe(true);
  });

  it('preserves a quick jump press until a simulation step consumes it', () => {
    const { target, input } = setup();
    key(target, 'keydown', 'Space');
    key(target, 'keyup', 'Space');
    expect(input.wasPressed('jump')).toBe(true);
    expect(input.wasReleased('jump')).toBe(true);
    expect(input.isDown('jump')).toBe(false);
    input.endStep();
    expect(input.wasPressed('jump')).toBe(false);
  });

  it('does not repeat jump edges for held keys or a held action alias', () => {
    const { target, input } = setup();
    key(target, 'keydown', 'Space');
    expect(input.wasPressed('jump')).toBe(true);
    input.endStep();
    key(target, 'keydown', 'Space', true);
    key(target, 'keydown', 'KeyW');
    expect(input.wasPressed('jump')).toBe(false);
    key(target, 'keyup', 'Space');
    expect(input.wasReleased('jump')).toBe(false);
    key(target, 'keyup', 'KeyW');
    key(target, 'keydown', 'ArrowUp');
    expect(input.wasPressed('jump')).toBe(true);
  });

  it('clears all active and pending input on blur and ignores autorepeat on return', () => {
    const { target, input } = setup();
    key(target, 'keydown', 'KeyD');
    key(target, 'keydown', 'Space');
    target.dispatchEvent(new Event('blur'));
    expect(input.horizontal).toBe(0);
    expect(input.wasPressed('jump')).toBe(false);
    key(target, 'keydown', 'Space', true);
    expect(input.wasPressed('jump')).toBe(false);
  });

  it('removes listeners on disposal so instances do not leak input', () => {
    const { target, input } = setup();
    input.dispose();
    const next = new InputManager(target);
    inputs.push(next);
    key(target, 'keydown', 'F3');
    expect(input.wasPressed('toggleDebug')).toBe(false);
    expect(next.wasPressed('toggleDebug')).toBe(true);
    expect(key(target, 'keydown', 'KeyZ').defaultPrevented).toBe(false);
  });
});
