import { AdditiveBlending, Color, Mesh, MeshBasicMaterial, ShaderMaterial, Vector2 } from 'three';
import type { Object3D } from 'three';
import settings from '../config/nine-dragons.generated.json';

interface GlowLayer {
  overlay: Mesh;
  material: ShaderMaterial;
}

// Thêm lớp sáng lên sprite nhân vật và skill được chọn; không sửa material/texture gốc.
export class PlayerSkillGlow {
  private readonly layers = new Map<Mesh, GlowLayer>();

  constructor(private readonly playerRoot: Object3D) {}

  sync(character: Object3D | null, power: number, effects: readonly Object3D[] = []): void {
    for (const [source, layer] of this.layers) {
      let node: Object3D | null = source;
      while (node && node !== this.playerRoot && !effects.includes(node)) node = node.parent;
      if (!node) {
        layer.overlay.removeFromParent();
        layer.material.dispose();
        this.layers.delete(source);
      } else layer.overlay.visible = false;
    }
    if (power <= 0) return;
    for (const root of [character, ...effects]) root?.traverseVisible((object) => {
      if (!(object instanceof Mesh) || !(object.material instanceof MeshBasicMaterial) || !object.material.map) return;
      const texture = object.material.map, width = texture.image?.width, height = texture.image?.height;
      const uv = object.geometry.getAttribute('uv');
      if (!width || !height || !uv) return;
      let layer = this.layers.get(object);
      if (!layer) {
        const material = new ShaderMaterial({
          transparent: true, depthWrite: false, blending: AdditiveBlending,
          uniforms: {
            uMap: { value: texture }, uTexel: { value: new Vector2(1 / width, 1 / height) },
            uMin: { value: new Vector2() }, uMax: { value: new Vector2() }, uPower: { value: 0 },
            uRim: { value: new Color(settings.glow.rimColor) }, uHalo: { value: new Color(settings.glow.haloColor) },
            uRadius: { value: new Vector2(settings.glow.rimRadiusPx, settings.glow.haloRadiusPx) },
            uBrightness: { value: settings.glow.brightness - 1 }, uSaturation: { value: settings.glow.saturation - 1 },
          },
          vertexShader: `varying vec2 vUv;
            void main() { vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
          fragmentShader: `uniform sampler2D uMap;
            uniform vec2 uTexel,uMin,uMax,uRadius;
            uniform vec3 uRim,uHalo;
            uniform float uPower,uBrightness,uSaturation;
            varying vec2 vUv;
            float ink(vec2 at) {
              if(any(lessThan(at,uMin))||any(greaterThan(at,uMax)))return 0.0;
              return texture2D(uMap,at).a;
            }
            void main() {
              vec4 body=texture2D(uMap,vUv);
              float nearInk=body.a,farInk=0.0;
              for(int i=0;i<8;i++) {
                float angle=float(i)*0.7853981634;
                vec2 direction=vec2(cos(angle),sin(angle))*uTexel;
                nearInk=max(nearInk,ink(vUv+direction*uRadius.x));
                farInk+=ink(vUv+direction*uRadius.y)*0.025+ink(vUv+direction*uRadius.y*0.5)*0.1;
              }
              float rim=max(0.0,nearInk-body.a),halo=farInk*(1.0-body.a)*(1.0-rim);
              float light=dot(body.rgb,vec3(0.2126,0.7152,0.0722));
              vec3 lift=max(vec3(0.0),body.rgb*uBrightness+(body.rgb-vec3(light))*uSaturation)*body.a;
              vec3 glow=lift+uRim*rim*0.65+uHalo*halo*0.16;
              gl_FragColor=vec4(glow*uPower,1.0);
              #include <tonemapping_fragment>
              #include <colorspace_fragment>
            }`,
        });
        // Dùng cùng geometry/UV để frame, facing và pivot bám đúng sprite. Không sở hữu geometry/texture.
        const overlay = new Mesh(object.geometry, material);
        overlay.position.z = 0.001;
        overlay.name = 'nine-dragons-character-glow';
        object.add(overlay);
        layer = { overlay, material };
        this.layers.set(object, layer);
      }
      const x0 = Math.min(uv.getX(0), uv.getX(1)), x1 = Math.max(uv.getX(0), uv.getX(1));
      const y0 = Math.min(uv.getY(0), uv.getY(2)), y1 = Math.max(uv.getY(0), uv.getY(2));
      layer.material.uniforms.uMin!.value.set(x0, y0);
      layer.material.uniforms.uMax!.value.set(x1, y1);
      layer.material.uniforms.uPower!.value = power;
      layer.overlay.visible = true;
    });
  }

  dispose(): void {
    for (const layer of this.layers.values()) {
      layer.overlay.removeFromParent();
      layer.material.dispose();
    }
    this.layers.clear();
  }
}
