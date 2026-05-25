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
