export function initTimeline(element, data) {
  if (!element || !data) return;

  const calculateDuration = (dateString) => {
    const [start, end] = dateString.split(" - ");
    const startDate = new Date(start);
    const endDate = end === "Present" ? new Date() : new Date(end);

    // Calculate total months
    let months = (endDate.getFullYear() - startDate.getFullYear()) * 12;
    months -= startDate.getMonth();
    months += endDate.getMonth();
    // Add 1 month to include the starting month
    months += 1;

    let years = Math.floor(months / 12);
    let remainingMonths = months % 12;

    // Rounding logic: 1 month -> 0, 11 months -> 1 year
    if (remainingMonths === 1) {
      remainingMonths = 0;
    } else if (remainingMonths === 11) {
      years += 1;
      remainingMonths = 0;
    }

    let duration = "";
    if (years > 0) {
      duration += `${years} yr${years > 1 ? "s" : ""}`;
    }
    if (remainingMonths > 0) {
      if (years > 0) duration += " & ";
      duration += `${remainingMonths} mo`;
    }

    return `(${duration})`;
  };

  const itemsHtml = data
    .map(
      (item, index) => `
    <div class="timeline-item ${index % 2 === 0 ? "right" : "left"}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h3 class="timeline-title">${item.position}</h3>
        <h4 class="timeline-company">${item.company}</h4>
        <div class="timeline-location">${item.location}</div>
        <div class="timeline-date">${
          item.date
        } <span class="duration">${calculateDuration(item.date)}</span></div>
        <p class="timeline-description">${item.description}</p>
      </div>
    </div>
  `
    )
    .join("");

  element.innerHTML = `
    <div class="timeline-video-container">
      <video class="timeline-video" autoplay muted loop playsinline>
        <source src="/videos/bottom-video.mp4" type="video/mp4">
      </video>
      <div class="timeline-overlay"></div>
    </div>
    <div class="timeline-container">
      <h2 class="section-title">Past Experiences</h2>
      <div class="timeline-line"></div>
      ${itemsHtml}
    </div>
  `;

  // Intersection Observer for animations
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
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

  const items = element.querySelectorAll(".timeline-item");
  items.forEach((item) => observer.observe(item));

  const title = element.querySelector(".section-title");
  if (title) {
    observer.observe(title);
  }
}
