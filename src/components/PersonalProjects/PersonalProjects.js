import "./PersonalProjects.css";
import { languageColors } from "../../data/portfolioData.js";
import { fetchProjects } from "../../utils/fetchProjects.js";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { createElement, CircleCheck, CircleX, Clock, Archive } from "lucide";

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

  preloadImages() {
    const heroUrls = this.projects
      .map((p) => p.mainImage)
      .filter(Boolean);

    const otherUrls = this.projects
      .flatMap((p) => (p.images || []).filter((img) => img !== p.mainImage))
      .filter(Boolean);

    const load = (src) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = src;
      });

    Promise.all(heroUrls.map(load)).then(() => {
      otherUrls.forEach((src) => load(src));
    });
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
      const data = await fetchProjects();
      this.projects = data.projects || [];
      this.undocumentedCount = data.undocumentedCount || 0;
    } catch {
      this.projects = [];
      this.undocumentedCount = 0;
    }
    this.preloadImages();
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
          <div class="pp-popup-hero">
            <div class="pp-popup-hero-img"></div>
            <div class="pp-popup-hero-overlay"></div>
            <div class="pp-popup-hero-badges"></div>
            <button class="pp-popup-close" aria-label="Close popup">&times;</button>
          </div>
          <div class="pp-popup-content-wrapper">
            <div class="pp-popup-content"></div>
          </div>
          <div class="pp-popup-footer">
            <button class="pp-popup-footer-btn pp-popup-footer-prev" aria-label="Previous project">
              <span class="pp-popup-footer-arrow">&lsaquo;</span>
              <span class="pp-popup-footer-label"></span>
            </button>
            <button class="pp-popup-footer-btn pp-popup-footer-next" aria-label="Next project">
              <span class="pp-popup-footer-label"></span>
              <span class="pp-popup-footer-arrow">&rsaquo;</span>
            </button>
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
    this.popupElement.querySelector(".pp-popup-footer-prev").addEventListener("click", () => this.navigatePopup(-1));
    this.popupElement.querySelector(".pp-popup-footer-next").addEventListener("click", () => this.navigatePopup(1));

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

  getStatusIcon(status) {
    const icons = {
      finished: { icon: CircleCheck, class: "pp-status-finished", label: "Finished" },
      "in-progress": { icon: Clock, class: "pp-status-in-progress", label: "In Progress" },
      abandoned: { icon: CircleX, class: "pp-status-abandoned", label: "Abandoned" },
      archived: { icon: Archive, class: "pp-status-archived", label: "Archived" },
    };
    const entry = icons[status];
    if (!entry) return "";
    const svg = createElement(entry.icon, { size: 14, strokeWidth: 2.5 });
    const svgHtml = svg.outerHTML;
    return `<span class="pp-card-status-icon ${entry.class}" title="${entry.label}">${svgHtml}</span>`;
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

    const statusIcon = this.getStatusIcon(project.status);

    return `
      <div class="pp-card" data-project-index="${originalIndex}" role="button" tabindex="0">
        <div class="pp-card-media">
          ${mediaHtml}
          <div class="pp-card-media-overlay">
            <div class="pp-card-overlay-left">
              ${statusIcon}
              ${project.type ? `<span class="pp-badge pp-badge-type">${this.escapeHTML(project.type)}</span>` : ""}
            </div>
          </div>
        </div>
        <div class="pp-card-body">
          <h3 class="pp-card-title">${this.escapeHTML(project.title)}</h3>
          <p class="pp-card-desc">${this.escapeHTML(project.shortDescription || "")}</p>
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
        <div class="personal-projects-scroll-wrapper">
          <button class="pp-scroll-arrow pp-scroll-arrow-prev" aria-label="Scroll left">&lsaquo;</button>
          <button class="pp-scroll-arrow pp-scroll-arrow-next" aria-label="Scroll right">&rsaquo;</button>
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
        </div>
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
        const filteredIndex = filtered.findIndex(p => this.projects.indexOf(p) === originalIndex);
        this.openPopup(filteredIndex, filtered);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    // Scroll arrows
    const grid = this.element.querySelector(".personal-projects-grid");
    const prevBtn = this.element.querySelector(".pp-scroll-arrow-prev");
    const nextBtn = this.element.querySelector(".pp-scroll-arrow-next");
    if (grid && prevBtn && nextBtn) {
      const updateArrows = () => {
        const canScrollLeft = grid.scrollLeft > 0;
        const canScrollRight = grid.scrollLeft < grid.scrollWidth - grid.clientWidth - 1;
        prevBtn.classList.toggle("visible", canScrollLeft);
        nextBtn.classList.toggle("visible", canScrollRight);
      };

      const getScrollAmount = () => {
        const card = grid.querySelector(".pp-card");
        if (!card) return grid.clientWidth;
        const cardWidth = card.offsetWidth;
        const gap = parseFloat(getComputedStyle(grid).gap) || 0;
        const fullVisible = Math.floor(grid.clientWidth / (cardWidth + gap));
        return Math.max(1, fullVisible) * (cardWidth + gap);
      };

      prevBtn.addEventListener("click", () => {
        grid.scrollBy({ left: -getScrollAmount() });
      });
      nextBtn.addEventListener("click", () => {
        grid.scrollBy({ left: getScrollAmount() });
      });

      grid.addEventListener("scroll", updateArrows, { passive: true });
      updateArrows();
    }
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

    const primaryLanguage = project.languages?.[0];
    const color = languageColors[primaryLanguage] || "#3572A5";

    // Hero image or gradient
    const heroImg = this.popupElement.querySelector(".pp-popup-hero-img");
    if (project.mainImage) {
      heroImg.style.backgroundImage = `url('${this.escapeHTML(project.mainImage)}')`;
      heroImg.style.background = "";
      heroImg.style.backgroundImage = `url('${this.escapeHTML(project.mainImage)}')`;
      heroImg.style.backgroundSize = "cover";
      heroImg.style.backgroundPosition = "center";
    } else {
      heroImg.style.backgroundImage = "";
      heroImg.style.background = `linear-gradient(135deg, ${color} 0%, #131929 100%)`;
    }

    // Clear hero badges
    this.popupElement.querySelector(".pp-popup-hero-badges").innerHTML = "";

    // Content
    const contentArea = this.popupElement.querySelector(".pp-popup-content");

    const hasLinks = project.liveUrl || project.repoUrl;
    const linksHtml = hasLinks ? `
      <div class="pp-popup-links">
        ${project.liveUrl ? `<a href="${this.escapeHTML(project.liveUrl)}" target="_blank" rel="noopener noreferrer" class="pp-btn pp-btn-primary">Live Demo</a>` : ""}
        ${project.repoUrl ? `<a href="${this.escapeHTML(project.repoUrl)}" target="_blank" rel="noopener noreferrer" class="pp-btn pp-btn-outline">Repository</a>` : ""}
      </div>
    ` : "";

    const rawMarkdownContent = project.longDescriptionMarkdown
      ? marked.parse(project.longDescriptionMarkdown)
      : (project.description || "No detailed description available.");
    const markdownContent = DOMPurify.sanitize(rawMarkdownContent);

    const images = project.images || (project.mainImage ? [project.mainImage] : []);
    const galleryHtml = images.length > 1
      ? `<div class="pp-popup-gallery">
          ${images.map(img => `<img src="${this.escapeHTML(img)}" alt="${this.escapeHTML(project.title)}" loading="lazy">`).join("")}
         </div>`
      : "";

    const statusIcon = this.getStatusIcon(project.status);
    const techBadges = [
      ...(project.languages || []),
      ...(project.frameworks || [])
    ].map(tech => `<span class="pp-badge pp-badge-neutral">${this.escapeHTML(tech)}</span>`).join("");

    const metaItems = [
      project.type ? this.escapeHTML(project.type) : "",
      project.year ? this.escapeHTML(project.year) : "",
    ].filter(Boolean).join(" \u00b7 ");

    contentArea.innerHTML = `
      <h2 class="pp-popup-title">${this.escapeHTML(project.title)}</h2>
      ${linksHtml}
      ${galleryHtml}
      <div class="pp-popup-description markdown-content">
        ${markdownContent}
      </div>
      <div class="pp-popup-meta-section">
        <div class="pp-popup-meta-row">
          ${statusIcon}
          ${project.status ? `<span class="pp-popup-meta-status">${this.escapeHTML(this.getStatusLabel(project.status))}</span>` : ""}
          ${metaItems ? `<span class="pp-popup-meta-sep">\u00b7</span><span class="pp-popup-meta-text">${metaItems}</span>` : ""}
        </div>
        ${techBadges ? `<div class="pp-popup-tech-row">${techBadges}</div>` : ""}
      </div>
    `;

    this.popupElement.querySelector(".pp-popup-content-wrapper").scrollTop = 0;

    // Footer navigation labels
    const len = this.currentFilteredProjects.length;
    const prevBtn = this.popupElement.querySelector(".pp-popup-footer-prev");
    const nextBtn = this.popupElement.querySelector(".pp-popup-footer-next");

    if (len <= 1) {
      prevBtn.style.visibility = "hidden";
      nextBtn.style.visibility = "hidden";
    } else {
      const prevIndex = (this.currentProjectIndex - 1 + len) % len;
      const nextIndex = (this.currentProjectIndex + 1) % len;
      prevBtn.style.visibility = "";
      nextBtn.style.visibility = "";
      prevBtn.querySelector(".pp-popup-footer-label").textContent = this.currentFilteredProjects[prevIndex].title;
      nextBtn.querySelector(".pp-popup-footer-label").textContent = this.currentFilteredProjects[nextIndex].title;
    }
  }
}

export function initPersonalProjects(element, locomotiveScroll) {
  if (!element) return;
  new PersonalProjects(element, locomotiveScroll);
}
