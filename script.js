const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const header = document.querySelector(".site-header");
const progressBar = document.getElementById("scroll-progress-bar");
const backToTop = document.querySelector(".back-to-top");

function setTheme(theme) {
  root.dataset.theme = theme;
  themeButton.textContent = theme === "dark" ? "☼" : "☾";
  themeButton.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  try { localStorage.setItem("bharath-portfolio-theme", theme); } catch (_) {}
}

let savedTheme = "dark";
try { savedTheme = localStorage.getItem("bharath-portfolio-theme") || "dark"; } catch (_) {}
setTheme(savedTheme);

themeButton.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

function closeMenu() {
  navLinks.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
}

menuButton.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});

navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});

function updateScrollUI() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
  progressBar.style.width = progress + "%";
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  backToTop.classList.toggle("visible", window.scrollY > 500);
}
window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

const revealItems = document.querySelectorAll("[data-reveal]");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

document.getElementById("year").textContent = new Date().getFullYear();

const roleText = document.getElementById("role-text");
const roleNames = ["Java Full-Stack Developer","Backend Developer","Java Developer"];
if(roleText && !window.matchMedia("(prefers-reduced-motion: reduce)").matches){
 let roleIndex=0;
 window.setInterval(()=>{
  roleIndex=(roleIndex+1)%roleNames.length;
  roleText.animate([{opacity:1,transform:"translateY(0)"},{opacity:0,transform:"translateY(-7px)"}],{duration:160,fill:"forwards"}).onfinish=()=>{
   roleText.textContent=roleNames[roleIndex];
   roleText.animate([{opacity:0,transform:"translateY(7px)"},{opacity:1,transform:"translateY(0)"}],{duration:260,fill:"forwards"});
  };
 },3200);
}
const sectionLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections=sectionLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
if("IntersectionObserver" in window){
 const sectionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(!entry.isIntersecting)return;
  sectionLinks.forEach(link=>{
   if(link.getAttribute("href")==="#"+entry.target.id)link.setAttribute("aria-current","location");
   else link.removeAttribute("aria-current");
  });
 }),{rootMargin:"-30% 0px -60% 0px"});
 observedSections.forEach(section=>sectionObserver.observe(section));
}
