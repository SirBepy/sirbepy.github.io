export function initHero(element) {
  if (!element) return;

  const startYear = 2019;
  const currentYear = new Date().getFullYear();
  const yearsOfExperience = currentYear - startYear;

  element.innerHTML = `
    <div class="hero-container">
      <video class="hero-video" autoplay muted loop playsinline>
        <source src="/videos/hero-image.mp4" type="video/mp4">
      </video>
      <div class="hero-content">
        <h1>Hello, I'm <span id="hero-name" style="display: inline-block">Josip Mužić</span></h1>
        <p class="subheading">
          <span class="hero-text-link" data-target="web">Web</span> & 
          <span class="hero-text-link" data-target="mobile">Mobile</span> Developer with ${yearsOfExperience}+ years of experience 
          <br>
          and a <span class="hero-text-link" data-target="gamedev">Game Dev</span> addiction.
        </p>
        
        <div class="hero-nav-buttons">
          <button class="hero-btn" data-target="web">Web Dev</button>
          <button class="hero-btn" data-target="mobile">Mobile Dev</button>
          <button class="hero-btn" data-target="gamedev">Game Dev</button>
        </div>

        <div id="hero-links"></div>
      </div>
    </div>
  `;

  // Attach event listeners to text links
  const links = element.querySelectorAll(".hero-text-link");
  links.forEach((link) => {
    link.addEventListener("click", () => {
      const targetId = link.dataset.target;

      // Scroll to skills section
      const skillsSection = document.querySelector("#skills-section");
      skillsSection.scrollIntoView({ behavior: "smooth" });

      // Dispatch event to switch tab
      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("switch-skill-tab", {
            detail: { tabId: targetId },
          })
        );
      }, 100);
    });
  });

  // Sticky Header Logic
  const stickyHeader = document.createElement("div");
  stickyHeader.id = "sticky-header";
  stickyHeader.innerHTML = `
    <div class="sticky-logo">Josip Mužić</div>
    <div class="sticky-links"></div>
  `;
  document.body.appendChild(stickyHeader);

  // Clone links into sticky header
  // We can reuse initLinks if we import it, or just clone the innerHTML if it's static enough.
  // Since initLinks is imported in main.js, we can't easily call it here without changing signature or imports.
  // Let's just wait for links to be populated in the main DOM, then clone them.
  // Or better, let's just use the same logic to populate it.
  // For simplicity and robustness, let's clone the links container content after a short delay or just grab it.
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

  let isNameSticky = false;
  let stickyLinksState = []; // Track sticky state of each link
  let stickyHeaderTimeout = null;
  const activeFlipTimeouts = new WeakMap();

  // Helper for FLIP animation
  const performFlip = (heroEl, stickyEl, showSticky, delay = 0) => {
    // Clear any existing timeout for these elements to prevent race conditions
    if (activeFlipTimeouts.has(heroEl))
      clearTimeout(activeFlipTimeouts.get(heroEl));
    if (activeFlipTimeouts.has(stickyEl))
      clearTimeout(activeFlipTimeouts.get(stickyEl));

    // 1. FIRST: Capture position of the element that is currently visible
    const firstEl = showSticky ? heroEl : stickyEl;
    const firstRect = firstEl.getBoundingClientRect();

    // 2. LAST: Temporarily toggle states to capture final position
    if (showSticky) {
      stickyEl.classList.add("visible");
      heroEl.classList.add(
        heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
      );
    } else {
      stickyEl.classList.remove("visible");
      heroEl.classList.remove(
        heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
      );
    }

    // Capture position of the element that will be visible
    const lastEl = showSticky ? stickyEl : heroEl;
    const lastRect = lastEl.getBoundingClientRect();

    // REVERT: Immediately revert to initial state so it stays hidden/visible until delay
    if (showSticky) {
      stickyEl.classList.remove("visible");
      heroEl.classList.remove(
        heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
      );
    } else {
      stickyEl.classList.add("visible");
      heroEl.classList.add(
        heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
      );
    }

    // 3. INVERT: Calculate deltas
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    // 4. PLAY (Delayed)
    const timeoutId = setTimeout(() => {
      // Apply final state
      if (showSticky) {
        stickyEl.classList.add("visible");
        heroEl.classList.add(
          heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
        );
      } else {
        stickyEl.classList.remove("visible");
        heroEl.classList.remove(
          heroEl.id === "hero-name" ? "hero-name-hidden" : "hero-link-hidden"
        );
      }

      lastEl.style.transformOrigin = "top left";
      lastEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
      lastEl.style.transition = "none";

      requestAnimationFrame(() => {
        lastEl.offsetHeight; // force reflow
        lastEl.style.transition =
          "transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease";
        lastEl.style.transform = "translate(0, 0) scale(1)";
      });

      activeFlipTimeouts.delete(heroEl);
      activeFlipTimeouts.delete(stickyEl);
    }, delay);

    activeFlipTimeouts.set(heroEl, timeoutId);
    activeFlipTimeouts.set(stickyEl, timeoutId);
  };

  window.addEventListener("scroll", () => {
    if (!heroTitle || !heroName) return;

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
    const nameThreshold = -nameRect.height / 2;
    const shouldNameBeSticky = nameRect.top < nameThreshold;

    if (shouldNameBeSticky && !isNameSticky) {
      isNameSticky = true;
      if (stickyHeaderTimeout) {
        clearTimeout(stickyHeaderTimeout);
        stickyHeaderTimeout = null;
      }
      stickyHeader.classList.add("show-sticky");
      element.classList.add("hide-hero-elements");
      performFlip(heroName, stickyLogo, true);
    } else if (!shouldNameBeSticky && isNameSticky) {
      isNameSticky = false;
      element.classList.remove("hide-hero-elements");
      // Only hide header if no links are sticky either
      if (!stickyLinksState.some((s) => s)) {
        // Delay hiding the header to allow reverse animations to finish
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
      const linkThreshold = -linkRect.height / 2;
      const shouldLinkBeSticky = linkRect.top < linkThreshold;
      const sLink = stickyLinks[index];

      if (shouldLinkBeSticky && !stickyLinksState[index]) {
        stickyLinksState[index] = true;
        if (stickyHeaderTimeout) {
          clearTimeout(stickyHeaderTimeout);
          stickyHeaderTimeout = null;
        }
        stickyHeader.classList.add("show-sticky");
        if (sLink) performFlip(link, sLink, true, index * 150);
      } else if (!shouldLinkBeSticky && stickyLinksState[index]) {
        stickyLinksState[index] = false;
        // Only hide header if name is not sticky and no other links are sticky
        if (!isNameSticky && !stickyLinksState.some((s) => s)) {
          // Delay hiding the header to allow reverse animations to finish
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

    // Parallax effect
    const scrollY = window.scrollY;
    // video.style.transform = `translateY(-${scrollY * 0.2}px)`;
  });
}
