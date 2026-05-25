import * as THREE from "three";
import { buildRoom } from "./Room.js";
import { buildCharacter } from "./Character.js";
import { Lights } from "./Lights.js";
import { Camera } from "./Camera.js";
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
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.loop);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.cam.dispose();
    this.unsubStore?.();
    this.renderer.dispose();
  }
}
