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
