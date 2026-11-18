import * as THREE from "three";

export class Lights {
  constructor(scene) {
    this.scene = scene;
    this.monitorLights = [];

    // Sun: warm low-angle directional through the window from -Z outside.
    this.sun = new THREE.DirectionalLight(0xffb070, 4.0);
    this.sun.position.set(2, 6, -12);
    this.sun.target.position.set(0, 2, 0);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(2048, 2048);
    this.sun.shadow.camera.near = 1;
    this.sun.shadow.camera.far = 40;
    this.sun.shadow.camera.left = -12;
    this.sun.shadow.camera.right = 12;
    this.sun.shadow.camera.top = 12;
    this.sun.shadow.camera.bottom = -12;
    this.sun.shadow.bias = -0.0005;
    this.sun.shadow.normalBias = 0.04;
    scene.add(this.sun);
    scene.add(this.sun.target);

    // Minimal ambient so shadows still read but interior isn't pitch black.
    this.ambient = new THREE.AmbientLight(0x2a1a14, 0.25);
    scene.add(this.ambient);

    // Hemisphere bounce, very subtle.
    this.hemi = new THREE.HemisphereLight(0xffb070, 0x1a0f08, 0.15);
    scene.add(this.hemi);
  }

  addMonitorLight(position, { color = 0x6a8aff, intensity = 2.4, distance = 6 } = {}) {
    const light = new THREE.PointLight(color, intensity, distance, 2);
    light.position.set(...position);
    light.castShadow = false;
    this.scene.add(light);
    this.monitorLights.push(light);
  }

  update(t) {
    void t;
  }

  setMode(mode) {
    // Stub for v2/v3 day/night switch. v1 is fixed sunset.
    void mode;
  }
}
