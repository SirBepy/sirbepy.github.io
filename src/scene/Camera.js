import * as THREE from "three";
import { Tween, Easing, update as tweenUpdate, removeAll } from "@tweenjs/tween.js";
import { FOCUS_POINTS } from "./focus-points.js";

export class Camera {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.currentFocus = "main";
    this.applyFocusImmediate("main");

    // Parallax state
    this.parallaxEnabled = true;
    this.mouse = { x: 0, y: 0 };
    this.parallaxBase = FOCUS_POINTS.main.position.clone();

    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener("mousemove", this.onMouseMove);
  }

  applyFocusImmediate(name) {
    const fp = FOCUS_POINTS[name];
    if (!fp) throw new Error(`Unknown focus point '${name}'`);
    this.camera.position.copy(fp.position);
    this.camera.lookAt(fp.lookAt);
    this.parallaxEnabled = !!fp.parallax;
    this.parallaxBase = fp.position.clone();
    this.currentFocus = name;
  }

  focusOn(name) {
    const fp = FOCUS_POINTS[name];
    if (!fp) throw new Error(`Unknown focus point '${name}'`);
    if (name === this.currentFocus) return;

    removeAll();

    // Reduced motion: snap.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.applyFocusImmediate(name);
      return;
    }

    const startPos = this.camera.position.clone();
    const lookAtCurrent = new THREE.Vector3();
    this.camera.getWorldDirection(lookAtCurrent);
    lookAtCurrent.multiplyScalar(5).add(this.camera.position);

    const proxy = { px: startPos.x, py: startPos.y, pz: startPos.z, lx: lookAtCurrent.x, ly: lookAtCurrent.y, lz: lookAtCurrent.z };
    const dest = { px: fp.position.x, py: fp.position.y, pz: fp.position.z, lx: fp.lookAt.x, ly: fp.lookAt.y, lz: fp.lookAt.z };

    this.parallaxEnabled = false;

    new Tween(proxy)
      .to(dest, fp.duration)
      .easing(Easing.Cubic.InOut)
      .onUpdate(() => {
        this.camera.position.set(proxy.px, proxy.py, proxy.pz);
        this.camera.lookAt(proxy.lx, proxy.ly, proxy.lz);
      })
      .onComplete(() => {
        this.parallaxEnabled = !!fp.parallax;
        this.parallaxBase = fp.position.clone();
        this.currentFocus = name;
      })
      .start();
  }

  onMouseMove(e) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
  }

  update(t) {
    tweenUpdate(t);

    if (this.parallaxEnabled) {
      const targetX = this.parallaxBase.x + this.mouse.x * 0.5;
      const targetY = this.parallaxBase.y - this.mouse.y * 0.3;
      this.camera.position.x += (targetX - this.camera.position.x) * 0.05;
      this.camera.position.y += (targetY - this.camera.position.y) * 0.05;
      this.camera.lookAt(FOCUS_POINTS.main.lookAt);
    }
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    window.removeEventListener("mousemove", this.onMouseMove);
    removeAll();
  }
}
