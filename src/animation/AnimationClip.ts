export interface SpriteFrame {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly sourceWidth: number;
  readonly sourceHeight: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly pivot?: Readonly<{ x: number; y: number }>;
}

export interface AnimationClip {
  readonly name: string;
  readonly frames: readonly SpriteFrame[];
  readonly fps: number;
  readonly loop: boolean;
  readonly speed?: number;
}

export type AnimationClips = Readonly<Record<string, AnimationClip>>;
export type Facing = 'left' | 'right';
