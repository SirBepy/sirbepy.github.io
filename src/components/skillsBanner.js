import "../styles/skillsBanner.css";

export class SkillsBanner {
  constructor(container, data) {
    this.container = container;
    this.rawData = data;
    this.processData();
    this.activeTabId = this.data[0].id; // Default to first tab
    this.init();
  }

  processData() {
    // Create a deep copy of the data to avoid mutating the original
    this.data = JSON.parse(JSON.stringify(this.rawData));

    // Helper to sort projects by year (desc) then length (desc)
    const sortProjects = (projects) => {
      return projects.sort((a, b) => {
        if (b.year !== a.year) {
          return b.year - a.year;
        }
        return b.length - a.length;
      });
    };

    // Calculate project counts and sort projects for specific categories
    this.data.forEach((item) => {
      if (item.projects) {
        item.projectCount = item.projects.length;
        sortProjects(item.projects);
      }
    });

    // Handle Overview pooling and global sorting
    const overview = this.data.find((item) => item.id === "overview");
    if (overview) {
      const webProjects =
        this.data.find((item) => item.id === "web")?.projects || [];
      const mobileProjects =
        this.data.find((item) => item.id === "mobile")?.projects || [];
      const gamedevProjects =
        this.data.find((item) => item.id === "gamedev")?.projects || [];

      // Pool all projects together
      const allProjects = [
        ...webProjects,
        ...mobileProjects,
        ...gamedevProjects,
      ];

      // Sort the entire pool globally by year then length
      overview.projects = sortProjects(allProjects);
      overview.projectCount = overview.projects.length;
    }
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
              
              <div class="skill-details">
                <div class="tech-stack">
                  ${
                    item.frameworks
                      ? `
                    <div class="tech-group">
                      <span class="tech-label">Frameworks:</span>
                      <div class="tech-tags">
                        ${item.frameworks
                          .map(
                            (tech) => `<span class="tech-tag">${tech}</span>`
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    item.languages
                      ? `
                    <div class="tech-group">
                      <span class="tech-label">Languages:</span>
                      <div class="tech-tags">
                        ${item.languages
                          .map(
                            (tech) => `<span class="tech-tag">${tech}</span>`
                          )
                          .join("")}
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
                
                <div class="skill-stats">
                  ${
                    item.projectCount !== undefined
                      ? `
                    <div class="stat-group experience-trigger">
                      <h4>Projects</h4>
                      <div class="stat-value-row">
                        <span class="stat-number">${item.projectCount}</span>
                        <span class="stat-unit">Projects Completed</span>
                      </div>
                      
                      <div class="project-list-tooltip">
                        <div class="tooltip-header">Projects</div>
                        <div class="tooltip-content">
                          ${
                            item.projects
                              ? item.projects
                                  .map(
                                    (proj) => `
                            <div class="project-item">
                              <span class="project-name">${proj.name}</span>
                              <div class="project-item-sub">
                                <span class="project-company">${proj.company}</span>
                                <span class="project-separator">•</span>
                                <span class="project-length">${proj.length} mo</span>
                                <span class="project-separator">•</span>
                                <span class="project-year">${proj.year}</span>
                              </div>
                              <p class="project-item-desc">${proj.description}</p>
                            </div>
                          `
                                  )
                                  .join("")
                              : '<div class="no-projects">No detailed projects listed.</div>'
                          }
                        </div>
                      </div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    item.hackathons !== undefined
                      ? `
                    <div class="stat-group">
                      <h4>Hackathons</h4>
                      <div class="stat-value-row">
                        <span class="stat-number">${item.hackathons}</span>
                        ${
                          item.hackathonNote
                            ? `<span class="won-tag">${item.hackathonNote}</span>`
                            : ""
                        }
                      </div>
                    </div>
                  `
                      : ""
                  }

                  ${
                    item.gamejams !== undefined
                      ? `
                    <div class="stat-group">
                      <h4>Gamejams</h4>
                      <div class="stat-value-row">
                        <span class="stat-number">${item.gamejams}</span>
                      </div>
                    </div>
                  `
                      : ""
                  }
                </div>
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
