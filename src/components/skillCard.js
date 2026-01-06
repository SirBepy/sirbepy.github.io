import { ProjectCarousel } from "./projectCarousel.js";

export function createSkillCard({ title, technologies, projects }) {
  const card = document.createElement("div");
  card.className = "skill-card";

  const techList = technologies.map((tech) => `<li>${tech}</li>`).join("");

  card.innerHTML = `
    <div class="skill-header">
      <h3>${title}</h3>
      <ul class="tech-list">
        ${techList}
      </ul>
    </div>
    <div class="carousel-mount-point"></div>
  `;

  // Initialize carousel
  const mountPoint = card.querySelector(".carousel-mount-point");
  new ProjectCarousel(mountPoint, projects);

  return card;
}
