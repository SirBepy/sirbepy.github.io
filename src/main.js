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

const skillsData = [
  {
    id: "overview",
    title: "Overview",
    description:
      "I am a versatile developer with a passion for building immersive digital experiences. My journey spans from web and mobile development to game design, always aiming to create polished, high-performance applications that delight users.",
    languages: ["JavaScript", "TypeScript", "Dart", "Lua"],
    frameworks: ["React", "Flutter", "Node.js"],
    projectCount: 15,
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Specializing in modern web applications using React, Next.js, and Gatsby. I focus on performance, SEO, and creating intuitive user interfaces that work seamlessly across devices.",
    languages: ["JavaScript", "TypeScript", "HTML/CSS"],
    frameworks: ["React", "Next.js", "Gatsby", "TailwindCSS", "Node.js"],
    projectCount: 8,
    hackathons: 2,
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Building cross-platform mobile applications with Flutter. I have experience with complex state management, real-time features, and integrating with various backend services.",
    languages: ["Dart"],
    frameworks: ["Flutter", "Firebase", "GraphQL", "Provider/Riverpod"],
    projectCount: 4,
    hackathons: 1,
    hackathonNote: "Even won this one",
  },
  {
    id: "gamedev",
    title: "Game Development",
    description:
      "Creating engaging games on the Roblox platform using Lua and Roact. My games have reached over 900k visits, featuring custom mechanics and optimized performance.",
    languages: ["Lua"],
    frameworks: ["Roblox API", "Roact", "Rodux"],
    projectCount: 3,
    gamejams: 2,
  },
];

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

const timelineData = [
  {
    company: "Tabs Labs",
    position: "Software Developer",
    date: "February 2025 - Present",
    location: "Zagreb",
    description:
      "Founded solo development company for commercial game development and client projects. Developed multiple Roblox games including one with 900k+ visits. Currently developing Shroomshire Restoration for April 2025 release.",
  },
  {
    company: "KTO",
    position: "Gatsby Developer",
    date: "March 2022 - February 2025",
    location: "Remote",
    description:
      "Led multiple web app redesigns, improved Lighthouse scores by 40+ points. Architected data synchronization between Gatsby web and Flutter mobile app. Owned technical SEO strategy.",
  },
  {
    company: "Best Technology",
    position: "Flutter Developer",
    date: "October 2021 - March 2022",
    location: "Zagreb",
    description:
      "Solo-developed cross-platform Flutter app for web and mobile using GraphQL and Auth0 for internal operations management. Contributed to UI/UX design.",
  },
  {
    company: "Bebabit",
    position: "Full-Stack Developer",
    date: "June 2021 - December 2021",
    location: "Zagreb",
    description:
      "Led team for Unisport project. Developed React dashboard for referees and Flutter app with play-by-play features. Provided Node.js backend support.",
  },
  {
    company: "Cinnamon Agency",
    position: "Frontend Developer",
    date: "May 2020 - May 2021",
    location: "Zagreb",
    description:
      "Contributed to large-scale applications in Flutter/React/Next.js. Solo-developed 3 apps: Flutter, Vanilla JS, and WordPress.",
  },
  {
    company: "RIT Croatia",
    position: "Web and Mobile Computing Tutor",
    date: "September 2019 - May 2020",
    location: "Zagreb",
    description:
      "Selected to tutor programming subjects with consistently fully-booked sessions. Continued unofficial tutoring for years due to teaching effectiveness.",
  },
  {
    company: "Infomedica",
    position: "Frontend Developer",
    date: "May 2019 - September 2019",
    location: "Split",
    description: "Ported iRIS software into web app using Angular.",
  },
  {
    company: "ArsSacra",
    position: "Full-Stack Developer",
    date: "January 2019 - May 2019",
    location: "Međugorje",
    description:
      "Built e-commerce store using React and Node.js with chat-based purchasing system.",
  },
];

initTimeline(document.querySelector("#timeline-section"), timelineData);

console.log("Portfolio app initialized");
