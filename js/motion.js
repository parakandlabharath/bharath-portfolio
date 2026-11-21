/* Glass motion layer. All effects are optional and respect accessibility settings. */
(() => {
  const html = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const reducedTransparency = window.matchMedia("(prefers-reduced-transparency: reduce)");
  const touchMode = window.matchMedia("(hover: none), (pointer: coarse)");
  const safe = (selector, classNames) => document.querySelectorAll(selector).forEach(el => classNames.forEach(name => el.classList.add(name)));

  // Create the ambient orbs and grain behind the page content.
  const ambient = document.createElement("div");
  ambient.className = "glass-ambient";
  ambient.setAttribute("aria-hidden", "true");
  ambient.innerHTML = '<span class="glass-orb-wrap orb-one"><span class="glass-orb"></span></span><span class="glass-orb-wrap orb-two"><span class="glass-orb"></span></span><span class="glass-orb-wrap orb-three"><span class="glass-orb"></span></span><span class="glass-grain"></span>';
  document.body.prepend(ambient);

  // Add glass to the existing page elements without changing their content.
  safe(".site-header", ["glass-surface", "glass-nav"]);
  // Add the richer Liquid Glass finish to existing glass surfaces.
  safe(".glass-surface", ["glass-liquid"]);
  safe(".mobile-nav", ["glass-liquid"]);
  safe(".theme-toggle", ["glass-liquid"]);
  safe(".toast", ["glass-liquid"]);
  safe(".mobile-nav", ["glass-mobile-nav"]);
  safe(".flow-panel", ["glass-surface", "glass-strong", "glass-diagram"]);
  safe(".hero-side .spec-grid > div", ["glass-surface", "glass-strong", "glass-hover"]);
  safe(".status", ["glass-surface"]);
  safe(".project-card", ["glass-surface", "glass-strong", "glass-sheen", "glass-spotlight", "glass-hover"]);
  safe(".skill-card", ["glass-surface", "glass-strong", "glass-sheen", "glass-spotlight", "glass-hover"]);
  safe(".cert-grid > *", ["glass-surface", "glass-strong", "glass-hover"]);
  safe(".more-card", ["glass-surface", "glass-strong", "glass-hover"]);
  safe(".theme-toggle", ["glass-toggle"]);
  safe(".toast", ["glass-toast"]);
  // Reapply after all surface classes are assigned so every card receives the finish.
  safe(".glass-surface", ["glass-liquid"]);

  // Add a scroll progress line separate from the site's existing progress bar.
  const progress = document.createElement("div");
  progress.className = "glass-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);

  // Apply reveal motion only after JavaScript has initialized.
  const revealTargets = document.querySelectorAll(".section-heading h2, .section-heading p, .project-card, .skill-card, .cert-grid > *, .more-card, .principles article, .contact-card");
  revealTargets.forEach((el, index) => {
    el.classList.add("glass-reveal");
    if (el.matches(".project-card,.skill-card,.cert-grid > *,.more-work > *")) el.style.transitionDelay = ((index % 5) * 65) + "ms";
  });

  // Reveal items once when they enter the viewport. If the browser has no observer, show them.
  if (!reducedMotion.matches && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        revealObserver.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("is-in"));
  }

  // Animate the hero in a short sequence and do not delay the whole page.
  const heroLines = document.querySelectorAll(".hero-copy h1");
  heroLines.forEach(el => el.classList.add("glass-hero-line"));
  const heroItems = document.querySelectorAll(".hero-top,.hero-intro,.hero-buttons,.hero-side,.hero-bottom");
  heroItems.forEach(el => el.classList.add("glass-hero-item"));
  const showHero = () => {
    heroLines.forEach(el => el.classList.add("is-in"));
    heroItems.forEach((el, i) => {
      el.style.transitionDelay = (i * 75) + "ms";
      el.classList.add("is-in");
    });
  };
  if (reducedMotion.matches) showHero();
  else window.setTimeout(showHero, 80);

  // Make cards show their glow where the pointer is, only on mouse devices.
  if (!touchMode.matches && !reducedMotion.matches) {
    document.querySelectorAll(".glass-spotlight").forEach(card => {
      card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--spot-x", (event.clientX - rect.left) + "px");
        card.style.setProperty("--spot-y", (event.clientY - rect.top) + "px");
      });
    });
  }

  // Add a soft cursor light for desktop only.
  if (!touchMode.matches && !reducedMotion.matches && !reducedTransparency.matches) {
    const cursor = document.createElement("div");
    cursor.className = "glass-cursor";
    cursor.setAttribute("aria-hidden", "true");
    document.body.append(cursor);
    window.addEventListener("pointermove", event => {
      cursor.style.transform = "translate(" + event.clientX + "px," + event.clientY + "px) translate(-50%,-50%)";
      cursor.classList.add("is-active");
    }, { passive: true });
    window.addEventListener("pointerleave", () => cursor.classList.remove("is-active"));
  }

  // Make primary buttons follow the pointer by a few pixels, but only on desktops.
  if (!touchMode.matches && !reducedMotion.matches) {
    document.querySelectorAll(".button-primary").forEach(button => {
      button.classList.add("glass-magnetic");
      button.addEventListener("pointermove", event => {
        const rect = button.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width * 8;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height * 8;
        button.style.transform = "translate(" + x + "px," + y + "px)";
      });
      button.addEventListener("pointerleave", () => button.style.transform = "");
      button.addEventListener("pointerdown", () => button.style.transform = "scale(.98)");
    });
  }

  // Mark nav links as active based on the visible section.
  const nav = document.querySelector(".desktop-nav");
  const navLinks = document.querySelectorAll(".desktop-nav a");
  const navSections = [...navLinks].map(link => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  let navIndicator;
  if (nav && navLinks.length) {
    navIndicator = document.createElement("span");
    navIndicator.className = "glass-nav-indicator";
    navIndicator.setAttribute("aria-hidden", "true");
    nav.prepend(navIndicator);
    // The active pill moves with transforms instead of animating its width.
    const moveIndicator = link => {
      if (!link || !navIndicator) return;
      const x = link.offsetLeft;
      const w = link.offsetWidth;
      navIndicator.style.transform = "translate(" + x + "px,-50%) scaleX(" + w + ")";
    };
    navLinks.forEach(link => link.addEventListener("focus", () => moveIndicator(link)));
    window.addEventListener("resize", () => {
      const active = [...navLinks].find(link => link.classList.contains("glass-active-link"));
      if (active) moveIndicator(active);
    });
    if ("IntersectionObserver" in window) {
      const navObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("glass-active-link", active);
            if (active) moveIndicator(link);
          });
        });
      }, { rootMargin: "-25% 0px -60% 0px" });
      navSections.forEach(section => navObserver.observe(section));
    } else {
      navLinks[0]?.classList.add("glass-active-link");
      moveIndicator(navLinks[0]);
    }
  }

  // Make the header glass stronger after scrolling and hide it while scrolling down.
  const header = document.querySelector(".site-header");
  let lastY = window.scrollY;
  let ticking = false;
  const updateScrollMotion = () => {
    const y = window.scrollY;
    if (header) {
      header.classList.toggle("scrolled", y > 20);
      if (y > 140 && y > lastY + 2) header.classList.add("nav-hidden");
      if (y < lastY - 2 || y < 60) header.classList.remove("nav-hidden");
    }
    lastY = y;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (maxScroll > 0 ? Math.min(1, y / maxScroll) : 0) + ")";
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollMotion);
    }
  }, { passive: true });
  updateScrollMotion();

  // Let the existing mobile menu open/close classes drive the glass link reveal.
  const mobileMenu = document.querySelector(".mobile-nav");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuObserver = new MutationObserver(() => mobileMenu?.classList.toggle("open", mobileMenu.classList.contains("open")));
  if (mobileMenu) menuObserver.observe(mobileMenu, { attributes: true, attributeFilter: ["class"] });
  menuToggle?.addEventListener("click", () => window.setTimeout(() => mobileMenu?.classList.toggle("open", mobileMenu.classList.contains("open")), 0));

  // Keep the copy-email toast animated using its existing show class.
  const toast = document.querySelector(".toast");
  if (toast) toast.classList.add("glass-toast");

  // Parallax affects only the ambient orbs, never the text or cards.
  if (!touchMode.matches && !reducedMotion.matches && !reducedTransparency.matches) {
    const orbs = ambient.querySelectorAll(".glass-orb-wrap");
    window.addEventListener("pointermove", event => {
      const x = (event.clientX / window.innerWidth - .5) * 20;
      const y = (event.clientY / window.innerHeight - .5) * 20;
      orbs.forEach((orb, index) => {
        const factor = (index + 1) * .22;
        orb.style.transform = "translate3d(" + (x * factor) + "px," + (y * factor) + "px,0)";
      });
    }, { passive: true });
  }

  // Reduce transparency and motion on demand by switching to simpler surfaces.
  const accessibilityChange = () => {
    document.body.classList.toggle("glass-solid-mode", reducedTransparency.matches);
    document.body.classList.toggle("glass-reduced-motion", reducedMotion.matches);
  };
  accessibilityChange();
  reducedMotion.addEventListener?.("change", accessibilityChange);
  reducedTransparency.addEventListener?.("change", accessibilityChange);
})();