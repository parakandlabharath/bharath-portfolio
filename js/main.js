/* Small, readable enhancements. Content remains visible if this file fails. */
(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  let lenis = null;
  let introTimeline = null;
  let toastTimer = null;

  function initTheme() {
    const button = $('.theme-toggle');
    const saved = localStorage.getItem('bharath-theme');
    if (saved === 'light') root.dataset.theme = 'light';
    button?.setAttribute('aria-label', saved === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    button?.addEventListener('click', () => {
      const light = root.dataset.theme !== 'light';
      root.dataset.theme = light ? 'light' : 'dark';
      localStorage.setItem('bharath-theme', light ? 'light' : 'dark');
      button.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  function initMenu() {
    const button = $('.menu-toggle');
    const menu = $('#mobile-menu');
    if (!button || !menu) return;
    const links = $$('a', menu);
    const close = () => {
      button.setAttribute('aria-expanded', 'false');
      button.setAttribute('aria-label', 'Open navigation');
      menu.classList.remove('open');
      menu.setAttribute('inert', '');
      document.body.classList.remove('menu-open');
    };
    button.addEventListener('click', () => {
      const opening = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(opening));
      button.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      menu.classList.toggle('open', opening);
      if (opening) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
      document.body.classList.toggle('menu-open', opening);
      if (opening) links[0]?.focus();
    });
    links.forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        close(); button.focus();
      }
      if (button.getAttribute('aria-expanded') === 'true' && event.key === 'Tab') {
        const items = [button, ...links];
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    });
  }

  function initLenis() {
    if (reduced || !window.Lenis || !window.gsap) return;
    try {
      lenis = new Lenis({duration: 1.05, smoothWheel: true, syncTouch: false});
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    } catch (error) { console.warn('Smooth scrolling unavailable:', error); }
  }

  function initIntro() {
    const title = $('.hero-title');
    if (!title) return;
    const finish = () => title.classList.add('ready');
    const skipButton = $('.intro-skip');
    const skip = () => {
      introTimeline?.kill(); finish();
      if (window.gsap) gsap.set(['.eyebrow','.hero-bottom','.header-inner'], {clearProps:'all',opacity:1,y:0});
      sessionStorage.setItem('bharath-intro-seen','1');
      if (skipButton) skipButton.hidden = true;
    };
    const alreadySeen = sessionStorage.getItem('bharath-intro-seen');
    if (reduced || alreadySeen) { finish(); if (skipButton) skipButton.hidden = true; return; }
    if (skipButton) { skipButton.hidden = false; skipButton.addEventListener('click', skip, {once:true}); }
    const intro = introTimeline = gsap?.timeline({defaults:{ease:'power4.out'}, onComplete:() => { sessionStorage.setItem('bharath-intro-seen','1'); if (skipButton) skipButton.hidden = true; }});
    if (!intro) { finish(); return; }
    intro.call(finish).from('.eyebrow', {y:14,opacity:0,duration:.35}, 0)
      .from('.hero-bottom', {y:22,opacity:0,duration:.5}, .35)
      .from('.header-inner', {y:-12,opacity:0,duration:.35}, .15);
    const timeout = window.setTimeout(skip, 1400);
    intro.eventCallback('onComplete', () => { clearTimeout(timeout); sessionStorage.setItem('bharath-intro-seen','1'); });
  }

  function initReveals() {
    const items = $$('.reveal');
    if (!items.length) return;
    if (reduced || !window.gsap || !window.ScrollTrigger) {
      items.forEach(item => { item.style.opacity = '1'; item.style.transform = 'none'; });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    items.forEach(item => gsap.to(item, {opacity:1,y:0,duration:.8,ease:'power3.out',scrollTrigger:{trigger:item,start:'top 88%',once:true}}));
    $$('.arch-svg .arch-lines path').forEach(path => gsap.to(path,{strokeDashoffset:0,duration:1.25,ease:'power2.out',scrollTrigger:{trigger:path.closest('.architecture'),start:'top 78%',once:true}}));
  }

  function initProjects() {
    if (reduced || !window.gsap || !window.ScrollTrigger || window.matchMedia('(max-width: 900px)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('[data-project]').forEach((card,index,all) => {
      if (index === all.length - 1) return;
      ScrollTrigger.create({trigger:card,start:'top top+=100',endTrigger:all[index+1],end:'top top+=130',pin:true,pinSpacing:false,anticipatePin:1});
    });
  }

  function initHover() {
    if (!finePointer) return;
    $$('.project-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
        if (window.gsap && !reduced) {
          const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
          const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
          gsap.to(card,{rotateY:x*3,rotateX:-y*3,duration:.35,ease:'power2.out',transformPerspective:900});
        }
      });
      card.addEventListener('pointerleave', () => {
        if (window.gsap) gsap.to(card,{rotateX:0,rotateY:0,duration:.45,ease:'power3.out'});
      });
    });
    $$('.magnetic').forEach(button => {
      button.addEventListener('pointermove', event => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width/2;
        const y = event.clientY - rect.top - rect.height/2;
        if (window.gsap) gsap.to(button,{x:x*.12,y:y*.16,duration:.3,ease:'power2.out'});
      });
      button.addEventListener('pointerleave', () => window.gsap?.to(button,{x:0,y:0,duration:.4,ease:'power3.out'}));
    });
  }

  function initCursor() {
    if (!finePointer || reduced) return;
    const cursor = $('.cursor');
    if (!cursor) return;
    window.addEventListener('pointermove', event => {
      cursor.classList.add('visible');
      if (window.gsap) gsap.to(cursor,{x:event.clientX,y:event.clientY,duration:.16,ease:'power2.out'});
      else { cursor.style.left = event.clientX+'px'; cursor.style.top = event.clientY+'px'; }
    }, {passive:true});
    $$('a,button,[data-project]').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.toggle('view', el.matches('[data-project]')));
      el.addEventListener('pointerleave', () => cursor.classList.remove('view'));
    });
  }

  function initContact() {
    const user = 'kumarb57871';
    const domain = 'gmail.com';
    const email = user + '@' + domain;
    const link = $('[data-email-link]');
    const text = $('[data-email-text]');
    const copy = $('[data-copy-email]');
    const toast = $('[data-toast]');
    if (link) { link.href = 'mailto:' + email; if (text) text.textContent = email; }
    copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(email);
        toast.textContent = 'Email copied to clipboard';
      } catch {
        toast.textContent = 'Select the email address to copy it';
      }
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }

  function initNavigation() {
    const header = $('.site-header');
    const progress = $('.scroll-progress');
    const sections = $$('main section[id]');
    const navLinks = $$('.desktop-nav a');
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (scrollable > 0 ? window.scrollY / scrollable * 100 : 0) + '%';
      header?.classList.toggle('scrolled', window.scrollY > 20);
      let current = '';
      sections.forEach(section => { if (window.scrollY >= section.offsetTop - 180) current = section.id; });
      navLinks.forEach(link => {
        const active = link.getAttribute('href') === '#' + current;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current');
      });
    };
    window.addEventListener('scroll', update, {passive:true});
    update();
  }

  function initCommandPalette() {
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        const ids = ['home','about','experience','projects','skills','contact'];
        const choice = window.prompt('Jump to section: ' + ids.join(', '));
        if (choice && ids.includes(choice.toLowerCase())) document.getElementById(choice.toLowerCase())?.scrollIntoView({behavior:reduced?'auto':'smooth'});
      }
    });
  }

  function init() {
    $('[data-year]').textContent = new Date().getFullYear();
    initTheme();
    initMenu();
    initContact();
    initNavigation();
    if (window.gsap && window.ScrollTrigger) {
      initLenis();
      initIntro();
      initReveals();
      initProjects();
      initHover();
      initCursor();
    } else {
      $('.hero-title')?.classList.add('ready');
      $$('.reveal').forEach(item => { item.style.opacity='1'; item.style.transform='none'; });
    }
    initCommandPalette();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
