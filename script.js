/* =====================================================
   ARYAN KULKARNI — PORTFOLIO JAVASCRIPT
   All interactivity: cursor, typing, navbar,
   scroll reveal, counters, skill bars, form
   ===================================================== */

"use strict";

/* --------------------------------------------------
   1. CUSTOM CURSOR
-------------------------------------------------- */
(function initCursor() {
  const cursor   = document.getElementById("cursor");
  const follower = document.getElementById("cursorFollower");
  if (!cursor || !follower) return;

  // Only run on non-touch devices
  if (!window.matchMedia("(hover: hover)").matches) {
    cursor.style.display   = "none";
    follower.style.display = "none";
    return;
  }

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + "px";
    cursor.style.top  = mouseY + "px";
  });

  // Smooth follower with RAF
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + "px";
    follower.style.top  = followerY + "px";
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    "a, button, .project-card, .tool-card, .skill-category, input, textarea"
  );
  hoverTargets.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hover");
      follower.classList.add("hover");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hover");
      follower.classList.remove("hover");
    });
  });
})();

/* --------------------------------------------------
   2. NAVBAR — scroll effect + active section
-------------------------------------------------- */
(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  // Scroll class
  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    updateActiveLink();
  }

  // Highlight active nav link based on scroll position
  function updateActiveLink() {
    let current = "";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.id;
      }
    });
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.dataset.section === current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once
})();

/* --------------------------------------------------
   3. HAMBURGER / MOBILE MENU
-------------------------------------------------- */
(function initMobileMenu() {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobileNav");
  const mobLinks  = document.querySelectorAll(".mob-link");

  if (!hamburger || !mobileNav) return;

  function toggleMenu() {
    hamburger.classList.toggle("open");
    mobileNav.classList.toggle("open");
    document.body.style.overflow = mobileNav.classList.contains("open") ? "hidden" : "";
  }

  hamburger.addEventListener("click", toggleMenu);

  // Close on link click
  mobLinks.forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });
})();

/* --------------------------------------------------
   4. TYPING EFFECT (hero role text)
-------------------------------------------------- */
(function initTyping() {
  const el = document.getElementById("typedText");
  if (!el) return;

  const phrases = [
    "Computer Science Student",
    "Problem Solver",
    "DSA Enthusiast",

  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;
  let pauseTimer  = null;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      // Typing
      el.textContent = currentPhrase.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === currentPhrase.length) {
        // Pause at full word before deleting
        pauseTimer = setTimeout(() => {
          isDeleting = true;
          type();
        }, 1800);
        return;
      }
    } else {
      // Deleting
      el.textContent = currentPhrase.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 55 : 90;
    setTimeout(type, speed);
  }

  // Start after a short delay (let hero animations settle)
  setTimeout(type, 1200);
})();

/* --------------------------------------------------
   5. SCROLL REVEAL (Intersection Observer)
-------------------------------------------------- */
(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // animate only once
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  revealEls.forEach((el) => observer.observe(el));
})();

/* --------------------------------------------------
   6. SKILL BAR ANIMATION (trigger when section visible)
-------------------------------------------------- */
(function initSkillBars() {
  const skillsSection = document.querySelector(".skills-section");
  if (!skillsSection) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        skillsSection.classList.add("animate");
        sectionObserver.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  sectionObserver.observe(skillsSection);
})();

/* --------------------------------------------------
   7. ACHIEVEMENT PLATFORM BAR ANIMATION
-------------------------------------------------- */
(function initAchieveBars() {
  const achieveSection = document.querySelector(".achievements-section");
  if (!achieveSection) return;

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        achieveSection.classList.add("animate");
        sectionObserver.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  sectionObserver.observe(achieveSection);
})();

/* --------------------------------------------------
   8. COUNT-UP ANIMATION (stats and DSA numbers)
-------------------------------------------------- */
(function initCountUp() {
  const countEls = document.querySelectorAll("[data-target]");
  if (!countEls.length) return;

  function animateCount(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600; // ms
    const start    = performance.now();

    function step(timestamp) {
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  countEls.forEach((el) => observer.observe(el));
})();

/* --------------------------------------------------
   9. SCROLL-TO-TOP BUTTON
-------------------------------------------------- */
(function initScrollTop() {
  const btn = document.getElementById("scrollTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();

/* --------------------------------------------------
   10. SMOOTH SCROLL for nav links
-------------------------------------------------- */
(function initSmoothScroll() {
  const allLinks = document.querySelectorAll('a[href^="#"]');
  allLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href").slice(1);
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;
      e.preventDefault();
      const top = targetEl.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
})();

/* --------------------------------------------------
   11. CONTACT FORM — client-side validation + feedback
-------------------------------------------------- */
(function initContactForm() {
  const form    = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  if (!form || !success) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Simple validation
    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      shakeForm(form);
      return;
    }
    if (!isValidEmail(email)) {
      form.email.style.borderColor = "#ff5f57";
      setTimeout(() => (form.email.style.borderColor = ""), 2000);
      return;
    }

    // Simulate send (frontend-only portfolio)
    const btn = form.querySelector(".btn-primary");
    btn.disabled = true;
    btn.querySelector(".btn-text").textContent = "Sending…";

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector(".btn-text").textContent = "Send Message";
      success.classList.add("show");
      setTimeout(() => success.classList.remove("show"), 5000);
    }, 1200);
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.style.animation = "none";
    // trigger reflow
    void el.offsetHeight;
    el.style.animation = "shake 0.4s ease";
  }
})();

/* --------------------------------------------------
   12. TILT EFFECT on project cards (subtle 3D)
-------------------------------------------------- */
(function initTilt() {
  if (!window.matchMedia("(hover: hover)").matches) return;

  const cards = document.querySelectorAll(".project-card");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -4;   // max ±4deg
      const rotY   = ((x - cx) / cx) *  4;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* --------------------------------------------------
   13. PARALLAX ORBS (subtle movement on mouse)
-------------------------------------------------- */
(function initParallax() {
  if (!window.matchMedia("(hover: hover)").matches) return;

  const orb1 = document.querySelector(".orb-1");
  const orb2 = document.querySelector(".orb-2");
  if (!orb1 || !orb2) return;

  document.addEventListener("mousemove", (e) => {
    const xPct = (e.clientX / window.innerWidth  - 0.5);
    const yPct = (e.clientY / window.innerHeight - 0.5);
    orb1.style.transform = `translate(${xPct * 30}px, ${yPct * 30}px)`;
    orb2.style.transform = `translate(${-xPct * 20}px, ${-yPct * 20}px)`;
  });
})();

/* --------------------------------------------------
   14. ADD SHAKE KEYFRAME DYNAMICALLY
-------------------------------------------------- */
(function addShakeKeyframe() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%      { transform: translateX(-8px); }
      40%      { transform: translateX(8px); }
      60%      { transform: translateX(-5px); }
      80%      { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* --------------------------------------------------
   15. FOOTER YEAR (auto-update)
-------------------------------------------------- */
(function setYear() {
  const yearEl = document.querySelector(".footer-copy");
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace(
      /\d{4}/,
      new Date().getFullYear()
    );
  }
})();

/* --------------------------------------------------
   16. NAV LINK HOVER — add ripple underline effect
      (adds a micro-interaction for polish)
-------------------------------------------------- */
(function initNavRipple() {
  const links = document.querySelectorAll(".nav-link");
  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      link.style.setProperty("--ease", "cubic-bezier(0.16,1,0.3,1)");
    });
  });
})();

/* --------------------------------------------------
   Log
-------------------------------------------------- */
console.log(
  "%cAryan Kulkarni — Portfolio\n%cBuilt with HTML, CSS & Vanilla JS",
  "color:#c8ff00;font-family:monospace;font-size:16px;font-weight:bold;",
  "color:#6b6b6b;font-family:monospace;font-size:12px;"
);