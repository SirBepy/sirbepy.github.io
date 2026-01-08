/**
 * FLIP Animation Utility
 * Provides reusable FLIP (First, Last, Invert, Play) animation helpers
 * to eliminate code duplication across components.
 */

// Track active timeouts to prevent race conditions
const activeFlipTimeouts = new WeakMap();

/**
 * Performs a FLIP animation between two elements (typically hero and sticky versions)
 * @param {HTMLElement} heroEl - The element in the hero section
 * @param {HTMLElement} stickyEl - The corresponding element in the sticky header
 * @param {boolean} showSticky - Whether to show the sticky version (true) or hero version (false)
 * @param {number} delay - Delay before starting the animation in milliseconds
 */
export function performFlip(heroEl, stickyEl, showSticky, delay = 0) {
  // Clear any existing timeout for these elements to prevent race conditions
  if (activeFlipTimeouts.has(heroEl))
    clearTimeout(activeFlipTimeouts.get(heroEl));
  if (activeFlipTimeouts.has(stickyEl))
    clearTimeout(activeFlipTimeouts.get(stickyEl));

  // 4. PLAY (Delayed) - Move FLIP calculation inside timeout to capture live positions
  const timeoutId = setTimeout(() => {
    // 1. FIRST: Capture position of the element that is currently visible (RIGHT NOW)
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

    // 3. INVERT: Calculate deltas
    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    // Apply the inverted transform immediately
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
}
