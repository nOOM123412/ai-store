/* ==================== CONFIG ==================== */
const RUB_USD = 95;
function rub(usd) {
  return Math.floor((usd * RUB_USD) / 100) * 100;
}
function fmt(n) {
  return n.toLocaleString('ru-RU') + ' ₽';
}

/* ==================== BRAND SVG ICONS ==================== */
const ICONS = {
  claude:
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 1.6c.28 3.36.9 5.42 2.36 6.88 1.46 1.46 3.52 2.08 6.88 2.36v2.32c-3.36.28-5.42.9-6.88 2.36-1.46 1.46-2.08 3.52-2.36 6.88h-2.32c-.28-3.36-.9-5.42-2.36-6.88C6.86 14.06 4.8 13.44 1.44 13.16v-2.32c3.36-.28 5.42-.9 6.88-2.36C9.78 7.02 10.4 4.96 10.68 1.6H12z"/></svg>',
  chatgpt:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 2.5l7.2 4.15v8.3L12 19.1 4.8 14.95v-8.3z"/>' +
    '<circle cx="12" cy="10.8" r="2.4"/>' +
    '<path d="M12 2.5v5.9M19.2 6.65l-5 2.9M19.2 14.95l-5-2.9M12 19.1v-5.9M4.8 14.95l5-2.9M4.8 6.65l5 2.9"/></svg>',
  gemini:
    '<svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M12 2c.4 4.2 1.6 6.4 4 8.8 2.4 2.4 4.6 3.6 8 4-3.4.4-5.6 1.6-8 4-2.4 2.4-3.6 4.6-4 8-.4-3.4-1.6-5.6-4-8-2.4-2.4-3.6-3.6-4-4 3.4-.4 5.6-1.6 8-4 2.4-2.4 3.6-4.6 4-8z"/></svg>',
};

/* ==================== PRODUCTS DATA ==================== */
const PRODUCTS = [
  {
    id: 'claude',
    name: 'Claude',
    tagline: 'Anthropic · от $20/мес',
    plans: [
      {
        name: 'Pro',
        usd: 20,
        desc: 'Расширенные лимиты, доступ к старшим моделям (включая Opus), планировщик задач, интеграции (Chrome, Office), проекты и встроенный Claude Code. Годовая оплата — $200 (~$17/мес).',
      },
      {
        name: 'Max 5x',
        usd: 100,
        desc: 'Лимит сообщений и объём сессий в 5 раз выше, чем у Pro. Только помесячно.',
      },
      {
        name: 'Max 20x',
        usd: 200,
        desc: 'Лимит и объём сессий в 20 раз выше Pro. Подходит для тяжёлой работы с Claude Code и большими массивами данных.',
      },
      {
        name: 'Team Standard',
        usd: 20,
        desc: 'От 5 человек. $25/мес или $20/мес за место при годовой оплате (1.25× от Pro). SSO, корпоративный домен, единый биллинг, общие папки.',
      },
      {
        name: 'Team Premium',
        usd: 100,
        desc: 'От 5 человек. $100/мес за место при годовой оплате (6.25× от Pro). SSO, корпоративный домен, единый биллинг, общие папки.',
      },
    ],
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    tagline: 'OpenAI · от $8/мес',
    plans: [
      {
        name: 'Go',
        usd: 8,
        desc: 'Бюджетный план. Все функции Free, увеличенные лимиты на сообщения, вызов инструментов, загрузки и голосовые чаты.',
      },
      {
        name: 'Plus',
        usd: 20,
        desc: 'Основной. Продвинутые модели рассуждений (GPT-6, Thinking), расширенные лимиты, генерация изображений, проекты, Custom GPT, Codex, глубокие исследования.',
      },
      {
        name: 'Pro',
        usd: 100,
        desc: 'Рассуждения Pro на GPT-6 Astra, максимальные лимиты (5–20× Plus), постоянный агент (dot), кредиты API до $500/мес. От $100 до $200 в зависимости от лимитов.',
      },
      {
        name: 'Business',
        usd: 20,
        desc: 'Для команд 2–200 сотрудников. Общее пространство, администрирование, SAML/SSO, без обучения моделей на данных. $20/чел при годовой оплате или $25/мес.',
      },
      {
        name: 'Enterprise',
        usd: 0,
        desc: 'Для крупных организаций, цена индивидуально. Расширенное контекстное окно, максимальная безопасность, аудит, поддержка 24/7.',
        custom: true,
      },
    ],
  },
  {
    id: 'gemini',
    name: 'Gemini',
    tagline: 'Google · от $4.99/мес',
    plans: [
      {
        name: 'Google AI Plus',
        usd: 4.99,
        desc: '400 ГБ облачного хранилища, семейный доступ до 5 человек, удвоенные лимиты, модель Flash.',
      },
      {
        name: 'Google AI Pro',
        usd: 19.99,
        desc: '5 ТБ хранилища, в 4 раза больше лимитов, передовые модели (Gemini 4 Argon, Pro/Flash), Google Antigravity для кода, YouTube и Google Home.',
      },
      {
        name: 'Google AI Ultra',
        usd: 99.99,
        desc: 'От 20 ТБ хранилища, максимальные лимиты (5–20×), YouTube Premium, Project Genie, Colab (2000 вычислительных единиц), Google Cloud ($40). От $99.99 до $199.99.',
      },
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
  const current = document.querySelector('.screen.active');
  const el = document.getElementById('screen-' + name);
  if (!el) return;
  if (current && current !== el) {
    current.classList.remove('active');
  }
  el.classList.remove('active');
  // force reflow so the entrance animation replays smoothly
  void el.offsetWidth;
  el.classList.add('active');
  document.querySelectorAll('.hotbar-item').forEach(function (b) {
    b.classList.toggle('active', b.dataset.screen === name);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ==================== PRODUCTS ==================== */
function renderProducts() {
  const wrap = document.getElementById('products-list');
  wrap.innerHTML = PRODUCTS.map(function (p, pi) {
    const plansHtml = p.plans
      .map(function (pl, idx) {
        const priceTxt = pl.custom ? 'по запросу' : fmt(rub(pl.usd));
        const btnTxt = pl.custom ? 'Связаться' : 'Купить';
        return (
          '<div class="plan" style="animation-delay:' + idx * 0.05 + 's">' +
          '<div class="plan-top"><span class="plan-name">' + pl.name + '</span>' +
          '<span class="plan-price">' + priceTxt + '</span></div>' +
          '<div class="plan-desc">' + pl.desc + '</div>' +
          '<button class="plan-buy" data-p="' + p.name + '" data-plan="' + pl.name + '" data-usd="' + pl.usd + '" data-custom="' + (pl.custom ? 1 : 0) + '">' + btnTxt + '</button>' +
          '</div>'
        );
      })
      .join('');
    return (
      '<div class="product" data-id="' + p.id + '" style="animation-delay:' + pi * 0.08 + 's">' +
      '<div class="product-head" data-toggle="' + p.id + '">' +
      '<div class="product-icon ' + p.id + '">' + ICONS[p.id] + '</div>' +
      '<div class="product-title"><h4>' + p.name + '</h4><span>' + p.tagline + '</span></div>' +
      '<div class="product-arrow">▼</div></div>' +
      '<div class="product-body"><div class="plans">' + plansHtml + '</div></div></div>'
    );
  }).join('');

  wrap.querySelectorAll('[data-toggle]').forEach(function (el) {
    el.addEventListener('click', function () {
      toggleProduct(el.dataset.toggle);
    });
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
    const statR = document.getElementById('stat-reviews');
    const statA = document.getElementById('stat-avg');
    if (statR) statR.textContent = reviewsData.total;
    if (statA) statA.textContent = reviewsData.avg.toFixed(2);
    renderReviewSummary();
    renderReviews(true);
  } catch (e) {
    console.error('reviews load error', e);
  }
}

function renderReviewSummary() {
  const d = reviewsData.distribution || {};
  const total = reviewsData.total || 1;
  function bar(star) {
    const pct = ((d[star] || 0) / total) * 100;
    return (
      '<div class="rev-bar-row"><span class="rev-bar-lbl">' + star + '</span>' +
      '<div class="rev-bar-track"><div class="rev-bar-fill" data-w="' + pct + '"></div></div></div>'
    );
  }
  const el = document.getElementById('rev-summary');
  if (!el) return;
  el.innerHTML =
    '<div class="rev-avg"><div class="rev-avg-num">' + reviewsData.avg.toFixed(1) +
    '</div><div class="rev-avg-stars">★★★★★</div>' +
    '<div class="rev-avg-cnt">' + total + ' отзывов</div></div>' +
    '<div class="rev-bars">' + [5, 4, 3, 2, 1].map(bar).join('') + '</div>';
  setTimeout(function () {
    el.querySelectorAll('.rev-bar-fill').forEach(function (f) {
      f.style.width = f.dataset.w + '%';
    });
  }, 100);
}

function stars(n) {
  return '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
}

function reviewCard(r) {
  const badge = r.verified ? '<span class="verified-badge">✓</span>' : '';
  return (
    '<div class="review"><div class="review-head"><div class="review-author">' +
    '<div class="review-avatar">✧</div><div>' +
    '<div class="review-name">Аноним' + badge + '</div>' +
    '<div class="review-meta">' + r.date + '</div></div></div>' +
    '<div class="review-stars">' + stars(r.rating) + '</div></div>' +
    '<div class="review-text">' + r.text + '</div>' +
    '<span class="review-tag">' + r.product + ' · ' + r.plan + '</span></div>'
  );
}

function renderReviews(reset) {
  const list = document.getElementById('reviews-list');
  if (!list || !reviewsData) return;
  if (reset) {
    reviewsShown = 0;
    list.innerHTML = '';
  }
  const next = reviewsData.reviews.slice(reviewsShown, reviewsShown + REVIEWS_PER_PAGE);
  list.insertAdjacentHTML('beforeend', next.map(reviewCard).join(''));
  reviewsShown += next.length;
  const btn = document.getElementById('load-more-btn');
  if (!btn) return;
  if (reviewsShown >= reviewsData.total) {
    btn.style.display = 'none';
  } else {
    btn.style.display = 'flex';
    btn.textContent = 'Показать ещё (' + (reviewsData.total - reviewsShown) + ')';
  }
}

function loadMoreReviews() {
  renderReviews(false);
}

/* ==================== SUPPORT ==================== */
function openSupport() {
  document.getElementById('support-overlay').classList.add('show');
}
function closeSupport() {
  document.getElementById('support-overlay').classList.remove('show');
}

function submitSupport() {
  const subject = document.getElementById('support-subject').value.trim();
  const message = document.getElementById('support-message').value.trim();
  if (!subject && !message) {
    showToast('Заполните хотя бы одно поле');
    return;
  }
  const btn = document.getElementById('support-send');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Отправка...';
  // Visual-only submission: no backend call.
  setTimeout(function () {
    btn.disabled = false;
    btn.innerHTML = orig;
    closeSupport();
    document.getElementById('support-subject').value = '';
    document.getElementById('support-message').value = '';
    showToast('Обращение отправлено ✓');
  }, 1400);
}

/* ==================== BUY ==================== */
function openBuy(product, plan, usd, isCustom) {
  currentBuy = { product: product, plan: plan, usd: usd, isCustom: isCustom };
  const title = document.getElementById('buy-title');
  const subtitle = document.getElementById('buy-subtitle');
  const body = document.getElementById('buy-body');
  if (isCustom) {
    title.textContent = 'Связаться с менеджером';
    subtitle.textContent = product + ' · ' + plan + ' — цена по запросу';
    body.innerHTML =
      '<button class="btn btn-primary" id="buy-confirm" onclick="contactManager()">Связаться в Telegram</button>' +
      '<div class="btn-row"><button class="btn btn-ghost" onclick="closeBuy()">Отмена</button></div>';
  } else {
    title.textContent = 'Оформление заказа';
    subtitle.textContent = product + ' · ' + plan + ' — ' + fmt(rub(usd));
    body.innerHTML =
      '<p style="margin-bottom:14px">После оплаты с вами свяжутся для активации подписки.</p>' +
      '<button class="btn btn-primary" id="buy-confirm" onclick="confirmBuy()">Оплатить через CryptoBot</button>' +
      '<div class="btn-row"><button class="btn btn-ghost" onclick="closeBuy()">Отмена</button></div>';
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
    body: JSON.stringify({
      tg_id: u.tg_id,
      username: u.username,
      product: currentBuy ? currentBuy.product : '',
      plan: currentBuy ? currentBuy.plan : '',
    }),
  }).catch(function () {});
  if (tg) tg.showAlert('Менеджер свяжется с вами в Telegram.');
  else showToast('Менеджер свяжется с вами');
  closeBuy();
}

async function confirmBuy() {
  if (!currentBuy) return;
  const u = getUser();
  const btn = document.getElementById('buy-confirm');
  const orig = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Создаём счёт...';
  try {
    const price = rub(currentBuy.usd);
    const res = await fetch('/api/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tg_id: u.tg_id,
        username: u.username,
        product: currentBuy.product,
        plan: currentBuy.plan,
        price: price,
      }),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || 'Ошибка');
    if (data.payUrl) {
      if (tg) tg.openLink(data.payUrl, { try_instant_view: false });
      else window.open(data.payUrl, '_blank');
      closeBuy();
      showToast('Счёт создан. Ожидаем оплату...');
      pollStatus(data.orderId);
    } else {
      throw new Error('Нет ссылки на оплату');
    }
  } catch (e) {
    btn.disabled = false;
    btn.innerHTML = orig;
    showToast(e.message);
  }
}

function pollStatus(orderId) {
  let tries = 0;
  const iv = setInterval(async function () {
    tries++;
    if (tries > 40) {
      clearInterval(iv);
      return;
    }
    try {
      const res = await fetch('/api/order/' + orderId + '/status');
      const data = await res.json();
      if (data.status === 'paid') {
        clearInterval(iv);
        showToast('Оплата получена! С вами свяжутся.');
      }
    } catch (_) {}
  }, 5000);
}

/* ==================== TOAST ==================== */
let toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    t.classList.remove('show');
  }, 3000);
}

document.addEventListener('click', function (e) {
  if (e.target.classList && e.target.classList.contains('overlay')) {
    e.target.classList.remove('show');
  }
});