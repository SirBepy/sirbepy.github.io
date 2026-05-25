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
