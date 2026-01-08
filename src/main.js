import "./styles/main.css";
import "./styles/hero.css";
import "./styles/skills.css";
import "./styles/github.css";
import "./styles/timeline.css";
import "./styles/cursor.css";
import "./styles/footer.css";
import "locomotive-scroll/dist/locomotive-scroll.css";

import { initHero } from "./components/hero.js";
import { initLinks } from "./components/links.js";
import { initCursor } from "./components/cursor.js";
import LocomotiveScroll from "locomotive-scroll";

import { setupSeamlessLoop } from "./utils/video.js";

const appElement = document.querySelector("#app");
appElement.innerHTML = `
  <div class="fixed-backgrounds">
    <div id="bg-hero" class="bg-container"></div>
    <div id="bg-timeline" class="bg-container"></div>
    <div class="global-video-overlay"></div>
  </div>
  <div data-scroll-container>
    <main>
      <section id="hero-section" data-scroll-section></section>
      <section id="skills-section" data-scroll-section>
        <div class="skills-grid"></div>
      </section>
      <section id="timeline-section" data-scroll-section></section>
      <section id="footer-section" data-scroll-section></section>
    </main>
  </div>
`;

import { initSkillsBanner } from "./components/skillsBanner.js";
import { skillsData, timelineData } from "./data/portfolioData.js";
import { initTimeline } from "./components/timeline.js";
import { initFooter } from "./components/footer.js";

// Initialize Backgrounds
setupSeamlessLoop(
  document.querySelector("#bg-hero"),
  "/videos/hero-video.mp4",
  "hero-video",
  1.0
);
setupSeamlessLoop(
  document.querySelector("#bg-timeline"),
  "/videos/bottom-video.mp4",
  "timeline-video",
  1.0
);

// Initialize Locomotive Scroll
const scroll = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  multiplier: 1,
  lerp: 0.1,
});

initHero(document.querySelector("#hero-section"), scroll);
initLinks(document.querySelector("#hero-links"));
initCursor();

const skillsSection = document.querySelector("#skills-section");
skillsSection.innerHTML = "";
const bannerContainer = document.createElement("div");
bannerContainer.className = "skills-banner-container";
bannerContainer.style.maxWidth = "1200px";
bannerContainer.style.margin = "0 auto";
skillsSection.appendChild(bannerContainer);

initSkillsBanner(bannerContainer, skillsData);
initTimeline(document.querySelector("#timeline-section"), timelineData, scroll);
initFooter(document.querySelector("#footer-section"));

const bgHero = document.querySelector("#bg-hero");
const bgTimeline = document.querySelector("#bg-timeline");
const timelineSection = document.querySelector("#timeline-section");
const footerSection = document.querySelector("#footer-section");

const updateVideoClipping = (scrollY) => {
  if (!skillsSection || !bgHero || !bgTimeline) return;

  const viewportHeight = window.innerHeight;

  // Check if timeline or footer sections are in view
  const timelineRect = timelineSection.getBoundingClientRect();
  const footerRect = footerSection.getBoundingClientRect();

  // If timeline or footer is taking up significant viewport space, lock to timeline video
  const timelineInView =
    timelineRect.top < viewportHeight * 0.5 && timelineRect.bottom > 0;
  const footerInView = footerRect.top < viewportHeight && footerRect.bottom > 0;

  if (timelineInView || footerInView) {
    bgHero.style.clipPath = `inset(0 0 100% 0)`;
    bgTimeline.style.clipPath = `inset(0 0 0 0)`;
    return;
  }

  // Get skills banner position relative to viewport
  const skillsRect = skillsSection.getBoundingClientRect();
  const skillsTopInViewport = skillsRect.top;

  // Calculate the split point as a percentage (where skills banner is in viewport)
  // 0% = skills at top of viewport, 100% = skills at bottom of viewport
  const splitPercent = Math.max(
    0,
    Math.min(100, (skillsTopInViewport / viewportHeight) * 100)
  );

  // Hero video: clip from bottom based on split point
  // When split is at 100% (skills at bottom/top of page) = show full hero
  // When split is at 0% (skills at top/scrolled past) = hide hero
  bgHero.style.clipPath = `inset(0 0 ${100 - splitPercent}% 0)`;

  // Timeline video: clip from top based on split point
  // When split is at 100% (top of page) = hide timeline
  // When split is at 0% (scrolled past skills) = show full timeline
  bgTimeline.style.clipPath = `inset(${splitPercent}% 0 0 0)`;
};

scroll.on("scroll", (args) => updateVideoClipping(args.scroll.y));
updateVideoClipping(0);

setTimeout(() => scroll.update(), 100);
setTimeout(() => scroll.update(), 1000);

window.addEventListener("load", () => {
  scroll.update();
});

let resizeTimeout;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    scroll.update();
  }, 150);
});

window.locomotiveScroll = scroll;

console.log("Portfolio app initialized with Locomotive Scroll");
