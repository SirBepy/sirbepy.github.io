import * as THREE from "three";

export class Lights {
  constructor(scene) {
    this.scene = scene;
    this.torches = [];

    // Sun (warm low-angle directional, pours through window from -Z direction outside)
    this.sun = new THREE.DirectionalLight(0xffb070, 1.6);
    this.sun.position.set(2, 6, -12);
    this.sun.target.position.set(0, 2, 0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 30;
    this.sun.shadow.camera.left = -10;
    this.sun.shadow.camera.right = 10;
    this.sun.shadow.camera.top = 10;
    this.sun.shadow.camera.bottom = -10;
    scene.add(this.sun);
    scene.add(this.sun.target);

    // Ambient (low warm fill)
    this.ambient = new THREE.AmbientLight(0x4a2f1f, 0.6);
    scene.add(this.ambient);

    // Hemisphere (sky/floor bounce)
    this.hemi = new THREE.HemisphereLight(0xffb070, 0x3a2510, 0.4);
    scene.add(this.hemi);
  }

  addTorch(position) {
    const light = new THREE.PointLight(0xffaa4a, 1.5, 8, 2);
    light.position.set(...position);
    light.castShadow = false;
    this.scene.add(light);
    this.torches.push({ light, baseIntensity: 1.5, seed: Math.random() * 100 });
  }

  update(t) {
    // Flicker torches: low-amplitude noise on intensity
    for (const torch of this.torches) {
      const n = Math.sin(t * 0.008 + torch.seed) * 0.5 + Math.sin(t * 0.013 + torch.seed * 1.7) * 0.5;
      torch.light.intensity = torch.baseIntensity + n * 0.25;
    }
  }

  setMode(mode) {
    // Stub for v2/v3 day/night switch. v1 is fixed sunset.
    void mode;
  }
}
