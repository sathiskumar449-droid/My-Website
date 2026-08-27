/* ==========================================================================
   MAIN.JS - VANQUR NEXT-GEN AI & WEB AUTOMATION STUDIO
   Ultra High-Performance Vanilla ES6+ Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initNavDropdown();
  initActiveNavLink();
  initHeroRotatingHeadline();
  initCostCalculator();
  initSmoothAnchorScroll();
  handlePageLoadHash();
  initContactForm();
});

/* --------------------------------------------------------------------------
   Sticky Navigation Bar
   -------------------------------------------------------------------------- */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  // passive:true tells browser "scroll freely, don't wait for JS" → removes 100ms mobile delay
  window.addEventListener('scroll', () => {
    if (window.scrollY > 25) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initActiveNavLink() {
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const linkHref = link.getAttribute('href');
    if (!linkHref) return;
    const baseHref = linkHref.split('#')[0].split('?')[0];
    if (baseHref === currentPath || (currentPath === '' && baseHref === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function initMobileMenu() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  const hamburgerSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  const closeSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

  toggleBtn.addEventListener('click', () => {
    const isOpen = toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    toggleBtn.innerHTML = isOpen ? closeSvg : hamburgerSvg;
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Don't close mobile drawer if clicking the dropdown accordion toggle on mobile
      if (link.classList.contains('dropdown-toggle') && window.innerWidth <= 768) {
        return;
      }
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
      toggleBtn.innerHTML = hamburgerSvg;
      document.body.style.overflow = '';
    });
  });
}

/* --------------------------------------------------------------------------
   Services Navigation Dropdown (Desktop Hover/Click & Mobile Accordion)
   -------------------------------------------------------------------------- */
function initNavDropdown() {
  const dropdownContainers = document.querySelectorAll('.nav-item-dropdown');

  dropdownContainers.forEach(container => {
    const toggle = container.querySelector('.dropdown-toggle');
    const menu = container.querySelector('.nav-dropdown-menu');
    if (!toggle || !menu) return;

    // Mobile accordion click handler
    toggle.addEventListener('click', (e) => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        e.preventDefault();
        const isOpen = container.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      }
    });

    // Close on click outside (for desktop & tablet)
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        container.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard support: Escape closes dropdown
    container.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        container.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  });

  // Close mobile navigation drawer when clicking any item inside dropdown
  const dropdownLinks = document.querySelectorAll('.nav-dropdown-menu a');
  dropdownLinks.forEach(link => {
    link.addEventListener('click', () => {
      const toggleBtn = document.getElementById('nav-toggle');
      const navMenu = document.getElementById('nav-menu');
      if (toggleBtn && navMenu) {
        toggleBtn.classList.remove('open');
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
        document.body.style.overflow = '';
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Hero Rotating Animated Orange Headline
   -------------------------------------------------------------------------- */
function initHeroRotatingHeadline() {
  const textEl = document.getElementById('hero-rotating-text');
  if (!textEl) return;

  const phrases = [
    'AI-Powered Automation',
    'Smart Business Software',
    'Industrial Digital Solutions',
    'POS & ERP Systems',
    'Modern Web Experiences'
  ];

  let currentIndex = 0;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const displayDuration = 2600;
  const transitionDuration = 450;

  function rotateToNext() {
    if (prefersReduced) {
      currentIndex = (currentIndex + 1) % phrases.length;
      textEl.textContent = phrases[currentIndex];
      setTimeout(rotateToNext, displayDuration);
      return;
    }

    textEl.classList.remove('is-visible');
    textEl.classList.add('is-exiting');

    setTimeout(() => {
      currentIndex = (currentIndex + 1) % phrases.length;
      textEl.textContent = phrases[currentIndex];
      textEl.classList.remove('is-exiting');
      textEl.classList.add('is-entering');

      void textEl.offsetWidth; // Reflow

      textEl.classList.remove('is-entering');
      textEl.classList.add('is-visible');

      setTimeout(rotateToNext, displayDuration);
    }, transitionDuration);
  }

  setTimeout(rotateToNext, displayDuration);
}

/* --------------------------------------------------------------------------
   Project Cost Estimator & Quote Engine
   -------------------------------------------------------------------------- */
function initCostCalculator() {
  calculateCost();
}

window.calculateCost = function() {
  const typeSelect = document.getElementById('calc-project-type');
  const speedSelect = document.getElementById('calc-timeline');
  const displayEl = document.getElementById('cost-display');

  if (!typeSelect || !displayEl) return;

  const basePrice = parseFloat(typeSelect.value) || 28000;
  const speedMultiplier = parseFloat(speedSelect ? speedSelect.value : 1.0) || 1.0;

  let addonsTotal = 0;
  const waAddon = document.getElementById('addon-wa');
  const gstAddon = document.getElementById('addon-gst');
  const supportAddon = document.getElementById('addon-support');

  if (waAddon && waAddon.checked) addonsTotal += parseFloat(waAddon.value) || 4000;
  if (gstAddon && gstAddon.checked) addonsTotal += parseFloat(gstAddon.value) || 6000;
  if (supportAddon && supportAddon.checked) addonsTotal += parseFloat(supportAddon.value) || 5000;

  const total = Math.round((basePrice + addonsTotal) * speedMultiplier);
  displayEl.textContent = `₹${total.toLocaleString('en-IN')}`;
};

/* --------------------------------------------------------------------------
   What We Build Interactive Service Navigation Engine
   -------------------------------------------------------------------------- */
const WHAT_WE_BUILD_SERVICES = {
  'websites-ecommerce': {
    title: 'Modern Websites & E-Commerce',
    iconClass: 'app-icon-purple',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    intro: "Fast, responsive and dynamic digital experiences designed to help businesses build a stronger online presence and sell more effectively.",
    whatWeOffer: [
      "Business websites",
      "Corporate websites",
      "Landing pages",
      "Portfolio websites",
      "E-commerce platforms",
      "Product catalogs",
      "Dynamic content systems",
      "Custom customer experiences"
    ],
    keyFeatures: [
      "Mobile-first responsive design",
      "High-speed performance",
      "SEO-ready architecture",
      "Modern UI/UX",
      "Smooth 3D motion experiences",
      "Interactive animations",
      "Dynamic product and content management",
      "Shopping cart and checkout",
      "Payment gateway integration",
      "Order management"
    ],
    builtFor: "Retail businesses, brands, startups, service companies, creators and businesses looking for a modern digital presence or online store.",
    ourApproach: "We engineer fast, clean-coded web solutions with mobile-first UI architecture, SEO optimization, and high-converting user journeys built for performance and growth.",
    ctaText: "Build My Website →",
    contactService: "Websites"
  },
  'pos-billing': {
    title: 'POS & Billing Systems',
    iconClass: 'app-icon-orange',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    intro: "Modern POS and business management software designed to simplify billing, inventory, GST workflows and everyday business operations.",
    productHighlight: {
      title: "Powered by BillGrow — our modern business management and POS platform.",
      desc: "BillGrow brings billing, inventory, accounting workflows, payments and business operations together in a single modern platform — built to make everyday retail management faster, simpler and more organized."
    },
    whatWeOffer: [
      "POS billing",
      "GST billing",
      "Inventory management",
      "Purchase management",
      "Customer management",
      "Supplier management",
      "Payment tracking",
      "Sales and purchase reporting",
      "Business dashboards",
      "Returns, exchanges and refunds"
    ],
    keyFeatures: [
      "Fast billing and invoice generation",
      "GST-ready billing workflows",
      "GSTR-1, GSTR-2B and GSTR-3B workflows",
      "Product and stock management",
      "Customer and supplier management",
      "Cash and bank tracking",
      "Sales and purchase reports",
      "Barcode and product management",
      "Role-based access",
      "Business performance dashboards"
    ],
    builtFor: "Retail stores, fashion businesses, supermarkets, growing businesses and organizations that need centralized billing and business management.",
    ourApproach: "We design high-speed, intuitive POS platforms with instant barcode scanning, thermal receipt printing, offline database resilience, and automated GST reporting.",
    ctaText: "Explore POS Solution →",
    contactService: "POS"
  },
  'erp': {
    title: 'ERP & Business Management',
    iconClass: 'app-icon-rose',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>`,
    intro: "Centralized business software that connects sales, purchases, inventory, customers, suppliers and operational reporting in one platform.",
    whatWeOffer: [
      "ERP systems",
      "CRM",
      "Inventory management",
      "Sales management",
      "Purchase management",
      "Supplier management",
      "Customer management",
      "Reports and dashboards",
      "Workflow management"
    ],
    keyFeatures: [
      "Centralized business data",
      "Real-time operational visibility",
      "Role-based access",
      "Sales and purchase workflows",
      "Inventory tracking",
      "Customer and supplier management",
      "Business reporting",
      "Custom workflows",
      "Scalable architecture"
    ],
    builtFor: "Growing businesses that need to move away from disconnected spreadsheets and separate systems.",
    ourApproach: "We build tailored ERP systems aligned with your actual business workflows, featuring role-based security, automated approvals, and real-time operational analytics.",
    ctaText: "Build My Business System →",
    contactService: "ERP"
  },
  'whatsapp-ai': {
    title: 'AI WhatsApp Automation',
    iconClass: 'app-icon-green',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`,
    intro: "Intelligent WhatsApp experiences that help businesses communicate with customers, answer questions, showcase products and automate conversations.",
    whatWeOffer: [
      "AI WhatsApp assistants",
      "Customer support automation",
      "Product discovery",
      "Order assistance",
      "Automated notifications",
      "FAQ automation",
      "Human agent handoff"
    ],
    keyFeatures: [
      "AI-powered conversations",
      "Product search",
      "Customer enquiry handling",
      "Automated responses",
      "Order assistance",
      "Business workflow integration",
      "Live data integration",
      "Human handoff"
    ],
    builtFor: "Retail, e-commerce, service businesses and companies that receive large volumes of customer enquiries through WhatsApp.",
    ourApproach: "We build official WhatsApp Cloud API integrations powered by custom AI logic, connecting directly to your inventory, CRM, and order databases.",
    ctaText: "Build My AI Assistant →",
    contactService: "WhatsAppAI"
  },
  'custom-web-apps': {
    title: 'Custom Web Applications',
    iconClass: 'app-icon-blue',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    intro: "Scalable web applications designed around your exact business requirements, workflows and users.",
    whatWeOffer: [
      "Customer portals",
      "Admin dashboards",
      "Internal business applications",
      "SaaS platforms",
      "Management systems",
      "Custom dashboards"
    ],
    keyFeatures: [
      "Custom user experiences",
      "Secure authentication",
      "Role-based access",
      "Real-time data",
      "API integrations",
      "Scalable architecture",
      "Responsive interfaces",
      "Custom business workflows"
    ],
    builtFor: "Businesses that need software beyond a standard website or off-the-shelf application.",
    ourApproach: "We craft high-throughput web applications with modular architecture, robust API security boundaries, and responsive interfaces designed for high concurrency.",
    ctaText: "Build My Web App →",
    contactService: "WebApps"
  },
  'automation': {
    title: 'Business Automation',
    iconClass: 'app-icon-emerald',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`,
    intro: "Automate repetitive processes, notifications, workflows and data operations so your team can focus on higher-value work.",
    whatWeOffer: [
      "Workflow automation",
      "Notifications",
      "Data processing",
      "Automated reports",
      "Scheduled tasks",
      "Business integrations"
    ],
    keyFeatures: [
      "Automated workflows",
      "Scheduled processes",
      "Email and WhatsApp notifications",
      "Data synchronization",
      "API-based automation",
      "Automated reporting",
      "Reduced manual work"
    ],
    builtFor: "Businesses looking to reduce repetitive manual processes and improve operational efficiency.",
    ourApproach: "We deploy intelligent robotic process automation (RPA), headless scrapers, multi-portal API sync, and scheduled background workers to eliminate manual bottlenecks.",
    ctaText: "Automate My Business →",
    contactService: "Automation"
  },
  'system-integration': {
    title: 'API & System Integration',
    iconClass: 'app-icon-cyan',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    intro: "Connect your existing tools, platforms and business systems into one connected digital ecosystem.",
    whatWeOffer: [
      "REST APIs",
      "Payment gateway integration",
      "WhatsApp integration",
      "Database integration",
      "Third-party services",
      "Existing software integration"
    ],
    keyFeatures: [
      "Secure API integration",
      "Payment integrations",
      "WhatsApp integrations",
      "Database connectivity",
      "Third-party API connections",
      "Data synchronization",
      "Custom integration workflows"
    ],
    builtFor: "Businesses that already use multiple tools and need them to communicate with each other.",
    ourApproach: "We design robust middleware, webhook listeners, and secure API bridges to connect legacy software, payment gateways, and cloud databases effortlessly.",
    ctaText: "Connect My Systems →",
    contactService: "SystemIntegration"
  },
  'custom-software': {
    title: 'Custom Software Solutions',
    iconClass: 'app-icon-amber',
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    intro: "When standard software doesn't fit your workflow, we design and build a solution specifically around your business.",
    whatWeOffer: [
      "Custom business software",
      "Industry-specific platforms",
      "Internal tools",
      "Management systems",
      "Workflow applications",
      "Custom dashboards"
    ],
    keyFeatures: [
      "Fully customized workflows",
      "Custom database architecture",
      "Role-based access",
      "Business-specific features",
      "API integrations",
      "Scalable architecture",
      "Future-ready development"
    ],
    builtFor: "Businesses with unique workflows, specialized requirements or processes that cannot be handled effectively by generic software.",
    ourApproach: "We collaborate directly with your team to model your operational logic, engineering bespoke software from database schema to UI interactions.",
    ctaText: "Discuss My Requirement →",
    contactService: "CustomSoftware"
  }
};

function initWhatWeBuildNav() {
  const gridEl = document.getElementById('what-we-build-grid');
  const detailWrapper = document.getElementById('service-detail-wrapper');
  const detailCard = document.getElementById('service-detail-card');

  if (!gridEl || !detailWrapper || !detailCard) return;

  const cards = gridEl.querySelectorAll('.what-we-build-card');
  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const serviceKey = card.getAttribute('data-service');
      if (serviceKey && WHAT_WE_BUILD_SERVICES[serviceKey]) {
        openServiceDetail(serviceKey, true);
      }
    });
  });

  window.openServiceDetail = function(key, updateHash = true) {
    const data = WHAT_WE_BUILD_SERVICES[key];
    if (!data) return;

    let html = `
      <div>
        <div class="service-detail-header">
          <div class="app-icon-squircle ${data.iconClass}">
            ${data.svgIcon}
          </div>
          <h2 class="service-detail-title">${data.title}</h2>
        </div>
        <p class="service-detail-intro">${data.intro}</p>
      </div>
    `;

    if (data.productHighlight) {
      html += `
        <div class="service-product-box" style="padding:16px 20px;background:rgba(253, 235, 227, 0.7);border:1px solid rgba(224, 83, 56, 0.35);border-radius:16px;">
          <div style="font-size:13px;font-weight:800;color:var(--terracotta-primary);margin-bottom:6px;display:flex;align-items:center;gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${data.productHighlight.title}</span>
          </div>
          <p style="font-size:13px;color:#334155;line-height:1.55;margin:0;font-weight:500;">${data.productHighlight.desc}</p>
        </div>
      `;
    }

    // What We Offer
    html += `
      <div>
        <div class="service-detail-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
          WHAT WE OFFER
        </div>
        <div class="service-offer-grid">
          ${data.whatWeOffer.map(item => `<div class="service-offer-item">${item}</div>`).join('')}
        </div>
      </div>
    `;

    // Key Features
    html += `
      <div>
        <div class="service-detail-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          KEY FEATURES
        </div>
        <ul class="service-features-list" style="margin:0;">
          ${data.keyFeatures.map(feat => `<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="20 6 9 17 4 12"></polyline></svg> ${feat}</li>`).join('')}
        </ul>
      </div>
    `;

    // Built For
    html += `
      <div>
        <div class="service-detail-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          BUILT FOR
        </div>
        <div class="service-detail-text-box">${data.builtFor}</div>
      </div>
    `;

    // Our Approach
    html += `
      <div>
        <div class="service-detail-section-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
          OUR APPROACH
        </div>
        <div class="service-detail-text-box">${data.ourApproach}</div>
      </div>
    `;

    // CTA Button
    html += `
      <div style="margin-top: 10px;">
        <a href="contact.html?service=${data.contactService}" class="btn btn-primary" style="display: inline-flex; align-items: center; justify-content: center; width: 100%; max-width: 320px; padding: 14px 28px; font-size: 15px;">
          ${data.ctaText}
        </a>
      </div>
    `;

    detailCard.innerHTML = html;
    gridEl.style.display = 'none';
    detailWrapper.style.display = 'block';

    const sectionEl = document.getElementById('what-we-build');
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }

    if (updateHash) {
      history.pushState(null, '', `#${key}`);
    }
  };

  window.closeServiceDetail = function(updateHash = true) {
    detailWrapper.style.display = 'none';
    gridEl.style.display = 'grid';

    const sectionEl = document.getElementById('what-we-build');
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: 'smooth' });
    }

    if (updateHash) {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  };

  function checkHashNav() {
    const hash = window.location.hash.replace('#', '');
    if (hash && WHAT_WE_BUILD_SERVICES[hash]) {
      openServiceDetail(hash, false);
    } else if (!hash && detailWrapper.style.display !== 'none') {
      closeServiceDetail(false);
    }
  }

  window.addEventListener('hashchange', checkHashNav);
  checkHashNav();
}

/* --------------------------------------------------------------------------
   Smooth Anchor Scrolling with Fixed Header Offset & Hash Routing
   -------------------------------------------------------------------------- */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

function handlePageLoadHash() {
  if (window.location.hash) {
    const targetEl = document.querySelector(window.location.hash);
    if (targetEl) {
      setTimeout(() => {
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // Add a subtle highlight flash to show the exact service card
        targetEl.style.transition = 'box-shadow 0.4s ease, border-color 0.4s ease';
        targetEl.style.borderColor = 'var(--terracotta-primary)';
        targetEl.style.boxShadow = '0 0 0 2px rgba(224, 83, 56, 0.4)';
        setTimeout(() => {
          targetEl.style.boxShadow = '';
          targetEl.style.borderColor = '';
        }, 2200);
      }, 150);
    }
  }
}

/* --------------------------------------------------------------------------
   Contact Form & URL Parameter Pre-population
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('project-contact-form');
  const industrySelect = document.getElementById('contact-industry');
  const serviceSelect = document.getElementById('contact-service');

  // Handle URL Query Parameters (e.g. ?industry=Textile-Garment or ?service=POS)
  if (window.location.search) {
    const params = new URLSearchParams(window.location.search);
    const industryParam = params.get('industry');
    const serviceParam = params.get('service');

    if (industryParam && industrySelect) {
      const normalized = industryParam.replace(/-/g, ' ').toLowerCase();
      Array.from(industrySelect.options).forEach(opt => {
        if (opt.value && (opt.value.toLowerCase().includes(normalized) || normalized.includes(opt.value.toLowerCase()))) {
          industrySelect.value = opt.value;
        }
      });
    }

    if (serviceParam && serviceSelect) {
      const normalized = serviceParam.replace(/-/g, ' ').toLowerCase();
      Array.from(serviceSelect.options).forEach(opt => {
        if (opt.value && (opt.value.toLowerCase().includes(normalized) || normalized.includes(opt.value.toLowerCase()))) {
          serviceSelect.value = opt.value;
        }
      });
    }
  }

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value.trim() || '';
    const phone = document.getElementById('contact-phone')?.value.trim() || '';
    const industry = industrySelect?.value || '';
    const service = serviceSelect?.value || '';
    const message = document.getElementById('contact-message')?.value.trim() || '';

    let text = `*New Project Consultation Inquiry*\n\n` +
      `👤 *Name:* ${name}\n` +
      `📱 *Phone:* ${phone}\n`;

    if (industry) {
      text += `🏢 *Industry:* ${industry}\n`;
    }
    if (service) {
      text += `🎯 *Target Solution:* ${service}\n`;
    }
    if (message) {
      text += `📝 *Requirements:* ${message}\n`;
    }

    const waUrl = `https://api.whatsapp.com/send?phone=919942305574&text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  });
}

