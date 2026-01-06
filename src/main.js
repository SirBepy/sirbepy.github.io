import "./styles/main.css";
import "./styles/hero.css";
import "./styles/skills.css";
import "./styles/timeline.css";
import "./styles/cursor.css";

import { initHero } from "./components/hero.js";
import { initLinks } from "./components/links.js";
import { initCursor } from "./components/cursor.js";

document.querySelector("#app").innerHTML = `
  <main>
    <section id="hero-section"></section>
    <section id="skills-section">
      <div class="skills-grid"></div>
    </section>
    <section id="timeline-section"></section>
  </main>
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

console.log("Portfolio app initialized");
