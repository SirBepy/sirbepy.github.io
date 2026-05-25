let audio = null;
let unavailable = false;

const ensure = () => {
  if (audio || unavailable) return;
  try {
    audio = new Audio("/audio/ambient.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audio.addEventListener("error", () => { unavailable = true; audio = null; });
  } catch {
    unavailable = true;
  }
};

export const isMusicAvailable = () => !unavailable;

export const setMusic = (on) => {
  ensure();
  if (!audio) return;
  if (on) {
    audio.play().catch(() => { /* autoplay blocked, ignore */ });
  } else {
    audio.pause();
  }
};
