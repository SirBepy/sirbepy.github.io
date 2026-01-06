export const heroContent = {
  name: "Josip Mužić",
  subheading: {
    web: "Web",
    mobile: "Mobile",
    gamedev: "Game Dev",
    experienceStartYear: 2019,
  },
};

export const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/josip-muzic",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>',
  },
  {
    name: "GitHub",
    url: "https://github.com/SirBepy",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>',
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@sirbepy",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>',
  },
  {
    name: "Email",
    url: "mailto:sirbepy@gmail.com",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>',
  },
  {
    name: "Download CV",
    url: "/JosipMuzic_CV.pdf",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
  },
];

export const skillsData = [
  {
    id: "overview",
    title: "Overview",
    description:
      "I am a versatile developer with a passion for building immersive digital experiences. My journey spans from web and mobile development to game design, always aiming to create polished, high-performance applications that delight users.",
    languages: ["JavaScript", "TypeScript", "Dart", "Lua"],
    frameworks: ["React", "Flutter", "Node.js"],
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Specializing in modern web applications using React, Next.js, and Gatsby. I focus on performance, SEO, and creating intuitive user interfaces that work seamlessly across devices.",
    languages: ["JavaScript", "TypeScript", "HTML/CSS"],
    frameworks: ["React", "Next.js", "Gatsby", "TailwindCSS", "Node.js"],
    hackathons: 2,
    projects: [
      {
        name: "KTO Website Redesign",
        company: "KTO",
        length: 12,
        year: 2024,
        description:
          "Led the complete overhaul of the main corporate website using Gatsby and modern SEO practices.",
      },
      {
        name: "Internal Management Tool",
        company: "Best Technology",
        length: 6,
        year: 2022,
        description:
          "Developed a custom dashboard for internal operations with real-time data visualization.",
      },
      {
        name: "E-commerce Platform",
        company: "ArsSacra",
        length: 4,
        year: 2019,
        description:
          "Built a full-stack e-commerce solution with React and Node.js featuring a chat-based purchasing system.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Building cross-platform mobile applications with Flutter. I have experience with complex state management, real-time features, and integrating with various backend services.",
    languages: ["Dart"],
    frameworks: ["Flutter", "Firebase", "GraphQL", "Provider/Riverpod"],
    hackathons: 1,
    hackathonNote: "Even won this one",
    projects: [
      {
        name: "KTO Mobile App",
        company: "KTO",
        length: 18,
        year: 2024,
        description:
          "Developed a cross-platform Flutter app architected to sync seamlessly with the Gatsby web platform.",
      },
      {
        name: "Operations Management App",
        company: "Best Technology",
        length: 5,
        year: 2021,
        description:
          "Built a Flutter app for internal management using GraphQL and Auth0 for secure access.",
      },
      {
        name: "Unisport App",
        company: "Bebabit",
        length: 6,
        year: 2021,
        description:
          "Created a Flutter app for real-time sports tracking and referee management during tournaments.",
      },
    ],
  },
  {
    id: "gamedev",
    title: "Game Development",
    description:
      "Creating engaging games on the Roblox platform using Lua and Roact. My games have reached over 900k visits, featuring custom mechanics and optimized performance.",
    languages: ["Lua"],
    frameworks: ["Roblox API", "Roact", "Rodux"],
    gamejams: 2,
    projects: [
      {
        name: "Shroomshire Restoration",
        company: "Tabs Labs",
        length: 8,
        year: 2025,
        description:
          "Developing a complex restoration simulator on Roblox with custom physics and building mechanics.",
      },
      {
        name: "Mystery Adventure",
        company: "Tabs Labs",
        length: 10,
        year: 2024,
        description:
          "Developed a highly successful Roblox game with over 900k visits and deep player engagement.",
      },
      {
        name: "Game Jam Prototype",
        company: "Solo",
        length: 1,
        year: 2023,
        description:
          "Created a physics-based puzzle game prototype during a 48-hour game jam.",
      },
    ],
  },
];

export const timelineData = [
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
