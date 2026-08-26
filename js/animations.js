/* ==========================================================================
   ANIMATIONS.JS - VANQUR 3D PLEXUS & MOTION ORCHESTRATION
   Interactive 2D Canvas Plexus, Traveling Energy Sparks, Cursor Glow & 3D Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCursorGlow();
  initCard3DTilt();
  initScrollReveal();
  initStatCounters();
});

/* --------------------------------------------------------------------------
   Custom Interactive Cursor Glow (Lagged Spring Physics)
   -------------------------------------------------------------------------- */
function initCursorGlow() {
  const cursor = document.getElementById('cursor-glow');
  if (!cursor || window.innerWidth <= 768) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    cursor.style.opacity = '1';
  });

  window.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
  });

  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }

  renderCursor();
}

/* --------------------------------------------------------------------------
   3D Tilt Effect on Interactive Cards
   -------------------------------------------------------------------------- */
function initCard3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  if (window.innerWidth <= 768) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}

/* --------------------------------------------------------------------------
   Global Scroll Reveal & Staggered Card Pop-Up Observer
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  // Skip ALL entrance animations on mobile & tablet — prevents compositor layer churn during scroll
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 992 || ('ontouchstart' in window);
  if (isMobile) {
    // Make everything immediately visible — no hidden opacity-0 elements
    document.querySelectorAll(
      '.section-header, .pillars-grid, .services-grid, .why-us-grid, ' +
      '.cta-banner-glass, .page-hero-header, .interactive-card, ' +
      '.about-intro-box, .sim-category-nav, .sim-view-panel, ' +
      '.service-card, .tilt-card, .pillar-card, .why-choose-row-card, .selected-build-card'
    ).forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    });
    return;
  }

  const revealSelectors = [
    '.section-header',
    '.pillars-grid',
    '.services-grid',
    '.testimonials-grid',
    '.selected-builds-grid',
    '.why-us-grid',
    '.cta-banner-glass',
    '.page-hero-header',
    '.interactive-card',
    '.about-intro-box',
    '.sim-category-nav',
    '.sim-view-panel'
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => {
    // If it's a grid/container of cards, add reveal-cards for natural stagger
    if (
      el.classList.contains('pillars-grid') || 
      el.classList.contains('services-grid') || 
      el.classList.contains('why-us-grid') || 
      el.classList.contains('testimonials-grid')
    ) {
      el.classList.add('reveal-cards');
    } else {
      el.classList.add('reveal-on-scroll');
    }
    observer.observe(el);
  });

  // Observe individual standalone cards not already inside observed grids
  const standaloneCards = document.querySelectorAll('.service-card, .tilt-card');
  standaloneCards.forEach(card => {
    if (!card.closest('.pillars-grid') && !card.closest('.services-grid') && !card.closest('.why-us-grid')) {
      card.classList.add('reveal-on-scroll');
      observer.observe(card);
    }
  });
}

/* --------------------------------------------------------------------------
   Animated Statistics Counter (99.8%, <300ms, 24/7 with Smooth Ease-Out)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statsSection = document.querySelector('.trust-metrics-card');
  if (!statsSection) return;

  // Skip rAF counter loop on mobile — competes with scroll for main thread
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobile) {
    // Show final values immediately, no animation
    const h3s = statsSection.querySelectorAll('.trust-metric-pill h3');
    const finals = ['99.8%', '<300ms', '24/7'];
    h3s.forEach((el, i) => { if (finals[i]) el.textContent = finals[i]; });
    return;
  }

  const statItems = statsSection.querySelectorAll('.trust-metric-pill');
  if (!statItems.length) return;

  // Add scroll reveal class for staggered item entrance
  statsSection.classList.add('reveal-cards');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const statsConfig = [
    { el: statItems[0]?.querySelector('h3'), start: 0, target: 99.8, decimals: 1, prefix: '', suffix: '%' },
    { el: statItems[1]?.querySelector('h3'), start: 0, target: 300, decimals: 0, prefix: '<', suffix: 'ms' },
    { el: statItems[2]?.querySelector('h3'), isRatio: true, target1: 24, target2: 7 }
  ];

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statsSection.classList.add('in-view');

        if (prefersReducedMotion) {
          // Immediately display final values without motion
          return;
        }

        const duration = 1800; // 1.8 seconds smooth duration
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Smooth cubic ease-out curve
          const easeOut = 1 - Math.pow(1 - progress, 3);

          statsConfig.forEach(item => {
            if (!item.el) return;

            if (item.isRatio) {
              const val1 = Math.floor(easeOut * item.target1);
              const val2 = Math.floor(easeOut * item.target2);
              item.el.textContent = `${val1}/${val2}`;
            } else {
              const current = item.start + (item.target - item.start) * easeOut;
              const formatted = item.decimals > 0 ? current.toFixed(item.decimals) : Math.floor(current);
              item.el.textContent = `${item.prefix}${formatted}${item.suffix}`;
            }
          });

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            // Guarantee precise final numbers
            if (statsConfig[0].el) statsConfig[0].el.textContent = '99.8%';
            if (statsConfig[1].el) statsConfig[1].el.textContent = '<300ms';
            if (statsConfig[2].el) statsConfig[2].el.textContent = '24/7';
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(statsSection);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  observer.observe(statsSection);
}
