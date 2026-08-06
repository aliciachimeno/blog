// Mobile nav toggle — shared across all pages
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
    });
  }

  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  initLetterEffect();
  initCustomCursor();
  initScrollReveal();
  initSkyBackground();
  initFadeLoop();
  initPhotoStack();
});

/* ----------------------------------------------------------------------
   Letter hover effect
   Wraps every character of any element with class "split-text" in its
   own <span class="letter">, so each letter can be styled/hovered on
   its own (font change + bold + move up — see style.css).
   ---------------------------------------------------------------------- */
function initLetterEffect() {
  document.querySelectorAll(".split-text").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    const words = text.split(" ");
    words.forEach((word, i) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";
      word.split("").forEach((ch) => {
        const letterSpan = document.createElement("span");
        letterSpan.className = "letter";
        letterSpan.textContent = ch;
        wordSpan.appendChild(letterSpan);
      });
      el.appendChild(wordSpan);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  });
}

/* ----------------------------------------------------------------------
   Custom star cursor
   - Only turns on for real mice (skips touch devices).
   - Shows a simple CSS-drawn star immediately.
   - Automatically swaps to your uploaded image the moment
     assets/cursor-star.png exists — no code changes needed on your end,
     just drop the file in the assets folder with that exact name.
   ---------------------------------------------------------------------- */
function initCustomCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const cursor = document.createElement("div");
  cursor.className = "custom-cursor custom-cursor--css-star";
  document.body.appendChild(cursor);
  document.body.classList.add("cursor-enabled");

  window.addEventListener("mousemove", (e) => {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  // Try to load your uploaded star image; fall back silently to the CSS star.
  const img = new Image();
  img.onload = () => {
    cursor.classList.remove("custom-cursor--css-star");
    cursor.style.backgroundImage = "url('assets/cursor-star.png')";
  };
  img.src = "assets/cursor-star.png";
}

function initScrollReveal() {
  const paragraphs = document.querySelectorAll(".scroll-reveal");
  if (!paragraphs.length) return;

  paragraphs.forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    const words = text.split(" ");
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "reveal-word";
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });

  function update() {
    const vh = window.innerHeight;
    const startAt = vh * 0.9;
    const endAt = vh * 0.45;

    paragraphs.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const raw = (startAt - rect.top) / (startAt - endAt);
      const progress = Math.min(1, Math.max(0, raw));

      const words = el.querySelectorAll(".reveal-word");
      words.forEach((word, i) => {
        const wordProgress = progress * words.length - i;
        const opacity = Math.min(1, Math.max(0.15, wordProgress));
        word.style.opacity = opacity;
      });
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
}

const SKY_KEYFRAMES = [
  { hour: 0,    top: [238, 241, 251], bottom: [247, 245, 252] },
  { hour: 5,    top: [243, 233, 247], bottom: [251, 238, 240] },
  { hour: 7,    top: [255, 232, 214], bottom: [255, 243, 224] },
  { hour: 10,   top: [234, 244, 255], bottom: [255, 255, 255] },
  { hour: 13,   top: [245, 250, 255], bottom: [255, 255, 255] },
  { hour: 16,   top: [255, 248, 239], bottom: [255, 255, 255] },
  { hour: 18,   top: [255, 227, 199], bottom: [255, 214, 214] },
  { hour: 19.5, top: [255, 211, 211], bottom: [243, 217, 247] },
  { hour: 21,   top: [230, 219, 247], bottom: [238, 241, 251] },
  { hour: 24,   top: [238, 241, 251], bottom: [247, 245, 252] },
];

function initSkyBackground() {
  function lerp(a, b, t) { return a + (b - a) * t; }
  function lerpColor(c1, c2, t) {
    return [Math.round(lerp(c1[0], c2[0], t)), Math.round(lerp(c1[1], c2[1], t)), Math.round(lerp(c1[2], c2[2], t))];
  }

  function update() {
    const now = new Date();
    const hour = now.getHours() + now.getMinutes() / 60;

    let prev = SKY_KEYFRAMES[0];
    let next = SKY_KEYFRAMES[SKY_KEYFRAMES.length - 1];
    for (let i = 0; i < SKY_KEYFRAMES.length - 1; i++) {
      if (hour >= SKY_KEYFRAMES[i].hour && hour <= SKY_KEYFRAMES[i + 1].hour) {
        prev = SKY_KEYFRAMES[i];
        next = SKY_KEYFRAMES[i + 1];
        break;
      }
    }

    const span = next.hour - prev.hour;
    const t = span === 0 ? 0 : (hour - prev.hour) / span;
    const top = lerpColor(prev.top, next.top, t);
    const bottom = lerpColor(prev.bottom, next.bottom, t);

    document.body.style.background = `linear-gradient(180deg, rgb(${top.join(",")}) 0%, rgb(${bottom.join(",")}) 100%)`;
  }

  update();
  setInterval(update, 60000);
}


function initFadeLoop() {
  document.querySelectorAll(".fade-loop").forEach((el) => {
    const text = el.textContent;
    el.textContent = "";
    const words = text.split(" ");
    words.forEach((word, i) => {
      const span = document.createElement("span");
      span.className = "fade-word";
      span.textContent = word;
      span.style.animationDelay = `${i * 0.2}s`;
      el.appendChild(span);
      if (i < words.length - 1) {
        el.appendChild(document.createTextNode(" "));
      }
    });
  });
}

function initPhotoStack() {
  const stack = document.querySelector(".about-photo-stack");
  if (!stack) return;
  const photos = stack.querySelectorAll(".stack-photo");
  if (!photos.length) return;

  let current = 0;
  photos[current].classList.add("is-active");

  setInterval(() => {
    photos[current].classList.remove("is-active");
    current = (current + 1) % photos.length;
    photos[current].classList.add("is-active");
  }, 3500);
}