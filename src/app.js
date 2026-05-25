import "./styles/styles.css";
import { Scene } from "./scene/Scene.js";
import { Menu } from "./menu/Menu.js";
import { BioView } from "./menu/views/BioView/BioView.js";
import { ProjectsView } from "./menu/views/ProjectsView/ProjectsView.js";
import { CreditsView } from "./menu/views/CreditsView/CreditsView.js";
import { SettingsView } from "./menu/views/SettingsView/SettingsView.js";
import { store } from "./state/store.js";
import { setMusic } from "./utils/audio.js";

const canvas = document.getElementById("scene-canvas");
const menuRoot = document.getElementById("menu-root");

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

new Menu(menuRoot);

const viewClasses = { bio: BioView, projects: ProjectsView, credits: CreditsView, settings: SettingsView };
let currentSubview = null;

store.subscribe((s, p) => {
  if (s.view === p.view) return;
  if (currentSubview) {
    currentSubview.dispose();
    currentSubview = null;
  }
  const Cls = viewClasses[s.view];
  if (Cls) {
    currentSubview = new Cls(menuRoot);
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && store.get().view !== "main") {
    store.setView("main");
  }
});

// Restore music state on load (autoplay may be blocked until user interaction)
if (store.get().music) setMusic(true);
