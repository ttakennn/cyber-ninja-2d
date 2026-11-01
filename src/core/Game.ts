import { gameConfig } from '../config/game.config';
import { DebugOverlay } from '../debug/DebugOverlay';
import { CollisionDebug } from '../debug/CollisionDebug';
import { Player } from '../entities/Player';
import { InputManager } from '../input/InputManager';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { GameCamera } from '../rendering/GameCamera';
import { Renderer } from '../rendering/Renderer';
import { TestLevel } from '../world/TestLevel';
import { GameLoop } from './GameLoop';
import { FallRecovery } from './FallRecovery';

export class Game {
  private readonly renderer: Renderer;
  private readonly camera: GameCamera;
  private readonly input: InputManager;
  private readonly physics: PhysicsWorld;
  private readonly player: Player;
  private readonly level: TestLevel;
  private readonly debug: DebugOverlay;
  private readonly collisionDebug: CollisionDebug;
  private readonly loop: GameLoop;
  private readonly recovery: FallRecovery;
  private readonly resizeObserver: ResizeObserver;
  private started = false;
  private disposed = false;

  constructor(private readonly container: HTMLElement, levelData?: unknown) {
    this.level = new TestLevel(levelData);
    this.physics = new PhysicsWorld(gameConfig.physics.gravity, this.level.colliders, this.level.climbables);
    if (!this.physics.canOccupy({ position: this.level.spawn, width: gameConfig.player.width, height: gameConfig.player.height })) {
      this.level.dispose();
      throw new Error(`Level "${this.level.id}": spawn không đủ khoảng trống cho collider đứng`);
    }
    try {
      this.renderer = new Renderer(container);
    } catch (error) {
      this.level.dispose();
      throw error;
    }
    this.camera = new GameCamera(this.level.cameraBounds, this.level.cameraFollowY);
    this.player = new Player(this.level.spawn);
    this.recovery = new FallRecovery(this.level.spawn, this.level.deathY);
    this.input = new InputManager();
    this.debug = new DebugOverlay(container, this.level.id);
    this.collisionDebug = new CollisionDebug(this.level.colliders, this.level.climbables);
    this.renderer.scene.add(this.level.visual, this.player.visual, this.collisionDebug.visual);
    this.loop = new GameLoop(this.update, this.render);
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);
    window.addEventListener('resize', this.resize);
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.resize();
    this.camera.reset(this.player.visual.position);
    void this.player.loadSprite();
  }

  async loadLevelVisuals(): Promise<void> {
    await this.level.loadVisuals();
  }

  start(): void {
    if (this.disposed || this.started) return;
    this.started = true;
    this.player.resetInterpolation();
    if (!document.hidden) this.loop.start();
  }

  stop(): void {
    this.started = false;
    this.loop.stop();
    this.input.reset();
    this.player.movement.resetInput();
    this.player.resetInterpolation();
  }

  dispose(): void {
    if (this.disposed) return;
    this.stop();
    this.disposed = true;
    this.resizeObserver.disconnect();
    window.removeEventListener('resize', this.resize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.input.dispose();
    this.player.dispose();
    this.level.dispose();
    this.debug.dispose();
    this.collisionDebug.dispose();
    this.renderer.dispose();
  }

  private readonly update = (delta: number): void => {
    this.player.capturePreviousPosition();
    if (this.input.wasPressed('toggleDebug')) this.debug.toggle();
    if (this.input.wasPressed('toggleCollision')) this.collisionDebug.toggle();
    const landed = this.player.updateMovement(this.physics, delta, {
      horizontal: this.input.horizontal,
      vertical: this.input.vertical,
      crouch: this.input.isDown('crouch'),
      enterClimb: this.input.wasPressed('climb'),
      jump: this.input.wasPressed('jump'),
      detachJump: this.input.wasPressed('detachJump'),
    });
    if (this.recovery.update(this.player, this.input, this.camera)) return;
    this.player.updateState(landed);
    this.player.updateAnimation(delta, landed);
    this.input.endStep();
  };

  private readonly render = (frameDelta: number, alpha: number): void => {
    this.player.syncVisual(alpha);
    this.camera.follow(this.player.visual.position, this.player.renderHeight);
    this.level.updateVisuals(this.camera.camera, frameDelta);
    this.collisionDebug.update(this.player.visual.position.x, this.player.visual.position.y, this.player.body.width, this.player.renderHeight);
    this.renderer.render(this.camera.camera);
    this.debug.update(frameDelta, this.player, alpha, this.camera, this.recovery.count, this.level.deathY);
  };

  private readonly resize = (): void => {
    const width = Math.max(1, this.container.clientWidth);
    const height = Math.max(1, this.container.clientHeight);
    this.camera.resize(width, height);
    this.renderer.resize(width, height);
  };

  private readonly onVisibilityChange = (): void => {
    this.input.reset();
    this.player.movement.resetInput();
    this.player.resetInterpolation();
    if (document.hidden) this.loop.stop();
    else if (this.started) this.loop.start();
  };
}
