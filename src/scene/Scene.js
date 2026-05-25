import * as THREE from "three";

export class Scene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1410);

    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(8, 6, 8);
    this.camera.lookAt(0, 2, 0);

    // Temporary cube so we can see something rendering
    const placeholder = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0xc4985a })
    );
    this.scene.add(placeholder);

    // Temporary lights so the placeholder is visible
    const sun = new THREE.DirectionalLight(0xffd8a0, 1.2);
    sun.position.set(5, 10, 5);
    this.scene.add(sun);
    this.scene.add(new THREE.AmbientLight(0x4a3520, 0.6));

    this.paused = false;
    this.onResize = this.onResize.bind(this);
    this.loop = this.loop.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    requestAnimationFrame(this.loop);
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  onVisibilityChange() {
    this.paused = document.hidden;
    if (!this.paused) requestAnimationFrame(this.loop);
  }

  loop(t) {
    if (this.paused) return;
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.renderer.dispose();
  }
}
