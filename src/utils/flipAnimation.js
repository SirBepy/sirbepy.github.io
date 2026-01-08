const activeFlipTimeouts = new WeakMap();

export function performFlip(heroEl, stickyEl, showSticky, delay = 0) {
  if (activeFlipTimeouts.has(heroEl))
    clearTimeout(activeFlipTimeouts.get(heroEl));
  if (activeFlipTimeouts.has(stickyEl))
    clearTimeout(activeFlipTimeouts.get(stickyEl));

  const timeoutId = setTimeout(() => {
    const firstEl = showSticky ? heroEl : stickyEl;
    const firstRect = firstEl.getBoundingClientRect();

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

    const lastEl = showSticky ? stickyEl : heroEl;
    const lastRect = lastEl.getBoundingClientRect();

    const deltaX = firstRect.left - lastRect.left;
    const deltaY = firstRect.top - lastRect.top;
    const scaleX = firstRect.width / lastRect.width;
    const scaleY = firstRect.height / lastRect.height;

    lastEl.style.transformOrigin = "top left";
    lastEl.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${scaleX}, ${scaleY})`;
    lastEl.style.transition = "none";

    requestAnimationFrame(() => {
      lastEl.offsetHeight;
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
