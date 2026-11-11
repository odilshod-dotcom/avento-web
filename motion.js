(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function decorateArrows() {
    document.querySelectorAll('a, button').forEach((element) => {
      if (!/[↗↓↑]/.test(element.innerHTML)) return;
      const rightIcon = element.closest('.gold') ? 'arrow-right-navy.svg' : 'arrow-right-petrol.svg';
      element.innerHTML = element.innerHTML
        .replaceAll('↗', `<img class="motion-arrow" src="assets/icons/${rightIcon}" alt="" aria-hidden="true">`)
        .replaceAll('↓', '<img class="motion-arrow is-down" src="assets/icons/arrow-down-gold.svg" alt="" aria-hidden="true">')
        .replaceAll('↑', '<img class="motion-arrow is-up" src="assets/icons/arrow-up-light.svg" alt="" aria-hidden="true">');
    });
  }

  decorateArrows();
  document.querySelectorAll('.langs button').forEach((button) => {
    button.addEventListener('click', () => requestAnimationFrame(decorateArrows));
  });

  if (reduced || !('IntersectionObserver' in window)) return;

  const targets = [...document.querySelectorAll(
    '.strip-inner, .section-head, .services article, .steps article, .about-photo, .about-copy, .business-inner > div, .future-list > div, .future-note, .faq > div, .accordion details, .contact-grid > div, .foot-main, .foot-bottom'
  )];
  targets.forEach((element) => {
    const peers = targets.filter((item) => item.parentElement === element.parentElement);
    element.style.setProperty('--motion-delay', `${Math.min(peers.indexOf(element), 4) * 85}ms`);
    element.classList.add('motion-reveal');
  });

  document.body.classList.add('motion-ready');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
  targets.forEach((element) => observer.observe(element));

  let scheduled = false;
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (scheduled || !hero || window.scrollY > hero.offsetHeight) return;
    scheduled = true;
    requestAnimationFrame(() => {
      hero.style.setProperty('--hero-shift', `${Math.min(window.scrollY * 0.08, 28)}px`);
      scheduled = false;
    });
  }, { passive: true });
})();
