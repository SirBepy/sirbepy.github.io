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
        <h1>Hello, I'm Josip Mužić</h1>
        <p class="subheading">
          <span class="hero-text-link" data-target="web">Web</span> & 
          <span class="hero-text-link" data-target="mobile">Mobile</span> Developer with ${yearsOfExperience}+ years of experience 
          <br>
          and a <span class="hero-text-link" data-target="gamedev">Game Dev</span> addiction.
        </p>
        
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
  window.addEventListener("scroll", () => {
    // Since video is fixed, we don't need to move it much.
    // But to give a "slow scroll" feel (moving up slowly), we translate it up.
    // video is fixed at top:0. Content moves up at 1x.
    // If we want video to move up at 0.2x, we translate Y by -scrollY * 0.2
    const scrollY = window.scrollY;
    video.style.transform = `translateY(-${scrollY * 0.2}px)`;
  });
}
