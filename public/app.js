/* ==================== CONFIG ==================== */
const RUB_USD = 95;
function rub(usd) {
  return Math.floor((usd * RUB_USD) / 100) * 100;
}
function fmt(n) {
  return n.toLocaleString('ru-RU') + ' \u20BD';
}

/* ==================== PRODUCTS DATA ==================== */
const PRODUCTS = [
  {
    id: 'claude',
    name: 'Claude',
    icon: 'C',
    iconClass: 'icon-claude',
    tagline: 'Anthropic \u00B7 \u043E\u0442 $20/\u043C\u0435\u0441',
    plans: [
      { name: 'Pro', usd: 20, desc: '\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B, \u0434\u043E\u0441\u0442\u0443\u043F \u043A \u0441\u0442\u0430\u0440\u0448\u0438\u043C \u043C\u043E\u0434\u0435\u043B\u044F\u043C (\u0432\u043A\u043B\u044E\u0447\u0430\u044F Opus), \u043F\u043B\u0430\u043D\u0438\u0440\u043E\u0432\u0449\u0438\u043A \u0437\u0430\u0434\u0430\u0447, \u0438\u043D\u0442\u0435\u0433\u0440\u0430\u0446\u0438\u0438 (Chrome, Office), \u043F\u0440\u043E\u0435\u043A\u0442\u044B \u0438 \u0432\u0441\u0442\u0440\u043E\u0435\u043D\u043D\u044B\u0439 Claude Code. $200/\u0433\u043E\u0434 (~$17/\u043C\u0435\u0441).' },
      { name: 'Max 5x', usd: 100, desc: '\u041B\u0438\u043C\u0438\u0442 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439 \u0438 \u043E\u0431\u044A\u0451\u043C \u0441\u0435\u0441\u0441\u0438\u0439 \u0432 5 \u0440\u0430\u0437 \u0432\u044B\u0448\u0435, \u0447\u0435\u043C \u0443 Pro. \u0422\u043E\u043B\u044C\u043A\u043E \u043F\u043E\u043C\u0435\u0441\u044F\u0447\u043D\u043E.' },
      { name: 'Max 20x', usd: 200, desc: '\u041B\u0438\u043C\u0438\u0442 \u0438 \u043E\u0431\u044A\u0451\u043C \u0441\u0435\u0441\u0441\u0438\u0439 \u0432 20 \u0440\u0430\u0437 \u0432\u044B\u0448\u0435 Pro. \u0414\u043B\u044F \u0442\u044F\u0436\u0451\u043B\u043E\u0439 \u0440\u0430\u0431\u043E\u0442\u044B \u0441 Claude Code.' },
      { name: 'Team Standard', usd: 20, desc: '\u041E\u0442 5 \u0447\u0435\u043B\u043E\u0432\u0435\u043A. $25/\u043C\u0435\u0441 \u0438\u043B\u0438 $20/\u043C\u0435\u0441 \u0437\u0430 \u043C\u0435\u0441\u0442\u043E \u0433\u043E\u0434\u043E\u0432\u043E\u0439 \u043E\u043F\u043B\u0430\u0442\u0435 (1.25\u00D7 \u043E\u0442 Pro). SSO, \u0435\u0434\u0438\u043D\u044B\u0439 \u0431\u0438\u043B\u043B\u0438\u043D\u0433, \u043E\u0431\u0449\u0438\u0435 \u043F\u0430\u043F\u043A\u0438.' },
      { name: 'Team Premium', usd: 100, desc: '\u041E\u0442 5 \u0447\u0435\u043B\u043E\u0432\u0435\u043A. $100/\u043C\u0435\u0441 \u0437\u0430 \u043C\u0435\u0441\u0442\u043E \u0433\u043E\u0434\u043E\u0432\u043E\u0439 \u043E\u043F\u043B\u0430\u0442\u0435 (6.25\u00D7 \u043E\u0442 Pro). SSO, \u043A\u043E\u0440\u043F\u043E\u0440\u0430\u0442\u0438\u0432\u043D\u044B\u0439 \u0434\u043E\u043C\u0435\u043D, \u043E\u0431\u0449\u0438\u0435 \u043F\u0430\u043F\u043A\u0438.' },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: 'G',
    iconClass: 'icon-gpt',
    tagline: 'OpenAI \u00B7 \u043E\u0442 $8/\u043C\u0435\u0441',
    plans: [
      { name: 'Go', usd: 8, desc: '\u0411\u044E\u0434\u0436\u0435\u0442\u043D\u044B\u0439. \u0412\u0441\u0435 \u0444\u0443\u043D\u043A\u0446\u0438\u0438 Free, \u0443\u0432\u0435\u043B\u0438\u0447\u0435\u043D\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B \u043D\u0430 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F, \u0432\u044B\u0437\u043E\u0432 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442\u043E\u0432, \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0438 \u0433\u043E\u043B\u043E\u0441\u043E\u0432\u044B\u0435 \u0447\u0430\u0442\u044B.' },
      { name: 'Plus', usd: 20, desc: '\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439. \u041F\u0440\u043E\u0434\u0432\u0438\u043D\u0443\u0442\u044B\u0435 \u043C\u043E\u0434\u0435\u043B\u0438 \u0440\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u0439 (GPT-6, Thinking), \u0440\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B, \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044F \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0439, \u043F\u0440\u043E\u0435\u043A\u0442\u044B, Custom GPT, Codex, \u0433\u043B\u0443\u0431\u043E\u043A\u0438\u0435 \u0438\u0441\u0441\u043B\u0435\u0434\u043E\u0432\u0430\u043D\u0438\u044F.' },
      { name: 'Pro', usd: 100, desc: '\u0420\u0430\u0441\u0441\u0443\u0436\u0434\u0435\u043D\u0438\u044F Pro \u043D\u0430 GPT-6 Astra, \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B (5\u201320\u00D7 Plus), \u0430\u0433\u0435\u043D\u0442 (dot), \u043A\u0440\u0435\u0434\u0438\u0442\u044B API \u0434\u043E $500/\u043C\u0435\u0441.' },
      { name: 'Business', usd: 20, desc: '\u0414\u043B\u044F \u043A\u043E\u043C\u0430\u043D\u0434 2\u2013200 \u0441\u043E\u0442\u0440\u0443\u0434\u043D\u0438\u043A\u043E\u0432. \u041E\u0431\u0449\u0435\u0435 \u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E, \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435, SAML/SSO, \u0431\u0435\u0437 \u043E\u0431\u0443\u0447\u0435\u043D\u0438\u044F \u043C\u043E\u0434\u0435\u043B\u0435\u0439 \u043D\u0430 \u0434\u0430\u043D\u043D\u044B\u0445.' },
      { name: 'Enterprise', usd: 0, desc: '\u0414\u043B\u044F \u043A\u0440\u0443\u043F\u043D\u044B\u0445 \u043E\u0440\u0433\u0430\u043D\u0438\u0437\u0430\u0446\u0438\u0439, \u0446\u0435\u043D\u0430 \u0438\u043D\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043B\u044C\u043D\u043E. \u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u043E\u0435 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u043D\u043E\u0435 \u043E\u043A\u043D\u043E, \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u0430\u044F \u0431\u0435\u0437\u043E\u043F\u0430\u0441\u043D\u043E\u0441\u0442\u044C, \u0430\u0443\u0434\u0438\u0442, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u043A\u0430 24/7.', custom: true },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: '\u2726',
    iconClass: 'icon-gemini',
    tagline: 'Google \u00B7 \u043E\u0442 $4.99/\u043C\u0435\u0441',
    plans: [
      { name: 'Google AI Plus', usd: 4.99, desc: '400 \u0413\u0411 \u043E\u0431\u043B\u0430\u0447\u043D\u043E\u0433\u043E \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430, \u0441\u0435\u043C\u0435\u0439\u043D\u044B\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u0434\u043E 5 \u0447\u0435\u043B\u043E\u0432\u0435\u043A, \u0443\u0434\u0432\u043E\u0435\u043D\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B, \u043C\u043E\u0434\u0435\u043B\u044C Flash.' },
      { name: 'Google AI Pro', usd: 19.99, desc: '5 \u0422\u0411 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430, \u0432 4 \u0440\u0430\u0437\u0430 \u0431\u043E\u043B\u044C\u0448\u0435 \u043B\u0438\u043C\u0438\u0442\u043E\u0432, Gemini 4 Argon, Pro/Flash, Google Antigravity \u0434\u043B\u044F \u043A\u043E\u0434\u0430, YouTube, Google Home.' },
      { name: 'Google AI Ultra', usd: 99.99, desc: '\u041E\u0442 20 \u0422\u0411 \u0445\u0440\u0430\u043D\u0438\u043B\u0438\u0449\u0430, \u043C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0435 \u043B\u0438\u043C\u0438\u0442\u044B (5\u201320\u00D7), YouTube Premium, Project Genie, Colab (2000 \u0435\u0434\u0438\u043D\u0438\u0446), Google Cloud ($40).' },
    ],
  },
];

/* ==================== STATE ==================== */
let reviewsData = null;
let reviewsShown = 0;
const REVIEWS_PER_PAGE = 12;
let currentBuy = null;
let tg = window.Telegram && window.Telegram.WebApp;

/* ==================== INIT ==================== */
document.addEventListener('DOMContentLoaded', init);

function init() {
  if (tg) {
    try {
      tg.ready();
      tg.expand();
      tg.setHeaderColor('#0a0a0b');
      tg.setBackgroundColor('#0a0a0b');
    } catch (_) {}
  }
  renderProducts();
  loadReviews();
  identifyUser();
}

function getUser() {
  const u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
  if (u) return { tg_id: u.id, username: u.username || '', first_name: u.first_name || '' };
  return { tg_id: '', username: '', first_name: '' };
}

async function identifyUser() {
  const u = getUser();
  if (!u.tg_id) return;
  try {
    await fetch('/api/identify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u),
    });
  } catch (_) {}
}

/* ==================== NAVIGATION ==================== */
function showScreen(name) {
  document.querySelectorAll('.screen').forEach(function (s) { s.classList.remove('active'); });
  const el = document.getElementById('screen-' + name);
  if (el) el.classList.add('active');
  document.querySelectorAll('.hotbar-item').forEach(function (b) {
    b.classList.toggle('active', b.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==================== PRODUCTS ==================== */
function renderProducts() {
  const wrap = document.getElementById('products-list');
  wrap.innerHTML = PRODUCTS.map(function (p, pi) {
    const plansHtml = p.plans.map(function (pl, idx) {
      const priceTxt = pl.custom ? '\u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443' : fmt(rub(pl.usd));
      const btnTxt = pl.custom ? '\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F' : '\u041A\u0443\u043F\u0438\u0442\u044C';
      return '<div class="plan" style="animation-delay:' + (idx * 0.05) + 's">' +
        '<div class="plan-top"><span class="plan-name">' + pl.name + '</span>' +
        '<span class="plan-price">' + priceTxt + '</span></div>' +
        '<div class="plan-desc">' + pl.desc + '</div>' +
        '<button class="plan-buy" data-p="' + p.name + '" data-plan="' + pl.name + '" data-usd="' + pl.usd + '" data-custom="' + (pl.custom ? 1 : 0) + '">' + btnTxt + '</button>' +
        '</div>';
    }).join('');
    return '<div class="product" data-id="' + p.id + '" style="animation-delay:' + (pi * 0.08) + 's">' +
      '<div class="product-head" data-toggle="' + p.id + '">' +
      '<div class="product-icon ' + p.iconClass + '">' + p.icon + '</div>' +
      '<div class="product-title"><h4>' + p.name + '</h4><span>' + p.tagline + '</span></div>' +
      '<div class="product-arrow">\u25BC</div></div>' +
      '<div class="product-body"><div class="plans">' + plansHtml + '</div></div></div>';
  }).join('');

  wrap.querySelectorAll('[data-toggle]').forEach(function (el) {
    el.addEventListener('click', function () { toggleProduct(el.dataset.toggle); });
  });
  wrap.querySelectorAll('.plan-buy').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      openBuy(btn.dataset.p, btn.dataset.plan, parseFloat(btn.dataset.usd), btn.dataset.custom === '1');
    });
  });
}

function toggleProduct(id) {
  const el = document.querySelector('.product[data-id="' + id + '"]');
  if (el) el.classList.toggle('open');
}

/* ==================== REVIEWS ==================== */
async function loadReviews() {
  try {
    const res = await fetch('reviews.json');
    reviewsData = await res.json();
    document.getElementById('stat-reviews').textContent = reviewsData.total;
    document.getElementById('stat-avg').textContent = reviewsData.avg.toFixed(2);
    renderReviewSummary();
    renderReviews(true);
  } catch (e) { console.error('reviews load error', e); }
}

function renderReviewSummary() {
  const d = reviewsData.distribution;
  const total = reviewsData.total;
  function bar(star) {
    const pct = (d[star] / total) * 100;
    return '<div class="rev-bar-row"><span class="rev-bar-lbl">' + star + '</span>' +
      '<div class="rev-bar-track"><div class="rev-bar-fill" data-w="' + pct + '"></div></div></div>';
  }
  const el = document.getElementById('rev-summary');
  el.innerHTML = '<div class="rev-avg"><div class="rev-avg-num">' + reviewsData.avg.toFixed(1) +
    '</div><div class="rev-avg-stars">\u2605\u2605\u2605\u2605\u2605</div>' +
    '<div class="rev-avg-cnt">' + total + ' \u043E\u0442\u0437\u044B\u0432\u043E\u0432</div></div>' +
    '<div class="rev-bars">' + [5, 4, 3, 2, 1].map(bar).join('') + '</div>';
  setTimeout(function () {
    el.querySelectorAll('.rev-bar-fill').forEach(function (f) { f.style.width = f.dataset.w + '%'; });
  }, 100);
}

function stars(n) {
  return '\u2605\u2605\u2605\u2605\u2605'.slice(0, n) + '\u2606\u2606\u2606\u2606\u2606'.slice(0, 5 - n);
}

function reviewCard(r) {
  const initial = r.name.charAt(0).toUpperCase();
  const badge = r.verified ? '<span class="verified-badge">\u2713</span>' : '';
  return '<div class="review"><div class="review-head"><div class="review-author">' +
    '<div class="review-avatar">' + initial + '</div><div>' +
    '<div class="review-name">' + r.name + badge + '</div>' +
    '<div class="review-meta">' + r.city + ' \u00B7 ' + r.date + '</div></div></div>' +
    '<div class="review-stars">' + stars(r.rating) + '</div></div>' +
    '<div class="review-text">' + r.text + '</div>' +
    '<span class="review-tag">' + r.product + ' \u00B7 ' + r.plan + '</span></div>';
}

function renderReviews(reset) {
  const list = document.getElementById('reviews-list');
  if (reset) { reviewsShown = 0; list.innerHTML = ''; }
  const next = reviewsData.reviews.slice(reviewsShown, reviewsShown + REVIEWS_PER_PAGE);
  list.insertAdjacentHTML('beforeend', next.map(reviewCard).join(''));
  reviewsShown += next.length;
  const btn = document.getElementById('load-more-btn');
  if (reviewsShown >= reviewsData.total) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    btn.textContent = '\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C \u0435\u0449\u0451 (' + (reviewsData.total - reviewsShown) + ')';
  }
}

function loadMoreReviews() { renderReviews(false); }

/* ==================== SUPPORT ==================== */
function openSupport() { document.getElementById('support-overlay').classList.add('show'); }
function closeSupport() { document.getElementById('support-overlay').classList.remove('show'); }

function submitSupport() {
  const subject = document.getElementById('support-subject').value.trim();
  const message = document.getElementById('support-message').value.trim();
  if (!subject && !message) { showToast('\u0417\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u043D\u043E \u043F\u043E\u043B\u0435'); return; }
  const btn = document.getElementById('support-send');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> \u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430...';
  setTimeout(function () {
    btn.disabled = false;
    btn.innerHTML = orig;
    closeSupport();
    document.getElementById('support-subject').value = '';
    document.getElementById('support-message').value = '';
    showToast('\u2705 \u041E\u0431\u0440\u0430\u0449\u0435\u043D\u0438\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043E!');
  }, 1400);
}

/* ==================== BUY ==================== */
function openBuy(product, plan, usd, isCustom) {
  currentBuy = { product: product, plan: plan, usd: usd, isCustom: isCustom };
  const title = document.getElementById('buy-title');
  const subtitle = document.getElementById('buy-subtitle');
  const body = document.getElementById('buy-body');
  if (isCustom) {
    title.textContent = '\u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u043E\u043C';
    subtitle.textContent = product + ' \u00B7 ' + plan + ' \u2014 \u0446\u0435\u043D\u0430 \u043F\u043E \u0437\u0430\u043F\u0440\u043E\u0441\u0443';
    body.innerHTML = '<button class="btn btn-primary" id="buy-confirm" onclick="contactManager()">\u270D\uFE0F \u0421\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0432 Telegram</button>' +
      '<div class="btn-row"><button class="btn btn-ghost" onclick="closeBuy()">\u041E\u0442\u043C\u0435\u043D\u0430</button></div>';
  } else {
    title.textContent = '\u041E\u0444\u043E\u0440\u043C\u043B\u0435\u043D\u0438\u0435 \u0437\u0430\u043A\u0430\u0437\u0430';
    subtitle.textContent = product + ' \u00B7 ' + plan + ' \u2014 ' + fmt(rub(usd));
    body.innerHTML = '<p style="margin-bottom:14px">\u041F\u043E\u0441\u043B\u0435 \u043E\u043F\u043B\u0430\u0442\u044B \u0441 \u0432\u0430\u043C\u0438 \u0441\u0432\u044F\u0436\u0443\u0442\u0441\u044F \u0434\u043B\u044F \u0430\u043A\u0442\u0438\u0432\u0430\u0446\u0438\u0438.</p>' +
      '<button class="btn btn-primary" id="buy-confirm" onclick="confirmBuy()">\uD83D\uDC8E \u041E\u043F\u043B\u0430\u0442\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 CryptoBot</button>' +
      '<div class="btn-row"><button class="btn btn-ghost" onclick="closeBuy()">\u041E\u0442\u043C\u0435\u043D\u0430</button></div>';
  }
  document.getElementById('buy-overlay').classList.add('show');
}

function closeBuy() {
  document.getElementById('buy-overlay').classList.remove('show');
  currentBuy = null;
}

function contactManager() {
  const u = getUser();
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tg_id: u.tg_id, username: u.username, product: currentBuy ? currentBuy.product : '', plan: currentBuy ? currentBuy.plan : '' }),
  }).catch(function () {});
  if (tg) tg.showAlert('\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u0432\u044F\u0436\u0435\u0442\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0432 Telegram.');
  else showToast('\u041C\u0435\u043D\u0435\u0434\u0436\u0435\u0440 \u0441\u0432\u044F\u0436\u0435\u0442\u0441\u044F \u0441 \u0432\u0430\u043C\u0438');
  closeBuy();
}

async function confirmBuy() {
  if (!currentBuy) return;
  const u = getUser();
  const btn = document.getElementById('buy-confirm');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> \u0421\u043E\u0437\u0434\u0430\u0451\u043C \u0441\u0447\u0451\u0442...';
  try {
    const price = rub(currentBuy.usd);
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tg_id: u.tg_id, username: u.username, product: currentBuy.product, plan: currentBuy.plan, price: price }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || '\u041E\u0448\u0438\u0431\u043A\u0430');
    if (data.payUrl) {
      if (tg) tg.openLink(data.payUrl, { try_instant_view: false });
      else window.open(data.payUrl, '_blank');
      closeBuy();
      showToast('\u0421\u0447\u0451\u0442 \u0441\u043E\u0437\u0434\u0430\u043D. \u041E\u0436\u0438\u0434\u0430\u0435\u043C \u043E\u043F\u043B\u0430\u0442\u0443...');
      pollStatus(data.orderId);
    } else { throw new Error('\u041D\u0435\u0442 \u0441\u0441\u044B\u043B\u043A\u0438 \u043D\u0430 \u043E\u043F\u043B\u0430\u0442\u0443'); }
  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = orig;
    showToast('\u274C ' + e.message);
  }
}

function pollStatus(orderId) {
  let tries = 0;
  const iv = setInterval(async function () {
    tries++;
    if (tries > 40) { clearInterval(iv); return; }
    try {
      const res = await fetch('/api/order/' + orderId + '/status');
      const data = await res.json();
      if (data.status === 'paid') {
        clearInterval(iv);
        showToast('\uD83C\uDF89 \u041E\u043F\u043B\u0430\u0442\u0430 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0430! \u0421 \u0432\u0430\u043C\u0438 \u0441\u0432\u044F\u0436\u0443\u0442\u0441\u044F.');
      }
    } catch (_) {}
  }, 5000);
}

/* ==================== TOAST ==================== */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3000);
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('overlay')) e.target.classList.remove('show');
});
