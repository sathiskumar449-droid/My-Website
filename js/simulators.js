/* ==========================================================================
   SIMULATORS.JS - INTERACTIVE SIMULATORS ENGINE
   Live POS / GST Billing Terminal, Invoice Generator, ERP & WhatsApp Chatbot
   ========================================================================== */

// Clean Developer SVG Icons for POS Catalog Items
const ICONS = {
  milk: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 2h10l-1 6H8L7 2z"/><path d="M6 8h12v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V8z"/><line x1="10" y1="13" x2="14" y2="13"/></svg>`,
  rice: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><path d="M8 8l4-4 4 4"/><path d="M6 14l6-4 6 4"/><path d="M4 20l8-4 8 4"/></svg>`,
  oil: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
  chocolate: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>`,
  tea: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
  honey: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3 5H9l3-5z"/><rect x="6" y="7" width="12" height="14" rx="3"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="6" y1="16" x2="18" y2="16"/></svg>`,
  dish: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  naan: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14c0 4.4 3.6 8 8 8s8-3.6 8-8c0-5-4-10-8-10S4 9 4 14z"/><circle cx="10" cy="13" r="1"/><circle cx="14" cy="13" r="1"/><circle cx="12" cy="16" r="1"/></svg>`,
  biryani: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11h18c0 5-4 9-9 9s-9-4-9-9z"/><path d="M12 3a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
  snack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 9l2-5h10l2 5"/><rect x="3" y="9" width="18" height="12" rx="2"/><path d="M8 9v12"/><path d="M16 9v12"/></svg>`,
  dessert: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 8a4 4 0 0 1 8 0"/><path d="M5 8h14v3a7 7 0 0 1-14 0V8z"/><path d="M12 18v3"/><path d="M8 21h8"/></svg>`,
  earbuds: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
  charger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="7" width="14" height="12" rx="2"/><line x1="9" y1="3" x2="9" y2="7"/><line x1="15" y1="3" x2="15" y2="7"/><path d="M12 11v4"/></svg>`,
  mouse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="3" width="12" height="18" rx="6"/><line x1="12" y1="7" x2="12" y2="11"/></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  scanner: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`,
  watch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35l-.35 3.83a2 2 0 0 1-2 1.82H9.83a2 2 0 0 1-2-1.82l-.35-3.83m.01-10.7l.35-3.83A2 2 0 0 1 9.83 1h4.35a2 2 0 0 1 2 1.82l.35 3.83"/></svg>`
};

// Sample Catalog Data for POS Simulator with Mobile Squircle Icon classes
const POS_CATALOG = {
  retail: [
    { id: 'r1', name: 'Organic Almond Milk 1L', price: 280, gstRate: 5, hsn: '0401', icon: ICONS.milk, iconClass: 'app-icon-blue' },
    { id: 'r2', name: 'Basmati Rice Premium 5kg', price: 450, gstRate: 5, hsn: '1006', icon: ICONS.rice, iconClass: 'app-icon-emerald' },
    { id: 'r3', name: 'Cold-Pressed Coconut Oil', price: 320, gstRate: 5, hsn: '1513', icon: ICONS.oil, iconClass: 'app-icon-amber' },
    { id: 'r4', name: 'Artisan Dark Chocolate 85%', price: 190, gstRate: 18, hsn: '1806', icon: ICONS.chocolate, iconClass: 'app-icon-purple' },
    { id: 'r5', name: 'Herbal Green Tea 50 Bags', price: 260, gstRate: 12, hsn: '0902', icon: ICONS.tea, iconClass: 'app-icon-green' },
    { id: 'r6', name: 'Pure Honey Jar 500g', price: 340, gstRate: 5, hsn: '0409', icon: ICONS.honey, iconClass: 'app-icon-orange' }
  ],
  restaurant: [
    { id: 'f1', name: 'Paneer Butter Masala', price: 240, gstRate: 5, hsn: '2106', icon: ICONS.dish, iconClass: 'app-icon-orange' },
    { id: 'f2', name: 'Butter Garlic Naan (2 pcs)', price: 120, gstRate: 5, hsn: '1905', icon: ICONS.naan, iconClass: 'app-icon-amber' },
    { id: 'f3', name: 'Special Dum Biryani', price: 310, gstRate: 5, hsn: '2106', icon: ICONS.biryani, iconClass: 'app-icon-rose' },
    { id: 'f4', name: 'Signature Cold Brew Coffee', price: 180, gstRate: 5, hsn: '2202', icon: ICONS.coffee, iconClass: 'app-icon-purple' },
    { id: 'f5', name: 'Crispy Peri Peri Fries', price: 140, gstRate: 5, hsn: '2004', icon: ICONS.snack, iconClass: 'app-icon-amber' },
    { id: 'f6', name: 'Sizzling Brownie with Ice Cream', price: 220, gstRate: 18, hsn: '1905', icon: ICONS.dessert, iconClass: 'app-icon-rose' }
  ],
  electronics: [
    { id: 'e1', name: 'Wireless Bluetooth Earbuds', price: 1899, gstRate: 18, hsn: '8518', icon: ICONS.earbuds, iconClass: 'app-icon-blue' },
    { id: 'e2', name: 'Fast USB-C 65W GaN Charger', price: 1250, gstRate: 18, hsn: '8504', icon: ICONS.charger, iconClass: 'app-icon-cyan' },
    { id: 'e3', name: 'Ergonomic Optical Gaming Mouse', price: 950, gstRate: 18, hsn: '8471', icon: ICONS.mouse, iconClass: 'app-icon-purple' },
    { id: 'e4', name: 'Thermal Receipt Printer 80mm', price: 4200, gstRate: 18, hsn: '8443', icon: ICONS.printer, iconClass: 'app-icon-orange' },
    { id: 'e5', name: 'Laser 2D Barcode Scanner', price: 2400, gstRate: 18, hsn: '8471', icon: ICONS.scanner, iconClass: 'app-icon-emerald' },
    { id: 'e6', name: 'Smart Fitness Tracker Band', price: 2100, gstRate: 18, hsn: '8517', icon: ICONS.watch, iconClass: 'app-icon-rose' }
  ]
};

// State
let currentCategory = 'retail';
let cart = [
  { id: 'r1', name: 'Organic Almond Milk 1L', price: 280, gstRate: 5, hsn: '0401', icon: ICONS.milk, iconClass: 'app-icon-blue', qty: 2 },
  { id: 'r4', name: 'Artisan Dark Chocolate 85%', price: 190, gstRate: 18, hsn: '1806', icon: ICONS.chocolate, iconClass: 'app-icon-purple', qty: 1 }
];

document.addEventListener('DOMContentLoaded', () => {
  initPosCategoryButtons();
  renderPosCatalog();
  renderPosCart();
  initInvoiceModal();
  initWhatsAppBot();
});

/* --------------------------------------------------------------------------
   Simulators Carousel Controller (Button & Indicator Navigation)
   -------------------------------------------------------------------------- */
let currentSimIndex = 0;
const SIM_META = [
  { id: 'pos-panel', title: 'POS & GST Billing Terminal', icon: '🛒' },
  { id: 'erp-panel', title: 'ERP & CRM Kanban Pipeline', icon: '📊' },
  { id: 'whatsapp-bot-panel', title: 'WhatsApp AI Chatbot', icon: '🤖' }
];

window.switchSimulator = function(index) {
  if (index < 0) index = SIM_META.length - 1;
  if (index >= SIM_META.length) index = 0;
  currentSimIndex = index;

  // Update panel visibility
  SIM_META.forEach((sim, i) => {
    const panel = document.getElementById(sim.id);
    if (panel) {
      if (i === index) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    }
  });

  // Update indicators & headers
  document.querySelectorAll('.sim-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });

  const titleEl = document.querySelector('.sim-active-title');
  const iconEl = document.querySelector('.sim-active-icon');
  if (titleEl) titleEl.textContent = SIM_META[index].title;
  if (iconEl) iconEl.textContent = SIM_META[index].icon;
};

window.nextSimulator = function() {
  switchSimulator(currentSimIndex + 1);
};

window.prevSimulator = function() {
  switchSimulator(currentSimIndex - 1);
};

/* --------------------------------------------------------------------------
   POS Catalog & Billing Logic
   -------------------------------------------------------------------------- */
function initPosCategoryButtons() {
  const catButtons = document.querySelectorAll('.pos-cat-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category') || 'retail';
      renderPosCatalog();
    });
  });
}

function renderPosCatalog() {
  const container = document.getElementById('pos-items-container');
  if (!container) return;

  const items = POS_CATALOG[currentCategory] || [];
  container.innerHTML = items.map(item => `
    <div class="pos-item-card" onclick="addToCart('${item.id}')">
      <div class="app-icon-squircle-sm ${item.iconClass || 'app-icon-blue'}">
        ${item.icon}
      </div>
      <div class="pos-item-name">${item.name}</div>
      <div class="pos-item-price">₹${item.price.toFixed(2)} <span style="font-size:9.5px;color:var(--text-muted);">(+${item.gstRate}%)</span></div>
    </div>
  `).join('');
}

window.addToCart = function(itemId) {
  const allItems = [...POS_CATALOG.retail, ...POS_CATALOG.restaurant, ...POS_CATALOG.electronics];
  const item = allItems.find(i => i.id === itemId);
  if (!item) return;

  const existing = cart.find(c => c.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  renderPosCart();
};

window.updateQty = function(itemId, delta) {
  const item = cart.find(c => c.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(c => c.id !== itemId);
  }
  renderPosCart();
};

window.clearCart = function() {
  cart = [];
  renderPosCart();
};

function renderPosCart() {
  const listContainer = document.getElementById('pos-cart-list');
  const subtotalEl = document.getElementById('pos-subtotal');
  const cgstEl = document.getElementById('pos-cgst');
  const sgstEl = document.getElementById('pos-sgst');
  const grandtotalEl = document.getElementById('pos-grandtotal');

  if (!listContainer) return;

  if (cart.length === 0) {
    listContainer.innerHTML = `<div style="text-align:center;padding:24px 0;color:var(--text-muted);font-size:12.5px;">Cart is empty. Tap items to add.</div>`;
    if (subtotalEl) subtotalEl.textContent = '₹0.00';
    if (cgstEl) cgstEl.textContent = '₹0.00';
    if (sgstEl) sgstEl.textContent = '₹0.00';
    if (grandtotalEl) grandtotalEl.textContent = '₹0.00';
    return;
  }

  let subtotal = 0;
  let totalTax = 0;

  listContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    const tax = (itemTotal * item.gstRate) / 100;
    subtotal += itemTotal;
    totalTax += tax;

    return `
      <div class="cart-item-row">
        <div>
          <strong style="font-size:12px;color:var(--text-primary);">${item.name}</strong>
          <div style="font-size:11px;color:var(--text-muted);font-family:var(--font-mono);">₹${item.price} × ${item.qty} = ₹${itemTotal.toFixed(2)}</div>
        </div>
        <div class="cart-qty-ctrl">
          <button type="button" class="qty-btn" onclick="updateQty('${item.id}', -1)">−</button>
          <span style="font-weight:700;font-size:12px;min-width:14px;text-align:center;">${item.qty}</span>
          <button type="button" class="qty-btn" onclick="updateQty('${item.id}', 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  const halfTax = totalTax / 2;
  const grandTotal = subtotal + totalTax;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (cgstEl) cgstEl.textContent = `₹${halfTax.toFixed(2)}`;
  if (sgstEl) sgstEl.textContent = `₹${halfTax.toFixed(2)}`;
  if (grandtotalEl) grandtotalEl.textContent = `₹${grandTotal.toFixed(2)}`;
}

/* --------------------------------------------------------------------------
   Thermal Invoice Modal & GST Receipt Generator
   -------------------------------------------------------------------------- */
function initInvoiceModal() {
  const genBtn = document.getElementById('generate-invoice-btn');
  if (genBtn) {
    genBtn.addEventListener('click', generateThermalReceipt);
  }

  const modal = document.getElementById('invoice-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeInvoiceModal();
      }
    });
  }

  const closeBtn = document.getElementById('modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeInvoiceModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeInvoiceModal();
    }
  });
}

function generateThermalReceipt() {
  if (cart.length === 0) {
    alert('Please add at least one item to the cart first.');
    return;
  }

  const modal = document.getElementById('invoice-modal');
  const itemsBody = document.getElementById('invoice-items-body');
  if (!modal || !itemsBody) return;

  const now = new Date();
  const invoiceNo = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  let subtotal = 0;
  let totalTax = 0;

  itemsBody.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.qty;
    const tax = (itemTotal * item.gstRate) / 100;
    subtotal += itemTotal;
    totalTax += tax;

    return `
      <tr>
        <td>
          <strong style="color:#0F172A;font-size:12.5px;">${item.name}</strong>
          <div style="font-size:10.5px;color:#64748B;font-family:var(--font-mono);margin-top:2px;">HSN: ${item.hsn || '0000'} | GST: ${item.gstRate}%</div>
        </td>
        <td style="text-align:center;font-weight:700;font-size:13px;">${item.qty}</td>
        <td style="text-align:right;font-family:var(--font-mono);font-size:12px;">₹${item.price.toFixed(2)}</td>
        <td style="text-align:right;font-family:var(--font-mono);font-weight:700;font-size:12.5px;color:var(--terracotta-deep);">₹${itemTotal.toFixed(2)}</td>
      </tr>
    `;
  }).join('');

  const halfTax = totalTax / 2;
  const grandTotal = subtotal + totalTax;

  const invNumEl = document.getElementById('inv-number');
  const invDateEl = document.getElementById('inv-date');
  const invSubtotalEl = document.getElementById('inv-subtotal');
  const invCgstEl = document.getElementById('inv-cgst');
  const invSgstEl = document.getElementById('inv-sgst');
  const invGrandtotalEl = document.getElementById('inv-grandtotal');

  if (invNumEl) invNumEl.textContent = invoiceNo;
  if (invDateEl) invDateEl.textContent = dateStr;
  if (invSubtotalEl) invSubtotalEl.textContent = `₹${subtotal.toFixed(2)}`;
  if (invCgstEl) invCgstEl.textContent = `₹${halfTax.toFixed(2)}`;
  if (invSgstEl) invSgstEl.textContent = `₹${halfTax.toFixed(2)}`;
  if (invGrandtotalEl) invGrandtotalEl.textContent = `₹${grandTotal.toFixed(2)}`;

  modal.classList.add('open');
}

window.closeInvoiceModal = function() {
  const modal = document.getElementById('invoice-modal');
  if (modal) modal.classList.remove('open');
};

window.printInvoice = function() {
  window.print();
};

/* --------------------------------------------------------------------------
   WhatsApp AI Chatbot Simulation Engine
   -------------------------------------------------------------------------- */
const WA_RESPONSES = {
  'hi': "👋 Hello! Welcome to VANQUR Studio. How can we elevate your business today?",
  'hello': "👋 Hey there! Welcome to VANQUR Studio. Feel free to explore our services or ask for pricing!",
  'price': "💰 **Project Estimates:**\n• Modern Websites: ₹15,000 - ₹35,000\n• POS & GST Billing: ₹24,000 - ₹55,000\n• ERP / Custom SaaS: ₹45,000+\n• WhatsApp AI Bot: ₹18,000\nWould you like a formal quote for your business?",
  'pos': "🛒 **VANQUR Smart POS:**\n• High-speed billing & thermal printing\n• Barcode scanning & live inventory\n• GST invoice generation with HSN codes\n• Works 100% offline & syncs to cloud!",
  'web': "🌐 **Custom Web Development:**\n• Lightning-fast load times (< 0.8s)\n• SEO-optimized & mobile-first UI\n• E-commerce & secure payment gateways\n• Built on modern tech stack.",
  'timeline': "⚡ **Delivery Timeline:**\n• Landing Pages: 2 - 4 business days\n• Full Websites / POS: 1 - 2 weeks\n• Custom ERP / SaaS: 3 - 6 weeks\nWe offer milestone tracking & daily progress updates!",
  'whatsapp': "📱 **WhatsApp AI Commerce Bot:**\n• Automatic product catalog & ordering\n• Instant FAQ answering & lead capture\n• Payment links & order status alerts\n• Cloud API integration with your DB!",
  'default': "🚀 Thanks for reaching out! Our software engineering team specializes in custom websites, POS billing systems, ERPs and WhatsApp AI automations. Would you like to connect directly on WhatsApp with our lead developer?"
};

function initWhatsAppBot() {
  const container = document.getElementById('wa-messages-body');
  if (!container) return;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  container.innerHTML = `
    <div class="wa-bubble bot">
      👋 Hello! Welcome to <strong>VANQUR Software Studio</strong>. I am your AI Business Assistant.<br><br>
      How can I assist your business growth today?
      <span class="wa-bubble-time">${timeStr}</span>
    </div>
    <div class="wa-bubble bot">
      💡 <em>Tip: Tap any quick suggestion chip below or type your questions!</em>
      <span class="wa-bubble-time">${timeStr}</span>
    </div>
  `;
}

window.sendQuickMessage = function(text) {
  const input = document.getElementById('wa-chat-input');
  if (input) {
    input.value = text;
    executeWaMessage();
  }
};

window.handleWaChatSubmit = function(e) {
  if (e) e.preventDefault();
  executeWaMessage();
};

function executeWaMessage() {
  const input = document.getElementById('wa-chat-input');
  const container = document.getElementById('wa-messages-body');
  if (!input || !container || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  // 1. Append User Message
  const userBubble = document.createElement('div');
  userBubble.className = 'wa-bubble user';
  userBubble.innerHTML = `${escapeHtml(text)}<span class="wa-bubble-time">${timeStr} <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34B7F1" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline><polyline points="20 11 12 19"></polyline></svg></span>`;
  container.appendChild(userBubble);
  container.scrollTop = container.scrollHeight;

  // 2. Show Typing Indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'wa-typing-indicator';
  typingIndicator.id = 'wa-typing-active';
  typingIndicator.innerHTML = `
    <span class="wa-typing-dot"></span>
    <span class="wa-typing-dot"></span>
    <span class="wa-typing-dot"></span>
  `;
  container.appendChild(typingIndicator);
  container.scrollTop = container.scrollHeight;

  // 3. Generate Smart Bot Response after brief delay
  setTimeout(() => {
    const activeTyping = document.getElementById('wa-typing-active');
    if (activeTyping) activeTyping.remove();

    let reply = WA_RESPONSES.default;
    const lower = text.toLowerCase();

    if (lower.includes('price') || lower.includes('cost') || lower.includes('estimate') || lower.includes('quote') || lower.includes('rate')) {
      reply = WA_RESPONSES.price;
    } else if (lower.includes('pos') || lower.includes('bill') || lower.includes('gst') || lower.includes('receipt') || lower.includes('thermal') || lower.includes('retail')) {
      reply = WA_RESPONSES.pos;
    } else if (lower.includes('web') || lower.includes('site') || lower.includes('portfolio') || lower.includes('app') || lower.includes('ecommerce')) {
      reply = WA_RESPONSES.web;
    } else if (lower.includes('time') || lower.includes('fast') || lower.includes('deliver') || lower.includes('duration') || lower.includes('day')) {
      reply = WA_RESPONSES.timeline;
    } else if (lower.includes('whats') || lower.includes('bot') || lower.includes('chat') || lower.includes('auto')) {
      reply = WA_RESPONSES.whatsapp;
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('vanakkam')) {
      reply = WA_RESPONSES.hi;
    }

    const formattedReply = reply.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    const botBubble = document.createElement('div');
    botBubble.className = 'wa-bubble bot';
    botBubble.innerHTML = `${formattedReply}<span class="wa-bubble-time">${timeStr}</span>`;
    container.appendChild(botBubble);
    container.scrollTop = container.scrollHeight;
  }, 500);
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
