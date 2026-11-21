(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const progress = document.querySelector(".scroll-progress");
  const toast = document.querySelector(".toast");

  // Keep the email assembled here so it does not appear as plain text in the HTML.
  const email = ["kumarb57871", "gmail.com"].join("@");
  const emailLink = document.querySelector("#email-link");
  const copyButton = document.querySelector("#copy-email");
  let toastTimer;

  // Load a theme choice if one was saved earlier. Dark is the default.
  try {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") root.dataset.theme = savedTheme;
  } catch (error) {
    // The page still works if browser storage is unavailable.
  }

  function updateThemeButton() {
    const light = root.dataset.theme === "light";
    themeButton.textContent = light ? "☾" : "☀";
    themeButton.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
    themeButton.setAttribute("aria-pressed", String(light));
  }

  updateThemeButton();
  themeButton?.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
    try {
      localStorage.setItem("portfolio-theme", root.dataset.theme);
    } catch (error) {
      // Theme switching still works for this page if storage is blocked.
    }
    updateThemeButton();
  });

  // Make the contact email and mail link from the same value.
  if (emailLink) {
    emailLink.href = "mailto:" + email;
    emailLink.textContent = email;
    const arrow = document.createElement("span");
    arrow.textContent = "↗";
    arrow.setAttribute("aria-hidden", "true");
    emailLink.append(arrow);
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  copyButton?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("Email copied");
    } catch (error) {
      // If clipboard access is blocked, show the email so it can still be copied.
      showToast(email);
    }
  });

  // Open and close the small-screen menu.
  function closeMenu() {
    mobileNav?.classList.remove("open");
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
    if (menuButton) menuButton.textContent = "☰";
  }

  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    mobileNav?.classList.toggle("open", open);
    menuButton.textContent = open ? "×" : "☰";
  });
  mobileNav?.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  // Update the thin page progress line as the visitor scrolls.
  function updateProgress() {
    const pageLength = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = pageLength > 0 ? (window.scrollY / pageLength) * 100 : 0;
    if (progress) progress.style.width = Math.min(100, Math.max(0, percentage)) + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  // Keep the copyright year current.
  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();
})();
// Pass 2: reveal sections only after JavaScript is running, so the no-JS page stays visible.
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const desktopMotion = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 900px)").matches;
  const revealItems = document.querySelectorAll(".reveal");
  const flowPanel = document.querySelector(".flow-panel");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(item => item.classList.add("is-visible"));
    flowPanel?.classList.add("is-visible");
  } else {
    // Fade cards into view as they enter the viewport, then stop observing them.
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealItems.forEach(item => revealObserver.observe(item));

    // Draw the request diagram when its panel first appears.
    if (flowPanel) {
      const flowObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            flowPanel.classList.add("is-visible");
            flowObserver.disconnect();
          }
        });
      }, { threshold: 0.2 });
      flowObserver.observe(flowPanel);
    }
  }

  // Mark the nav link for the section currently being viewed.
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".desktop-nav a, .mobile-nav a");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", active);
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
          });
        }
      });
    }, { rootMargin: "-25% 0px -60% 0px", threshold: 0 });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Keep the background network small and disable it for phones or reduced motion.
  const canvas = document.getElementById("network");
  if (canvas && !reduceMotion && window.innerWidth > 760) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      let nodes = [];
      let rafId = 0;
      const maxNodes = 40;
      const sizeCanvas = () => {
        const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        const count = Math.min(maxNodes, Math.floor(window.innerWidth / 38));
        nodes = Array.from({ length: count }, () => ({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - .5) * .22,
          vy: (Math.random() - .5) * .22
        }));
      };
      // Draw faint dots and connect only close neighbours.
      const draw = () => {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        const light = root.dataset.theme === "light";
        const color = light ? "32,39,35" : "214,222,215";
        nodes.forEach((node, i) => {
          node.x += node.vx; node.y += node.vy;
          if (node.x < 0 || node.x > window.innerWidth) node.vx *= -1;
          if (node.y < 0 || node.y > window.innerHeight) node.vy *= -1;
          ctx.fillStyle = "rgba(" + color + ",.42)";
          ctx.beginPath(); ctx.arc(node.x, node.y, 1.5, 0, Math.PI * 2); ctx.fill();
          for (let j = i + 1; j < nodes.length; j++) {
            const other = nodes[j];
            const dx = node.x - other.x, dy = node.y - other.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 125) {
              ctx.strokeStyle = "rgba(" + color + "," + (1 - dist / 125) * .11 + ")";
              ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(node.x, node.y); ctx.lineTo(other.x, other.y); ctx.stroke();
            }
          }
        });
        rafId = requestAnimationFrame(draw);
      };
      sizeCanvas(); draw();
      window.addEventListener("resize", () => {
        if (window.innerWidth > 760) sizeCanvas();
        else { cancelAnimationFrame(rafId); ctx.clearRect(0, 0, canvas.width, canvas.height); }
      }, { passive: true });
      // Pause background animation when the visitor switches tabs.
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) cancelAnimationFrame(rafId);
        else if (window.innerWidth > 760) draw();
      });
    }
  }

  // A small ring cursor is enabled only on mouse-oriented desktop screens.
  if (desktopMotion && !reduceMotion) {
    const ring = document.createElement("div");
    const dot = document.createElement("div");
    ring.className = "cursor-ring";
    dot.className = "cursor-dot";
    ring.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.append(ring, dot);
    let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;
    document.body.classList.add("cursor-ready");
    document.addEventListener("mousemove", event => {
      mouseX = event.clientX; mouseY = event.clientY;
      dot.style.left = mouseX + "px"; dot.style.top = mouseY + "px";
    }, { passive: true });
    // Ease the ring toward the pointer rather than snapping.
    const moveRing = () => {
      ringX += (mouseX - ringX) * .18;
      ringY += (mouseY - ringY) * .18;
      ring.style.left = ringX + "px"; ring.style.top = ringY + "px";
      requestAnimationFrame(moveRing);
    };
    moveRing();
    document.querySelectorAll("a,button").forEach(el => {
      el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
  }
})();