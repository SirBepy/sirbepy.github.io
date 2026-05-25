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
