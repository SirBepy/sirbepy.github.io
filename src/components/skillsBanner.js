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
      const web = this.data.find((item) => item.id === "web");
      const mobile = this.data.find((item) => item.id === "mobile");
      const gamedev = this.data.find((item) => item.id === "gamedev");

      const webProjects = web?.projects || [];
      const mobileProjects = mobile?.projects || [];
      const gamedevProjects = gamedev?.projects || [];

      // Pool all projects together
      const allProjects = [
        ...webProjects,
        ...mobileProjects,
        ...gamedevProjects,
      ];

      // Sort the entire pool globally by year then length
      overview.projects = sortProjects(allProjects);
      overview.projectCount = overview.projects.length;

      // Calculate total hackathons and gamejams
      let totalHackathons = 0;
      if (web?.hackathons) totalHackathons += web.hackathons;
      if (mobile?.hackathons) totalHackathons += mobile.hackathons;
      if (gamedev?.gamejams) totalHackathons += gamedev.gamejams;

      if (totalHackathons > 0) {
        overview.hackathons = totalHackathons;
      }
    }
  }

  init() {
    this.render();
    this.attachEvents();
    this.attachScrollLock();

    // Initialize GitHub contributions if overview is active
    if (this.activeTabId === "overview") {
      this.initializeGithubContributions();
    }

    // Listen for external switch events
    document.addEventListener("switch-skill-tab", (e) => {
      this.switchTab(e.detail.tabId);
    });
  }

  initializeGithubContributions() {
    const githubContainer = document.getElementById("overview-github-container");
    if (githubContainer && !githubContainer.hasChildNodes()) {
      import("./github.js").then(({ initGithub }) => {
        initGithub(githubContainer, "SirBepy");
      });
    }
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
              ${
                item.id === "overview"
                  ? this.renderOverviewPanel(item)
                  : this.renderRegularPanel(item)
              }
            </div>
          `
            )
            .join("")}
        </div>
      </div>
    `;
  }

  renderOverviewPanel(item) {
    return `
      <div class="skill-panel-layout overview-layout">
        <h2 class="skill-title">${item.title}</h2>
        <div class="overview-content-row">
          <p class="skill-description">${item.description}</p>
          <div class="overview-stats">
            ${
              item.projectCount !== undefined
                ? `
              <div class="stat-group">
                <span class="tech-label">Projects:</span>
                <div class="stat-value-row">
                  <span class="stat-number">${item.projectCount}</span>
                </div>
              </div>
            `
                : ""
            }
            ${
              item.hackathons !== undefined
                ? `
              <div class="stat-group">
                <span class="tech-label">Hackathons:</span>
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
          </div>
        </div>
        <div class="overview-github-row">
          <div id="overview-github-container"></div>
        </div>
      </div>
    `;
  }

  renderRegularPanel(item) {
    return `
      <div class="skill-panel-layout">
        <div class="skill-info-column">
          <h2 class="skill-title">${item.title}</h2>
          <p class="skill-description">${item.description}</p>

          <div class="tech-stack">
            ${
              item.frameworks
                ? `
              <div class="tech-group">
                <span class="tech-label">Frameworks:</span>
                <div class="tech-tags">
                  ${item.frameworks
                    .map((tech) => `<span class="tech-tag">${tech}</span>`)
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
                    .map((tech) => `<span class="tech-tag">${tech}</span>`)
                    .join("")}
                </div>
              </div>
            `
                : ""
            }
          </div>

          ${
            item.hackathons !== undefined || item.gamejams !== undefined
              ? `
            <div class="skill-stats">
              ${
                item.hackathons !== undefined
                  ? `
                <div class="stat-group">
                  <span class="tech-label">Hackathons:</span>
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
                  <span class="tech-label">Gamejams:</span>
                  <div class="stat-value-row">
                    <span class="stat-number">${item.gamejams}</span>
                  </div>
                </div>
              `
                  : ""
              }
            </div>
          `
              : ""
          }
        </div>

        ${
          item.projectCount !== undefined
            ? `
          <div class="skill-projects-column">
            <div class="projects-header">
              <h3>Projects: ${item.projectCount}</h3>
            </div>
            <div class="projects-list">
              ${
                item.projects
                  ? item.projects
                      .map(
                        (proj) => `
                  <div class="project-card">
                    <div class="project-card-header">
                      <span class="project-name">${proj.name}</span>
                      ${
                        proj.isOngoing
                          ? '<span class="ongoing-badge">Ongoing</span>'
                          : ""
                      }
                    </div>
                    <div class="project-meta">
                      <span class="project-company">${proj.company}</span>
                      <span class="project-separator">•</span>
                      <span class="project-length">${
                        proj.length < 1
                          ? `${Math.round(proj.length * 4)} week${
                              Math.round(proj.length * 4) !== 1 ? "s" : ""
                            }`
                          : `${proj.length} mo`
                      }</span>
                      <span class="project-separator">•</span>
                      <span class="project-year">${proj.year}</span>
                    </div>
                    <p class="project-description">${proj.description}</p>
                  </div>
                `
                      )
                      .join("")
                  : '<div class="no-projects">No detailed projects listed.</div>'
              }
            </div>
          </div>
        `
            : ""
        }
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

  attachScrollLock() {
    const projectsLists = this.container.querySelectorAll(".projects-list");

    projectsLists.forEach((list) => {
      list.addEventListener(
        "wheel",
        (e) => {
          const delta = e.deltaY;
          const scrollTop = list.scrollTop;
          const scrollHeight = list.scrollHeight;
          const clientHeight = list.clientHeight;

          // Prevent scrolling the page when scrolling within the projects list
          if (
            (delta < 0 && scrollTop === 0) || // Scrolling up at the top
            (delta > 0 && scrollTop + clientHeight >= scrollHeight) // Scrolling down at the bottom
          ) {
            e.preventDefault();
          }

          // Always stop propagation to prevent page scroll
          e.stopPropagation();
        },
        { passive: false }
      );
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

    // Initialize GitHub contributions when switching to overview
    if (tabId === "overview") {
      this.initializeGithubContributions();
    }
  }
}

export function initSkillsBanner(element, data) {
  if (!element) return;
  new SkillsBanner(element, data);
}
