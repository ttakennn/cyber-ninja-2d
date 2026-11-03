export type InputAction = 'moveLeft' | 'moveRight' | 'jump' | 'toggleDebug' | 'crouch' | 'climbUp' | 'climb' | 'detachJump' | 'toggleCollision' | 'specialSkill1' | 'toggleHelp';
export type KeyBindings = Readonly<Record<InputAction, readonly string[]>>;

export const defaultBindings: KeyBindings = {
  moveLeft: ['KeyA', 'ArrowLeft'],
  moveRight: ['KeyD', 'ArrowRight'],
  jump: ['Space', 'KeyW', 'ArrowUp'],
  toggleDebug: ['F3'],
  crouch: ['KeyS', 'ArrowDown'],
  climbUp: ['KeyW', 'ArrowUp'],
  climb: ['KeyF'],
  detachJump: ['Space'],
  toggleCollision: ['F4'],
  specialSkill1: ['KeyE'],
  toggleHelp: ['KeyH'],
};

export class InputManager {
  private readonly held = new Set<string>();
  private readonly pressed = new Set<InputAction>();
  private readonly released = new Set<InputAction>();
  private readonly mappedKeys: Set<string>;

  constructor(
    private readonly target: EventTarget = window,
    private readonly bindings: KeyBindings = defaultBindings,
  ) {
    this.mappedKeys = new Set(Object.values(bindings).flat());
    target.addEventListener('keydown', this.onKeyDown);
    target.addEventListener('keyup', this.onKeyUp);
    target.addEventListener('blur', this.onBlur);
  }

  isDown(action: InputAction): boolean {
    return this.bindings[action].some((code) => this.held.has(code));
  }

  wasPressed(action: InputAction): boolean {
    return this.pressed.has(action);
  }

  wasReleased(action: InputAction): boolean {
    return this.released.has(action);
  }

  get horizontal(): number {
    return Number(this.isDown('moveRight')) - Number(this.isDown('moveLeft'));
  }

  get vertical(): number {
    return Number(this.isDown('climbUp')) - Number(this.isDown('crouch'));
  }

  // Called after each fixed step, never after a render with no simulation step.
  endStep(): void {
    this.pressed.clear();
    this.released.clear();
  }

  reset(): void {
    this.held.clear();
    this.endStep();
  }

  dispose(): void {
    this.target.removeEventListener('keydown', this.onKeyDown);
    this.target.removeEventListener('keyup', this.onKeyUp);
    this.target.removeEventListener('blur', this.onBlur);
    this.reset();
  }

  private readonly onKeyDown = (event: Event): void => {
    const key = event as KeyboardEvent;
    if (!this.mappedKeys.has(key.code) || this.isEditable(key.target)) return;
    if (key.ctrlKey || key.metaKey || key.altKey) return;
    key.preventDefault();
    if (key.repeat || this.held.has(key.code)) return;

    for (const action of Object.keys(this.bindings) as InputAction[]) {
      if (this.bindings[action].includes(key.code) && !this.isDown(action)) {
        this.pressed.add(action);
      }
    }
    this.held.add(key.code);
  };

  private readonly onKeyUp = (event: Event): void => {
    const key = event as KeyboardEvent;
    if (!this.mappedKeys.has(key.code)) return;
    const active = (Object.keys(this.bindings) as InputAction[]).filter((action) => this.isDown(action));
    if (this.held.has(key.code)) key.preventDefault();
    this.held.delete(key.code);
    for (const action of active) {
      if (!this.isDown(action)) this.released.add(action);
    }
  };

  private readonly onBlur = (): void => {
    this.reset();
  };

  private isEditable(target: EventTarget | null): boolean {
    return typeof HTMLElement !== 'undefined' && target instanceof HTMLElement &&
      (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
  }
}
