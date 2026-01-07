/**
 * Sets up a seamless video loop by cross-fading between two video elements.
 * @param {HTMLElement} container - The container to inject the videos into.
 * @param {string} videoSrc - The source URL of the video.
 * @param {string} className - The CSS class to apply to the video elements.
 * @param {number} fadeDuration - The duration of the cross-fade in seconds.
 */
export function setupSeamlessLoop(
  container,
  videoSrc,
  className,
  fadeDuration = 1.0
) {
  if (!container) return;

  container.innerHTML = `
    <video class="${className}" muted playsinline style="z-index: 1; opacity: 0;">
      <source src="${videoSrc}" type="video/mp4">
    </video>
    <video class="${className}" muted playsinline style="z-index: 0; opacity: 0;">
      <source src="${videoSrc}" type="video/mp4">
    </video>
  `;

  const videos = container.querySelectorAll(`.${className}`);
  let currentIdx = 0;
  let isTransitioning = false;
  const playVideo = (video) => {
    video.play().catch((err) => console.error("Video play failed:", err));
  };

  // Initialize first video
  videos[0].style.opacity = "1";
  videos[0].style.zIndex = "1";
  playVideo(videos[0]);

  const checkLoop = () => {
    const video = videos[currentIdx];
    const nextIdx = (currentIdx + 1) % 2;
    const nextVideo = videos[nextIdx];

    if (!video.duration) {
      requestAnimationFrame(checkLoop);
      return;
    }

    // Trigger next video slightly before the current one ends
    if (!isTransitioning && video.currentTime > video.duration - fadeDuration) {
      isTransitioning = true;

      // Prepare next video
      nextVideo.currentTime = 0;
      nextVideo.style.zIndex = "0"; // Place it behind the current one
      nextVideo.style.opacity = "1";
      playVideo(nextVideo);

      // Fade out current video
      video.style.transition = `opacity ${fadeDuration}s ease-in-out`;
      video.style.opacity = "0";

      // After fade completes
      setTimeout(() => {
        video.pause();
        video.style.transition = "none";
        video.style.zIndex = "-1";

        nextVideo.style.zIndex = "1"; // Move next video to front
        currentIdx = nextIdx;
        isTransitioning = false;
      }, fadeDuration * 1000);
    }

    requestAnimationFrame(checkLoop);
  };

  // Start the loop check
  requestAnimationFrame(checkLoop);
}
