const CONFIG = {
  poolSize: 70,
  colors: ["#B3EC15", "#1DEC51", "#51EC26"],
  spawnChance: 0.25,
  cursorLag: 0.1,

  // Physics
  shoveStrength: 5,
  floatSpeed: -1, // Upward speed (negative is up)
  friction: 0.92,

  // Gathering
  gatherRadius: 300,
  gatherSpeed: 0.02,
  jitterAmount: 10,

  // Explosion
  explodeSpeedMin: 5,
  explodeSpeedMax: 10,

  // Life (Duration in Seconds)
  durationMin: 0.5,
  durationMax: 1.5,

  // Size
  sizeMin: 20,
  sizeMax: 45,
};

const STATE_FLOATING = 0;
const STATE_GATHERING = 1;
const STATE_JITTERING = 2;

class StarCursor {
  constructor() {
    this.pool = [];

    // Mouse state
    this.mouseX = 0;
    this.mouseY = 0;
    this.prevMouseX = 0;
    this.prevMouseY = 0;

    // Lagged cursor state
    this.cursorX = 0;
    this.cursorY = 0;

    this.isMouseDown = false;
    this.gatherTimer = null;

    this.initPool();
    this.bindEvents();
    this.animate();
  }

  initPool() {
    for (let i = 0; i < CONFIG.poolSize; i++) {
      const el = document.createElement("div");
      el.classList.add("star-particle");
      document.body.appendChild(el);

      this.pool.push({
        element: el,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        life: 0,
        decay: 0,
        state: STATE_FLOATING,
        active: false,
      });
    }
  }

  spawn(x, y) {
    const particle = this.pool.find((p) => !p.active);
    if (!particle) return;

    this.resetParticle(particle, x, y);

    // "Shove" physics
    particle.vx = (Math.random() - 0.5) * CONFIG.shoveStrength;
    particle.vy = (Math.random() - 0.5) * CONFIG.shoveStrength;

    particle.state = STATE_FLOATING;
  }

  gatherExisting() {
    this.pool.forEach((p) => {
      if (p.active && p.state === STATE_FLOATING) {
        p.state = STATE_GATHERING;
        p.life = 1.0;
        p.decay = 0;

        p.targetX = this.cursorX;
        p.targetY = this.cursorY;
        p.gatherSpeed = CONFIG.gatherSpeed + Math.random() * 0.05;
      }
    });
  }

  spawnGather(targetX, targetY) {
    const particle = this.pool.find((p) => !p.active);
    if (!particle) return;

    const angle = Math.random() * Math.PI * 2;
    const radius = 60 + Math.random() * 40;
    const startX = targetX + Math.cos(angle) * radius;
    const startY = targetY + Math.sin(angle) * radius;

    this.resetParticle(particle, startX, startY);
    particle.life = 1.0;
    particle.decay = 0;
    particle.state = STATE_GATHERING;

    particle.targetX = targetX;
    particle.targetY = targetY;
    particle.gatherSpeed = CONFIG.gatherSpeed + Math.random() * 0.05;
  }

  getRandomDuration() {
    return (
      CONFIG.durationMin +
      Math.random() * (CONFIG.durationMax - CONFIG.durationMin)
    );
  }

  resetParticle(particle, x, y) {
    particle.active = true;
    particle.x = x;
    particle.y = y;
    particle.life = 1.0;
    particle.decay = 1.0 / (this.getRandomDuration() * 60);

    const size =
      CONFIG.sizeMin + Math.random() * (CONFIG.sizeMax - CONFIG.sizeMin);
    const color =
      CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];

    particle.element.style.width = `${size}px`;
    particle.element.style.height = `${size}px`;
    particle.element.style.backgroundColor = color;
    particle.element.style.transform = `translate(${x}px, ${y}px)`;
    particle.element.style.opacity = 1;
    particle.element.style.display = "block";
  }

  explode() {
    this.pool.forEach((p) => {
      if (!p.active) return;

      if (p.state === STATE_GATHERING || p.state === STATE_JITTERING) {
        p.state = STATE_FLOATING;

        const angle = Math.random() * Math.PI * 2;
        const speed =
          CONFIG.explodeSpeedMin +
          Math.random() * (CONFIG.explodeSpeedMax - CONFIG.explodeSpeedMin);

        p.vx = Math.cos(angle) * speed;
        p.vy = Math.sin(angle) * speed;

        p.decay = 1.0 / (this.getRandomDuration() * 60);
      }
    });
  }

  update() {
    this.cursorX += (this.mouseX - this.cursorX) * CONFIG.cursorLag;
    this.cursorY += (this.mouseY - this.cursorY) * CONFIG.cursorLag;

    const mouseDist = Math.hypot(
      this.mouseX - this.prevMouseX,
      this.mouseY - this.prevMouseY
    );

    this.prevMouseX = this.mouseX;
    this.prevMouseY = this.mouseY;

    if (
      !this.isMouseDown &&
      mouseDist > 0.1 &&
      Math.random() < CONFIG.spawnChance
    ) {
      this.spawn(this.mouseX, this.mouseY);
    }

    this.pool.forEach((p) => {
      if (!p.active) return;

      if (p.state === STATE_FLOATING) {
        p.x += p.vx;
        p.y += p.vy;

        p.vx *= CONFIG.friction;
        p.vy += (CONFIG.floatSpeed - p.vy) * 0.05;

        p.life -= p.decay;
      } else if (p.state === STATE_GATHERING) {
        p.targetX = this.cursorX;
        p.targetY = this.cursorY;

        p.x += (p.targetX - p.x) * p.gatherSpeed;
        p.y += (p.targetY - p.y) * p.gatherSpeed;

        const d = Math.hypot(p.targetX - p.x, p.targetY - p.y);
        if (d < 10) {
          p.state = STATE_JITTERING;
        }
      } else if (p.state === STATE_JITTERING) {
        p.x = this.cursorX + (Math.random() - 0.5) * CONFIG.jitterAmount;
        p.y = this.cursorY + (Math.random() - 0.5) * CONFIG.jitterAmount;
        p.life = 1.0;
      }

      if (p.life <= 0) {
        p.active = false;
        p.element.style.display = "none";
      } else {
        p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
        p.element.style.opacity = p.life;
      }
    });
  }

  animate = () => {
    this.update();
    requestAnimationFrame(this.animate);
  };

  bindEvents() {
    document.addEventListener("mousemove", (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      // Note: Spawning is now handled in update() loop for smoother trails
    });

    document.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return; // Only left-click

      if (this.gatherTimer) clearInterval(this.gatherTimer);

      this.isMouseDown = true;
      this.gatherExisting();
      this.gatherTimer = setInterval(() => {
        for (let i = 0; i < 2; i++) {
          this.spawnGather(this.cursorX, this.cursorY);
        }
      }, 20);
    });

    document.addEventListener("mouseup", (e) => {
      if (e.button !== 0) return; // Only left-click
      this.isMouseDown = false;
      if (this.gatherTimer) clearInterval(this.gatherTimer);
      this.explode();
    });

    document.addEventListener("mouseleave", () => {
      if (this.isMouseDown) {
        this.isMouseDown = false;
        if (this.gatherTimer) clearInterval(this.gatherTimer);
        this.explode();
      }
    });
  }
}

export const initCursor = () => {
  new StarCursor();
};
