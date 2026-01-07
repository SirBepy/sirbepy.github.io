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
      "Versatile developer shipping web, mobile, and game projects since 2019. Built high-traffic platforms, cross-platform apps, and games with 900k+ visits.",
    languages: ["JavaScript", "TypeScript", "Dart", "Lua"],
    frameworks: ["React", "Flutter", "Node.js"],
  },
  {
    id: "web",
    title: "Web Development",
    description:
      "Building modern web applications with React, Next.js, and Gatsby. Improved Lighthouse scores by 40+ points, implemented technical SEO strategies, and shipped responsive interfaces for high-traffic platforms.",
    languages: ["JavaScript", "TypeScript", "HTML/CSS"],
    frameworks: [
      "React",
      "Next.js",
      "Gatsby",
      "TailwindCSS",
      "Node.js",
      "Angular",
    ],
    hackathons: 2,
    projects: [
      {
        name: "KTO Website",
        company: "KTO",
        length: 36,
        year: 2022,
        description:
          "Improved Lighthouse performance scores by 40+ points and owned technical SEO strategy for high-traffic betting platform.",
      },
      {
        name: "Unisport Consumer Website",
        company: "Bebabit",
        length: 6,
        year: 2021,
        description:
          "Built real-time sports tracking platform using WebSockets. Recording Croatian university matches for 3+ years with all matches viewable online.",
      },
      {
        name: "Unisport Referee Dashboard",
        company: "Bebabit",
        length: 6,
        year: 2021,
        description:
          "Created referee management system for live play-by-play event tracking. Mentored junior developers and wrote all WebSocket implementation.",
      },
      {
        name: "iRIS Web App",
        company: "Infomedica",
        length: 4,
        year: 2019,
        description:
          "Ported legacy iRIS software to modern web application using Angular. First time learning Angular framework.",
      },
      {
        name: "E-commerce Store",
        company: "ArsSacra",
        length: 4,
        year: 2019,
        description:
          "Built full-stack e-commerce solution with React and Node.js featuring chat-based purchasing system instead of traditional checkout.",
      },
    ],
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description:
      "Cross-platform Flutter apps with complex state management and real-time features. Shipped apps with 5k+ downloads, managed video streaming with chat systems, and integrated GraphQL/Firebase backends.",
    languages: ["Dart"],
    frameworks: ["Flutter", "Firebase", "GraphQL", "Provider/Riverpod"],
    hackathons: 1,
    hackathonNote: "Even won this one",
    projects: [
      {
        name: "Safari Duha",
        company: "Cinnamon Agency",
        length: 6,
        year: 2024,
        isOngoing: true,
        description:
          "Managing complex state across video streaming, real-time chat, journaling, and social features while maintaining performance standards.",
      },
      {
        name: "KTO Mobile App",
        company: "KTO",
        length: 12,
        year: 2024,
        description:
          "Architected seamless data synchronization between Gatsby web platform and Flutter mobile app for cross-platform user experience.",
      },
      {
        name: "Unisport Consumer App",
        company: "Bebabit",
        length: 6,
        year: 2021,
        description:
          "Achieved 5k+ downloads. Real-time sports tracking with play-by-play features, team viewing, competitions, and news.",
      },
      {
        name: "Best Technology IoT Dashboard",
        company: "Best Technology",
        length: 5,
        year: 2021,
        description:
          "Built virtual key management system for hotels and homeowners. Track entrances and easily revoke access for cleaning staff and customers.",
      },
      {
        name: "Bet Contest",
        company: "Cinnamon Agency",
        length: 4,
        year: 2021,
        description:
          "Social betting game with fake money for weekly competitions. Handled high variety of sports and different betting types per sport.",
      },
      {
        name: "Holi Mental Health",
        company: "Cinnamon Agency",
        length: 3,
        year: 2021,
        description:
          "Mood tracking app with biofeedback integration. Performance-optimized animations for B2B mental health platform deployed to employee wellness programs.",
      },
      {
        name: "Hello Bear",
        company: "Cinnamon Agency",
        length: 3,
        year: 2020,
        description:
          "Anonymous messaging safe space with heavy animations. Messages float as paper planes that open when tapped, maintaining smooth performance.",
      },
      {
        name: "Romb Customer Feedback",
        company: "Romb",
        length: 0.25,
        year: 2022,
        description:
          "Customer satisfaction form and club membership signup running on in-store Android devices. Firebase to Google Sheets pipeline for easy management.",
      },
    ],
  },
  {
    id: "gamedev",
    title: "Game Development",
    description:
      "Roblox games built with Lua and Roact. Shipped games with 900k+ visits, developed custom mechanics and progression systems, and managed full development lifecycle with hired artists and composers.",
    languages: ["Lua"],
    frameworks: ["Roblox API", "Roact", "Rodux"],
    gamejams: 2,
    projects: [
      {
        name: "Shroomshire Restoration",
        company: "Tabs Labs",
        length: 8,
        year: 2025,
        isOngoing: true,
        description:
          "Commercially planned adventure tycoon game scheduled for April 2026 release. Managing full development lifecycle including team coordination with hired artists and composers.",
      },
      {
        name: "Find Sahuurs",
        company: "Tabs Labs",
        length: 8,
        year: 2024,
        isOngoing: true,
        description:
          "Achieved 900k+ visits through collectathon gameplay featuring Brainy Broc character from Italy. Each suhoor collectible grants different player abilities.",
      },
      {
        name: "Untitled Castle Game",
        company: "Tabs Labs",
        length: 3,
        year: 2023,
        isOngoing: true,
        description:
          "Story-based puzzle game developed with team of 3. Started 2 years ago, paused, and recently restarted development.",
      },
      {
        name: "Pass the Planets or Die",
        company: "Solo",
        length: 0.1,
        year: 2025,
        description:
          "Goober Game Jam 2025 submission made in one weekend. Celestial hot potato where players fly around passing planets with different boosts before one explodes.",
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
      "Founded solo development company for commercial game development and client projects. Developed multiple Roblox games including one with 900k+ visits. Currently developing Shroomshire Restoration for April 2026 release.",
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
