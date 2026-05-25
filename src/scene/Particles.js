import * as THREE from "three";

const COUNT = 200;
const BOUNDS = { x: 14, y: 7, z: 10 }; // half-extents for spawn volume centered on origin

export class Particles {
  constructor() {
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(COUNT * 3);
    this.velocities = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      this.positions[i * 3 + 0] = (Math.random() * 2 - 1) * BOUNDS.x;
      this.positions[i * 3 + 1] = Math.random() * BOUNDS.y * 2; // 0..2y
      this.positions[i * 3 + 2] = (Math.random() * 2 - 1) * BOUNDS.z;
      this.velocities[i * 3 + 0] = (Math.random() - 0.5) * 0.002;
      this.velocities[i * 3 + 1] = 0.005 + Math.random() * 0.005;
      this.velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
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

    // Cursor world-space target (raycast plane). Updated externally.
    this.cursorWorld = new THREE.Vector3(0, 3, 0);
    this.cursorActive = false;

    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  setCursor(worldPos, active) {
    this.cursorWorld.copy(worldPos);
    this.cursorActive = active;
  }

  update(dt) {
    if (this.reducedMotion) return;

    const positions = this.positions;
    const cx = this.cursorWorld.x, cy = this.cursorWorld.y, cz = this.cursorWorld.z;
    const radius = 1.5;
    const radiusSq = radius * radius;

    for (let i = 0; i < COUNT; i++) {
      const ix = i * 3, iy = i * 3 + 1, iz = i * 3 + 2;
      positions[ix] += this.velocities[ix] * dt;
      positions[iy] += this.velocities[iy] * dt;
      positions[iz] += this.velocities[iz] * dt;

      if (this.cursorActive) {
        const dx = positions[ix] - cx;
        const dy = positions[iy] - cy;
        const dz = positions[iz] - cz;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq < radiusSq && distSq > 0.0001) {
          const inv = 1 / Math.sqrt(distSq);
          const push = (1 - Math.sqrt(distSq) / radius) * 0.02 * dt;
          positions[ix] += dx * inv * push;
          positions[iy] += dy * inv * push;
          positions[iz] += dz * inv * push;
        }
      }

      // wrap upward
      if (positions[iy] > BOUNDS.y * 2) {
        positions[iy] = 0;
        positions[ix] = (Math.random() * 2 - 1) * BOUNDS.x;
        positions[iz] = (Math.random() * 2 - 1) * BOUNDS.z;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }
}
