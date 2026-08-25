/* ==========================================================================
   INTERACTIVE PROJECT COST & TIMELINE ESTIMATOR
   Dynamic Budget Calculation & WhatsApp Instant Quote Generator
   ========================================================================== */

// Base pricing and timelines configuration (in INR and working days)
const SERVICES_DATA = {
  website: {
    name: 'Modern High-Converting Website',
    basePrice: 18000,
    baseDays: 7,
    features: ['Ultra-fast speed optimization', 'SEO 100/100 structure', 'Smooth animations & responsive layout', 'Domain & Cloud hosting setup']
  },
  webapp: {
    name: 'Full-Stack Web App / SaaS Platform',
    basePrice: 48000,
    baseDays: 20,
    features: ['React/Vue + Node.js scalable architecture', 'User Authentication & RBAC', 'Cloud Database & API endpoints', 'Admin analytics dashboard']
  },
  pos: {
    name: 'Smart POS & Retail Billing Software',
    basePrice: 28000,
    baseDays: 10,
    features: ['Barcode scanner & thermal printer support', 'Inventory stock tracking', 'Quick billing & item lookup', 'Offline-first mode']
  },
  gst: {
    name: 'GST Invoicing & Tax Management Engine',
    basePrice: 22000,
    baseDays: 8,
    features: ['Auto CGST/SGST/IGST tax calculation', 'E-Way bill & E-invoice integration', 'GSTR-1/3B summary reports', 'Custom A4 & thermal print templates']
  },
  erp: {
    name: 'Enterprise ERP & Custom CRM Suite',
    basePrice: 75000,
    baseDays: 30,
    features: ['Multi-branch inventory management', 'Sales pipeline & CRM lead stages', 'Purchase orders & supplier ledger', 'Staff HR & Payroll management']
  },
  mobile: {
    name: 'Android & iOS Mobile App',
    basePrice: 55000,
    baseDays: 22,
    features: ['Cross-platform Flutter / React Native', 'Push notifications & background sync', 'Biometric / OTP login', 'Play Store & App Store build']
  },
  automation: {
    name: 'Web Automation & Custom Scraper Bot',
    basePrice: 20000,
    baseDays: 6,
    features: ['Automated web scraping & data extraction', 'Portal auto-submission bot', 'Scheduled cron job orchestration', 'Webhook & Excel/CSV auto-export']
  }
};

const SCALE_MULTIPLIERS = {
  startup: { multiplier: 1.0, daysAdd: 0, label: 'Startup / Single Store MVP' },
  business: { multiplier: 1.45, daysAdd: 6, label: 'Growing Business (Standard)' },
  enterprise: { multiplier: 2.2, daysAdd: 14, label: 'Multi-Branch Enterprise' }
};

const ADDONS_DATA = {
  gst_einv: { name: 'GST E-Invoice & NIC Portal API', price: 6500, days: 2 },
  whatsapp_bot: { name: 'Automated WhatsApp Notifications Bot', price: 5500, days: 2 },
  payment_gateway: { name: 'Razorpay / UPI Payment Gateway', price: 4500, days: 2 },
  thermal_barcode: { name: 'Thermal Printing & Barcode Scanner SDK', price: 4000, days: 1 },
  cloud_sync: { name: 'Real-time Multi-Location Cloud Sync', price: 8000, days: 3 },
  app_store: { name: 'Play Store & App Store Deployment Setup', price: 5000, days: 2 }
};

// State
let selectedService = 'webapp';
let selectedScale = 'business';
let selectedAddons = ['gst_einv', 'payment_gateway'];

document.addEventListener('DOMContentLoaded', () => {
  initCalculatorUI();
  updateCalculation();
});

function initCalculatorUI() {
  // Service Options Click Handlers
  const serviceCards = document.querySelectorAll('.calc-service-opt');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedService = card.getAttribute('data-service');
      updateCalculation();
    });
  });

  // Scale Options Click Handlers
  const scaleCards = document.querySelectorAll('.calc-scale-opt');
  scaleCards.forEach(card => {
    card.addEventListener('click', () => {
      scaleCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      selectedScale = card.getAttribute('data-scale');
      updateCalculation();
    });
  });

  // Addon Checkbox Handlers
  const addonCheckboxes = document.querySelectorAll('.calc-addon-check');
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      selectedAddons = Array.from(addonCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      updateCalculation();
    });
  });

  // WhatsApp Quote Button
  const whatsappQuoteBtn = document.getElementById('calc-whatsapp-quote-btn');
  if (whatsappQuoteBtn) {
    whatsappQuoteBtn.addEventListener('click', sendQuoteToWhatsApp);
  }
}

function updateCalculation() {
  const service = SERVICES_DATA[selectedService] || SERVICES_DATA.website;
  const scale = SCALE_MULTIPLIERS[selectedScale] || SCALE_MULTIPLIERS.startup;

  let basePrice = service.basePrice * scale.multiplier;
  let totalDays = service.baseDays + scale.daysAdd;

  let addonsPrice = 0;
  let addonsListNames = [];

  selectedAddons.forEach(addonKey => {
    const addon = ADDONS_DATA[addonKey];
    if (addon) {
      addonsPrice += addon.price;
      totalDays += addon.days;
      addonsListNames.push(addon.name);
    }
  });

  let totalEstimate = Math.round(basePrice + addonsPrice);
  let priceMin = Math.round(totalEstimate * 0.95);
  let priceMax = Math.round(totalEstimate * 1.15);

  // Update DOM elements
  const amountEl = document.getElementById('calc-display-amount');
  const timelineEl = document.getElementById('calc-display-timeline');
  const featuresListEl = document.getElementById('calc-display-features');

  if (amountEl) {
    amountEl.textContent = `₹${priceMin.toLocaleString('en-IN')} - ₹${priceMax.toLocaleString('en-IN')}`;
  }

  if (timelineEl) {
    timelineEl.textContent = `⏱ Estimated Delivery: ${totalDays - 2} to ${totalDays + 4} Business Days`;
  }

  if (featuresListEl) {
    const defaultFeatures = service.features.map(f => `
      <li>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${f}</span>
      </li>
    `).join('');

    const addonFeatures = addonsListNames.map(f => `
      <li style="color:var(--neon-cyan);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>+ ${f}</span>
      </li>
    `).join('');

    featuresListEl.innerHTML = defaultFeatures + addonFeatures;
  }
}

function sendQuoteToWhatsApp() {
  const service = SERVICES_DATA[selectedService];
  const scale = SCALE_MULTIPLIERS[selectedScale];
  const amountEl = document.getElementById('calc-display-amount');
  const timelineEl = document.getElementById('calc-display-timeline');

  const priceText = amountEl ? amountEl.textContent : 'Custom Quote';
  const timelineText = timelineEl ? timelineEl.textContent : 'Within 2-3 Weeks';

  let selectedAddonsText = selectedAddons.map(a => `• ${ADDONS_DATA[a]?.name}`).join('%0A') || 'None';

  const message = `*🚀 NEW PROJECT ESTIMATE INQUIRY*%0A%0A` +
    `*Service:* ${service.name}%0A` +
    `*Scale:* ${scale.label}%0A` +
    `*Add-on Features:*%0A${selectedAddonsText}%0A%0A` +
    `*Estimated Budget:* ${priceText}%0A` +
    `*Estimated Timeline:* ${timelineText}%0A%0A` +
    `_Hello VANQUR Team, I would like to discuss this project requirements and get started._`;

  // Default contact phone number (customizable by client)
  const phone = '919876543210'; 
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;

  window.open(url, '_blank');
}
