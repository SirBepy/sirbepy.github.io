export function initGithub(element, username) {
  if (!element || !username) return;

  element.innerHTML = `
    <a
      href="https://github.com/${username}"
      target="_blank"
      rel="noopener noreferrer"
      class="github-card"
    >
      <div class="github-chart-wrapper">
        <div class="github-contributions-title">Last 50 weeks of Github Contributions</div>
        <img
          src="https://ssr-contributions-svg.vercel.app/_/${username}?chart=calendar&flatten=2&weeks=50&format=svg&dark=true&colors=ee75f412,ee75f455,ee75f4aa,ee75f4dd,ee75f4ff"
          alt="GitHub Contribution Calendar"
          class="github-chart"
          loading="eager"
        />
      </div>
      <span class="github-tooltip">Visit GitHub Profile</span>
    </a>
  `;

  // Update Locomotive Scroll after image loads
  const img = element.querySelector(".github-chart");
  if (img) {
    img.addEventListener("load", () => {
      if (window.locomotiveScroll) {
        window.locomotiveScroll.update();
      }
    });
    // If image is already cached/loaded
    if (img.complete) {
      if (window.locomotiveScroll) {
        window.locomotiveScroll.update();
      }
    }
  }

  // Fade in animation on scroll
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        const isBelowViewport = entry.boundingClientRect.top > 0;
        if (isBelowViewport) {
          entry.target.classList.remove("visible");
        }
      }
    });
  }, observerOptions);

  const card = element.querySelector(".github-card");
  if (card) observer.observe(card);
}
