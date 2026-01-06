import "./styles/main.css";
import "./styles/hero.css";
import "./styles/skills.css";
import "./styles/timeline.css";
import "./styles/cursor.css";
import "locomotive-scroll/dist/locomotive-scroll.css";

import { initHero } from "./components/hero.js";
import { initLinks } from "./components/links.js";
import { initCursor } from "./components/cursor.js";
import LocomotiveScroll from "locomotive-scroll";

const appElement = document.querySelector("#app");
appElement.innerHTML = `
  <div data-scroll-container>
    <main>
      <section id="hero-section" data-scroll-section></section>
      <section id="skills-section" data-scroll-section>
        <div class="skills-grid"></div>
      </section>
      <section id="timeline-section" data-scroll-section></section>
    </main>
  </div>
`;

initHero(document.querySelector("#hero-section"));
initLinks(document.querySelector("#hero-links"));
initCursor();

import { initSkillsBanner } from "./components/skillsBanner.js";
import { skillsData, timelineData } from "./data/portfolioData.js";

const skillsSection = document.querySelector("#skills-section");
// Clear existing content
skillsSection.innerHTML = "";
// Create container for banner
const bannerContainer = document.createElement("div");
bannerContainer.className = "skills-banner-container";
bannerContainer.style.maxWidth = "1200px";
bannerContainer.style.margin = "0 auto";
skillsSection.appendChild(bannerContainer);

initSkillsBanner(bannerContainer, skillsData);

import { initTimeline } from "./components/timeline.js";

initTimeline(document.querySelector("#timeline-section"), timelineData);

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  multiplier: 1,
  lerp: 0.1,
});

// Update scroll on content changes or window resize
window.addEventListener("load", () => {
  scroll.update();
});

console.log("Portfolio app initialized with Locomotive Scroll");
