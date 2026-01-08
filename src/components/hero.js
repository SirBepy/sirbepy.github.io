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
        <h1>Hello, I'm <span id="hero-name" class="underline-hover" style="display: inline-block">${heroContent.name}</span></h1>
        <p class="subheading">
          <span class="hero-text-link underline-hover" data-target="web">${heroContent.subheading.web}</span> &
          <span class="hero-text-link underline-hover" data-target="mobile">${heroContent.subheading.mobile}</span> Developer with ${yearsOfExperience}+ years of experience
          <br>
          and a <span class="hero-text-link underline-hover" data-target="gamedev">${heroContent.subheading.gamedev}</span> addiction.
        </p>

        <div id="hero-links"></div>
      </div>
    </div>
  `;

  const scrollToSkillsCenter = (targetTabId) => {
    const skillsSection = document.querySelector("#skills-section");
    if (!skillsSection) return;

    const viewportHeight = window.innerHeight;
    const skillsRect = skillsSection.getBoundingClientRect();
    const skillsAbsoluteTop = skillsRect.top + window.scrollY;
    const skillsHeight = skillsRect.height;

    const centeredScrollPosition =
      skillsAbsoluteTop - (viewportHeight - skillsHeight) / 2;

    locomotiveScroll.scrollTo(centeredScrollPosition);

    setTimeout(() => {
      document.dispatchEvent(
        new CustomEvent("switch-skill-tab", {
          detail: { tabId: targetTabId },
        })
      );
    }, 100);
  };

  const links = element.querySelectorAll(".hero-text-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.target;
      scrollToSkillsCenter(targetId);
    });
  });

  const stickyHeader = document.createElement("div");
  stickyHeader.id = "sticky-header";
  stickyHeader.innerHTML = `
    <div class="sticky-logo underline-hover">${heroContent.name}</div>
    <div class="sticky-links"></div>
  `;
  document.body.appendChild(stickyHeader);

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

  heroName.addEventListener("click", () => {
    scrollToSkillsCenter("overview");
  });

  stickyLogo.addEventListener("click", () => {
    locomotiveScroll.scrollTo(0);
  });

  let lastScrollY = 0;
  let isNameSticky = false;
  let stickyLinksState = [];
  let stickyHeaderTimeout = null;

  const handleScroll = (args) => {
    if (!heroTitle || !heroName) return;

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

    if (stickyLinksState.length === 0 && heroLinks.length > 0) {
      stickyLinksState = new Array(heroLinks.length).fill(false);
    }

    const nameOffsetInSection = heroName.offsetTop;
    const nameAbsolutePosition = nameOffsetInSection;

    const nameVisibleThreshold = 100;
    const hasScrolledPastName =
      currentScrollY > nameAbsolutePosition + nameVisibleThreshold;
    const isNameVisible =
      currentScrollY < nameAbsolutePosition + nameVisibleThreshold;

    if (isScrollingDown && hasScrolledPastName && !isNameSticky) {
      isNameSticky = true;
      if (stickyHeaderTimeout) {
        clearTimeout(stickyHeaderTimeout);
        stickyHeaderTimeout = null;
      }
      stickyHeader.classList.add("show-sticky");
      element.classList.add("hide-hero-elements");
      performFlip(heroName, stickyLogo, true);
    } else if (!isScrollingDown && isNameVisible && isNameSticky) {
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

    heroLinks.forEach((link, index) => {
      const linkOffsetInSection = link.offsetTop;
      const linkAbsolutePosition = linkOffsetInSection;
      const linkVisibleThreshold = 100;
      const hasScrolledPastLink =
        currentScrollY > linkAbsolutePosition + linkVisibleThreshold;
      const isLinkVisible =
        currentScrollY < linkAbsolutePosition + linkVisibleThreshold;
      const sLink = stickyLinks[index];

      if (isScrollingDown && hasScrolledPastLink && !stickyLinksState[index]) {
        stickyLinksState[index] = true;
        if (stickyHeaderTimeout) {
          clearTimeout(stickyHeaderTimeout);
          stickyHeaderTimeout = null;
        }
        stickyHeader.classList.add("show-sticky");
        if (sLink) performFlip(link, sLink, true, index * 150);
      } else if (!isScrollingDown && isLinkVisible && stickyLinksState[index]) {
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

  if (locomotiveScroll) {
    locomotiveScroll.on("scroll", handleScroll);
  } else {
    window.addEventListener("scroll", handleScroll);
  }
}
