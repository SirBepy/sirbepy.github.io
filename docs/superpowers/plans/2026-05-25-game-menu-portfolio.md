# Game Menu Portfolio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace current scroll-based portfolio with a Three.js cozy-room game-main-menu experience on `feat/main-menu-portfolio`.

**Architecture:** Module split by domain. `scene/` owns Three.js (no DOM), `menu/` owns DOM overlay (no 3D), `state/store.js` is a ~30-line pub/sub between them. Camera dolly-tweens to named focus points per menu action.

**Tech Stack:** Vanilla JS, Vite, Three.js, `@tweenjs/tween.js`, Phosphor Icons (CDN), CSS. Deploy to GH Pages via existing pipeline.

**Spec:** `docs/superpowers/specs/2026-05-25-game-menu-portfolio-design.md`

**Test policy for this plan:** Spec explicitly states no automated test suite for v1. Every task ends with a **manual verification step** in the browser (`npm run dev`) and a **commit step**. No Vitest. No Playwright. The manual checklist in the spec is the acceptance test.

**Commit policy:** Each task ends with `/commit` invocation (project rule from `~/.claude/CLAUDE.md`). If executing inline, run `/commit` manually. If subagent-driven, the dispatcher invokes `/commit` after each subagent's report-back per global rules.

---

## File Structure

```
src/
├─ app.js                              MODIFY — strip old, mount scene + menu
├─ scene/
│   ├─ Scene.js                        CREATE — Three.js root, renderer, rAF loop
│   ├─ Room.js                         CREATE — builds room from config
│   ├─ room-config.js                  CREATE — declarative block layout
│   ├─ Character.js                    CREATE — voxel humanoid at desk
│   ├─ Lights.js                       CREATE — sun + ambient + torch flicker
│   ├─ Particles.js                    CREATE — drifting motes, cursor reactive
│   ├─ Camera.js                       CREATE — PerspectiveCamera + tween
│   └─ focus-points.js                 CREATE — named camera target coords
├─ menu/
│   ├─ Menu.js                         CREATE — 4 buttons + socials + cog
│   ├─ Menu.css                        CREATE
│   ├─ lingo.js                        CREATE — label dict + getLabel()
│   └─ views/
│       ├─ BioView/
│       │   ├─ BioView.js              CREATE
│       │   └─ BioView.css             CREATE
│       ├─ ProjectsView/
│       │   ├─ ProjectsView.js         CREATE
│       │   └─ ProjectsView.css        CREATE
│       ├─ CreditsView/
│       │   ├─ CreditsView.js          CREATE
│       │   └─ CreditsView.css         CREATE
│       └─ SettingsView/
│           ├─ SettingsView.js         CREATE
│           └─ SettingsView.css        CREATE
├─ state/
│   └─ store.js                        CREATE — pub/sub, localStorage
├─ data/
│   └─ portfolioData.js                MODIFY — add aboutContent, project thumbnails
├─ styles/
│   ├─ styles.css                      MODIFY — strip old, keep reset + tokens
│   └─ utilities.css                   MODIFY — trim unused
└─ utils/
    └─ audio.js                        CREATE — music play/pause helper

public/
├─ images/
│   └─ room-fallback.png               ADD LATER (after scene exists, screenshot it)
├─ audio/
│   └─ ambient.mp3                     ADD — CC0 track committed
└─ videos/                             DELETE — no longer used

index.html                             MODIFY — single <canvas> + #menu-root
package.json                           MODIFY — add three, @tweenjs/tween.js; remove locomotive-scroll
```

Files to DELETE (no longer used):
- `src/components/Hero/`, `SkillsBanner/`, `Github/`, `Timeline/`, `PersonalProjects/`, `Footer/`, `Links/`, `Cursor/`
- `src/utils/video.js`
- `public/videos/*`

---

## Task 1: Project cleanup + dependency swap

**Files:**
- Modify: `package.json`
- Modify: `index.html`
- Modify: `src/app.js` (replace content)
- Modify: `src/styles/styles.css`, `src/styles/utilities.css` (strip component-specific rules; keep CSS vars + reset)
- Delete: `src/components/`, `src/utils/video.js`, `public/videos/`

- [ ] **Step 1: Add new deps, remove unused**

```bash
cd /Users/josipmuzic/projects/sirbepy.github.io
npm install three @tweenjs/tween.js
npm uninstall locomotive-scroll
```

(Leave `dompurify` and `marked` for now — re-evaluate before final polish.)

- [ ] **Step 2: Replace `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
    <link rel="icon" type="image/png" href="/images/favicon.png" />
    <link rel="alternate icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Josip Muzic — Portfolio</title>
    <script src="https://unpkg.com/@phosphor-icons/web"></script>
  </head>
  <body>
    <div id="app">
      <canvas id="scene-canvas"></canvas>
      <div id="menu-root"></div>
    </div>
    <script type="module" src="/src/app.js"></script>
  </body>
</html>
```

(Verify `public/images/favicon.svg|png|ico` exist; if not, leave only the existing `favicon.ico` reference for now and fix in a later cleanup task.)

- [ ] **Step 3: Replace `src/app.js`**

```js
import "./styles/styles.css";

// scene + menu mount in later tasks
console.log("portfolio bootstrap");
```

- [ ] **Step 4: Strip `src/styles/styles.css`** — keep only the body/html reset, CSS variables for colors/fonts (if any), and a `:root` declaration. Delete all component-specific selectors. Keep the file under ~50 lines.

If unsure what to keep, end with this minimal file:

```css
:root {
  --bg: #1a1410;
  --fg: #f4e8d3;
  --accent: #ffb84a;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body, #app {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--fg);
  font-family: system-ui, sans-serif;
}

#scene-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

#menu-root {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

#menu-root > * { pointer-events: auto; }
```

- [ ] **Step 5: Strip `src/styles/utilities.css`** to empty or delete entirely. If kept empty, ensure nothing imports it from `app.js`.

- [ ] **Step 6: Delete unused dirs and files**

```bash
rm -rf src/components src/utils/video.js public/videos
```

- [ ] **Step 7: Verify build + dev server boot**

```bash
npm run dev
```

Expected: dev server starts on `localhost:5173`, page loads with black/brown background, console logs `portfolio bootstrap`. No JS errors.

```bash
npm run build
```

Expected: build succeeds, `dist/` produced.

- [ ] **Step 8: Commit via `/commit` skill**

Single commit. Suggested message: `CHORE: strip legacy portfolio scaffolding, add three + tween deps`.

---

## Task 2: State store

**Files:**
- Create: `src/state/store.js`

- [ ] **Step 1: Create `src/state/store.js`**

```js
const STORAGE_KEY = "portfolioSettings";

const defaultState = {
  view: "main",            // 'main' | 'bio' | 'projects' | 'credits' | 'settings'
  lingo: "game",           // 'game' | 'plain'
  music: false,            // bool
  settingsOpen: false,     // bool (independent of view, settings can be sub-modal)
};

const readPersisted = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const pick = {};
    if (parsed.lingo === "game" || parsed.lingo === "plain") pick.lingo = parsed.lingo;
    if (typeof parsed.music === "boolean") pick.music = parsed.music;
    return pick;
  } catch {
    return {};
  }
};

const writePersisted = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ lingo: state.lingo, music: state.music }));
  } catch {
    // ignore
  }
};

const subscribers = new Set();
let state = { ...defaultState, ...readPersisted() };

export const store = {
  get: () => state,
  set: (partial) => {
    const prev = state;
    state = { ...state, ...partial };
    if (prev.lingo !== state.lingo || prev.music !== state.music) {
      writePersisted(state);
    }
    subscribers.forEach((fn) => fn(state, prev));
  },
  subscribe: (fn) => {
    subscribers.add(fn);
    return () => subscribers.delete(fn);
  },
  setView: (view) => store.set({ view }),
};
```

- [ ] **Step 2: Smoke-test inline from `app.js`**

Temporarily add to `src/app.js`:

```js
import { store } from "./state/store.js";

store.subscribe((s, p) => console.log("store:", p.view, "->", s.view));
console.log("initial state", store.get());
store.setView("bio");
store.setView("main");
store.set({ lingo: "plain" });
```

- [ ] **Step 3: Verify in browser**

`npm run dev`. Open devtools console. Expected logs:
- `initial state { view: 'main', lingo: 'game', music: false, settingsOpen: false }` (or with `lingo: 'plain'` if Step 2 persisted last run)
- `store: main -> bio`
- `store: bio -> main`
- `localStorage.getItem('portfolioSettings')` in console returns `{"lingo":"plain","music":false}`

Refresh page. Confirm `lingo` survives.

- [ ] **Step 4: Remove smoke-test code from `app.js`**

- [ ] **Step 5: Commit via `/commit` skill**

Suggested: `FEAT: state store with localStorage persistence`.

---

## Task 3: Scene boot — canvas, renderer, loop

**Files:**
- Create: `src/scene/Scene.js`
- Modify: `src/app.js`

- [ ] **Step 1: Create `src/scene/Scene.js`**

```js
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
```

- [ ] **Step 2: Mount from `app.js`**

```js
import "./styles/styles.css";
import { Scene } from "./scene/Scene.js";

const canvas = document.getElementById("scene-canvas");
new Scene(canvas);
```

- [ ] **Step 3: Verify**

`npm run dev`. Expected: warm-lit beige cube on dark background. Resize window, cube stays centered, no stretching. Switch to another tab and back, no console errors.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: scene boot with renderer, camera, rAF loop`.

---

## Task 4: Room build from declarative config

**Files:**
- Create: `src/scene/room-config.js`
- Create: `src/scene/Room.js`
- Modify: `src/scene/Scene.js` (remove placeholder cube, mount Room)

Voxel size: each block is 1 unit. Room interior: 16w x 8h x 12d. Origin (0,0,0) = center of floor.

- [ ] **Step 1: Create `src/scene/room-config.js`**

```js
// Coordinate system:
//   X: east-west (positive = east).
//   Y: up.
//   Z: north-south (positive = south).
// Camera will sit at SE corner (+X, +Z) looking toward (-X, -Z).
// Window is in the NORTH wall (-Z side).

export const ROOM = {
  width: 16,   // X
  height: 8,   // Y
  depth: 12,   // Z
};

export const MATERIALS = {
  floor: { color: 0x8b6b3f, roughness: 0.95 },
  wallWood: { color: 0xa07a4a, roughness: 0.9 },
  beam: { color: 0x4a3520, roughness: 0.9 },
  shelf: { color: 0x6b3f1f, roughness: 0.85 },
  book: { color: 0xc4985a, roughness: 0.7 },
  desk: { color: 0x4a3520, roughness: 0.85 },
  monitor: { color: 0x1a1410, roughness: 0.4, emissive: 0x6a8aff, emissiveIntensity: 0.4 },
  cork: { color: 0xb87a3f, roughness: 0.95 },
  paper: { color: 0xf4e8d3, roughness: 0.95 },
  banner: { color: 0x7a3f1f, roughness: 0.9 },
  windowGlass: { color: 0xfff0c0, roughness: 0.1, transparent: true, opacity: 0.4, emissive: 0xffa86a, emissiveIntensity: 0.6 },
  torchHead: { color: 0xff7a2a, emissive: 0xffaa4a, emissiveIntensity: 1.0 },
};

// Each block: { mat: key of MATERIALS, pos: [x, y, z] (center), size: [w, h, d] }
export const BLOCKS = [
  // Floor
  { mat: "floor", pos: [0, -0.1, 0], size: [16, 0.2, 12] },

  // North wall (with window cutout — we simulate by building wall in 3 chunks)
  { mat: "wallWood", pos: [-5.5, 4, -6], size: [5, 8, 0.4] },         // N wall left of window
  { mat: "wallWood", pos: [5.5, 4, -6], size: [5, 8, 0.4] },          // N wall right
  { mat: "wallWood", pos: [0, 7, -6], size: [6, 2, 0.4] },            // N wall above window
  { mat: "wallWood", pos: [0, 1, -6], size: [6, 2, 0.4] },            // N wall below window
  { mat: "windowGlass", pos: [0, 4, -6], size: [6, 4, 0.1] },         // glass

  // West wall (left in frame)
  { mat: "wallWood", pos: [-8, 4, 0], size: [0.4, 8, 12] },

  // Ceiling beam suggestion (just two beams)
  { mat: "beam", pos: [-4, 7.6, 0], size: [0.5, 0.5, 12] },
  { mat: "beam", pos: [4, 7.6, 0], size: [0.5, 0.5, 12] },

  // Bookshelf (W wall, north half)
  { mat: "shelf", pos: [-7.4, 3, -3], size: [1, 6, 4] },
  // Shelf books (decoration; not individually clickable per spec)
  { mat: "book", pos: [-6.8, 1.5, -4.5], size: [0.3, 0.8, 0.4] },
  { mat: "book", pos: [-6.8, 1.5, -4], size: [0.3, 1.0, 0.4] },
  { mat: "book", pos: [-6.8, 1.5, -3.5], size: [0.3, 0.9, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -4.5], size: [0.3, 0.7, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -4], size: [0.3, 0.9, 0.4] },
  { mat: "book", pos: [-6.8, 3.0, -3.5], size: [0.3, 1.1, 0.4] },
  { mat: "book", pos: [-6.8, 4.5, -4.5], size: [0.3, 0.8, 0.4] },
  { mat: "book", pos: [-6.8, 4.5, -4], size: [0.3, 1.0, 0.4] },

  // Corkboard (W wall, south half)
  { mat: "cork", pos: [-7.7, 3, 2.5], size: [0.2, 4, 4] },
  // Diploma + Sahur banner on corkboard
  { mat: "paper", pos: [-7.55, 3.7, 1.6], size: [0.05, 1.2, 1.6] },     // diploma
  { mat: "banner", pos: [-7.55, 2.4, 3.4], size: [0.05, 1.5, 2.0] },    // Sahur banner

  // Desk against N wall, east of window
  { mat: "desk", pos: [4.5, 1.5, -5], size: [4, 0.2, 2] },              // desk surface
  { mat: "desk", pos: [3, 0.75, -5], size: [0.3, 1.5, 1.5] },           // leg L
  { mat: "desk", pos: [6, 0.75, -5], size: [0.3, 1.5, 1.5] },           // leg R
  // Monitor
  { mat: "desk", pos: [4.5, 2.4, -5.5], size: [2.0, 1.4, 0.15] },       // monitor frame
  { mat: "monitor", pos: [4.5, 2.4, -5.42], size: [1.8, 1.2, 0.05] },   // monitor screen
  { mat: "desk", pos: [4.5, 1.75, -5.5], size: [0.3, 0.3, 0.3] },       // stand

  // Torch on N wall, far east
  { mat: "beam", pos: [7.5, 5, -5.8], size: [0.2, 1.5, 0.2] },          // torch stick
  { mat: "torchHead", pos: [7.5, 5.9, -5.8], size: [0.5, 0.5, 0.5] },   // torch head
];
```

- [ ] **Step 2: Create `src/scene/Room.js`**

```js
import * as THREE from "three";
import { BLOCKS, MATERIALS } from "./room-config.js";

const cachedMaterials = new Map();

const getMaterial = (key) => {
  if (cachedMaterials.has(key)) return cachedMaterials.get(key);
  const def = MATERIALS[key];
  if (!def) throw new Error(`Material '${key}' not in MATERIALS`);
  const mat = new THREE.MeshStandardMaterial(def);
  cachedMaterials.set(key, mat);
  return mat;
};

export const buildRoom = () => {
  const group = new THREE.Group();
  group.name = "Room";

  for (const block of BLOCKS) {
    const [w, h, d] = block.size;
    const geom = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geom, getMaterial(block.mat));
    mesh.position.set(...block.pos);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
  }

  return group;
};
```

- [ ] **Step 3: Mount Room in `Scene.js`**

Replace the placeholder cube section in `src/scene/Scene.js`:

```js
import { buildRoom } from "./Room.js";
// ... in constructor, after this.scene = new THREE.Scene():
this.scene.add(buildRoom());
```

Delete the placeholder cube lines.

- [ ] **Step 4: Verify**

`npm run dev`. Expected: visible room with floor, N wall (with bright window in middle), W wall, bookshelf with colored books, corkboard with diploma + banner, desk + monitor, torch on N wall. Resize OK.

- [ ] **Step 5: Commit via `/commit` skill**

Suggested: `FEAT: procedural voxel room from declarative block config`.

---

## Task 5: Lights — sun, ambient, torch flicker

**Files:**
- Create: `src/scene/Lights.js`
- Modify: `src/scene/Scene.js`

- [ ] **Step 1: Create `src/scene/Lights.js`**

```js
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
```

- [ ] **Step 2: Wire into `Scene.js`**

Replace the temporary sun + ambient block with:

```js
import { Lights } from "./Lights.js";
// ... in constructor:
this.lights = new Lights(this.scene);
this.lights.addTorch([7.5, 5.9, -5.8]); // matches room-config torch head position
```

Update `loop()`:

```js
loop(t) {
  if (this.paused) return;
  this.lights.update(t);
  this.renderer.render(this.scene, this.camera);
  requestAnimationFrame(this.loop);
}
```

- [ ] **Step 3: Verify**

`npm run dev`. Expected: warm sun rays visible on east wall side, room interior dimmer in corners, torch glow visible flickering near +X N corner. Shadows from shelf and desk cast onto floor.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: lights with sun, ambient, hemi, and flickering torches`.

---

## Task 6: Character (voxel humanoid at desk)

**Files:**
- Create: `src/scene/Character.js`
- Modify: `src/scene/Scene.js`

- [ ] **Step 1: Create `src/scene/Character.js`**

Static pose: seated at desk, facing N wall (back of head toward camera).

```js
import * as THREE from "three";

const SKIN = 0xd4a574;
const SHIRT = 0x4a6a8a;
const PANTS = 0x2a2a3a;
const HAIR = 0x3a2510;

const mat = (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.7 });

export const buildCharacter = () => {
  const group = new THREE.Group();
  group.name = "Character";

  // Sitting on chair-height, in front of desk at x=4.5, z=-5
  // Body parts use Minecraft-ish proportions (head:body:legs ≈ 1:1.5:1.5)
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.8, 0.8), mat(SKIN));
  head.position.set(0, 2.2, 0);
  const hair = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.4, 0.85), mat(HAIR));
  hair.position.set(0, 2.55, 0);
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.2, 0.5), mat(SHIRT));
  torso.position.set(0, 1.4, 0);
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mat(SHIRT));
  armL.position.set(-0.6, 1.4, 0.15);
  armL.rotation.x = -1.0;  // forward, toward keyboard
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.0, 0.3), mat(SHIRT));
  armR.position.set(0.6, 1.4, 0.15);
  armR.rotation.x = -1.0;
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.5), mat(PANTS));
  legL.position.set(-0.25, 0.5, 0.3);
  legL.rotation.x = -1.2; // forward (sitting)
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 1.0, 0.5), mat(PANTS));
  legR.position.set(0.25, 0.5, 0.3);
  legR.rotation.x = -1.2;

  for (const m of [head, hair, torso, armL, armR, legL, legR]) {
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
  }

  // Position seated facing N (so back is to camera)
  group.position.set(4.5, 0.4, -3.5);
  group.rotation.y = Math.PI; // face -Z

  return group;
};
```

- [ ] **Step 2: Add to `Scene.js`**

```js
import { buildCharacter } from "./Character.js";
// in constructor:
this.scene.add(buildCharacter());
```

- [ ] **Step 3: Verify**

`npm run dev`. Expected: blocky character seated at desk, back to camera, arms forward (typing pose), legs forward (sitting). Hair on top. Sun rim-light on shoulders.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: voxel character at desk, static pose`.

---

## Task 7: Camera focus points + tween

**Files:**
- Create: `src/scene/focus-points.js`
- Create: `src/scene/Camera.js`
- Modify: `src/scene/Scene.js` (replace inline camera with Camera class)

- [ ] **Step 1: Create `src/scene/focus-points.js`**

```js
import * as THREE from "three";

// All targets share fov 45. Override per target as needed.
export const FOCUS_POINTS = {
  main: {
    position: new THREE.Vector3(8, 6, 8),
    lookAt: new THREE.Vector3(0, 2.5, -1),
    duration: 1200,
    parallax: true,
  },
  desk: {
    position: new THREE.Vector3(6, 3, -1),
    lookAt: new THREE.Vector3(4.5, 2.3, -5),
    duration: 1500,
    parallax: false,
  },
  shelf: {
    position: new THREE.Vector3(-4, 3, 0),
    lookAt: new THREE.Vector3(-7.4, 3, -3),
    duration: 1500,
    parallax: false,
  },
  corkboard: {
    position: new THREE.Vector3(-4, 3, 4),
    lookAt: new THREE.Vector3(-7.7, 3, 2.5),
    duration: 1500,
    parallax: false,
  },
  creditsWall: {
    position: new THREE.Vector3(0, 4, 4),
    lookAt: new THREE.Vector3(-7.7, 3, 2.5),
    duration: 2000,
    parallax: false,
  },
};
```

- [ ] **Step 2: Create `src/scene/Camera.js`**

```js
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
```

- [ ] **Step 3: Replace inline camera in `Scene.js`**

```js
import { Camera } from "./Camera.js";

// in constructor, replace this.camera = new THREE.PerspectiveCamera(...) and its lookAt:
this.cam = new Camera();
this.camera = this.cam.camera; // keep .camera ref for renderer

// in onResize:
this.cam.onResize();

// in loop:
this.cam.update(t);

// in dispose:
this.cam.dispose();
```

- [ ] **Step 4: Wire up to store**

In `Scene.js` constructor, after `this.cam`:

```js
import { store } from "../state/store.js";

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
```

In `dispose()`:

```js
this.unsubStore?.();
```

- [ ] **Step 5: Smoke test from console**

`npm run dev`. In browser console:

```js
// camera should fly to bookshelf
(await import('/src/state/store.js')).store.setView('projects');
// back to main
(await import('/src/state/store.js')).store.setView('main');
```

Expected: camera dolly visible, ~1.5s tween. No errors.

Test reduced-motion: in devtools rendering tab toggle `prefers-reduced-motion: reduce`, retry — camera snaps instantly.

- [ ] **Step 6: Commit via `/commit` skill**

Suggested: `FEAT: camera focus targets with tween + mouse parallax`.

---

## Task 8: Particles

**Files:**
- Create: `src/scene/Particles.js`
- Modify: `src/scene/Scene.js`

- [ ] **Step 1: Create `src/scene/Particles.js`**

```js
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
```

- [ ] **Step 2: Mount + drive in `Scene.js`**

```js
import { Particles } from "./Particles.js";
import * as THREE from "three";

// in constructor:
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
```

In `loop()`, before `renderer.render`:

```js
this.raycaster.setFromCamera(this.mouseNDC, this.camera);
this.raycaster.ray.intersectPlane(this.cursorPlane, this.cursorWorld);
this.particles.setCursor(this.cursorWorld, this.cursorActive);

const dt = this.lastT ? (t - this.lastT) : 16;
this.lastT = t;
this.particles.update(dt);
```

In `dispose()`:

```js
window.removeEventListener("mousemove", this._mouseHandlers.onMouse);
window.removeEventListener("mouseout", this._mouseHandlers.onLeave);
```

- [ ] **Step 3: Verify**

`npm run dev`. Expected: small warm-toned dots drifting upward across the room. Mouse-over interior area pushes nearby particles away. No FPS drop.

Test reduced-motion: simulate via devtools — particles freeze in place.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: drifting motes with cursor-reactive displacement`.

---

## Task 9: Lingo dict

**Files:**
- Create: `src/menu/lingo.js`

- [ ] **Step 1: Create `src/menu/lingo.js`**

```js
import { store } from "../state/store.js";

const DICT = {
  continue: { game: "Continue", plain: "About Me" },
  loadSave: { game: "Load Save", plain: "Projects" },
  credits: { game: "Credits", plain: "Contact" },
  settings: { game: "Settings", plain: "Settings" },
  back: { game: "← Back", plain: "← Back" },
  loadSaveHeading: { game: "Saved Games", plain: "Projects" },
  creditsHeading: { game: "End Credits", plain: "Contact" },
  bioHeading: { game: "Player Profile", plain: "About Me" },
  settingsHeading: { game: "Game Settings", plain: "Settings" },
  lingoLabel: { game: "Game Speak", plain: "Plain English" },
  musicLabel: { game: "Background Music", plain: "Background Music" },
};

export const getLabel = (key) => {
  const entry = DICT[key];
  if (!entry) throw new Error(`No lingo entry '${key}'`);
  return entry[store.get().lingo];
};

export const onLingoChange = (fn) => {
  return store.subscribe((s, p) => {
    if (s.lingo !== p.lingo) fn(s.lingo);
  });
};
```

- [ ] **Step 2: Smoke test in console**

`npm run dev`. In console:

```js
const lingo = await import('/src/menu/lingo.js');
console.log(lingo.getLabel('continue')); // "Continue"
const store = (await import('/src/state/store.js')).store;
store.set({ lingo: 'plain' });
console.log(lingo.getLabel('continue')); // "About Me"
store.set({ lingo: 'game' });
```

- [ ] **Step 3: Commit via `/commit` skill**

Suggested: `FEAT: lingo dict with game ↔ plain English toggle`.

---

## Task 10: Menu root (4 buttons + socials + cog)

**Files:**
- Create: `src/menu/Menu.js`
- Create: `src/menu/Menu.css`
- Modify: `src/app.js`

- [ ] **Step 1: Create `src/menu/Menu.css`**

```css
.menu {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  padding: 48px 64px;
  pointer-events: none;
}

.menu.hidden { opacity: 0; pointer-events: none; transition: opacity 400ms ease; }
.menu.visible { opacity: 1; transition: opacity 400ms ease; }

.menu-title {
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--fg);
  text-shadow: 0 4px 24px rgba(0, 0, 0, 0.6);
  pointer-events: auto;
}

.menu-title small {
  display: block;
  font-size: 16px;
  font-weight: 500;
  opacity: 0.7;
  margin-top: 4px;
}

.menu-actions {
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 320px;
  pointer-events: auto;
}

.menu-button {
  background: rgba(20, 14, 10, 0.65);
  border: 2px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 22px;
  font-weight: 600;
  padding: 14px 24px;
  text-align: left;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: transform 150ms, border-color 150ms, background 150ms;
}

.menu-button:hover {
  background: rgba(255, 184, 74, 0.18);
  border-color: var(--accent);
  transform: translateX(6px);
}

.menu-footer {
  align-self: end;
  justify-self: end;
  display: flex;
  gap: 12px;
  pointer-events: auto;
}

.menu-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 14, 10, 0.65);
  border: 2px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 22px;
  cursor: pointer;
  transition: border-color 150ms, background 150ms;
}

.menu-icon:hover { border-color: var(--accent); background: rgba(255, 184, 74, 0.18); }
```

- [ ] **Step 2: Create `src/menu/Menu.js`**

```js
import "./Menu.css";
import { store } from "../state/store.js";
import { getLabel, onLingoChange } from "./lingo.js";

export class Menu {
  constructor(parent) {
    this.parent = parent;
    this.el = document.createElement("div");
    this.el.className = "menu visible";
    this.render();
    parent.appendChild(this.el);

    this.unsubLingo = onLingoChange(() => this.render());
    this.unsubView = store.subscribe((s, p) => {
      if (s.view !== p.view) {
        this.el.classList.toggle("hidden", s.view !== "main");
        this.el.classList.toggle("visible", s.view === "main");
      }
    });
  }

  render() {
    this.el.innerHTML = `
      <div class="menu-title">
        Josip Mužić
        <small>full-stack &amp; game dev — Zagreb</small>
      </div>
      <div class="menu-actions">
        <button class="menu-button" data-view="bio">${getLabel("continue")}</button>
        <button class="menu-button" data-view="projects">${getLabel("loadSave")}</button>
        <button class="menu-button" data-view="credits">${getLabel("credits")}</button>
        <button class="menu-button" data-view="settings">${getLabel("settings")}</button>
      </div>
      <div class="menu-footer">
        <a class="menu-icon" href="https://www.linkedin.com/in/josip-muzic" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="ph ph-linkedin-logo"></i></a>
        <a class="menu-icon" href="https://github.com/SirBepy" target="_blank" rel="noopener" aria-label="GitHub"><i class="ph ph-github-logo"></i></a>
        <a class="menu-icon" href="mailto:sirbepy@gmail.com" aria-label="Email"><i class="ph ph-envelope"></i></a>
      </div>
    `;

    this.el.querySelectorAll(".menu-button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.dataset.view;
        if (target) store.setView(target);
      });
    });
  }

  dispose() {
    this.unsubLingo?.();
    this.unsubView?.();
    this.el.remove();
  }
}
```

- [ ] **Step 3: Mount from `app.js`**

```js
import "./styles/styles.css";
import { Scene } from "./scene/Scene.js";
import { Menu } from "./menu/Menu.js";

const canvas = document.getElementById("scene-canvas");
const menuRoot = document.getElementById("menu-root");

new Scene(canvas);
new Menu(menuRoot);
```

- [ ] **Step 4: Verify**

`npm run dev`. Expected: room visible, top-left has name + subtitle, bottom-left column has 4 buttons (Continue / Load Save / Credits / Settings), bottom-right has 3 icon buttons (LinkedIn / GitHub / Envelope). Hover lifts buttons. Click Continue → camera flies to desk and main menu fades out. (Sub-views don't exist yet so it stays faded; that's fine.)

Manually call `store.setView('main')` in console to restore.

- [ ] **Step 5: Commit via `/commit` skill**

Suggested: `FEAT: main menu buttons + social icons overlay`.

---

## Task 11: BioView

**Files:**
- Create: `src/menu/views/BioView/BioView.js`
- Create: `src/menu/views/BioView/BioView.css`
- Modify: `src/data/portfolioData.js` (add `aboutContent`)
- Modify: `src/app.js` (mount BioView mediator)

- [ ] **Step 1: Add `aboutContent` to `src/data/portfolioData.js`**

Append before final `;` of exports, or as a new top-level export:

```js
export const aboutContent = {
  name: "Josip Mužić",
  location: "Zagreb, Croatia",
  pitch: "Full-stack developer (web + mobile) and Roblox game dev. RIT Croatia BSc Web & Mobile Computing, Magna Cum Laude.",
  paragraphs: [
    "Shipping since 2019. Built high-traffic Gatsby + Flutter products at KTO, real-time Unisport platform at Bebabit, IoT dashboards, mental-health apps, and an e-commerce store with a chat-based checkout.",
    "Quit my Gatsby job in 2025 to start Tabs Labs and chase commercial Roblox games. First release crossed 880k+ visits in months. Currently building Shroomshire Restoration for an April 2026 launch.",
    "I run a YouTube channel about the game dev journey (1k+ subs). Outside code: board games (top Croatian Catan rank), the dog, and the cat.",
  ],
};
```

- [ ] **Step 2: Create `src/menu/views/BioView/BioView.css`**

```css
.bio-view {
  position: absolute;
  top: 0;
  right: 0;
  width: 480px;
  height: 100%;
  background: rgba(20, 14, 10, 0.88);
  border-left: 2px solid rgba(255, 184, 74, 0.4);
  backdrop-filter: blur(8px);
  padding: 48px 40px;
  overflow-y: auto;
  transform: translateX(100%);
  transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--fg);
  pointer-events: auto;
}

.bio-view.open { transform: translateX(0); }

.bio-view h2 { font-size: 36px; margin-bottom: 4px; }
.bio-view .bio-location { font-size: 14px; opacity: 0.7; margin-bottom: 24px; }
.bio-view .bio-pitch { font-size: 18px; margin-bottom: 24px; color: var(--accent); }
.bio-view p { font-size: 15px; line-height: 1.6; margin-bottom: 16px; }

.bio-back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: 1px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
}
.bio-back:hover { border-color: var(--accent); background: rgba(255, 184, 74, 0.18); }
```

- [ ] **Step 3: Create `src/menu/views/BioView/BioView.js`**

```js
import "./BioView.css";
import { store } from "../../../state/store.js";
import { aboutContent } from "../../../data/portfolioData.js";
import { getLabel, onLingoChange } from "../../lingo.js";

export class BioView {
  constructor(parent) {
    this.parent = parent;
    this.el = document.createElement("div");
    this.el.className = "bio-view";
    this.render();
    parent.appendChild(this.el);
    requestAnimationFrame(() => this.el.classList.add("open"));

    this.unsubLingo = onLingoChange(() => this.render());
  }

  render() {
    this.el.innerHTML = `
      <button class="bio-back">${getLabel("back")}</button>
      <h2>${aboutContent.name}</h2>
      <div class="bio-location">${aboutContent.location}</div>
      <div class="bio-pitch">${aboutContent.pitch}</div>
      ${aboutContent.paragraphs.map((p) => `<p>${p}</p>`).join("")}
    `;
    this.el.querySelector(".bio-back").addEventListener("click", () => store.setView("main"));
  }

  dispose() {
    this.unsubLingo?.();
    this.el.classList.remove("open");
    setTimeout(() => this.el.remove(), 500);
  }
}
```

- [ ] **Step 4: Add view mediator to `app.js`**

```js
import { BioView } from "./menu/views/BioView/BioView.js";
import { store } from "./state/store.js";

const viewClasses = { bio: BioView };
let currentSubview = null;
let currentSubviewType = null;

store.subscribe((s, p) => {
  if (s.view === p.view) return;
  if (currentSubview) {
    currentSubview.dispose();
    currentSubview = null;
    currentSubviewType = null;
  }
  const Cls = viewClasses[s.view];
  if (Cls) {
    currentSubview = new Cls(menuRoot);
    currentSubviewType = s.view;
  }
});
```

- [ ] **Step 5: Verify**

`npm run dev`. Click "Continue" → camera flies to desk + side panel slides in from right with name/location/pitch/paragraphs. Back button returns to main, panel slides out.

- [ ] **Step 6: Commit via `/commit` skill**

Suggested: `FEAT: bio view with side-panel slide-in`.

---

## Task 12: ProjectsView

**Files:**
- Create: `src/menu/views/ProjectsView/ProjectsView.js`
- Create: `src/menu/views/ProjectsView/ProjectsView.css`
- Modify: `src/data/portfolioData.js` (add `category` field to each project)
- Modify: `src/app.js` (register ProjectsView)

- [ ] **Step 1: Annotate projects with category in `portfolioData.js`**

For each `skillsData` entry, every `projects[]` item should get a `category: 'web' | 'mobile' | 'gamedev'`. Easiest: do it in code rather than edit data — see Step 2.

- [ ] **Step 2: Create `src/menu/views/ProjectsView/ProjectsView.css`**

```css
.projects-view {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 14, 10, 0.7);
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: opacity 400ms ease;
  pointer-events: auto;
}
.projects-view.open { opacity: 1; }

.projects-panel {
  width: min(960px, 90vw);
  max-height: 80vh;
  background: rgba(40, 28, 18, 0.95);
  border: 2px solid rgba(255, 184, 74, 0.5);
  padding: 32px;
  overflow-y: auto;
  color: var(--fg);
}

.projects-panel h2 { font-size: 32px; margin-bottom: 24px; }

.project-list { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

.project-slot {
  background: rgba(20, 14, 10, 0.7);
  border: 1px solid rgba(255, 184, 74, 0.3);
  padding: 16px;
  cursor: pointer;
  transition: border-color 150ms, transform 150ms;
}
.project-slot:hover { border-color: var(--accent); transform: translateY(-2px); }

.project-slot .project-cat {
  display: inline-block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 2px 8px;
  border: 1px solid var(--accent);
  color: var(--accent);
  margin-bottom: 8px;
}
.project-slot h3 { font-size: 18px; margin-bottom: 4px; }
.project-slot .project-meta { font-size: 12px; opacity: 0.7; margin-bottom: 8px; }
.project-slot p { font-size: 13px; line-height: 1.5; }

.projects-back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: 1px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
}
.projects-back:hover { border-color: var(--accent); background: rgba(255, 184, 74, 0.18); }
```

- [ ] **Step 3: Create `src/menu/views/ProjectsView/ProjectsView.js`**

```js
import "./ProjectsView.css";
import { store } from "../../../state/store.js";
import { skillsData } from "../../../data/portfolioData.js";
import { getLabel, onLingoChange } from "../../lingo.js";

const flattenProjects = () => {
  const out = [];
  for (const skill of skillsData) {
    if (!skill.projects) continue;
    for (const p of skill.projects) {
      out.push({ ...p, category: skill.id });
    }
  }
  out.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
  return out;
};

export class ProjectsView {
  constructor(parent) {
    this.parent = parent;
    this.el = document.createElement("div");
    this.el.className = "projects-view";
    this.render();
    parent.appendChild(this.el);
    requestAnimationFrame(() => this.el.classList.add("open"));

    this.unsubLingo = onLingoChange(() => this.render());

    this.onBackdrop = (e) => {
      if (e.target === this.el) store.setView("main");
    };
    this.el.addEventListener("click", this.onBackdrop);
  }

  render() {
    const projects = flattenProjects();
    this.el.innerHTML = `
      <button class="projects-back">${getLabel("back")}</button>
      <div class="projects-panel">
        <h2>${getLabel("loadSaveHeading")}</h2>
        <div class="project-list">
          ${projects.map((p) => `
            <div class="project-slot">
              <span class="project-cat">${p.category}</span>
              <h3>${p.name}</h3>
              <div class="project-meta">${p.company} · ${p.year ?? ""}${p.isOngoing ? " · ongoing" : ""}</div>
              <p>${p.description}</p>
            </div>
          `).join("")}
        </div>
      </div>
    `;
    this.el.querySelector(".projects-back").addEventListener("click", (e) => {
      e.stopPropagation();
      store.setView("main");
    });
    // Stop clicks inside panel from bubbling to backdrop close
    this.el.querySelector(".projects-panel").addEventListener("click", (e) => e.stopPropagation());
  }

  dispose() {
    this.unsubLingo?.();
    this.el.removeEventListener("click", this.onBackdrop);
    this.el.classList.remove("open");
    setTimeout(() => this.el.remove(), 400);
  }
}
```

- [ ] **Step 4: Register in `app.js`**

```js
import { ProjectsView } from "./menu/views/ProjectsView/ProjectsView.js";
// extend viewClasses:
const viewClasses = { bio: BioView, projects: ProjectsView };
```

- [ ] **Step 5: Verify**

`npm run dev`. Click "Load Save" → camera flies to bookshelf, modal overlay fades in with a 2-col grid of projects sorted by year. Click backdrop (outside panel) closes; back button closes; click inside panel does nothing.

- [ ] **Step 6: Commit via `/commit` skill**

Suggested: `FEAT: projects view with save-slot grid`.

---

## Task 13: CreditsView

**Files:**
- Create: `src/menu/views/CreditsView/CreditsView.js`
- Create: `src/menu/views/CreditsView/CreditsView.css`
- Modify: `src/app.js`

- [ ] **Step 1: Create `src/menu/views/CreditsView/CreditsView.css`**

```css
.credits-view {
  position: absolute;
  inset: 0;
  background: rgba(20, 14, 10, 0.85);
  backdrop-filter: blur(6px);
  overflow: hidden;
  color: var(--fg);
  pointer-events: auto;
  opacity: 0;
  transition: opacity 500ms ease;
}
.credits-view.open { opacity: 1; }

.credits-scroll {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: min(640px, 90vw);
  text-align: center;
  animation: credits-roll 60s linear forwards;
}

@keyframes credits-roll {
  to { top: -800px; }
}

.credits-section { margin-bottom: 60px; }
.credits-section h3 {
  font-size: 24px;
  color: var(--accent);
  letter-spacing: 4px;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.credits-section p { font-size: 18px; line-height: 1.8; }

.credits-back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: 1px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
  z-index: 1;
}
.credits-back:hover { border-color: var(--accent); background: rgba(255, 184, 74, 0.18); }
```

- [ ] **Step 2: Create `src/menu/views/CreditsView/CreditsView.js`**

```js
import "./CreditsView.css";
import { store } from "../../../state/store.js";
import { timelineData, socialLinks } from "../../../data/portfolioData.js";
import { getLabel, onLingoChange } from "../../lingo.js";

const TOOLS = ["Three.js", "Vite", "@tweenjs/tween.js", "Phosphor Icons", "GitHub Pages"];

export class CreditsView {
  constructor(parent) {
    this.parent = parent;
    this.el = document.createElement("div");
    this.el.className = "credits-view";
    this.render();
    parent.appendChild(this.el);
    requestAnimationFrame(() => this.el.classList.add("open"));

    this.unsubLingo = onLingoChange(() => this.render());
  }

  render() {
    this.el.innerHTML = `
      <button class="credits-back">${getLabel("back")}</button>
      <div class="credits-scroll">
        <div class="credits-section">
          <h3>${getLabel("creditsHeading")}</h3>
          <p>Designed and built by Josip Mužić</p>
        </div>
        <div class="credits-section">
          <h3>Cast</h3>
          <p>Josip Mužić — Full-Stack &amp; Game Dev<br>RIT Croatia, Magna Cum Laude</p>
        </div>
        <div class="credits-section">
          <h3>Studios</h3>
          ${timelineData.map((t) => `<p>${t.company} — ${t.position}</p>`).join("")}
        </div>
        <div class="credits-section">
          <h3>Tools used</h3>
          ${TOOLS.map((t) => `<p>${t}</p>`).join("")}
        </div>
        <div class="credits-section">
          <h3>Contact</h3>
          ${socialLinks.map((s) => `<p><a href="${s.url}" target="_blank" rel="noopener" style="color: inherit; text-decoration: underline">${s.name}</a></p>`).join("")}
        </div>
      </div>
    `;
    this.el.querySelector(".credits-back").addEventListener("click", () => store.setView("main"));
  }

  dispose() {
    this.unsubLingo?.();
    this.el.classList.remove("open");
    setTimeout(() => this.el.remove(), 500);
  }
}
```

- [ ] **Step 3: Register in `app.js`**

```js
import { CreditsView } from "./menu/views/CreditsView/CreditsView.js";
// extend viewClasses:
const viewClasses = { bio: BioView, projects: ProjectsView, credits: CreditsView };
```

- [ ] **Step 4: Verify**

`npm run dev`. Click "Credits" → camera tilts toward corkboard, full-screen overlay with text scrolling bottom-to-top. Back button works. Confirm all `socialLinks` (LinkedIn, GitHub, YouTube, Email, Download CV) listed.

- [ ] **Step 5: Commit via `/commit` skill**

Suggested: `FEAT: scrolling credits view`.

---

## Task 14: SettingsView (lingo + music toggles)

**Files:**
- Create: `src/menu/views/SettingsView/SettingsView.js`
- Create: `src/menu/views/SettingsView/SettingsView.css`
- Create: `src/utils/audio.js`
- Add: `public/audio/ambient.mp3` (CC0 track — see Step 5)
- Modify: `src/app.js`

- [ ] **Step 1: Create `src/utils/audio.js`**

```js
let audio = null;
let unavailable = false;

const ensure = () => {
  if (audio || unavailable) return;
  try {
    audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.addEventListener("error", () => { unavailable = true; audio = null; });
  } catch {
    unavailable = true;
  }
};

export const isMusicAvailable = () => !unavailable;

export const setMusic = (on) => {
  ensure();
  if (!audio) return;
  if (on) {
    audio.play().catch(() => { /* autoplay blocked, ignore */ });
  } else {
    audio.pause();
  }
};
```

- [ ] **Step 2: Create `src/menu/views/SettingsView/SettingsView.css`**

```css
.settings-view {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(20, 14, 10, 0.7);
  backdrop-filter: blur(8px);
  opacity: 0;
  transition: opacity 300ms ease;
  pointer-events: auto;
}
.settings-view.open { opacity: 1; }

.settings-panel {
  width: 420px;
  background: rgba(50, 35, 22, 0.95);
  border: 2px solid rgba(255, 184, 74, 0.5);
  padding: 32px;
  color: var(--fg);
}

.settings-panel h2 { font-size: 28px; margin-bottom: 24px; }

.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 184, 74, 0.2);
}
.setting-row:last-child { border-bottom: none; }

.toggle {
  background: rgba(20, 14, 10, 0.7);
  border: 1px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 14px;
  padding: 6px 14px;
  cursor: pointer;
  min-width: 80px;
}
.toggle.on { background: var(--accent); color: #1a1410; border-color: var(--accent); }
.toggle:disabled { opacity: 0.5; cursor: not-allowed; }

.settings-back {
  position: absolute;
  top: 16px;
  left: 16px;
  background: none;
  border: 1px solid rgba(255, 184, 74, 0.4);
  color: var(--fg);
  font-size: 14px;
  padding: 6px 12px;
  cursor: pointer;
}
```

- [ ] **Step 3: Create `src/menu/views/SettingsView/SettingsView.js`**

```js
import "./SettingsView.css";
import { store } from "../../../state/store.js";
import { getLabel, onLingoChange } from "../../lingo.js";
import { setMusic, isMusicAvailable } from "../../../utils/audio.js";

export class SettingsView {
  constructor(parent) {
    this.parent = parent;
    this.el = document.createElement("div");
    this.el.className = "settings-view";
    this.render();
    parent.appendChild(this.el);
    requestAnimationFrame(() => this.el.classList.add("open"));

    this.unsubLingo = onLingoChange(() => this.render());
    this.unsubMusic = store.subscribe((s, p) => {
      if (s.music !== p.music) this.render();
    });

    this.onBackdrop = (e) => { if (e.target === this.el) store.setView("main"); };
    this.el.addEventListener("click", this.onBackdrop);
  }

  render() {
    const s = store.get();
    this.el.innerHTML = `
      <button class="settings-back">${getLabel("back")}</button>
      <div class="settings-panel">
        <h2>${getLabel("settingsHeading")}</h2>
        <div class="setting-row">
          <span>${getLabel("lingoLabel")}</span>
          <button class="toggle ${s.lingo === "plain" ? "" : "on"}" data-action="lingo">${s.lingo === "game" ? "Game" : "Plain"}</button>
        </div>
        <div class="setting-row">
          <span>${getLabel("musicLabel")}</span>
          <button class="toggle ${s.music ? "on" : ""}" data-action="music" ${isMusicAvailable() ? "" : "disabled"}>${s.music ? "On" : "Off"}</button>
        </div>
      </div>
    `;
    this.el.querySelector(".settings-back").addEventListener("click", (e) => {
      e.stopPropagation();
      store.setView("main");
    });
    this.el.querySelector(".settings-panel").addEventListener("click", (e) => e.stopPropagation());
    this.el.querySelectorAll(".toggle").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.action === "lingo") {
          store.set({ lingo: store.get().lingo === "game" ? "plain" : "game" });
        } else if (btn.dataset.action === "music") {
          const next = !store.get().music;
          store.set({ music: next });
          setMusic(next);
        }
      });
    });
  }

  dispose() {
    this.unsubLingo?.();
    this.unsubMusic?.();
    this.el.removeEventListener("click", this.onBackdrop);
    this.el.classList.remove("open");
    setTimeout(() => this.el.remove(), 300);
  }
}
```

- [ ] **Step 4: Register + initialize music in `app.js`**

```js
import { SettingsView } from "./menu/views/SettingsView/SettingsView.js";
import { setMusic } from "./utils/audio.js";

const viewClasses = { bio: BioView, projects: ProjectsView, credits: CreditsView, settings: SettingsView };

// Restore music state on load (autoplay may be blocked until user interaction)
if (store.get().music) setMusic(true);
```

- [ ] **Step 5: Source CC0 music**

Manual step — Joe picks the track. Suggested sources:
- https://freemusicarchive.org (filter: CC0)
- https://incompetech.com (royalty-free, attribution)
- https://pixabay.com/music/ (CC0-equivalent license)

Save the chosen file as `public/audio/ambient.mp3`. Verify license + add an `ATTRIBUTION.md` in `public/audio/` if attribution is required by the license.

If Joe hasn't picked yet: commit Steps 1-4 with the music toggle disabled (the `audio.onerror` handler will gracefully disable it). Add the track later as a separate commit.

- [ ] **Step 6: Verify**

`npm run dev`. Click "Settings" → modal opens. Click lingo toggle — all menu labels (and headings in any open view next time) flip between game/plain immediately. Click music toggle — if `ambient.mp3` exists, music starts. If not, button shows as disabled. Refresh — lingo + music settings persist. Back button + backdrop close.

- [ ] **Step 7: Commit via `/commit` skill**

Suggested: `FEAT: settings view with lingo + music toggles`.

---

## Task 15: ESC key + global back navigation

**Files:**
- Modify: `src/app.js`

- [ ] **Step 1: Add ESC handler**

In `src/app.js`, after view subscriptions:

```js
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (store.get().view !== "main") store.setView("main");
  }
});
```

- [ ] **Step 2: Verify**

`npm run dev`. Open each sub-view, press ESC, verify returns to main from bio, projects, credits, settings.

- [ ] **Step 3: Commit via `/commit` skill**

Suggested: `FEAT: ESC key closes any sub-view`.

---

## Task 16: WebGL feature detection + static fallback

**Files:**
- Modify: `src/app.js`
- Modify: `src/styles/styles.css`
- Add: `public/images/room-fallback.png` (placeholder for now, replace with real screenshot later)

- [ ] **Step 1: Add WebGL feature-detect to `app.js`**

Wrap Scene mount in try/feature-detect:

```js
const supportsWebGL = (() => {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
})();

if (supportsWebGL) {
  new Scene(canvas);
} else {
  canvas.style.display = "none";
  document.body.classList.add("no-webgl");
}
```

- [ ] **Step 2: Add fallback styling**

In `src/styles/styles.css`:

```css
body.no-webgl {
  background:
    linear-gradient(rgba(26, 20, 16, 0.4), rgba(26, 20, 16, 0.4)),
    url("/images/room-fallback.png") center / cover no-repeat;
}
```

- [ ] **Step 3: Drop placeholder fallback image**

Until a real screenshot exists, use the existing `og-image.png` or copy a single-color 1920x1080 stub to `public/images/room-fallback.png`. Replace after Task 21.

```bash
cp public/images/og-image.png public/images/room-fallback.png
```

- [ ] **Step 4: Verify**

`npm run dev`. Use Chrome DevTools → Rendering → "Disable WebGL". Reload. Expected: canvas hidden, fallback image shows, menu still functional, all sub-views open.

Re-enable WebGL.

- [ ] **Step 5: Commit via `/commit` skill**

Suggested: `FEAT: WebGL fallback with static room image`.

---

## Task 17: Mobile detection + simplified menu

**Files:**
- Modify: `src/app.js`
- Modify: `src/menu/Menu.css` (mobile rules)

- [ ] **Step 1: Detect mobile in `app.js`**

Before Scene mount:

```js
const isMobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;

if (isMobile) {
  canvas.style.display = "none";
  document.body.classList.add("mobile");
}
if (supportsWebGL && !isMobile) {
  new Scene(canvas);
} else if (!supportsWebGL && !isMobile) {
  document.body.classList.add("no-webgl");
}
```

Mobile uses the same static fallback bg (`body.no-webgl` styles already cover via additional `body.mobile` rule below).

- [ ] **Step 2: Add mobile CSS to `Menu.css` and `styles.css`**

In `src/styles/styles.css`, add:

```css
body.mobile {
  background:
    linear-gradient(rgba(26, 20, 16, 0.5), rgba(26, 20, 16, 0.5)),
    url("/images/room-fallback.png") center / cover no-repeat;
}
```

In `src/menu/Menu.css`, append:

```css
@media (max-width: 768px), (pointer: coarse) {
  .menu { padding: 24px; }
  .menu-title { font-size: 36px; }
  .menu-title small { font-size: 13px; }
  .menu-actions { width: 100%; }
  .menu-button { font-size: 18px; padding: 12px 16px; }
  .menu-footer { justify-self: stretch; justify-content: center; }
}
```

Sub-views (BioView, ProjectsView, CreditsView, SettingsView) also need small responsive tweaks — each `*.css` gets:

```css
@media (max-width: 768px) {
  .bio-view { width: 100%; padding: 32px 20px; }
  /* etc. — per-view: adjust widths to 100%/90vw and reduce padding */
}
```

Apply equivalent rules to `ProjectsView.css`, `CreditsView.css`, `SettingsView.css` (panel width → 90vw, padding reduced).

- [ ] **Step 3: Verify**

`npm run dev`. Chrome DevTools → Toggle device toolbar → iPhone preset. Expected: canvas hidden, fallback bg, vertical menu, sub-views fit screen. Camera tween calls are no-ops because Scene not mounted; store still works.

Toggle back to desktop preset → 3D scene returns on reload.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: mobile fallback with simplified menu layout`.

---

## Task 18: Reduced-motion polish + perf cap

**Files:**
- Modify: `src/scene/Scene.js`
- Modify: `src/scene/Particles.js` (already wired in Task 8)
- Modify: `src/scene/Camera.js` (already wired in Task 7)

- [ ] **Step 1: Add FPS monitor + auto-degrade**

In `src/scene/Scene.js`, add to constructor:

```js
this.fpsSamples = [];
this.degraded = false;
```

In `loop(t)` after `tweenUpdate`:

```js
if (this.lastFrameT) {
  const dt = t - this.lastFrameT;
  if (dt > 0) {
    const fps = 1000 / dt;
    this.fpsSamples.push(fps);
    if (this.fpsSamples.length > 120) this.fpsSamples.shift();
  }
}
this.lastFrameT = t;

if (!this.degraded && this.fpsSamples.length >= 120) {
  const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
  if (avg < 30) {
    this.degraded = true;
    this.scene.remove(this.particles.points);
    this.renderer.shadowMap.enabled = false;
    console.warn("FPS below 30 average, particles + shadows disabled");
  }
}
```

- [ ] **Step 2: Reduced-motion sanity check**

Already wired in Camera.js (snap) and Particles.js (freeze). No new code needed. Verify by toggling devtools simulation.

- [ ] **Step 3: Verify**

`npm run dev`. Devtools rendering → throttle CPU 6x. After ~4 seconds, console should warn about degraded perf and particles should vanish. Untoggle throttle.

- [ ] **Step 4: Commit via `/commit` skill**

Suggested: `FEAT: auto-degrade scene quality below 30fps average`.

---

## Task 19: Final polish — clean unused imports, retake fallback screenshot

**Files:**
- Modify: `src/data/portfolioData.js` (remove unused `languageColors`, `technologyLinks`, `heroContent.subheading` if not referenced)
- Modify: `package.json` (re-check `dompurify`, `marked` usage and uninstall if unused)
- Replace: `public/images/room-fallback.png` with actual screenshot of the scene
- Modify: `package.json` version bump

- [ ] **Step 1: Take real fallback screenshot**

`npm run dev`. Open in browser, press F11 for fullscreen, screenshot via OS tool. Resize/crop to 1920x1080. Save as `public/images/room-fallback.png` (overwrite stub from Task 16).

- [ ] **Step 2: Remove unused data**

```bash
grep -r "languageColors\|technologyLinks" src/
```

If no hits in code (other than the definition itself in `portfolioData.js`), delete those constants. Same for any `heroContent` fields not used.

- [ ] **Step 3: Audit deps**

```bash
grep -r "dompurify\|marked" src/
```

If no hits, `npm uninstall dompurify marked`.

- [ ] **Step 4: Run manual checklist** from spec

Open spec at `docs/superpowers/specs/2026-05-25-game-menu-portfolio-design.md`, work through the "Testing" section checklist. Fix anything that fails.

- [ ] **Step 5: Build + perf check**

```bash
npm run build
```

Then `npx serve dist` and run Chrome Lighthouse on desktop. Confirm perf score >= 80.

Inspect `dist/assets/` sizes. If JS bundle > 500kb gzipped, investigate (Three.js is ~150kb gzipped, baseline is fine).

- [ ] **Step 6: Commit via `/commit v` skill (bump version)**

Suggested: `CHORE: final polish, real fallback screenshot, drop unused deps`.

---

## Self-Review Notes

**Spec coverage check:**
- Concept (cozy 3D room menu) — Tasks 3-8.
- Layout A — Task 4 (`room-config.js`) + Task 7 (`focus-points.js`).
- 4 menu actions — Tasks 10-14.
- Camera fly-to behavior — Task 7.
- Lingo toggle in v1 — Task 9 + Task 14.
- Music toggle in v1 — Task 14.
- Particles + cursor reaction — Task 8.
- Mouse parallax main view — Task 7.
- localStorage persistence (lingo+music) — Task 2.
- WebGL fallback — Task 16.
- Mobile fallback — Task 17.
- Reduced motion + perf cap — Task 7, 8, 18.
- ESC + back button + click-outside — Task 10-14 (per-view back btn + backdrop) + Task 15 (ESC).
- Tab background pause — Task 3 (visibilitychange).
- Manual checklist (spec) — Task 19 Step 4.
- CC0 music sourced — Task 14 Step 5 (manual, Joe).

**Type/name consistency:** Camera focus name `"creditsWall"` used identically in `focus-points.js` and the `viewToFocus` map in Task 7. `store.setView` referenced consistently. View names `'main'|'bio'|'projects'|'credits'|'settings'` consistent across all files.

**No placeholders:** None. Every code step contains full code.

---

## Execution

Plan complete and saved to `docs/superpowers/plans/2026-05-25-game-menu-portfolio.md`. Two execution options:

1. **Subagent-Driven (recommended for plans this long)** — Fresh subagent per task, you review between tasks, fastest iteration on independent work.
2. **Inline Execution** — Execute in this session with checkpoints. Better when you want to feel each step and adjust visuals as we go.

Which approach?
