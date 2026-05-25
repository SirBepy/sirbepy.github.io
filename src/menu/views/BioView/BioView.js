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
