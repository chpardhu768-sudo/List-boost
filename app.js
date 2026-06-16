// ── Theme Toggle ──
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('listo-theme');
if (savedTheme === 'dark') html.classList.add('dark');

themeBtn.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.setItem('listo-theme', html.classList.contains('dark') ? 'dark' : 'light');
  themeBtn.textContent = html.classList.contains('dark') ? '☀️' : '🌙';
});
if (html.classList.contains('dark')) themeBtn.textContent = '☀️';

// ── Mobile Menu ──
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (mobileMenu.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  }
});
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '1';
    spans[2].style.transform = '';
  });
});

// ── Smooth Scroll ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Scroll Animations ──
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ── Feature Card Clicks → Open Tab ──
document.querySelectorAll('.feature-card[data-feature]').forEach(card => {
  card.addEventListener('click', () => {
    const tabId = card.dataset.feature;
    const panel = document.getElementById('resultsPanel');
    if (panel.classList.contains('visible')) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
      if (tabBtn) tabBtn.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      document.getElementById('input').scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Enter a product and click Analyze first!');
    }
  });
});

// ── Input Pulse ──
setTimeout(() => {
  const ta = document.getElementById('productInput');
  if (ta) ta.classList.add('pulse');
  setTimeout(() => ta && ta.classList.remove('pulse'), 2000);
}, 1000);

// ── Example Clicks ──
document.querySelectorAll('.example-chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.getElementById('productInput').value = chip.dataset.text;
  });
});

// ── Analyze ──
const analyzeBtn = document.getElementById('analyzeBtn');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const resultsPanel = document.getElementById('resultsPanel');

analyzeBtn.addEventListener('click', () => {
  const input = document.getElementById('productInput').value.trim();
  if (!input) {
    document.getElementById('productInput').focus();
    return;
  }
  analyzeBtn.disabled = true;
  analyzeBtn.classList.add('loading');
  analyzeBtn.innerHTML = '<span class="spinner"></span> Processing…';
  progressBar.classList.add('active');
  progressFill.style.width = '0%';
  setTimeout(() => progressFill.style.width = '40%', 100);
  setTimeout(() => progressFill.style.width = '70%', 800);
  setTimeout(() => progressFill.style.width = '95%', 1500);
  setTimeout(() => {
    progressFill.style.width = '100%';
    setTimeout(() => {
      analyzeBtn.disabled = false;
      analyzeBtn.classList.remove('loading');
      analyzeBtn.innerHTML = '🔍 Analyze';
      progressBar.classList.remove('active');
      progressFill.style.width = '0%';
      populateResults(input);
      resultsPanel.classList.add('visible');
      resultsPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      showToast('Listing analyzed successfully!');
    }, 400);
  }, 2200);
});

// ── Tabs ──
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ── Populate Results ──
function populateResults(input) {
  const isURL = input.startsWith('http');
  const productName = isURL ? 'Smart Bluetooth Headphones X10' : input;
  const shortName = productName.length > 50 ? productName.slice(0, 50) + '…' : productName;

  // SEO Titles
  const titles = [
    `${productName} – Premium Quality | Free Shipping | Best Price 2026`,
    `Buy ${shortName} Online at Lowest Price | Top Rated`,
    `${shortName} | Fast Delivery | 1 Year Warranty | Shop Now`,
    `Official ${shortName} – Compare Prices & Save Big`,
    `${shortName} – #1 Best Seller | Customer Reviews | Deals`
  ];
  const titleList = document.getElementById('titleList');
  titleList.innerHTML = '';
  titles.forEach(t => {
    const div = document.createElement('div');
    div.className = 'title-item';
    div.innerHTML = `<span>${t}</span><button class="copy-btn" onclick="copyText(this,'${t.replace(/'/g, "\\'")}')">📋<span class="tooltip">Copied!</span></button>`;
    titleList.appendChild(div);
  });

  // Description
  updateDescription();

  // Specs
  const specs = [
    ['Product Name', productName],
    ['Dimensions (L×W×H)', '16 cm × 8 cm × 3 cm'],
    ['Weight', '250 g'],
    ['Available Variants', 'Black, Blue, White (3 colors)'],
    ['Price Range', '₹1,999 – ₹2,499'],
    ['Offers', '15% off + Cashback'],
    ['Rating', '4.3 ★ (2,456 reviews)'],
    ['Marketplace', 'Amazon.in']
  ];
  const tbody = document.getElementById('specsBody');
  tbody.innerHTML = '';
  specs.forEach(([prop, val]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td class="prop">${prop}</td><td>${val}</td>`;
    tbody.appendChild(tr);
  });
}

// ── Generate Description ──
function updateDescription() {
  const length = document.getElementById('descLength').value;
  const tone = document.getElementById('descTone').value;
  const box = document.getElementById('descText');
  box.style.opacity = '0.3';

  const descriptions = {
    'short-professional': 'Premium quality product designed for modern consumers. Built with advanced technology and superior materials to deliver exceptional performance. Ideal for everyday use with reliable durability.',
    'short-casual': 'Love great products? This one\'s got you covered! Super handy, looks amazing, and works like a charm. Grab yours today! 🎉',
    'short-premium': 'Meticulously crafted with premium-grade materials. An exquisite addition to your collection, embodying sophistication and superior craftsmanship.',
    'medium-professional': 'Introducing a cutting-edge product engineered for peak performance and lasting quality. Our advanced manufacturing process ensures each unit meets the highest industry standards. Features include innovative design elements, premium construction materials, and comprehensive quality testing. Backed by our satisfaction guarantee and dedicated customer support team, this product delivers exceptional value and reliability for discerning consumers.',
    'medium-casual': 'Here\'s the deal – this product is seriously awesome! It\'s packed with cool features that make your life easier, looks great on your desk or wherever you use it, and won\'t let you down when you need it most. Plus, it comes with free shipping and easy returns. What\'s not to love? Get it now and see what the hype is all about! 😎',
    'medium-premium': 'A masterpiece of modern engineering, this product represents the pinnacle of design and functionality. Every detail has been thoughtfully considered, from the premium-grade materials to the refined aesthetics. Designed for those who demand nothing but the finest, it delivers an unparalleled experience that transcends ordinary expectations. Elevate your standards with a product worthy of your distinction.',
    'long-professional': 'We are proud to present this state-of-the-art product, designed to exceed expectations across every metric that matters. Engineered using cutting-edge technology and premium-grade materials, this product delivers consistent, reliable performance in any environment. Our rigorous quality assurance process involves multiple stages of testing to ensure each unit meets international standards. Key features include advanced functionality, ergonomic design, and energy efficiency. The product comes with comprehensive documentation, a detailed user guide, and access to our 24/7 customer support team. Whether you are upgrading your existing setup or making a first-time purchase, this product offers exceptional value with a proven track record of customer satisfaction. Backed by our industry-leading warranty and hassle-free return policy.',
    'long-casual': 'Okay, let me tell you why everyone is obsessed with this product! First off – it looks AMAZING. Sleek, modern, and totally Instagram-worthy. But it\'s not just a pretty face – this thing performs like a champ! Whether you\'re using it daily or just on weekends, it delivers every single time. The setup is super easy (like, 5 minutes tops), and it works right out of the box. Plus, the company behind it has awesome customer service – they actually respond to your messages! Shipping is fast, returns are free, and there\'s a solid warranty included. Over 2,000 happy customers can\'t be wrong. Seriously, stop scrolling and add this to your cart! 🚀🔥',
    'long-premium': 'Behold a product that redefines excellence in its category. Conceived by world-class designers and brought to life through precision manufacturing, every element speaks to an unwavering commitment to quality. The exterior showcases a refined aesthetic with clean lines and luxurious finishes, while the interior houses advanced technology that delivers remarkable performance. Crafted from sustainably sourced, premium-grade materials, this product is built to endure while minimizing environmental impact. The attention to detail extends from the packaging experience to the product itself – each unit arrives in bespoke packaging that reflects the premium nature of your purchase. Backed by an exclusive concierge support service and our comprehensive lifetime quality guarantee, this is more than a product – it is a statement of refined taste and discerning judgment.'
  };

  setTimeout(() => {
    const key = `${length}-${tone}`;
    box.textContent = descriptions[key] || descriptions['medium-professional'];
    box.style.opacity = '1';
  }, 500);
}

document.getElementById('descLength').addEventListener('change', updateDescription);
document.getElementById('descTone').addEventListener('change', updateDescription);

// ── Copy ──
function copyText(btn, text) {
  navigator.clipboard.writeText(text).catch(() => {});
  const tip = btn.querySelector('.tooltip');
  tip.classList.add('show');
  setTimeout(() => tip.classList.remove('show'), 1200);
}

function copyDescription() {
  const text = document.getElementById('descText').textContent;
  navigator.clipboard.writeText(text).catch(() => {});
  showToast('Description copied!');
}

function copyAllResults() {
  const titles = [...document.querySelectorAll('.title-item span')].map(s => s.textContent).join('\n');
  const desc = document.getElementById('descText').textContent;
  const specs = [...document.querySelectorAll('#specsBody tr')].map(tr => {
    const cells = tr.querySelectorAll('td');
    return `${cells[0].textContent}: ${cells[1].textContent}`;
  }).join('\n');
  const all = `SEO TITLES:\n${titles}\n\nDESCRIPTION:\n${desc}\n\nSPECS:\n${specs}`;
  navigator.clipboard.writeText(all).catch(() => {});
  showToast('All results copied!');
}

// ── Calculator ──
const calcInputs = document.querySelectorAll('.calc-input');
calcInputs.forEach(inp => inp.addEventListener('input', calculateProfit));

function calculateProfit() {
  const cost = parseFloat(document.getElementById('costPrice').value) || 0;
  const ship = parseFloat(document.getElementById('shippingCost').value) || 0;
  const commission = parseFloat(document.getElementById('commission').value) || 15;
  const margin = parseFloat(document.getElementById('targetMargin').value) || 20;

  const totalCost = cost + ship;
  const breakEven = totalCost / (1 - commission / 100);
  const sellingPrice = totalCost / (1 - (commission + margin) / 100);
  const profit = sellingPrice - totalCost - (sellingPrice * commission / 100);

  const curr = document.getElementById('currencySelect').value;
  const sym = { INR: '₹', USD: '$', EUR: '€' }[curr] || '₹';

  const spEl = document.getElementById('sellingPrice');
  const prEl = document.getElementById('estProfit');
  const beEl = document.getElementById('breakEven');

  spEl.textContent = `${sym}${sellingPrice.toFixed(0)}`;
  prEl.textContent = `${sym}${profit.toFixed(0)}`;
  beEl.textContent = `${sym}${breakEven.toFixed(0)}`;

  [spEl, prEl, beEl].forEach(el => {
    el.parentElement.classList.remove('pulse-once');
    void el.parentElement.offsetWidth;
    el.parentElement.classList.add('pulse-once');
  });
}

document.getElementById('currencySelect').addEventListener('change', calculateProfit);
document.getElementById('marketplace').addEventListener('change', function () {
  const rates = { amazon: 15, flipkart: 18, shopify: 5, custom: 10 };
  document.getElementById('commission').value = rates[this.value] || 15;
  calculateProfit();
});

function resetCalc() {
  document.getElementById('costPrice').value = '';
  document.getElementById('shippingCost').value = '';
  document.getElementById('commission').value = '15';
  document.getElementById('targetMargin').value = '20';
  document.getElementById('sellingPrice').textContent = '₹0';
  document.getElementById('estProfit').textContent = '₹0';
  document.getElementById('breakEven').textContent = '₹0';
}

// ── Export CSV ──
function exportCSV() {
  const titles = [...document.querySelectorAll('.title-item span')].map(s => s.textContent);
  const desc = document.getElementById('descText').textContent;
  const specs = [...document.querySelectorAll('#specsBody tr')].map(tr => {
    const cells = tr.querySelectorAll('td');
    return [cells[0].textContent, cells[1].textContent];
  });
  let csv = 'Category,Content\n';
  titles.forEach((t, i) => csv += `"Title ${i + 1}","${t}"\n`);
  csv += `"Description","${desc.replace(/"/g, '""')}"\n`;
  specs.forEach(([p, v]) => csv += `"${p}","${v}"\n`);
  const sp = document.getElementById('sellingPrice').textContent;
  const pr = document.getElementById('estProfit').textContent;
  const be = document.getElementById('breakEven').textContent;
  csv += `"Selling Price","${sp}"\n"Est. Profit","${pr}"\n"Break Even","${be}"\n`;
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'listo-export.csv';
  a.click();
  showToast('CSV exported!');
}

// ── Export PDF (simple) ──
function exportPDF() {
  const w = window.open('', '_blank');
  const titles = [...document.querySelectorAll('.title-item span')].map(s => `<li>${s.textContent}</li>`).join('');
  const desc = document.getElementById('descText').textContent;
  const specsRows = [...document.querySelectorAll('#specsBody tr')].map(tr => {
    const c = tr.querySelectorAll('td');
    return `<tr><td style="font-weight:600;padding:8px;border:1px solid #ddd">${c[0].textContent}</td><td style="padding:8px;border:1px solid #ddd">${c[1].textContent}</td></tr>`;
  }).join('');
  const sp = document.getElementById('sellingPrice').textContent;
  const pr = document.getElementById('estProfit').textContent;
  const be = document.getElementById('breakEven').textContent;
  w.document.write(`<!DOCTYPE html><html><head><title>Listo Export</title><style>body{font-family:Inter,sans-serif;padding:40px;color:#1e293b}h1{color:#0ea5e9}h2{color:#059669;margin-top:30px}table{border-collapse:collapse;width:100%}li{margin:8px 0}p{line-height:1.8}.price-box{display:inline-block;padding:12px 24px;margin:8px;background:#f0fdf4;border-radius:8px;text-align:center}.price-box .label{font-size:12px;color:#64748b}.price-box .val{font-size:24px;font-weight:700}</style></head><body><h1>📦 Listo – Listing Report</h1><h2>SEO Titles</h2><ol>${titles}</ol><h2>Description</h2><p>${desc}</p><h2>Product Specs</h2><table>${specsRows}</table><h2>Pricing</h2><div class="price-box"><div class="label">Selling Price</div><div class="val">${sp}</div></div><div class="price-box"><div class="label">Est. Profit</div><div class="val">${pr}</div></div><div class="price-box"><div class="label">Break Even</div><div class="val">${be}</div></div></body></html>`);
  w.document.close();
  setTimeout(() => { w.print(); }, 500);
  showToast('PDF ready to print!');
}

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── FAQ ──
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ── Onboarding ──
const onboardSteps = [
  { title: 'Welcome to Listo! 👋', text: 'Paste your product URL or title in the input box to get started.' },
  { title: 'Get SEO Titles 🔍', text: 'Click "Analyze" to generate optimized titles, descriptions, and product data.' },
  { title: 'Calculate Profits 💰', text: 'Use the Price Calculator tab to find your ideal selling price and margins.' },
  { title: 'Export Everything 📄', text: 'Copy individual items or export all results as CSV/PDF in one click.' }
];
let onboardIdx = 0;
const overlay = document.getElementById('onboardOverlay');
const onboardTitle = document.getElementById('onboardTitle');
const onboardText = document.getElementById('onboardText');
const onboardDots = document.getElementById('onboardDots');

function showOnboard() {
  if (localStorage.getItem('listo-onboarded')) return;
  overlay.classList.add('active');
  renderOnboardStep();
}
function renderOnboardStep() {
  const step = onboardSteps[onboardIdx];
  onboardTitle.textContent = step.title;
  onboardText.textContent = step.text;
  onboardDots.innerHTML = onboardSteps.map((_, i) =>
    `<span class="${i === onboardIdx ? 'active' : ''}"></span>`
  ).join('');
}
function nextOnboard() {
  if (onboardIdx < onboardSteps.length - 1) { onboardIdx++; renderOnboardStep(); }
  else closeOnboard();
}
function closeOnboard() {
  overlay.classList.remove('active');
  localStorage.setItem('listo-onboarded', '1');
}

// ── Regenerate Description ──
function regenerateDesc() { updateDescription(); showToast('Description regenerated!'); }

// ── Init ──
calculateProfit();
setTimeout(showOnboard, 1500);
