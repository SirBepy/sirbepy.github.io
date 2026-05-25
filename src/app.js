import "./styles/styles.css";
import { Scene } from "./scene/Scene.js";
import { Menu } from "./menu/Menu.js";
import { BioView } from "./menu/views/BioView/BioView.js";
import { store } from "./state/store.js";

const canvas = document.getElementById("scene-canvas");
const menuRoot = document.getElementById("menu-root");

new Scene(canvas);
new Menu(menuRoot);

const viewClasses = { bio: BioView };
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
