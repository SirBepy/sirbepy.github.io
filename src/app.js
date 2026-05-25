import "./styles/styles.css";
import { Scene } from "./scene/Scene.js";
import { Menu } from "./menu/Menu.js";

const canvas = document.getElementById("scene-canvas");
const menuRoot = document.getElementById("menu-root");

new Scene(canvas);
new Menu(menuRoot);
