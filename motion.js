(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const header = $('.header');

  // Replace text arrows with icon arrows.
  function decorateArrows() {
    $$('a, button').forEach((el) => {
      if (!/[↗↓↑]/.test(el.innerHTML)) return;
      const right = el.closest('.primary') ? 'arrow-right-navy.svg' : 'arrow-right-petrol.svg';
      el.innerHTML = el.innerHTML
        .replaceAll('↗', `<img class="motion-arrow" src="assets/icons/${right}" alt="" aria-hidden="true">`)
        .replaceAll('↓', '<img class="motion-arrow is-down" src="assets/icons/arrow-down-gold.svg" alt="" aria-hidden="true">')
        .replaceAll('↑', '<img class="motion-arrow is-up" src="assets/icons/arrow-up-light.svg" alt="" aria-hidden="true">');
    });
  }

  // Wrap each heading line so it can slide up from behind a mask.
  function splitHeadings() {
    if (reduced) return;
    $$('.section h2').forEach((h) => {
      if ($('.ln', h)) return;
      h.innerHTML = h.innerHTML.split(/<br\s*\/?>/i).map((l) => `<span class="ln"><span>${l}</span></span>`).join('');
      h.classList.add('split');
    });
  }

  // Side dots: one per main section, labelled by the section's eyebrow.
  const sections = ['top', 'services', 'navigator', 'process', 'about', 'business', 'faq', 'contact']
    .map((id) => document.getElementById(id)).filter(Boolean);
  const dots = document.createElement('nav');
  dots.className = 'dots';
  dots.setAttribute('aria-label', 'Sections');
  sections.forEach((sec) => {
    const a = document.createElement('a');
    a.href = `#${sec.id}`;
    a.appendChild(document.createElement('span'));
    dots.appendChild(a);
  });
  document.body.appendChild(dots);
  function labelDots() {
    sections.forEach((sec, i) => {
      const label = ($('.eyebrow', sec)?.textContent || 'AVENTO').trim();
      const a = dots.children[i];
      a.firstChild.textContent = label;
      a.setAttribute('aria-label', label);
    });
  }

  function onLang() { decorateArrows(); splitHeadings(); labelDots(); }
  onLang();
  document.addEventListener('avento:lang', onLang);

  // Reading progress, hero parallax, header hides on the way down.
  const progress = $('.progress');
  const hero = $('.hero');
  let lastY = window.scrollY, ticking = false;
  function onScroll() {
    const y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    const menuOpen = $('.toggle').getAttribute('aria-expanded') === 'true';
    header.classList.toggle('hide', !menuOpen && y > 600 && y > lastY + 4);
    if (y < lastY - 4) header.classList.remove('hide');
    if (Math.abs(y - lastY) > 4) lastY = y;
    if (!reduced && y < hero.offsetHeight) hero.style.setProperty('--hero-shift', `${Math.min(y * 0.12, 60)}px`);
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const i = sections.indexOf(e.target);
        [...dots.children].forEach((d, k) => d.classList.toggle('active', k === i));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  // Process tracker in the dashboard: steps advance in a loop.
  const steps = $$('.track li');
  let step = 0;
  function showStep(i) {
    steps.forEach((li, k) => { li.classList.toggle('active', k === i); li.classList.toggle('done', k < i); });
  }
  if (steps.length && !reduced) setInterval(() => { step = (step + 1) % steps.length; showStep(step); }, 2400);

  if (reduced || !('IntersectionObserver' in window)) return;

  // Scroll reveals with a stagger between siblings.
  const targets = $$('.strip-inner, .section-head, .services article, .steps article, .about-photo, .about > div:last-child, .business-inner > div, .future-list > div, .future-note, .faq > div, .accordion details, .contact-grid > div, .nav-grid > div, .stat, .foot-main, .foot-bottom');
  targets.forEach((el) => {
    const peers = targets.filter((item) => item.parentElement === el.parentElement);
    el.style.setProperty('--motion-delay', `${Math.min(peers.indexOf(el), 4) * 85}ms`);
    el.classList.add('motion-reveal');
  });
  document.body.classList.add('motion-ready');

  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add(e.target.matches('h2') ? 'is-in' : 'is-visible');
      if (e.target.matches('.stat')) countUp($('b', e.target));
      reveal.unobserve(e.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  [...targets, ...$$('.section h2')].forEach((el) => reveal.observe(el));

  function countUp(el) {
    const end = Number(el.dataset.count), t0 = performance.now(), dur = 900;
    (function frame(now) {
      const k = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(frame);
    })(t0);
  }

  // Pointer effects only where a fine pointer exists.
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  $$('.services article').forEach((card) => card.addEventListener('pointermove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  }));
  const dash = $('#dash'), stage = $('.navigator');
  stage.addEventListener('pointermove', (e) => {
    const r = dash.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    dash.style.setProperty('--ry', `${Math.max(-1, Math.min(1, dx)) * 5}deg`);
    dash.style.setProperty('--rx', `${Math.max(-1, Math.min(1, dy)) * -4}deg`);
  });
  stage.addEventListener('pointerleave', () => { dash.style.setProperty('--rx', '0deg'); dash.style.setProperty('--ry', '0deg'); });
})();
