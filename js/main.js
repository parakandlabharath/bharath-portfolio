(() => {
  const root = document.documentElement;
  const themeButton = document.querySelector(".theme-toggle");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const progress = document.querySelector(".scroll-progress");
  const toast = document.querySelector(".toast");

  // Keep the email assembled here so it does not appear as plain text in the HTML.
  const email = ["parakandlabharath", "gmail.com"].join("@");
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
      showToast("Copied ✓");
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

  // Add the enhancement class only after the reveal observer is ready. Without JavaScript, content stays visible.\n  root.classList.add('js');\n\n  // Mark the nav link for the section currently being viewed.
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
/* Pass 3: browser-only mini demos, clearly separated from the real project APIs. */
(() => {
  const board = document.getElementById("kanban-demo");
  const terminal = document.getElementById("rest-terminal");
  if (!board) return;

  const initialTasks = [
    { id: 1, title: "Prepare project notes", status: "todo" },
    { id: 2, title: "Create API outline", status: "todo" },
    { id: 3, title: "Build task route", status: "doing" },
    { id: 4, title: "Review task flow", status: "done" }
  ];
  let tasks = initialTasks.map(task => ({ ...task }));
  const statusNames = { todo: "TODO", doing: "IN_PROGRESS", done: "DONE" };
  const columnNames = ["todo", "doing", "done"];

  // Render the task cards and keep each move available as a regular button.
  function renderBoard() {
    columnNames.forEach(status => {
      const list = board.querySelector('[data-list="' + status + '"]');
      const count = board.querySelector('[data-column="' + status + '"] [data-count]');
      if (!list) return;
      list.innerHTML = "";
      const matching = tasks.filter(task => task.status === status);
      if (count) count.textContent = matching.length;
      matching.forEach(task => {
        const card = document.createElement("div");
        card.className = "kanban-task";
        card.tabIndex = 0;
        card.draggable = true;
        card.dataset.taskId = task.id;
        card.textContent = task.title;
        card.setAttribute("aria-label", task.title + ", " + statusNames[status]);
        card.addEventListener("dragstart", event => {
          card.classList.add("dragging");
          event.dataTransfer?.setData("text/plain", String(task.id));
          if (event.dataTransfer) event.dataTransfer.effectAllowed = "move";
        });
        card.addEventListener("dragend", () => card.classList.remove("dragging"));
        card.addEventListener("keydown", event => {
          if (event.key === " " || event.key === "Enter") {
            event.preventDefault();
            moveTask(task.id, nextStatus(status));
          }
        });
        const controls = document.createElement("div");
        controls.className = "task-controls";
        const move = document.createElement("button");
        move.type = "button";
        move.textContent = status === "done" ? "Move to To Do" : "Move →";
        move.setAttribute("aria-label", "Move " + task.title + " to " + (status === "todo" ? "In Progress" : status === "doing" ? "Done" : "To Do"));
        move.addEventListener("click", () => moveTask(task.id, nextStatus(status)));
        controls.append(move);
        card.append(controls);
        list.append(card);
      });
    });
  }

  function nextStatus(current) {
    const index = columnNames.indexOf(current);
    return columnNames[(index + 1) % columnNames.length];
  }

  function moveTask(taskId, newStatus) {
    const task = tasks.find(item => item.id === taskId);
    if (!task) return;
    task.status = newStatus;
    renderBoard();
    if (terminal) {
      terminal.textContent = 'PATCH /api/tasks/' + task.id + '\n{\n  "status": "' + statusNames[newStatus] + '"\n}\n\n200 OK\n{\n  "id": ' + task.id + ',\n  "status": "' + statusNames[newStatus] + '"\n}';
    }
  }

  // Allow cards to be dragged to a different status column.
  board.querySelectorAll(".kanban-column").forEach(column => {
    const list = column.querySelector(".kanban-list");
    list?.addEventListener("dragover", event => {
      event.preventDefault();
      list.classList.add("drag-target");
    });
    list?.addEventListener("dragleave", () => list.classList.remove("drag-target"));
    list?.addEventListener("drop", event => {
      event.preventDefault();
      list.classList.remove("drag-target");
      const id = Number(event.dataTransfer?.getData("text/plain"));
      moveTask(id, column.dataset.list);
    });
  });

  board.querySelector("[data-board-reset]")?.addEventListener("click", () => {
    tasks = initialTasks.map(task => ({ ...task }));
    renderBoard();
    if (terminal) terminal.textContent = 'POST /api/tasks\n{\n  "title": "Prepare project notes"\n}\n\n201 Created\n{\n  "id": 1,\n  "status": "TODO"\n}';
  });
  renderBoard();

  // Simulate a price changing in fixed steps. It is not connected to a store.
  const slider = document.getElementById("target-price");
  const priceText = document.getElementById("sim-price");
  const targetText = document.getElementById("target-display");
  const statusText = document.getElementById("price-status");
  const noteText = document.getElementById("price-note");
  const stepButton = document.getElementById("price-step");
  const resetButton = document.querySelector("[data-price-reset]");
  if (!slider || !priceText || !targetText || !statusText || !noteText || !stepButton) return;

  let currentPrice = 1200;
  const startingPrice = 1200;
  const startingTarget = 900;
  const money = value => "₹" + value.toLocaleString("en-IN");

  function updatePriceDemo() {
    const target = Number(slider.value);
    targetText.textContent = money(target);
    priceText.textContent = money(currentPrice);
    const reached = currentPrice <= target;
    statusText.textContent = reached ? "Target reached · example alert" : "Waiting for target";
    statusText.classList.toggle("alert", reached);
    noteText.textContent = reached
      ? "Example alert: the current price is at or below your target."
      : "The alert will appear when the example price is at or below your target.";
  }
  slider.addEventListener("input", updatePriceDemo);
  stepButton.addEventListener("click", () => {
    currentPrice = Math.max(500, currentPrice - 100);
    updatePriceDemo();
  });
  resetButton?.addEventListener("click", () => {
    currentPrice = startingPrice;
    slider.value = String(startingTarget);
    updatePriceDemo();
  });
  updatePriceDemo();
})();