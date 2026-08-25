/* ==========================================================================
   ANIMATIONS.JS - NEXAVERSE 3D PLEXUS & MOTION ORCHESTRATION
   Interactive 2D Canvas Plexus, Traveling Energy Sparks, Cursor Glow & 3D Tilt
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCursorGlow();
  initCard3DTilt();
  initScrollReveal();
  initStatCounters();
});

/* --------------------------------------------------------------------------
   3D Neural Plexus & Traveling Energy Sparks Particle Canvas
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  // Skip heavy canvas animation entirely on mobile — prevents frame drops
  const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobileDevice) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  let width, height, dpr;
  let particles = [];
  let sparks = [];
  let mouse = { x: null, y: null, radius: 180, isHovering: false };
  let animFrameId = null;
  let isPageVisible = true;

  // Pause canvas when tab is hidden (save battery & CPU)
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible && animFrameId === null) {
      animFrameId = requestAnimationFrame(animate);
    }
  });

  // Dual-Tone Color Palette (Warm Terracotta/Amber Embers + High-Contrast Slate)
  const PALETTE = [
    { color: '#E05338', glow: 'rgba(224, 83, 56, 0.65)', weight: 3 },
    { color: '#FF7A59', glow: 'rgba(255, 122, 89, 0.7)', weight: 3 },
    { color: '#FF9A3C', glow: 'rgba(255, 154, 60, 0.75)', weight: 3 },
    { color: '#FFD166', glow: 'rgba(255, 209, 102, 0.8)', weight: 3 },
    { color: '#FFFFFF', glow: 'rgba(255, 255, 255, 0.85)', weight: 2.5 },
    { color: '#1E293B', glow: 'rgba(30, 41, 59, 0.4)', weight: 2 }
  ];

  function getRandomPalette() {
    const totalWeight = PALETTE.reduce((sum, p) => sum + p.weight, 0);
    let rand = Math.random() * totalWeight;
    for (const p of PALETTE) {
      if (rand < p.weight) return p;
      rand -= p.weight;
    }
    return PALETTE[0];
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isHovering = true;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
    mouse.isHovering = false;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2.2 + 1.0;
      this.speedX = (Math.random() - 0.5) * 0.45;
      this.speedY = (Math.random() - 0.5) * 0.45;
      
      const p = getRandomPalette();
      this.color = p.color;
      this.glow = p.glow;
      this.alpha = Math.random() * 0.6 + 0.3;
      this.baseAlpha = this.alpha;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseAngle = Math.random() * Math.PI * 2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > width) this.x = 0;
      else if (this.x < 0) this.x = width;

      if (this.y > height) this.y = 0;
      else if (this.y < 0) this.y = height;

      this.pulseAngle += this.pulseSpeed;
      this.alpha = this.baseAlpha + Math.sin(this.pulseAngle) * 0.15;

      // Smooth mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 2.8;
          this.y -= dirY * force * 2.8;
          this.alpha = Math.min(this.alpha + 0.35, 1.0);
        }
      }
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = Math.max(0.1, this.alpha);
      // Removed shadowBlur on particles — expensive GPU overdraw
      ctx.fill();
      ctx.restore();
    }
  }

  // Traveling energetic spark/pulse along constellation lines
  class EnergyPulse {
    constructor(p1, p2) {
      this.p1 = p1;
      this.p2 = p2;
      this.progress = 0;
      this.speed = Math.random() * 0.025 + 0.015;
      this.size = Math.random() * 2.5 + 1.5;
      this.color = Math.random() > 0.5 ? '#FFD166' : '#FF7A59';
    }

    update() {
      this.progress += this.speed;
      return this.progress < 1;
    }

    draw() {
      const curX = this.p1.x + (this.p2.x - this.p1.x) * this.progress;
      const curY = this.p1.y + (this.p2.y - this.p1.y) * this.progress;

      ctx.save();
      ctx.beginPath();
      ctx.arc(curX, curY, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = '#FFD166';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = (1 - Math.abs(this.progress - 0.5) * 2) * 0.85;
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles() {
    particles = [];
    sparks = [];
    const count = Math.floor((width * height) / 14000);
    const particleCount = Math.min(Math.max(count, 45), 75);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectLines() {
    const maxDist = 130;

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const normDist = dist / maxDist;
          const lineAlpha = (1 - normDist) * 0.24;

          ctx.save();
          ctx.beginPath();
          if (dist < maxDist * 0.45) {
            ctx.strokeStyle = 'rgba(255, 154, 60, 0.45)';
            ctx.lineWidth = 1.0;
          } else {
            ctx.strokeStyle = 'rgba(224, 83, 56, 0.22)';
            ctx.lineWidth = 0.75;
          }
          ctx.globalAlpha = lineAlpha;
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
          ctx.restore();

          // Spawn occasional traveling energy spark between connected nodes
          if (Math.random() < 0.0008 && sparks.length < 8) {
            sparks.push(new EnergyPulse(particles[a], particles[b]));
          }
        }
      }
    }
  }

  function animate() {
    if (!isPageVisible) {
      animFrameId = null;
      return;
    }
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    connectLines();

    for (let i = sparks.length - 1; i >= 0; i--) {
      if (sparks[i].update()) {
        sparks[i].draw();
      } else {
        sparks.splice(i, 1);
      }
    }

    animFrameId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();
}

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
  // Skip ALL entrance animations on mobile — they cause compositor layer churn during scroll
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobile) {
    // Make everything immediately visible — no hidden opacity-0 elements
    document.querySelectorAll(
      '.section-header, .pillars-grid, .services-grid, .why-us-grid, ' +
      '.cta-banner-glass, .page-hero-header, .interactive-card, ' +
      '.about-intro-box, .sim-category-nav, .sim-view-panel, ' +
      '.service-card, .tilt-card, .pillar-card'
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
   Animated Statistics Counter (99.8%, 45+, <300ms, 24/7 with Smooth Ease-Out)
   -------------------------------------------------------------------------- */
function initStatCounters() {
  const statsSection = document.querySelector('.trust-metrics-card');
  if (!statsSection) return;

  // Skip rAF counter loop on mobile — competes with scroll for main thread
  const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobile) {
    // Show final values immediately, no animation
    const h3s = statsSection.querySelectorAll('.trust-metric-pill h3');
    const finals = ['99.8%', '45+', '<300ms', '24/7'];
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
    { el: statItems[1]?.querySelector('h3'), start: 0, target: 45, decimals: 0, prefix: '', suffix: '+' },
    { el: statItems[2]?.querySelector('h3'), start: 0, target: 300, decimals: 0, prefix: '<', suffix: 'ms' },
    { el: statItems[3]?.querySelector('h3'), isRatio: true, target1: 24, target2: 7 }
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
            if (statsConfig[1].el) statsConfig[1].el.textContent = '45+';
            if (statsConfig[2].el) statsConfig[2].el.textContent = '<300ms';
            if (statsConfig[3].el) statsConfig[3].el.textContent = '24/7';
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
