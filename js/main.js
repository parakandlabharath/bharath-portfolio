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