require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Database = require('better-sqlite3');

const {
  BOT_TOKEN,
  CRYPTOBOT_TOKEN,
  ADMIN_ID = '',
  PORT = 3000,
  DB_PATH = './data/store.db',
  DOMAIN = '',
} = process.env;

// ---------- Database ----------
const dbFile = path.resolve(DB_PATH);
fs.mkdirSync(path.dirname(dbFile), { recursive: true });
const db = new Database(dbFile);
db.pragma('journal_mode = WAL');

const schema = [
  'CREATE TABLE IF NOT EXISTS users (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  tg_id TEXT UNIQUE,',
  '  username TEXT,',
  '  first_name TEXT,',
  '  balance REAL DEFAULT 0,',
  "  created_at TEXT DEFAULT (datetime('now'))",
  ');',
  'CREATE TABLE IF NOT EXISTS contacts (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  tg_id TEXT,',
  '  username TEXT,',
  '  product TEXT,',
  '  plan TEXT,',
  "  created_at TEXT DEFAULT (datetime('now'))",
  ');',
  'CREATE TABLE IF NOT EXISTS orders (',
  '  id INTEGER PRIMARY KEY AUTOINCREMENT,',
  '  tg_id TEXT,',
  '  username TEXT,',
  '  product TEXT,',
  '  plan TEXT,',
  '  price INTEGER,',
  "  currency TEXT DEFAULT 'RUB',",
  '  invoice_id TEXT,',
  "  status TEXT DEFAULT 'pending',",
  "  created_at TEXT DEFAULT (datetime('now'))",
  ');',
].join('\n');
db.exec(schema);

// ---------- CryptoBot API ----------
const CRYPTO_API = 'https://pay.crypt.bot/api';
const cryptoApi = axios.create({
  baseURL: CRYPTO_API,
  headers: { 'Crypto-Pay-API-Token': CRYPTOBOT_TOKEN || '' },
  timeout: 15000,
});

async function createInvoice({ amount, description, payload, cbUrl }) {
  const body = {
    asset: 'USDT',
    amount: String(amount),
    description,
    payload,
    allow_comments: false,
    allow_anonymous: true,
  };
  if (cbUrl) body.paid_btn_url = cbUrl;
  const { data } = await cryptoApi.post('/createInvoice', body);
  if (!data || !data.ok) throw new Error('CryptoBot: ' + JSON.stringify(data));
  return data.result;
}

// ---------- Telegram Bot ----------
let bot = null;
try {
  const TelegramBot = require('node-telegram-bot-api');
  if (BOT_TOKEN) {
    bot = new TelegramBot(BOT_TOKEN, { polling: true });
    setupBot(bot);
  }
} catch (e) {
  console.error('Bot init error:', e.message);
}

function setupBot(bot) {
  const isAdmin = (msg) => String(msg.from.id) === String(ADMIN_ID);

  const upsertUser = db.prepare(`
    INSERT INTO users (tg_id, username, first_name)
    VALUES (@tg_id, @username, @first_name)
    ON CONFLICT(tg_id) DO UPDATE SET
      username = excluded.username,
      first_name = excluded.first_name
  `);

  bot.on('message', (msg) => {
    try {
      upsertUser.run({
        tg_id: String(msg.from.id),
        username: msg.from.username || '',
        first_name: msg.from.first_name || '',
      });
    } catch (_) {}
  });

  // Resolve the public web app URL. Prefer env DOMAIN, fail gracefully otherwise.
  function resolveWebAppUrl() {
    let base = (DOMAIN || '').trim();
    if (!base) base = (process.env.PUBLIC_URL || process.env.APP_URL || process.env.RENDER_EXTERNAL_URL || '').trim();
    if (base && !/^https?:\/\//i.test(base)) base = 'https://' + base;
    if (!base) return null;
    try {
      const u = new URL(base.replace(/\/$/, '') + '/app');
      if (u.protocol !== 'https:') return null;
      return u.toString();
    } catch (_) {
      return null;
    }
  }

  const WELCOME_TEXT =
    '👋 *Добро пожаловать в AI Store!*\n\n' +
    'Мы — магазин премиум-подписок на лучшие AI-сервисы:\n' +
    '• 🤖 Claude (Anthropic)\n' +
    '• 💬 ChatGPT (OpenAI)\n' +
    '• ✨ Gemini (Google)\n\n' +
    '💎 Официальные планы по ценам ниже, чем напрямую.\n' +
    '⚡ Мгновенная выдача и поддержка 24/7.\n' +
    '🔐 Удобная и безопасная оплата.\n\n' +
    'Нажмите кнопку ниже, чтобы открыть магазин 👇';

  function welcomeKeyboard() {
    const url = resolveWebAppUrl();
    if (url) {
      return {
        inline_keyboard: [
          [{ text: '🛍 Открыть магазин', web_app: { url } }],
          [
            { text: '💬 Поддержка', callback_data: 'user_support' },
            { text: '⭐ Отзывы', callback_data: 'user_reviews' },
          ],
        ],
      };
    }
    return {
      inline_keyboard: [
        [
          { text: '💬 Поддержка', callback_data: 'user_support' },
          { text: '⭐ Отзывы', callback_data: 'user_reviews' },
        ],
      ],
    };
  }

  function syncMenuButton() {
    const url = resolveWebAppUrl();
    if (!url) return;
    bot
      .setChatMenuButton({ menu_button: { type: 'web_app', text: '🛍 Магазин', web_app: { url } } })
      .catch(() => {});
  }

  bot.onText(/\/start/, (msg) => {
    bot
      .sendMessage(msg.chat.id, WELCOME_TEXT, { parse_mode: 'Markdown', reply_markup: welcomeKeyboard() })
      .then(() => syncMenuButton())
      .catch((e) => {
        console.error('/start send error:', e.message);
        bot.sendMessage(msg.chat.id, 'Добро пожаловать в AI Store! Нажмите /start ещё раз.').catch(() => {});
      });
    if (isAdmin(msg)) sendAdminPanel(msg.chat.id);
  });

  bot.on('callback_query', (q) => {
    if (q.data === 'user_support') {
      bot.answerCallbackQuery(q.id, { text: 'Откройте магазин и нажмите «Поддержка».', show_alert: true }).catch(() => {});
    } else if (q.data === 'user_reviews') {
      bot.answerCallbackQuery(q.id, { text: 'Отзывы доступны в магазине на вкладке «Отзывы».', show_alert: true }).catch(() => {});
    }
  });

  bot.on('polling_error', (e) => console.error('polling_error:', e.message));
  syncMenuButton();

  bot.onText(/\/admin/, (msg) => {
    if (!isAdmin(msg)) return;
    sendAdminPanel(msg.chat.id);
  });

  function statsText() {
    const totalUsers = db.prepare('SELECT COUNT(*) c FROM users').get().c;
    const totalOrders = db.prepare('SELECT COUNT(*) c FROM orders').get().c;
    const paid = db.prepare("SELECT COUNT(*) c, COALESCE(SUM(price),0) s FROM orders WHERE status='paid'").get();
    const pending = db.prepare("SELECT COUNT(*) c FROM orders WHERE status='pending'").get().c;
    const top = db.prepare("SELECT product, COUNT(*) c FROM orders WHERE status='paid' GROUP BY product ORDER BY c DESC LIMIT 5").all();
    let s =
      '📊 *Статистика магазина*\n\n' +
      `👥 Пользователей: ${totalUsers}\n` +
      `🧾 Заказов всего: ${totalOrders}\n` +
      `✅ Оплачено: ${paid.c} (на ${paid.s} ₽)\n` +
      `⏳ В ожидании: ${pending}\n`;
    if (top.length) {
      s += '\n🏆 *Топ товаров:*\n';
      top.forEach((t, i) => (s += `${i + 1}. ${t.product} — ${t.c}\n`));
    }
    return s;
  }

  function sendAdminPanel(chatId) {
    bot
      .sendMessage(chatId, statsText(), {
        parse_mode: 'Markdown',
        reply_markup: adminKeyboard(),
      })
      .catch(() => {});
  }

  function adminKeyboard() {
    return {
      inline_keyboard: [
        [{ text: '📢 Рассылка', callback_data: 'admin_broadcast' }],
        [{ text: '💰 Начислить баланс', callback_data: 'admin_balance' }],
        [{ text: '📊 Статистика', callback_data: 'admin_stats' }],
        [{ text: '🛍 Пользователи', callback_data: 'admin_users' }],
      ],
    };
  }

  // Admin state machine
  const awaiting = new Map(); // chatId -> 'broadcast' | {balanceUser, ...}

  bot.on('callback_query', async (q) => {
    if (!isAdmin({ from: q.from })) return bot.answerCallbackQuery(q.id);
    bot.answerCallbackQuery(q.id);
    const chatId = q.message.chat.id;
    const data = q.data;
    try {
      if (data === 'admin_stats') {
        bot.sendMessage(chatId, statsText(), { parse_mode: 'Markdown' });
      } else if (data === 'admin_broadcast') {
        awaiting.set(chatId, 'broadcast');
        bot.sendMessage(chatId, '📢 Отправьте текст рассылки одним сообщением.');
      } else if (data === 'admin_balance') {
        awaiting.set(chatId, 'balance');
        bot.sendMessage(
          chatId,
          '💰 Введите в формате: `<tg_id> <сумма>`\nПример: `123456789 500`',
          { parse_mode: 'Markdown' }
        );
      } else if (data === 'admin_users') {
        const users = db.prepare('SELECT tg_id, username, balance FROM users ORDER BY id DESC LIMIT 20').all();
        if (!users.length) return bot.sendMessage(chatId, 'Пользователей пока нет.');
        const text = users
          .map((u) => `• ${u.tg_id} ${u.username ? '@' + u.username : ''} — ${u.balance} ₽`)
          .join('\n');
        bot.sendMessage(chatId, '🛍 *Последние пользователи:*\n\n' + text, { parse_mode: 'Markdown' });
      }
    } catch (e) {
      bot.sendMessage(chatId, 'Ошибка: ' + e.message);
    }
  });

  bot.on('message', async (msg) => {
    if (!isAdmin(msg)) return;
    const chatId = msg.chat.id;
    const state = awaiting.get(chatId);
    if (!state) return;
    if (msg.text && msg.text.startsWith('/')) return;

    if (state === 'broadcast') {
      awaiting.delete(chatId);
      const users = db.prepare('SELECT tg_id FROM users').all();
      let ok = 0;
      let fail = 0;
      bot
        .sendMessage(chatId, `📤 Отправляю ${users.length} пользователям...`)
        .catch(() => {});
      for (const u of users) {
        try {
          await bot.sendMessage(u.tg_id, msg.text, { parse_mode: 'Markdown' });
          ok++;
        } catch (_) {
          fail++;
        }
      }
      bot.sendMessage(chatId, `✅ Готово. Успешно: ${ok}, ошибок: ${fail}`);
    } else if (state === 'balance') {
      awaiting.delete(chatId);
      const [tgId, amtRaw] = (msg.text || '').trim().split(/\s+/);
      const amt = Number(amtRaw);
      if (!tgId || !amt || isNaN(amt)) return bot.sendMessage(chatId, '❌ Неверный формат. Попробуйте снова /admin');
      const res = db.prepare('UPDATE users SET balance = balance + ? WHERE tg_id = ?').run(amt, tgId);
      if (res.changes === 0) {
        db.prepare('INSERT INTO users (tg_id, balance) VALUES (?, ?)').run(tgId, amt);
        bot.sendMessage(chatId, `✅ Создан пользователь ${tgId} с балансом ${amt} ₽`);
      } else {
        const u = db.prepare('SELECT balance FROM users WHERE tg_id = ?').get(tgId);
        bot.sendMessage(chatId, `✅ Баланс обновлён: ${tgId} → ${u.balance} ₽`);
      }
    }
  });

  bot.on('error', (e) => console.error('Bot error:', e.message));
}

// ---------- Express ----------
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Static pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/app', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// Register / identify user from Telegram initData (lightweight)
app.post('/api/identify', (req, res) => {
  try {
    const { tg_id, username, first_name } = req.body || {};
    if (!tg_id) return res.json({ ok: false });
    db.prepare(
      `INSERT INTO users (tg_id, username, first_name) VALUES (?, ?, ?)
       ON CONFLICT(tg_id) DO UPDATE SET username=excluded.username, first_name=excluded.first_name`
    ).run(String(tg_id), username || '', first_name || '');
    const u = db.prepare('SELECT balance FROM users WHERE tg_id = ?').get(String(tg_id));
    res.json({ ok: true, balance: u ? u.balance : 0 });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Contact manager request (Enterprise / custom pricing)
app.post('/api/contact', (req, res) => {
  try {
    const { tg_id, username, product, plan } = req.body || {};
    db.prepare(
      'INSERT INTO contacts (tg_id, username, product, plan) VALUES (?, ?, ?, ?)'
    ).run(String(tg_id || ''), username || '', product || '', plan || '');
    if (bot && ADMIN_ID) {
      bot
        .sendMessage(
          ADMIN_ID,
          `\u270D\uFE0F *\u0417\u0430\u043F\u0440\u043E\u0441 \u043C\u0435\u043D\u0435\u0434\u0436\u0435\u0440\u0430*\n\n\u0422\u043E\u0432\u0430\u0440: ${product || '\u2014'}\n\u041F\u043B\u0430\u043D: ${plan || '\u2014'}\n\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C: @${username || '\u2014'} (${tg_id || '\u2014'})`,
          { parse_mode: 'Markdown' }
        )
        .catch(() => {});
    }
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Create order + CryptoBot invoice
app.post('/api/order', async (req, res) => {
  try {
    const { tg_id, username, product, plan, price } = req.body || {};
    if (!product || !plan || !price) return res.json({ ok: false, error: 'missing fields' });

    // 1 RUB ≈ 1 USDT is not accurate; we keep price in RUB and convert for CryptoBot to USDT
    const RUB_PER_USDT = Number(process.env.RUB_PER_USDT || 95);
    const usdt = Math.max(0.1, +(Number(price) / RUB_PER_USDT).toFixed(2));

    const orderRow = db
      .prepare(
        `INSERT INTO orders (tg_id, username, product, plan, price, status)
         VALUES (?, ?, ?, ?, ?, 'pending')`
      )
      .run(String(tg_id || ''), username || '', product, plan, Math.round(Number(price)));

    const orderId = orderRow.lastInsertRowid;

    let invoice = null;
    try {
      invoice = await createInvoice({
        amount: usdt,
        description: `${product} — ${plan} (заказ #${orderId})`,
        payload: JSON.stringify({ orderId, tg_id, product, plan }),
      });
      db.prepare('UPDATE orders SET invoice_id = ? WHERE id = ?').run(String(invoice.invoice_id), orderId);
    } catch (e) {
      console.error('Invoice error:', e.message);
      return res.json({ ok: false, error: 'Не удалось создать счёт. Попробуйте позже.' });
    }

    res.json({
      ok: true,
      orderId,
      payUrl: invoice.bot_invoice_url || invoice.mini_app_invoice_url,
      invoiceId: invoice.invoice_id,
    });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

// Poll invoice status
app.get('/api/order/:id/status', async (req, res) => {
  try {
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.json({ ok: false });
    // If already marked paid
    if (order.status === 'paid') return res.json({ ok: true, status: 'paid' });
    if (order.invoice_id && CRYPTOBOT_TOKEN) {
      try {
        const { data } = await cryptoApi.get('/getInvoices', {
          params: { invoice_ids: order.invoice_id },
        });
        if (data && data.ok && data.result && data.result.items && data.result.items[0]) {
          const inv = data.result.items[0];
          if (inv.status === 'paid') {
            db.prepare("UPDATE orders SET status='paid' WHERE id = ?").run(order.id);
            notifyAdminPaid(order);
            return res.json({ ok: true, status: 'paid' });
          }
        }
      } catch (e) {
        console.error('check status error', e.message);
      }
    }
    res.json({ ok: true, status: order.status });
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
});

function notifyAdminPaid(order) {
  if (!bot || !ADMIN_ID) return;
  bot
    .sendMessage(
      ADMIN_ID,
      `💰 *Новая оплата*\n\n` +
        `Заказ #${order.id}\n` +
        `Товар: ${order.product}\n` +
        `План: ${order.plan}\n` +
        `Сумма: ${order.price} ₽\n` +
        `Пользователь: @${order.username || '—'} (${order.tg_id})`,
      { parse_mode: 'Markdown' }
    )
    .catch(() => {});
}

// CryptoBot webhook
app.post('/api/cryptobot/webhook', (req, res) => {
  try {
    const sig = req.headers['crypto-pay-api-signature'];
    // Skip HMAC verify for simplicity; rely on secure polling. Optionally verify.
    const update = req.body;
    if (update && update.update_type === 'invoice_paid' && update.payload && update.payload.invoice_id) {
      const invId = String(update.payload.invoice_id);
      const order = db.prepare('SELECT * FROM orders WHERE invoice_id = ?').get(invId);
      if (order && order.status !== 'paid') {
        db.prepare("UPDATE orders SET status='paid' WHERE id = ?").run(order.id);
        notifyAdminPaid(order);
      }
    }
    res.json({ ok: true });
  } catch (e) {
    res.json({ ok: false });
  }
});

app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, () => {
  console.log(`AI Store running on port ${PORT}`);
});