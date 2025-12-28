/* ============================
   African Wildlife – PRO JS
============================ */

/* ----------------------------
   Utility Helpers
---------------------------- */
const debounce = (fn, delay = 100) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
};

const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ----------------------------
   Toast (Session-based)
---------------------------- */
function showMessage() {
  if (sessionStorage.getItem("toastShown")) return;
  sessionStorage.setItem("toastShown", "true");

  const toast = document.createElement("div");
  toast.setAttribute("role", "alert");
  toast.textContent =
    "🐘 African Wildlife protects nature & documents the greatest migration on Earth.";

  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #3b2f2f;
    color: #fff;
    padding: 16px 22px;
    border-radius: 12px;
    font-size: 14px;
    box-shadow: 0 12px 30px rgba(0,0,0,0.35);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.4s ease;
    z-index: 9999;
  `;

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(20px)";
    setTimeout(() => toast.remove(), 400);
  }, 4500);
}

window.addEventListener("load", showMessage);

/* ----------------------------
   Smooth Scroll + Active Nav
---------------------------- */
const navLinks = document.querySelectorAll(".nav a");
const sections = document.querySelectorAll("section");

navLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });
});

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(l => l.classList.remove("active"));
      const active = document.querySelector(
        `.nav a[href="#${entry.target.id}"]`
      );
      active?.classList.add("active");
    });
  },
  { threshold: 0.6 }
);

sections.forEach(section => sectionObserver.observe(section));

/* ----------------------------
   Header Hide + Shadow
---------------------------- */
const header = document.getElementById("header");
let lastScrollY = window.scrollY;

const onScroll = debounce(() => {
  const y = window.scrollY;

  header.style.boxShadow =
    y > 60 ? "0 6px 18px rgba(0,0,0,0.35)" : "none";

  if (y > lastScrollY && y > 120) {
    header.style.transform = "translateY(-100%)";
  } else {
    header.style.transform = "translateY(0)";
  }

  lastScrollY = y;
}, 50);

window.addEventListener("scroll", onScroll);

/* ----------------------------
   Scroll Progress Indicator
---------------------------- */
const progressBar = document.createElement("div");
progressBar.style.cssText = `
  position: fixed;
  top: 0;
  left: 0;
  height: 4px;
  width: 0%;
  background: linear-gradient(90deg, #8d6e63, #3b2f2f);
  z-index: 10000;
`;
document.body.appendChild(progressBar);

window.addEventListener(
  "scroll",
  debounce(() => {
    const scrolled =
      (window.scrollY /
        (document.body.scrollHeight - window.innerHeight)) *
      100;
    progressBar.style.width = `${scrolled}%`;
  }, 20)
);

/* ----------------------------
   Reveal Animations
---------------------------- */
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.2 }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ----------------------------
   Lazy Loading Images
---------------------------- */
const lazyImages = document.querySelectorAll("img[data-src]");

const imageObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
      imageObserver.unobserve(img);
    });
  },
  { rootMargin: "100px" }
);

lazyImages.forEach(img => imageObserver.observe(img));

/* ----------------------------
   Idle User Detection
---------------------------- */
let idleTimer;
const IDLE_LIMIT = 30000;

const resetIdle = () => {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    console.log("User idle — consider showing conservation CTA.");
  }, IDLE_LIMIT);
};

["mousemove", "keydown", "scroll", "touchstart"].forEach(evt =>
  window.addEventListener(evt, resetIdle)
);

resetIdle();

/* ----------------------------
   Network-aware Animations
---------------------------- */
if (navigator.connection?.saveData) {
  document.documentElement.classList.add("reduced-data");
}
