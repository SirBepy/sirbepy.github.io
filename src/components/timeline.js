import { setupSeamlessLoop } from "../utils/video.js";
import { calculateDuration } from "../utils/dateHelpers.js";

export function initTimeline(element, data, locomotiveScroll) {
  if (!element || !data) return;

  const itemsHtml = data
    .map(
      (item, index) => `
    <div class="timeline-item ${index % 2 === 0 ? "right" : "left"}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3 class="timeline-title">${item.position}</h3>
        <h4 class="timeline-company">${item.company}</h4>
        <div class="timeline-location">${item.location}</div>
        <div class="timeline-date">${
          item.date
        } <span class="duration">${calculateDuration(item.date)}</span></div>
        <p class="timeline-description">${item.description}</p>
      </div>
    </div>
  `
    )
    .join("");

  element.innerHTML = `
    <div class="timeline-container">
      <h2 class="section-title">Past Experiences</h2>
      <div class="timeline-line"></div>
      ${itemsHtml}
    </div>
  `;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        const isBelowViewport = entry.boundingClientRect.top > 0;
        if (isBelowViewport) {
          entry.target.classList.remove("visible");
        }
      }
    });
  }, observerOptions);

  const items = element.querySelectorAll(".timeline-item");
  items.forEach((item) => observer.observe(item));

  const title = element.querySelector(".section-title");
  if (title) {
    observer.observe(title);
  }
}
