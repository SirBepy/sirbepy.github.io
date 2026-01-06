import "./styles/main.css";
import "./styles/hero.css";
import "./styles/skills.css";
import "./styles/timeline.css";

import { initHero } from "./components/hero.js";
import { initLinks } from "./components/links.js";
import { createSkillCard } from "./components/skillCard.js";

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

const skillsData = [
  {
    title: "Mobile Development",
    technologies: ["Flutter", "Firebase"],
    projects: [
      {
        name: "Safari Duha",
        description:
          "Flutter app featuring video streaming, real-time chat, journaling, and social features with complex state management.",
        badge: "Current",
      },
      {
        name: "KTO Mobile App",
        image: "/images/kto-app.jpg",
        description:
          "Cross-platform betting app synchronized with web platform. Architected seamless data flow between mobile and web.",
      },
      {
        name: "Unisport",
        image: "/images/unisport-app.png",
        description:
          "Sports tracking app with play-by-play features, team/competition viewing, and real-time updates.",
      },
      {
        name: "Best Technology",
        image: "/images/best-technology.jpg",
        description:
          "Cross-platform Flutter app for web and mobile using GraphQL and Auth0 for internal operations management.",
      },
    ],
  },
  {
    title: "Web Development",
    technologies: ["React", "Next.js", "Gatsby"],
    projects: [
      {
        name: "GoRide",
        image: "/images/goride.png",
        description:
          "Complex React application with large development team. Learned to navigate large codebases and maintain consistency.",
      },
      {
        name: "KTO Web Platform",
        image: "/images/kto.png",
        description:
          "Led multiple redesigns of high-traffic betting platform. Improved Lighthouse scores by 40+ points through optimization.",
      },
      {
        name: "Unisport Dashboard",
        image: "/images/unisport.png",
        description:
          "React PWA allowing referees to track sports events in real-time for mobile app consumption.",
      },
    ],
  },
  {
    title: "Game Development",
    technologies: ["Roblox (Lua)", "Roact"],
    projects: [
      {
        name: "Save Sahur Obby",
        description:
          "Published Roblox game that achieved over 900,000 visits. Features custom mechanics and engaging gameplay.",
        image: "/images/sahur.png",
        badge: "900k+ plays",
      },
      {
        name: "Shroomshire Restoration",
        description:
          "Commercially planned adventure tycoon game launching April 2025. Managing full dev lifecycle including team coordination.",
        image: "/images/shroomshire.png",
        badge: "In Development",
      },
      {
        name: "Twine to Lua Parser",
        image: "/images/twine.png",
        description:
          "JavaScript tool that converts Twine narrative format into Lua scripts for complex dialogue systems in Roblox games.",
      },
    ],
  },
];

const skillsGrid = document.querySelector(".skills-grid");
skillsData.forEach((skill) => {
  skillsGrid.appendChild(createSkillCard(skill));
});

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
