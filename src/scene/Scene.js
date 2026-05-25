import * as THREE from "three";
import { buildRoom } from "./Room.js";
import { buildCharacter } from "./Character.js";
import { Lights } from "./Lights.js";
import { Camera } from "./Camera.js";
import { Particles } from "./Particles.js";
import { store } from "../state/store.js";

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

    this.cam = new Camera();
    this.camera = this.cam.camera; // keep .camera ref for renderer

    const viewToFocus = {
      main: "main",
      bio: "desk",
      projects: "shelf",
      credits: "creditsWall",
      settings: "main",
    };

    this.unsubStore = store.subscribe((s, p) => {
      if (s.view !== p.view) {
        const focus = viewToFocus[s.view] || "main";
        this.cam.focusOn(focus);
      }
    });

    this.scene.add(buildRoom());

    this.lights = new Lights(this.scene);
    this.lights.addTorch([7.5, 5.9, -5.8]); // matches room-config torch head position

    this.scene.add(buildCharacter());

    this.particles = new Particles();
    this.scene.add(this.particles.points);

    this.raycaster = new THREE.Raycaster();
    this.cursorPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // plane z=0 facing camera (rough)
    this.mouseNDC = new THREE.Vector2(0, 0);
    this.cursorWorld = new THREE.Vector3();
    this.cursorActive = false;

    const onMouse = (e) => {
      this.mouseNDC.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouseNDC.y = -((e.clientY / window.innerHeight) * 2 - 1);
      this.cursorActive = true;
    };
    const onLeave = () => { this.cursorActive = false; };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("mouseout", onLeave);
    this._mouseHandlers = { onMouse, onLeave };

    this.paused = false;
    this.onResize = this.onResize.bind(this);
    this.loop = this.loop.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);

    window.addEventListener("resize", this.onResize);
    document.addEventListener("visibilitychange", this.onVisibilityChange);

    this.fpsSamples = [];
    this.degraded = false;

    requestAnimationFrame(this.loop);
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cam.onResize();
  }

  onVisibilityChange() {
    this.paused = document.hidden;
    if (!this.paused) requestAnimationFrame(this.loop);
  }

  loop(t) {
    if (this.paused) return;
    this.cam.update(t);
    this.lights.update(t);

    this.raycaster.setFromCamera(this.mouseNDC, this.camera);
    this.raycaster.ray.intersectPlane(this.cursorPlane, this.cursorWorld);
    this.particles.setCursor(this.cursorWorld, this.cursorActive);

    const dt = this.lastT ? (t - this.lastT) : 16;
    this.lastT = t;

    // FPS sampling for auto-degrade
    if (dt > 0) {
      const fps = 1000 / dt;
      this.fpsSamples.push(fps);
      if (this.fpsSamples.length > 120) this.fpsSamples.shift();
    }
    if (!this.degraded && this.fpsSamples.length >= 120) {
      const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
      if (avg < 30) {
        this.degraded = true;
        this.scene.remove(this.particles.points);
        this.renderer.shadowMap.enabled = false;
        console.warn("FPS below 30 average, particles + shadows disabled");
      }
    }

    this.particles.update(dt);

    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    window.removeEventListener("mousemove", this._mouseHandlers.onMouse);
    window.removeEventListener("mouseout", this._mouseHandlers.onLeave);
    this.cam.dispose();
    this.unsubStore?.();
    this.renderer.dispose();
  }
}
