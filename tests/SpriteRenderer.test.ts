import { Mesh, Texture } from 'three';
import { describe, expect, it, vi } from 'vitest';
import type { SpriteFrame } from '../src/animation/AnimationClip';
import type { LoadedSpriteSheet } from '../src/animation/SpriteSheetLoader';
import { SpriteRenderer } from '../src/rendering/SpriteRenderer';

function createSheet(): LoadedSpriteSheet {
  return {
    image: 'dev.png', kind: 'development', filter: 'nearest', texture: new Texture(),
    imageWidth: 256, imageHeight: 128, clips: {},
    visual: {
      width: 2, height: 4, offset: { x: 0.1, y: 0.2 },
      scale: { x: 1, y: 1 }, anchor: { x: 0.5, y: 0 },
    },
  };
}
const trimmedFrame: SpriteFrame = {
  x: 64, y: 32, width: 20, height: 40, sourceWidth: 64, sourceHeight: 80,
  offsetX: 20, offsetY: 32, pivot: { x: 32, y: 72 },
};

describe('render sprite không cần WebGL', () => {
  it('cập nhật UV chọn vùng atlas và lật ngang', () => {
    const renderer = new SpriteRenderer(createSheet());
    const mesh = renderer.visual.children[0] as Mesh;
    renderer.setFrame(trimmedFrame, 'right');
    const uv = mesh.geometry.getAttribute('uv');
    expect(uv.getX(0)).toBeCloseTo(64 / 256);
    expect(uv.getY(0)).toBeCloseTo(1 - 32 / 128);
    expect(uv.getX(3)).toBeCloseTo(84 / 256);
    expect(uv.getY(3)).toBeCloseTo(1 - 72 / 128);
    renderer.setFrame(trimmedFrame, 'left');
    expect(uv.getX(0)).toBeCloseTo(84 / 256);
    expect(uv.getX(3)).toBeCloseTo(64 / 256);
    renderer.dispose();
  });

  it('giữ chân và pivot ổn định giữa các frame có viền trong suốt khác nhau', () => {
    const renderer = new SpriteRenderer(createSheet());
    const mesh = renderer.visual.children[0] as Mesh;
    for (const frame of [trimmedFrame, { ...trimmedFrame, width: 36, height: 60, offsetX: 10, offsetY: 12 }]) {
      renderer.setFrame(frame, 'right');
      expect(mesh.position.y - mesh.scale.y / 2).toBeCloseTo(0.2);
      const footX = mesh.position.x + (32 - frame.offsetX - frame.width / 2) * 2 / 64;
      expect(footX).toBeCloseTo(0.1);
    }
    renderer.setFrame(trimmedFrame, 'left');
    expect(mesh.position.x).toBeCloseTo(0.1 - (20 + 10 - 32) * 2 / 64);
    expect(mesh.scale.x).toBeGreaterThan(0);
    renderer.dispose();
  });

  it('hỗ trợ anchor mặc định và visual scale, offset theo metadata', () => {
    const sheet = createSheet();
    const renderer = new SpriteRenderer({ ...sheet, visual: { ...sheet.visual, scale: { x: 2, y: 0.5 } } });
    const frame = { ...trimmedFrame, width: 64, height: 80, offsetX: 0, offsetY: 0, pivot: undefined };
    renderer.setFrame(frame, 'right');
    const mesh = renderer.visual.children[0] as Mesh;
    expect(mesh.scale.x).toBe(4);
    expect(mesh.scale.y).toBe(2);
    expect(mesh.position.x).toBe(0.1);
    expect(mesh.position.y - mesh.scale.y / 2).toBeCloseTo(0.2);
    renderer.dispose();
  });

  it('tái sử dụng geometry/material/texture và không cập nhật UV khi frame/hướng giữ nguyên', () => {
    const sheet = createSheet();
    const renderer = new SpriteRenderer(sheet);
    const mesh = renderer.visual.children[0] as Mesh;
    const geometry = mesh.geometry;
    const material = mesh.material;
    const uv = geometry.getAttribute('uv');
    renderer.setFrame(trimmedFrame, 'right');
    const setXY = vi.spyOn(uv, 'setXY');
    renderer.setFrame(trimmedFrame, 'right');
    expect(setXY).not.toHaveBeenCalled();
    renderer.setFrame({ ...trimmedFrame, x: 96 }, 'left');
    expect(mesh.geometry).toBe(geometry);
    expect(mesh.material).toBe(material);
    expect((mesh.material as { map?: Texture }).map).toBe(sheet.texture);
    const textureDispose = vi.spyOn(sheet.texture, 'dispose');
    const geometryDispose = vi.spyOn(geometry, 'dispose');
    renderer.dispose();
    renderer.dispose();
    expect(textureDispose).toHaveBeenCalledTimes(1);
    expect(geometryDispose).toHaveBeenCalledTimes(1);
  });
});
