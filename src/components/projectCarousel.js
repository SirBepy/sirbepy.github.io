export class ProjectCarousel {
  constructor(container, projects) {
    this.container = container;
    this.projects = projects;
    this.currentIndex = 0;
    this.init();
  }

  init() {
    this.render();
    this.attachEvents();
  }

  render() {
    if (!this.projects || this.projects.length === 0) return;

    const slides = this.projects
      .map(
        (project, index) => `
      <div class="project-card ${
        index === 0 ? "active" : ""
      }" data-index="${index}">
        <div class="project-info">
          <h4 class="project-name">
            ${project.name}
            ${
              project.badge
                ? `<span class="project-badge">${project.badge}</span>`
                : ""
            }
          </h4>
        </div>
        <div class="project-image-container">
          ${
            project.image
              ? `<img src="${project.image}" alt="${project.name}" class="project-image">`
              : `<div class="project-placeholder" style="background-color: ${this.getRandomColor(
                  index
                )}">
                  <span>${project.name.charAt(0)}</span>
                </div>`
          }
          <div class="project-overlay">
            <p class="project-description">${project.description}</p>
          </div>
        </div>
      </div>
    `
      )
      .join("");

    const navigation =
      this.projects.length > 1
        ? `
      <div class="carousel-nav">
        <button class="nav-btn prev" aria-label="Previous project">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div class="nav-dots">
          ${this.projects
            .map(
              (_, i) =>
                `<span class="nav-dot ${
                  i === 0 ? "active" : ""
                }" data-index="${i}"></span>`
            )
            .join("")}
        </div>
        <button class="nav-btn next" aria-label="Next project">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `
        : "";

    this.container.innerHTML = `
      <div class="carousel-wrapper">
        <div class="carousel-track">
          ${slides}
        </div>
        ${navigation}
      </div>
    `;

    this.track = this.container.querySelector(".carousel-track");
    this.dots = this.container.querySelectorAll(".nav-dot");
  }

  getRandomColor(index) {
    const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];
    return colors[index % colors.length];
  }

  attachEvents() {
    if (this.projects.length <= 1) return;

    const prevBtn = this.container.querySelector(".prev");
    const nextBtn = this.container.querySelector(".next");
    const dots = this.container.querySelectorAll(".nav-dot");

    prevBtn.addEventListener("click", () => this.prev());
    nextBtn.addEventListener("click", () => this.next());

    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const index = parseInt(e.target.dataset.index);
        this.goTo(index);
      });
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    this.container.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    this.container.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      },
      { passive: true }
    );
  }

  handleSwipe() {
    if (touchStartX - touchEndX > 50) {
      this.next();
    }
    if (touchEndX - touchStartX > 50) {
      this.prev();
    }
  }

  update() {
    // Update track position
    const offset = -(this.currentIndex * 100);
    this.track.style.transform = `translateX(${offset}%)`;

    // Update dots
    if (this.dots) {
      this.dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === this.currentIndex);
      });
    }
  }

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    this.update();
  }

  prev() {
    this.currentIndex =
      (this.currentIndex - 1 + this.projects.length) % this.projects.length;
    this.update();
  }

  goTo(index) {
    this.currentIndex = index;
    this.update();
  }
}
