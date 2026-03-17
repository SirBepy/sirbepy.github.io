import "../styles/personalProjects.css";
import { languageColors } from "../data/portfolioData.js";
import { marked } from "marked";
import DOMPurify from "dompurify";

export class PersonalProjects {
  constructor(element, locomotiveScroll) {
    this.element = element;
    this.scroll = locomotiveScroll;
    this.projects = [];
    this.undocumentedCount = 0;
    this.activeFilter = "all";
    
    // Popup state
    this.isPopupOpen = false;
    this.currentProjectIndex = -1;
    this.currentFilteredProjects = [];
    this.popupElement = null;

    this.loadData();
    this.initPopup();
  }

  // Simple HTML escape helper
  escapeHTML(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  async loadData() {
    try {
      const response = await fetch("/projects.json");
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      this.projects = data.projects || [];
      this.undocumentedCount = data.undocumentedCount || 0;
    } catch {
      this.projects = [];
      this.undocumentedCount = 0;
    }
    this.render();
    this.attachEvents();
    this.scheduleScrollUpdate();
  }

  initPopup() {
    // Create popup element if it doesn't exist
    this.popupElement = document.createElement("div");
    this.popupElement.className = "pp-popup-overlay";
    this.popupElement.setAttribute("aria-hidden", "true");
    this.popupElement.innerHTML = `
      <div class="pp-popup-container">
        <div class="pp-popup-modal" role="dialog" aria-modal="true">
          <button class="pp-popup-close" aria-label="Close popup">&times;</button>
          <button class="pp-popup-nav pp-popup-nav-prev" aria-label="Previous project">&lsaquo;</button>
          <button class="pp-popup-nav pp-popup-nav-next" aria-label="Next project">&rsaquo;</button>
          <div class="pp-popup-content-wrapper">
            <div class="pp-popup-content"></div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(this.popupElement);

    // Close on backdrop click
    this.popupElement.addEventListener("click", (e) => {
      if (e.target === this.popupElement || e.target.classList.contains("pp-popup-container")) {
        this.closePopup();
      }
    });

    // Close button
    this.popupElement.querySelector(".pp-popup-close").addEventListener("click", () => this.closePopup());

    // Navigation
    this.popupElement.querySelector(".pp-popup-nav-prev").addEventListener("click", () => this.navigatePopup(-1));
    this.popupElement.querySelector(".pp-popup-nav-next").addEventListener("click", () => this.navigatePopup(1));

    // Keyboard listener
    this.handleKeyDown = (e) => {
      if (!this.isPopupOpen) return;
      if (e.key === "Escape") this.closePopup();
      if (e.key === "ArrowLeft") this.navigatePopup(-1);
      if (e.key === "ArrowRight") this.navigatePopup(1);
      
      // Focus trap
      if (e.key === "Tab") {
        const focusableElements = this.popupElement.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
  }

  getFilteredProjects() {
    if (this.activeFilter === "all") return this.projects;
    return this.projects.filter((p) => p.type === this.activeFilter);
  }

  getTypes() {
    return [...new Set(this.projects.map((p) => p.type).filter(Boolean))];
  }

  getStatusLabel(status) {
    const map = {
      finished: "Finished",
      "in-progress": "In Progress",
      abandoned: "Abandoned",
      archived: "Archived",
    };
    return map[status] || status;
  }

  getStatusClass(status) {
    const map = {
      finished: "pp-badge-success",
      "in-progress": "pp-badge-info",
      abandoned: "pp-badge-danger",
      archived: "pp-badge-neutral",
    };
    return map[status] || "pp-badge-neutral";
  }

  renderCard(project, originalIndex) {
    const primaryLanguage = project.languages?.[0];
    const color = languageColors[primaryLanguage] || "#3572A5";

    const mediaHtml = project.mainImage
      ? `<img class="pp-card-img" src="${this.escapeHTML(project.mainImage)}" alt="${this.escapeHTML(project.title)}" loading="lazy">`
      : `<div class="pp-card-img pp-card-gradient" style="background: linear-gradient(135deg, ${color} 0%, #131929 100%)"></div>`;

    return `
      <div class="pp-card" data-project-index="${originalIndex}" role="button" tabindex="0">
        <div class="pp-card-media">${mediaHtml}</div>
        <div class="pp-card-body">
          <h3 class="pp-card-title">${this.escapeHTML(project.title)}</h3>
          <p class="pp-card-desc">${this.escapeHTML(project.shortDescription || "")}</p>
          <div class="pp-card-badges">
            ${project.type ? `<span class="pp-badge pp-badge-type">${this.escapeHTML(project.type)}</span>` : ""}
            ${project.status ? `<span class="pp-badge ${this.getStatusClass(project.status)}">${this.escapeHTML(this.getStatusLabel(project.status))}</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const types = this.getTypes();
    const filtered = this.getFilteredProjects();
    const hasProjects = this.projects.length > 0;

    this.element.innerHTML = `
      <div class="personal-projects-container">
        <h2 class="personal-projects-title">Personal Projects</h2>
        <div class="personal-projects-filter-tabs">
          <button class="filter-tab ${this.activeFilter === "all" ? "active" : ""}" data-filter="all">All</button>
          ${types
            .map(
              (type) => `
            <button class="filter-tab ${this.activeFilter === type ? "active" : ""}" data-filter="${this.escapeHTML(type)}">${this.escapeHTML(type)}</button>
          `
            )
            .join("")}
        </div>
        <div class="personal-projects-grid">
          ${
            !hasProjects
              ? `<p class="personal-projects-empty">No documented projects yet.</p>`
              : filtered.length === 0
              ? `<p class="personal-projects-empty">No projects in this category.</p>`
              : filtered
                  .map((project) => {
                    const originalIndex = this.projects.indexOf(project);
                    return this.renderCard(project, originalIndex);
                  })
                  .join("")
          }
        </div>
        <p class="personal-projects-undoc">+ ${this.undocumentedCount} undocumented repos</p>
      </div>
    `;
  }

  attachEvents() {
    this.element.querySelectorAll(".filter-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.dataset.filter === this.activeFilter) return;
        this.activeFilter = tab.dataset.filter;
        this.render();
        this.attachEvents();
        this.scheduleScrollUpdate();
      });
    });

    this.element.querySelectorAll(".pp-card").forEach((card) => {
      card.addEventListener("click", () => {
        const originalIndex = parseInt(card.dataset.projectIndex, 10);
        const filtered = this.getFilteredProjects();
        // Find position in current filtered list
        const filteredIndex = filtered.findIndex(p => this.projects.indexOf(p) === originalIndex);
        this.openPopup(filteredIndex, filtered);
      });
      
      // Handle Enter/Space for accessibility
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  scheduleScrollUpdate() {
    if (!this.scroll) return;

    let updateTimer;
    const debounce = () => {
      clearTimeout(updateTimer);
      updateTimer = setTimeout(() => this.scroll.update(), 150);
    };

    debounce();

    this.element.querySelectorAll("img.pp-card-img").forEach((img) => {
      img.addEventListener("load", debounce, { once: true });
      img.addEventListener("error", debounce, { once: true });
    });
  }

  setModalState(isOpen) {
    this.isPopupOpen = isOpen;
    this.popupElement.setAttribute("aria-hidden", !isOpen);
    
    if (isOpen) {
      document.body.classList.add("modal-open");
      if (this.scroll) this.scroll.stop();
      window.addEventListener("keydown", this.handleKeyDown);
      this.popupElement.classList.add("visible");
      // Focus the close button or modal
      setTimeout(() => {
        this.popupElement.querySelector(".pp-popup-close").focus();
      }, 100);
    } else {
      document.body.classList.remove("modal-open");
      if (this.scroll) this.scroll.start();
      window.removeEventListener("keydown", this.handleKeyDown);
      this.popupElement.classList.remove("visible");
    }
  }

  openPopup(index, filteredProjects) {
    this.currentProjectIndex = index;
    this.currentFilteredProjects = filteredProjects;
    this.renderPopupContent();
    this.setModalState(true);
  }

  closePopup() {
    this.setModalState(false);
  }

  navigatePopup(direction) {
    const len = this.currentFilteredProjects.length;
    if (len <= 1) return;

    // Fade out current content
    const content = this.popupElement.querySelector(".pp-popup-content");
    content.style.opacity = "0";
    content.style.transform = direction > 0 ? "translateX(-20px)" : "translateX(20px)";

    setTimeout(() => {
      this.currentProjectIndex = (this.currentProjectIndex + direction + len) % len;
      this.renderPopupContent();
      
      // Fade in new content
      content.style.transform = direction > 0 ? "translateX(20px)" : "translateX(-20px)";
      // Trigger reflow
      content.offsetHeight;
      content.style.opacity = "1";
      content.style.transform = "translateX(0)";
    }, 200);
  }

  renderPopupContent() {
    const project = this.currentFilteredProjects[this.currentProjectIndex];
    if (!project) return;

    const contentArea = this.popupElement.querySelector(".pp-popup-content");
    
    const images = project.images || (project.mainImage ? [project.mainImage] : []);
    const galleryHtml = images.length > 0 
      ? `<div class="pp-popup-gallery">
          ${images.map(img => `<img src="${this.escapeHTML(img)}" alt="${this.escapeHTML(project.title)}" loading="lazy">`).join("")}
         </div>`
      : "";

    const metaRow = `
      <div class="pp-popup-meta">
        ${project.year ? `<span class="pp-popup-meta-item"><strong>Year:</strong> ${this.escapeHTML(project.year)}</span>` : ""}
        ${project.usageFrequency ? `<span class="pp-popup-meta-item"><strong>Usage:</strong> ${this.escapeHTML(project.usageFrequency)}</span>` : ""}
      </div>
    `;

    const techBadges = [
      ...(project.languages || []),
      ...(project.frameworks || [])
    ].map(tech => `<span class="pp-badge pp-badge-neutral">${this.escapeHTML(tech)}</span>`).join("");

    const externalLinks = `
      <div class="pp-popup-links">
        ${project.liveUrl ? `<a href="${this.escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="pp-btn pp-btn-primary">Live Demo</a>` : ""}
        ${project.repoUrl ? `<a href="${this.escapeHTML(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="pp-btn pp-btn-outline">Repository</a>` : ""}
      </div>
    `;

    const rawMarkdownContent = project.longDescriptionMarkdown 
      ? marked.parse(project.longDescriptionMarkdown)
      : (project.description || "No detailed description available.");
    
    // Sanitize the markdown output
    const markdownContent = DOMPurify.sanitize(rawMarkdownContent);

    contentArea.innerHTML = `
      <div class="pp-popup-header">
        <h2 class="pp-popup-title">${this.escapeHTML(project.title)}</h2>
        <div class="pp-card-badges">
          ${project.type ? `<span class="pp-badge pp-badge-type">${this.escapeHTML(project.type)}</span>` : ""}
          ${project.status ? `<span class="pp-badge ${this.getStatusClass(project.status)}">${this.escapeHTML(this.getStatusLabel(project.status))}</span>` : ""}
        </div>
      </div>
      
      ${metaRow}
      
      <div class="pp-popup-tech-row">
        ${techBadges}
      </div>

      ${galleryHtml}

      <div class="pp-popup-description markdown-content">
        ${markdownContent}
      </div>

      ${externalLinks}
    `;
    
    // Reset scroll position of the content wrapper
    this.popupElement.querySelector(".pp-popup-content-wrapper").scrollTop = 0;
  }
}

export function initPersonalProjects(element, locomotiveScroll) {
  if (!element) return;
  new PersonalProjects(element, locomotiveScroll);
}
