import * as THREE from "three";

const COUNT = 200;
const BOUNDS = { x: 14, y: 7, z: 10 }; // half-extents for spawn volume centered on origin

// All motion in px/s. Converted to world-units per frame using camera + avg depth.
const UP_PX_PER_SEC = 12;             // dust rises this many screen px per second
const HORIZONTAL_PX_PER_SEC = 4;      // ± random sideways drift
const CURSOR_RADIUS_MIN_PX = 15;
const CURSOR_RADIUS_MAX_PX = 90;
const CURSOR_VEL_FOR_MAX_PX_PER_SEC = 800;
const CURSOR_VEL_SMOOTH = 0.12;
const CURSOR_PUSH_ACCEL_PX_PER_SEC2 = 2000; // acceleration (force) applied at cursor center
const IMPULSE_HALF_LIFE_SEC = 0.5;          // how fast cursor-induced motion decays
const LN2 = Math.LN2;

const tmpPos = new THREE.Vector3();
const tmpRef = new THREE.Vector3(0, 0, 0);

export class Particles {
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(COUNT * 3);
    // baseline drift velocity, px/s per axis
    this.velPx = new Float32Array(COUNT * 3);
    // cursor-induced impulse velocity, px/s per axis (decays with drag)
    this.impulsePx = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      this.positions[i * 3 + 0] = (Math.random() * 2 - 1) * BOUNDS.x;
      this.positions[i * 3 + 1] = Math.random() * BOUNDS.y * 2;
      this.positions[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
      this.velPx[i * 3 + 0] = (Math.random() - 0.5) * 2 * HORIZONTAL_PX_PER_SEC;
      this.velPx[i * 3 + 1] = UP_PX_PER_SEC * (0.6 + Math.random() * 0.6);
      this.velPx[i * 3 + 2] = (Math.random() - 0.5) * 2 * HORIZONTAL_PX_PER_SEC;
    }

    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));

    this.material = new THREE.PointsMaterial({
      color: 0xffd8a0,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.points = new THREE.Points(this.geometry, this.material);
    this.points.name = "Particles";

    this.mousePx = { x: 0, y: 0 };
    this.prevMousePx = null;
    this.smoothedMouseVel = 0;
    this.cursorActive = false;
    this.camera = null;
    this.screenW = window.innerWidth;
    this.screenH = window.innerHeight;
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setCursor(camera, mousePx, screenW, screenH, active) {
    this.camera = camera;
    this.mousePx.x = mousePx.x;
    this.mousePx.y = mousePx.y;
    this.screenW = screenW;
    this.screenH = screenH;
    this.cursorActive = active;
  }

  update(dt) {
    if (this.reducedMotion || !this.camera) return;

    const positions = this.positions;
    const camera = this.camera;
    const screenW = this.screenW;
    const screenH = this.screenH;
    const halfW = screenW * 0.5;
    const halfH = screenH * 0.5;
    const dtSec = dt * 0.001;

    const dist = camera.position.distanceTo(tmpRef);
    const vFov = (camera.fov * Math.PI) / 180;
    const worldPerPx = (2 * dist * Math.tan(vFov * 0.5)) / screenH;

    const mx = this.mousePx.x;
    const my = this.mousePx.y;

    // Mouse velocity tracking
    if (this.prevMousePx) {
      const ddx = mx - this.prevMousePx.x;
      const ddy = my - this.prevMousePx.y;
      const instVel = Math.hypot(ddx, ddy) / Math.max(dtSec, 0.001);
      this.smoothedMouseVel += (instVel - this.smoothedMouseVel) * CURSOR_VEL_SMOOTH;
    } else {
      this.prevMousePx = { x: mx, y: my };
    }
    this.prevMousePx.x = mx;
    this.prevMousePx.y = my;

    const velNorm = Math.min(1, this.smoothedMouseVel / CURSOR_VEL_FOR_MAX_PX_PER_SEC);
    const radiusPx = CURSOR_RADIUS_MIN_PX + (CURSOR_RADIUS_MAX_PX - CURSOR_RADIUS_MIN_PX) * velNorm;
    const radiusPxSq = radiusPx * radiusPx;

    // Drag: impulse velocity decays toward 0 with exponential half-life.
    const drag = Math.exp(-dtSec * LN2 / IMPULSE_HALF_LIFE_SEC);

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;

      // Decay impulse velocity first
      this.impulsePx[ix] *= drag;
      this.impulsePx[iy] *= drag;
      this.impulsePx[iz] *= drag;

      // Cursor force: add acceleration to impulse if within radius
      if (this.cursorActive) {
        tmpPos.set(positions[ix], positions[iy], positions[iz]);
        tmpPos.project(camera);
        const px = (tmpPos.x + 1) * halfW;
        const py = (1 - tmpPos.y) * halfH;
        const dx = px - mx;
        const dy = py - my;
        const distPxSq = dx * dx + dy * dy;
        if (distPxSq < radiusPxSq && distPxSq > 0.01) {
          const distPx = Math.sqrt(distPxSq);
          const falloff = 1 - distPx / radiusPx;
          const accel = CURSOR_PUSH_ACCEL_PX_PER_SEC2 * falloff * dtSec; // px/s gained this frame
          const nx = dx / distPx;
          const ny = dy / distPx;
          // Screen +x → world +x. Screen +y down → world -y.
          this.impulsePx[ix] += nx * accel;
          this.impulsePx[iy] += -ny * accel;
        }
      }

      // Integrate position with both baseline drift and decaying impulse.
      const stepX = (this.velPx[ix] + this.impulsePx[ix]) * worldPerPx * dtSec;
      const stepY = (this.velPx[iy] + this.impulsePx[iy]) * worldPerPx * dtSec;
      const stepZ = (this.velPx[iz] + this.impulsePx[iz]) * worldPerPx * dtSec;
      positions[ix] += stepX;
      positions[iy] += stepY;
      positions[iz] += stepZ;

      // wrap upward
      if (positions[iy] > BOUNDS.y * 2) {
        positions[iy] = 0;
        positions[ix] = (Math.random() * 2 - 1) * BOUNDS.x;
        positions[iz] = (Math.random() * 2 - 1) * BOUNDS.z;
        this.impulsePx[ix] = 0;
        this.impulsePx[iy] = 0;
        this.impulsePx[iz] = 0;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
