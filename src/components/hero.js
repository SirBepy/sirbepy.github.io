import { heroContent } from "../data/portfolioData.js";
import { performFlip } from "../utils/flipAnimation.js";

export function initHero(element, locomotiveScroll) {
  if (!element) return;

  const startYear = heroContent.subheading.experienceStartYear;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;

  element.innerHTML = `
    <div class="hero-container">
      <div class="hero-content">
        <h1>Hello, I'm <span id="hero-name" style="display: inline-block">${heroContent.name}</span></h1>
        <p class="subheading">
          <span class="hero-text-link" data-target="web">${heroContent.subheading.web}</span> & 
          <span class="hero-text-link" data-target="mobile">${heroContent.subheading.mobile}</span> Developer with ${yearsOfExperience}+ years of experience 
          <br>
          and a <span class="hero-text-link" data-target="gamedev">${heroContent.subheading.gamedev}</span> addiction.
        </p>
        
        <div class="hero-nav-buttons">
          <button class="hero-btn" data-target="web">${heroContent.subheading.web} Dev</button>
          <button class="hero-btn" data-target="mobile">${heroContent.subheading.mobile} Dev</button>
          <button class="hero-btn" data-target="gamedev">${heroContent.subheading.gamedev} Dev</button>
        </div>

        <div id="hero-links"></div>
      </div>
    </div>
  `;

  // Helper function to scroll to skills section and center it vertically
  const scrollToSkillsCenter = (targetTabId) => {
    const skillsSection = document.querySelector("#skills-section");
    if (!skillsSection) return;

    // Get current scroll position and viewport height
    const viewportHeight = window.innerHeight;

    // Get skills section dimensions and position
    const skillsRect = skillsSection.getBoundingClientRect();
    const skillsAbsoluteTop = skillsRect.top + window.scrollY;
    const skillsHeight = skillsRect.height;

    // Calculate the scroll position that centers the skills section
    const centeredScrollPosition = skillsAbsoluteTop - (viewportHeight - skillsHeight) / 2;

    // Scroll to the centered position
    locomotiveScroll.scrollTo(centeredScrollPosition);

    // Dispatch event to switch tab
    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("switch-skill-tab", {
          detail: { tabId: targetTabId },
        })
      );
    }, 100);
  };

  // Attach event listeners to text links
  const links = element.querySelectorAll(".hero-text-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.target;
      scrollToSkillsCenter(targetId);
    });
  });

  // Attach event listeners to buttons
  const buttons = element.querySelectorAll(".hero-btn");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.dataset.target;
      scrollToSkillsCenter(targetId);
    });
  });

  // Sticky Header Logic
  const stickyHeader = document.createElement("div");
  stickyHeader.id = "sticky-header";
  stickyHeader.innerHTML = `
    <div class="sticky-logo">${heroContent.name}</div>
    <div class="sticky-links"></div>
  `;
  document.body.appendChild(stickyHeader);

  // Clone links into sticky header
  setTimeout(() => {
    const originalLinks = element.querySelector(".links-container");
    if (originalLinks) {
      const stickyLinksContainer = stickyHeader.querySelector(".sticky-links");
      stickyLinksContainer.innerHTML = originalLinks.innerHTML;
    }
  }, 100);

  const heroTitle = element.querySelector("h1");
  const heroName = element.querySelector("#hero-name");
  const heroLinksContainer = element.querySelector("#hero-links");

  const stickyLogo = stickyHeader.querySelector(".sticky-logo");
  const stickyLinksContainer = stickyHeader.querySelector(".sticky-links");

  // Add click handler for hero name
  heroName.addEventListener("click", () => {
    scrollToSkillsCenter("overview");
  });

  // Add click handler for sticky logo
  stickyLogo.addEventListener("click", () => {
    locomotiveScroll.scrollTo(0);
  });

  let lastScrollY = 0;
  let isNameSticky = false;
  let stickyLinksState = []; // Track sticky state of each link
  let stickyHeaderTimeout = null;

  // Use Locomotive Scroll's scroll event instead of native window scroll
  const handleScroll = (args) => {
    if (!heroTitle || !heroName) return;

    // Handle both Locomotive args and native scroll events
    const currentScrollY = args && args.scroll ? args.scroll.y : window.scrollY;
    const isScrollingDown = currentScrollY > lastScrollY;
    lastScrollY = currentScrollY;

    const heroLinksInner = heroLinksContainer.querySelector(".links-container");
    const heroLinks = heroLinksInner
      ? Array.from(heroLinksInner.querySelectorAll(".social-link"))
      : [];
    const stickyLinks = Array.from(
      stickyLinksContainer.querySelectorAll(".social-link")
    );

    // Initialize state if needed
    if (stickyLinksState.length === 0 && heroLinks.length > 0) {
      stickyLinksState = new Array(heroLinks.length).fill(false);
    }

    // 1. Handle Name Sticky State
    const nameRect = heroName.getBoundingClientRect();
    // Threshold for when the name is considered "at the top" (near its original position)
    const nameThreshold = 100; // Buffer zone near top
    const isNearTop = currentScrollY < nameThreshold;

    if (isScrollingDown && nameRect.top < 0 && !isNameSticky) {
      // Show sticky header when scrolling DOWN past the hero name
      isNameSticky = true;
      if (stickyHeaderTimeout) {
        clearTimeout(stickyHeaderTimeout);
        stickyHeaderTimeout = null;
      }
      stickyHeader.classList.add("show-sticky");
      element.classList.add("hide-hero-elements");
      performFlip(heroName, stickyLogo, true);
    } else if (!isScrollingDown && isNearTop && isNameSticky) {
      // Hide sticky header ONLY when scrolling UP and near the top
      isNameSticky = false;
      element.classList.remove("hide-hero-elements");
      if (!stickyLinksState.some((s) => s)) {
        const maxDelay = (heroLinks.length - 1) * 150 + 200;
        if (stickyHeaderTimeout) clearTimeout(stickyHeaderTimeout);
        stickyHeaderTimeout = setTimeout(() => {
          stickyHeader.classList.remove("show-sticky");
          stickyHeaderTimeout = null;
        }, maxDelay);
      }
      performFlip(heroName, stickyLogo, false);
    }

    // 2. Handle Individual Links Sticky State
    heroLinks.forEach((link, index) => {
      const linkRect = link.getBoundingClientRect();
      const shouldLinkBeSticky = linkRect.top < 0;
      const sLink = stickyLinks[index];

      if (isScrollingDown && shouldLinkBeSticky && !stickyLinksState[index]) {
        // Show link
        stickyLinksState[index] = true;
        if (stickyHeaderTimeout) {
          clearTimeout(stickyHeaderTimeout);
          stickyHeaderTimeout = null;
        }
        stickyHeader.classList.add("show-sticky");
        if (sLink) performFlip(link, sLink, true, index * 150);
      } else if (!isScrollingDown && isNearTop && stickyLinksState[index]) {
        // Hide link only when scrolling back to top
        stickyLinksState[index] = false;
        if (!isNameSticky && !stickyLinksState.some((s) => s)) {
          const maxDelay = (heroLinks.length - 1) * 150 + 1000;
          if (stickyHeaderTimeout) clearTimeout(stickyHeaderTimeout);
          stickyHeaderTimeout = setTimeout(() => {
            stickyHeader.classList.remove("show-sticky");
            stickyHeaderTimeout = null;
          }, maxDelay);
        }
        if (sLink)
          performFlip(link, sLink, false, (heroLinks.length - 1 - index) * 150);
      }
    });
  };

  // Listen to Locomotive Scroll events if available, otherwise fallback to native scroll
  if (locomotiveScroll) {
    locomotiveScroll.on("scroll", handleScroll);
  } else {
    window.addEventListener("scroll", handleScroll);
  }
}
