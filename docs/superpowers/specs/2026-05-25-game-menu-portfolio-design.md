# Game Main Menu Portfolio — Design Spec

**Date:** 2026-05-25
**Branch:** `feat/main-menu-portfolio`
**Status:** Draft, pending review

## Concept

Portfolio site styled as a video game main menu. A cozy Minecraft-aesthetic 3D room sits behind a game-style UI overlay. The room tells the story through its objects. Camera idles with subtle mouse parallax. Clicking a menu button flies the camera to the relevant part of the room.

## Goals

- Replace current portfolio (`master`) with this experience on merge.
- Desktop-only for v1. Mobile gets a static fallback. Full mobile is v2.
- Ship one fully designed room with four menu actions wired end-to-end.
- Architect so v2 (mobile, day/night, animated character) is additive, not a rewrite.

## Non-goals

- Animated character (idle pose only in v1).
- Multiple rooms / scenes.
- 3D clickable books (panel-only projects in v1).
- Automated test suite.
- SSR / SEO beyond current GH Pages setup.

## Key UX decisions

| Decision | Choice |
|---|---|
| Tech | Three.js + custom GLSL where needed, vanilla JS, Vite |
| Room assets | Procedural voxel build (BoxGeometry blocks in code) |
| Room layout | Layout A — two-wall L composition, camera in SE corner looking NW |
| Menu click behavior | Camera flies to the relevant room object |
| Back from sub-view | ESC + back button + click-outside (all three) |
| Settings v1 | Lingo toggle + music toggle (day/night = v2/v3) |
| Settings persistence | localStorage for lingo + music; view never persists |
| Music asset | CC0/royalty-free track committed to repo |
| Character v1 | Static pose, no animation |
| Particles | Drifting motes + mouse reaction (Three.js Points) |
| Cursor | Native browser cursor (drop existing StarCursor component) |
| Lingo toggle | Ship in v1 |
| Tween library | `@tweenjs/tween.js` |
| WebGL fallback | Static room screenshot + same HTML menu |

## Room layout (Layout A)

Top-down (camera = 🎥 in SE corner, looks NW into the room):

```
 N wall = window (warm sunset light pouring in)
┌──────────────[WINDOW ☀]──────────────┐
│                                      │
│  [BOOKSHELF]            [DESK]       │
│   board games            monitor     │  ← N+E region
│   project books          keyboard    │
│                          mouse       │
│   (W wall)               bottle      │
│                          [CHAR]      │
│                                      │
│  [CORK BOARD]            [PET]       │
│   diploma                dog or cat  │
│   Sahur banner                       │
│   credit notes                       │
│                                      │
│                  [TORCH]             │
└──────────────────────────────────🎥──┘
     S wall                          SE corner
                                     camera
```

- Camera position: high-ish, SE corner, framing W and N walls.
- Sun: low-angle directional light through window, warm hue.
- Torches: point lights with flicker.
- Particles: ~200 motes drifting up across the volume.

## Menu actions

Four main buttons + three social icons + settings cog.

| Button (game) | Button (plain) | Action |
|---|---|---|
| Continue | About Me | Camera dolly + slight orbit to character at desk. Bio panel slides in from right. |
| Load Save | Projects | Camera flies to bookshelf. Projects panel overlays with save-slot list (thumbnail, title, date, desc). |
| Credits | Contact | Camera tilts up and slow-pans across the wall. Names roll up like game ending. |
| Settings | Settings | Camera holds. In-world settings panel appears (parchment style). Lingo + music toggles. |

Social row (always visible bottom of main menu): LinkedIn, GitHub, Email. YouTube too (already in current data).

## Architecture

**Pattern: A — module split by domain.**

```
src/
├─ app.js                       bootstrap, mount Scene + Menu, init store
├─ scene/                       pure 3D, no DOM
│   ├─ Scene.js                 Three.js root, renderer, rAF loop
│   ├─ Room.js                  procedural voxel build from room-config
│   ├─ room-config.js           declarative blocks [{type, pos, size, mat}]
│   ├─ Character.js             voxel humanoid (static)
│   ├─ Lights.js                sun + ambient + torch flicker
│   ├─ Particles.js             THREE.Points motes, cursor reactive
│   ├─ Camera.js                PerspectiveCamera + tween, focus targets
│   └─ focus-points.js          {main, desk, shelf, corkboard, credits-wall}
├─ menu/                        pure DOM, no 3D
│   ├─ Menu.js                  main button overlay
│   ├─ Menu.css
│   ├─ views/
│   │   ├─ BioView/
│   │   │   ├─ BioView.js
│   │   │   └─ BioView.css
│   │   ├─ ProjectsView/
│   │   │   ├─ ProjectsView.js
│   │   │   └─ ProjectsView.css
│   │   ├─ CreditsView/
│   │   │   ├─ CreditsView.js
│   │   │   └─ CreditsView.css
│   │   └─ SettingsView/
│   │       ├─ SettingsView.js
│   │       └─ SettingsView.css
│   └─ lingo.js                 label dict + getLabel(key, mode)
├─ state/
│   └─ store.js                 ~30-line pub/sub
├─ data/
│   └─ portfolioData.js         reused, extended with aboutContent + project thumbnails
└─ utils/
    └─ tween-helpers.js         wrapper around @tweenjs/tween.js
```

### Module contracts

- **`scene/Scene.js`** — `mount(canvas)`, `dispose()`. Subscribes to `store` for view changes; forwards to `Camera.focusOn(...)`.
- **`scene/Room.js`** — builds room from `room-config.js`. Returns `THREE.Group`. No DOM, no store.
- **`scene/Camera.js`** — owns `PerspectiveCamera` + active tween. Public: `focusOn(name)` where name is a key in `focus-points.js`. Mouse parallax enabled only when current view is `'main'`.
- **`scene/Particles.js`** — `THREE.Points` + `BufferGeometry`. Each frame: integrate Y velocity, raycast cursor onto room-center plane, push particles within radius.
- **`scene/Lights.js`** — `setMode('day'|'sunset'|'night')` stub for v2/v3. v1 always `'sunset'`.
- **`menu/Menu.js`** — renders 4 buttons + 3 social icons + settings cog. Hides when `store.view !== 'main'`.
- **`menu/views/*View.js`** — each exposes `mount(parent)`, `unmount()`. Renders own DOM, reads data, dispatches close events to `store`.
- **`menu/lingo.js`** — `getLabel(key, mode)`. Dict for: continue, loadSave, credits, settings, plus any sub-headings.
- **`state/store.js`** — `{ get(), set(partial), subscribe(fn) }`. State shape: `{ view, lingo, music, settingsOpen }`. View values: `'main' | 'bio' | 'projects' | 'credits' | 'settings'`. Persists `{lingo, music}` to localStorage on change.

## Data flow

User click → view DOM `onClick` → `store.setView(target)` → store fan-out:

1. **menu/Menu.js** fades main buttons out.
2. **views/[Target]View** mounts and animates in.
3. **scene/Camera.js** starts tween to corresponding focus point.

Return: ESC keydown, back button, or click on canvas backdrop → `store.setView('main')` → reverse fan-out.

## Data sources

- **Bio panel** — new `aboutContent` constant in `portfolioData.js`: long-form bio text (RIT Magna Cum Laude, Zagreb-based, 880k+ visit Roblox game, etc.).
- **Projects panel** — flatten `skillsData[].projects` into a single list, with each item gaining `category` (web | mobile | gamedev) and `thumbnail` (URL or asset path; placeholder is fine for v1).
- **Credits scroll** — sections built from:
  - "Cast": you, RIT degree.
  - "Studios": `timelineData` (companies).
  - "Tools used": hardcoded list (Three.js, Vite, vanilla JS, @tweenjs/tween.js, Phosphor Icons).
  - "Contact": `socialLinks`.

## Error handling and edge cases

- **No WebGL** — skip Scene mount, set `<body>` bg to a baked `room-fallback.png`. Menu DOM works unchanged. Focus calls are no-ops.
- **Slow GPU** — `WebGLRenderer({ powerPreference: 'high-performance' })`. Cap `pixelRatio` at 2. If FPS < 30 for 2s: disable particles, drop shadow map size.
- **Music asset load failure** — `<audio>.onerror` hides the music toggle silently.
- **localStorage blocked** — try/catch wrap, fall back to in-memory; never throws.
- **Window resize** — Scene updates renderer size + camera aspect. Menu CSS is responsive.
- **Mobile / touch / narrow viewport** — Detect `pointer: coarse` or `innerWidth < 768`. Skip 3D, show static screenshot + vertical menu list. Logged as v2.
- **Tab backgrounded** — `document.hidden` pauses rAF and music.
- **Camera tween interrupted** — TWEEN.js cancels current and starts new from current camera state.
- **`prefers-reduced-motion`** — Snap camera (no tween), disable particles drift, no parallax. Menu functional.
- **Missing data** — Throw in dev. Internal code, no graceful degradation.

## Testing

No automated tests for v1. Manual checklist:

```
Desktop Chrome / Safari / Firefox:
  [ ] Page loads, room renders, camera idle parallax works
  [ ] Continue → camera tweens to desk, bio panel slides in
  [ ] Load Save → camera to shelf, projects panel, slot click expands detail
  [ ] Credits → camera tilts, scrolling credits play, manual scroll works
  [ ] Settings → in-world panel, lingo toggle swaps all labels live
  [ ] Music toggle starts/stops track
  [ ] ESC returns to main from each sub-view
  [ ] Back button visible in sub-view, returns to main
  [ ] Click outside panel returns to main
  [ ] Refresh: lingo + music persisted; view resets to main
  [ ] Window resize: no clipping, no stretched canvas
  [ ] Social icons open correct URLs in new tab

Negative cases:
  [ ] Disable WebGL → fallback image shows, menu still works
  [ ] prefers-reduced-motion → no tweens, no particles, parallax off
  [ ] Private window (no localStorage) → toggles still function

Performance:
  [ ] Lighthouse perf score >= 80 on desktop
  [ ] FPS >= 50 on mid-tier GPU
  [ ] Bundle < 500kb gzip
```

Automated: `npm run build` must succeed (already in GH Pages deploy).

## Dependencies to add

- `three` — 3D engine.
- `@tweenjs/tween.js` — camera tween.

To remove from current `package.json`:
- `locomotive-scroll` — no longer scrolling site.
- `marked`, `dompurify` — only if no markdown rendering remains in v1 menu views (re-check before removing).

## Deferred to v2 / v3

- Mobile-native experience (full responsive 3D).
- Day/night lighting toggle in Settings.
- Animated character (idle breathing/sway/dance).
- 3D clickable books on the bookshelf for projects.
- Full settings menu (fake game controls section image, etc.).
- Dynamic image textures loaded from URLs (for picture frames).
- StarCursor revival, if appropriate.

## Migration plan

- Branch `feat/main-menu-portfolio` is the workspace.
- On merge to `master`: existing `src/components/Hero, SkillsBanner, Github, Timeline, PersonalProjects, Footer, Links` are removed. `Cursor` removed (decided to drop).
- `src/data/portfolioData.js` is kept and extended (`aboutContent`, project thumbnails, etc.).
- `public/videos/*` removed (no longer used).
- `index.html` simplified to just `<canvas>` + `#menu-root` containers.
- GH Pages deploy continues to consume `vite build` output.
