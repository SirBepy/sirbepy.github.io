import "../styles/skillsBanner.css";

export class SkillsBanner {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.activeTabId = data[0].id; // Default to first tab
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();

    // Listen for external switch events
    document.addEventListener("switch-skill-tab", (e) => {
      this.switchTab(e.detail.tabId);
    });
  }

  render() {
    this.container.innerHTML = `
      <div class="skills-banner">
        <div class="skills-tabs">
          ${this.data
            .map(
              (item) => `
            <div class="skill-tab ${
              item.id === this.activeTabId ? "active" : ""
            }" 
                 data-id="${item.id}">
              ${item.title}
            </div>
          `
            )
            .join("")}
        </div>
        <div class="skills-content">
          ${this.data
            .map(
              (item) => `
            <div class="skill-content-panel ${
              item.id === this.activeTabId ? "active" : ""
            }" 
                 data-id="${item.id}">
              <h2 class="skill-title">${item.title}</h2>
              <p class="skill-description">${item.description}</p>
              
              <div class="skill-stats">
                ${
                  item.technologies
                    ? `
                  <div class="stat-group">
                    <h4>Technologies</h4>
                    <div class="tech-tags">
                      ${item.technologies
                        .map((tech) => `<span class="tech-tag">${tech}</span>`)
                        .join("")}
                    </div>
                  </div>
                `
                    : ""
                }
                
                ${
                  item.projectCount !== undefined
                    ? `
                  <div class="stat-group">
                    <h4>Experience</h4>
                    <div>
                      <span class="project-count">${item.projectCount}</span>
                      <span class="project-count-label">Projects Completed</span>
                    </div>
                  </div>
                `
                    : ""
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  attachEvents() {
    const tabs = this.container.querySelectorAll(".skill-tab");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabId = tab.dataset.id;
        this.switchTab(tabId);
      });
    });
  }

  switchTab(tabId) {
    if (this.activeTabId === tabId) return;

    // Update state
    this.activeTabId = tabId;

    // Update UI
    const tabs = this.container.querySelectorAll(".skill-tab");
    const panels = this.container.querySelectorAll(".skill-content-panel");

    tabs.forEach((tab) => {
      if (tab.dataset.id === tabId) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    panels.forEach((panel) => {
      if (panel.dataset.id === tabId) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    });
  }
}

export function initSkillsBanner(element, data) {
  if (!element) return;
  new SkillsBanner(element, data);
}
