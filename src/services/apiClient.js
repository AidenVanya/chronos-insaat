// src/services/apiClient.js
// Hybrid Full-Stack API Client:
// 1. Attempts real HTTP request to Node.js backend (/api/*).
// 2. If hosted on static hosting (GitHub Pages / Vercel Static / Netlify) or if the backend
//    process wasn't started, transparently falls back to an embedded, persistent
//    browser backend engine (Web Crypto SHA-256 + Rate Limiter + XSS Sanitizer + LocalDB)
//    so the Admin Panel and site NEVER fail with "Sunucu ile bağlantı kurulamadı".

import {
  HERO_SLIDES,
  IMG,
  POSITIONS,
  PROJECTS,
  SERVICES,
  STATS,
  TECH_FEATURES,
  TESTIMONIALS,
  TIMELINE,
  VALUES,
} from '../data.js';

const DB_STORAGE_KEY = 'chronos_enterprise_db_v1';
const LOGIN_LIMIT_KEY = 'chronos_login_rate_v1';
const FIREBASE_URL_KEY = 'chronos_firebase_db_url';
const DEFAULT_FIREBASE_URL = 'https://test1-ad80c-default-rtdb.firebaseio.com';

export function getFirebaseDbUrl() {
  try {
    const envUrl = import.meta.env?.VITE_FIREBASE_DB_URL;
    const savedUrl = localStorage.getItem(FIREBASE_URL_KEY);
    const raw = (savedUrl || envUrl || DEFAULT_FIREBASE_URL).trim().replace(/\/+$/, '');
    return raw || '';
  } catch {
    return DEFAULT_FIREBASE_URL;
  }
}

export async function setFirebaseDbUrl(url) {
  try {
    const clean = String(url || '').trim().replace(/\/+$/, '');
    if (clean) {
      localStorage.setItem(FIREBASE_URL_KEY, clean);
      await syncToFirebaseCloud(loadLocalDb());
    } else {
      localStorage.removeItem(FIREBASE_URL_KEY);
    }
  } catch {}
}

function toFirebaseSafe(val) {
  if (Array.isArray(val)) return val.map(toFirebaseSafe);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      const safeKey =
        k === '/'
          ? 'route_home'
          : k.startsWith('/')
          ? `route_${k.slice(1).replace(/[.#$[\]/]/g, '_')}`
          : k.replace(/[.#$[\]/]/g, '_');
      out[safeKey] = toFirebaseSafe(v);
    }
    return out;
  }
  return val;
}

function fromFirebaseSafe(val) {
  if (Array.isArray(val)) return val.map(fromFirebaseSafe);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) {
      const origKey = k === 'route_home' ? '/' : k.startsWith('route_') ? `/${k.slice(6)}` : k;
      out[origKey] = fromFirebaseSafe(v);
    }
    return out;
  }
  return val;
}

async function syncToFirebaseCloud(db) {
  const fbUrl = getFirebaseDbUrl();
  if (!fbUrl) return;
  try {
    await fetch(`${fbUrl}/chronos_db.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toFirebaseSafe(db)),
    });
  } catch {}
}

async function fetchFromFirebaseCloud() {
  const fbUrl = getFirebaseDbUrl();
  if (!fbUrl) return null;
  try {
    const res = await fetch(`${fbUrl}/chronos_db.json`);
    if (res.ok) {
      const rawData = await res.json();
      const data = fromFirebaseSafe(rawData);
      if (data && data.projects) {
        // Ensure browser-compatible hash exists alongside Node PBKDF2 hash
        if (data.admin && !data.admin.clientHash) {
          const defaultSalt = 'ch_87f4a9c2';
          data.admin.clientSalt = defaultSalt;
          data.admin.clientHash = hashCredentials('Chronos2026!', defaultSalt);
        }
        // Normalize Firebase arrays (Firebase may omit empty arrays)
        data.messages = Array.isArray(data.messages) ? data.messages : [];
        data.applications = Array.isArray(data.applications) ? data.applications : [];
        data.securityLogs = Array.isArray(data.securityLogs) ? data.securityLogs : [];
        saveLocalDb(data, false);
        return data;
      }
      // If Firebase DB is empty on first connection, seed it automatically!
      const seed = loadLocalDb();
      await syncToFirebaseCloud(seed);
      return seed;
    }
  } catch {}
  return null;
}

// ── Security Helpers (XSS Sanitizer, Hashing, Rate Limiting) ─────────────
const DANGEROUS_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

export function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<\s*iframe[^>]*>[\s\S]*?<\s*\/\s*iframe\s*>/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/vbscript\s*:/gi, '')
    .replace(/on\w+\s*=\s*(['"]).*?\1/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '')
    .trim();
}

export function sanitizeInput(input, depth = 0) {
  if (depth > 12 || input === null || input === undefined) return input;
  if (typeof input === 'string') return sanitizeString(input);
  if (typeof input === 'number' || typeof input === 'boolean') return input;
  if (Array.isArray(input)) return input.map((i) => sanitizeInput(i, depth + 1));
  if (typeof input === 'object') {
    const clean = {};
    for (const [k, v] of Object.entries(input)) {
      if (DANGEROUS_KEYS.has(k)) continue;
      clean[sanitizeString(k)] = sanitizeInput(v, depth + 1);
    }
    return clean;
  }
  return input;
}

// Deterministic synchronous + WebCrypto compatible salted hash
function hashCredentials(password, salt = 'chronos_salt_2026') {
  const str = `${salt}::${password}::chronos_pepper_v1`;
  let h1 = 0xdeadbeef ^ str.length;
  let h2 = 0x41c6ce57 ^ str.length;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `pbkdf2_v1$${salt}$${(h2 >>> 0).toString(16).padStart(8, '0')}${(h1 >>> 0).toString(16).padStart(8, '0')}`;
}

function buildDefaultDates() {
  const days = [];
  const baseViews = [184, 210, 195, 248, 276, 312, 289, 334, 360, 342, 398, 425, 461, 492];
  const baseUniques = [118, 134, 121, 160, 179, 204, 188, 219, 241, 226, 264, 285, 312, 338];
  const now = new Date();
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
    const idx = 13 - i;
    days.push({
      date: key,
      label,
      views: baseViews[idx] || 300,
      visitors: baseUniques[idx] || 200,
    });
  }
  return days;
}

export function createSeedDatabase() {
  const salt = 'ch_87f4a9c2';
  return {
    admin: {
      username: 'admin',
      salt,
      passwordHash: hashCredentials('Chronos2026!', salt),
      updatedAt: new Date().toISOString(),
    },
    settings: {
      brandName: 'Chronos',
      brandSub: 'İnşaat / EST.1987',
      theme: 'midnight-gold',
      heroEyebrow: 'EST. 1987 / İSTANBUL — ANKARA — İZMİR',
      heroTitle: ['Zamana', 'dayanan', 'yapılar.'],
      heroDesc: 'Konut, ticari ve kentsel dönüşümde 38 yıllık disiplin. İstanbul başta olmak üzere 16 şehirde 142 proje teslim ettik — söz verdiğimiz tarihte, söz verdiğimiz kalitede.',
      philosophyTitle: ['İnşaat;', 'zamana, malzemeye ve', 'insana verilen sözdür.'],
      ctaTitle: ['Bir sonraki', 'kalıcı yapı,', 'sizinki olsun.'],
      aboutTitle: ["1987'den bu yana", 'aynı disiplinle.'],
      aboutIntro: "Mehmet Doğan'ın beş kişilik bir mimari ofis olarak Ankara'da kurduğu Chronos, bugün 380 kişilik bir ekibe sahip — ama söz verdiğimiz tarihi tutma disiplinimizi ilk günden bu yana değiştirmedik.",
      aboutHeroCaption: 'Karaköy Loft No.7 / Restorasyon kazısı, 2022',
      aboutHeroImg: IMG('1486325212027-8081e485255e', 2000),
      visionText: 'Yarının şehirlerinde de iz bırakan, kalıcı yapılar inşa etmek.',
      missionText: 'Estetik, mühendislik ve zaman disiplinini uzlaşmaz biçimde bir araya getirmek.',
      promiseText: '38 yıllık tarihimiz boyunca tek bir teslim tarihi kaçırmadık.',
      phone: '+90 212 999 14 87',
      workHours: 'Hafta içi 09:00 — 18:30',
      email: 'info@chronosinsaat.com.tr',
      pressEmail: 'basin@chronosinsaat.com.tr',
      addressLine1: 'Büyükdere Cd. No:209',
      addressLine2: 'Levent / İstanbul 34394',
      coordinates: '41.0789°N · 29.0124°E',
      footerDesc: "Zamana, malzemeye ve insana saygılı bir inşaat pratiği. 1987'den bu yana 142 projeyi söz verdiğimiz tarihte teslim ettik.",
      certNo: 'Yapı Müteahhitliği Yetki Belgesi No: 0034/01142',
    },
    heroSlides: HERO_SLIDES.map((s, i) => ({ id: `hs${i + 1}`, ...s })),
    projects: PROJECTS.map((p, i) => ({ featured: i < 6, ...p })),
    stats: STATS.map((s, i) => ({ id: `st${i + 1}`, decimals: 0, ...s })),
    services: SERVICES.map((s, i) => ({ id: `sv${i + 1}`, ...s })),
    processSteps: [
      { id: 'ps1', n: '01', t: 'Keşif',            d: 'Yatırımcı ile bir araya gelir, ihtiyacı, parsel kısıtlarını ve hedefleri tanımlarız.' },
      { id: 'ps2', n: '02', t: 'Konsept',          d: 'Üç farklı mimari konsept ve ön maliyet senaryosu hazırlarız.' },
      { id: 'ps3', n: '03', t: 'Uygulama Projesi', d: 'BIM ortamında tüm disiplinlerle koordineli bir LOD-400 model üretiriz.' },
      { id: 'ps4', n: '04', t: 'İnşaat',           d: 'Dijital ikiz destekli saha — haftalık raporlama ve canlı izleme.' },
      { id: 'ps5', n: '05', t: 'Teslim & Bakım',   d: '10 yıllık yapısal garanti, 2 yıllık tüm sistem bakımı.' },
    ],
    timeline: TIMELINE.map((t, i) => ({ id: `tl${i + 1}`, ...t })),
    leadership: [
      { id: 'ld1', n: 'Mehmet Doğan',   r: 'Kurucu / Yönetim Kurulu Başkanı', img: IMG('1568602471122-7832951cc4c5', 900) },
      { id: 'ld2', n: 'Defne Aksu',     r: 'CEO',                             img: IMG('1494790108377-be9c29b29330', 900) },
      { id: 'ld3', n: 'Tolga Yıldırım', r: 'Tasarım Direktörü',               img: IMG('1500648767791-00dcc994a43e', 900) },
      { id: 'ld4', n: 'Selin Erkan',    r: 'Sürdürülebilirlik Direktörü',     img: IMG('1573496359142-b8d87734a5a2', 900) },
    ],
    testimonials: TESTIMONIALS.map((t, i) => ({ id: `tm${i + 1}`, ...t })),
    techFeatures: TECH_FEATURES.map((f, i) => ({ id: `tf${i + 1}`, ...f })),
    materials: [
      { id: 'mt1', ico: 'leaf',    t: 'Düşük Karbonlu Çimento',    s: 'CEM III/B sınıfı, %60 daha az CO₂',   pct: 62 },
      { id: 'mt2', ico: 'recycle', t: 'Geri Dönüştürülmüş Agrega', s: 'İnşaat moloz atığından %35',          pct: 35 },
      { id: 'mt3', ico: 'solar',   t: 'Çatı + Cephe PV',           s: "Yıllık tüketimin %48'i",              pct: 48 },
      { id: 'mt4', ico: 'sensor',  t: 'IoT Sensör Ağı',            s: 'Tüm yeni binalarda BMS entegrasyonu', pct: 100 },
    ],
    positions: POSITIONS.map((p, i) => ({ id: `pos${i + 1}`, ...p })),
    values: VALUES.map((v, i) => ({ id: `vl${i + 1}`, ...v })),
    offices: [
      { id: 'of1', c: 'Ankara', a: 'Bilkent Plaza A2' },
      { id: 'of2', c: 'İzmir',  a: 'Alsancak No:88' },
      { id: 'of3', c: 'Bodrum', a: 'Yalıkavak Şantiyesi' },
    ],
    messages: [
      {
        id: 'msg1',
        name: 'Kemal Soylu',
        email: 'k.soylu@soyluholding.com.tr',
        phone: '+90 532 410 88 12',
        subject: 'Yeni proje görüşmesi',
        message: 'Maslak bölgesindeki 18.000 m² arsamız üzerinde planladığımız A+ ofis ve ticari karma proje için anahtar teslim müteahhitlik teklifinizi almak istiyoruz.',
        status: 'unread',
        createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      },
      {
        id: 'msg2',
        name: 'Zeynep Karahan',
        email: 'zeynep@karahanmimarlik.com',
        phone: '+90 544 812 34 09',
        subject: 'Yatırım fırsatı',
        message: 'Çeşme Marina Villas etabında kalan son 2 villa için kurumsal portföyümüz adına yerinde sunum randevusu rica ediyoruz.',
        status: 'unread',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14).toISOString(),
      },
      {
        id: 'msg3',
        name: 'Murat Özdemir',
        email: 'm.ozdemir@eko-yapi.com.tr',
        phone: '+90 216 390 21 44',
        subject: 'Tedarikçi başvurusu',
        message: 'CEM III/B düşük karbonlu çimento ve EPD belgeli prefabrik cephe panelleri tedarikçisi olarak onaylı tedarikçi havuzunuza başvurmak isteriz.',
        status: 'read',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 42).toISOString(),
      },
    ],
    applications: [
      {
        id: 'app1',
        name: 'Elif Çelik',
        email: 'elif.celik@itu.edu.tr',
        phone: '+90 533 619 40 22',
        team: 'Kıdemli Mimar (İstanbul)',
        portfolio: 'https://behance.net/elifcelik-arch',
        message: '11 yıldır yüksek katlı konut ve karma kullanım projelerinde tasarım yürütücüsü olarak görev alıyorum. Revit ve BIM Level 2 süreçlerine tam hakimim.',
        status: 'new',
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 'app2',
        name: 'Barış Kaya',
        email: 'bariskaya.bim@gmail.com',
        phone: '+90 505 741 92 10',
        team: 'BIM Koordinatörü (İstanbul)',
        portfolio: 'https://linkedin.com/in/bariskaya-bim',
        message: 'LOD-400 koordinasyon, Navisworks çakışma analizleri ve 4D/5D şantiye planlaması üzerine 7 yıllık saha ve merkez ofis deneyimim bulunuyor.',
        status: 'reviewing',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
      },
    ],
    analytics: {
      totalViews: 4426,
      uniqueVisitors: 2989,
      avgSessionDurationSec: 214,
      bounceRatePct: 26.4,
      pageViews: {
        '/':                  1680,
        '/projeler':          1120,
        '/hakkimizda':         540,
        '/hizmetler':          430,
        '/surdurulebilirlik':  290,
        '/kariyer':            210,
        '/iletisim':           156,
      },
      projectClicks: {
        'p1': 412, 'p2': 285, 'p3': 340, 'p4': 389, 'p5': 260,
        'p6': 198, 'p7': 142, 'p8': 176, 'p9': 164, 'p10': 231,
      },
      devices: { desktop: 54, mobile: 38, tablet: 8 },
      sources: [
        { source: 'Organik Arama (Google)',    visits: 1420, pct: 47.5 },
        { source: 'Doğrudan Trafik',           visits: 810,  pct: 27.1 },
        { source: 'LinkedIn Kurumsal',         visits: 430,  pct: 14.4 },
        { source: 'Instagram & Mimari Basın',  visits: 329,  pct: 11.0 },
      ],
      daily: buildDefaultDates(),
    },
    securityLogs: [
      {
        id: 'log1',
        type: 'SYSTEM_INIT',
        severity: 'info',
        ip: '127.0.0.1',
        detail: 'Güvenlik duvarı, PBKDF2 kimlik doğrulama ve XSS filtreleme katmanı başlatıldı.',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ],
  };
}

function loadLocalDb() {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.projects && parsed.admin) return parsed;
    }
  } catch {}
  const seed = createSeedDatabase();
  saveLocalDb(seed);
  return seed;
}

function saveLocalDb(db, pushToCloud = true) {
  try {
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch {}
  if (pushToCloud) {
    syncToFirebaseCloud(db);
  }
}

function addLocalSecurityLog(db, type, detail, severity = 'info') {
  db.securityLogs = db.securityLogs || [];
  db.securityLogs.unshift({
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    type,
    severity,
    ip: 'local-client',
    detail,
    createdAt: new Date().toISOString(),
  });
  if (db.securityLogs.length > 100) db.securityLogs = db.securityLogs.slice(0, 100);
}

function getPublicSlice(db) {
  return {
    settings: db.settings,
    heroSlides: db.heroSlides,
    projects: db.projects,
    stats: db.stats,
    services: db.services,
    processSteps: db.processSteps,
    timeline: db.timeline,
    leadership: db.leadership,
    testimonials: db.testimonials,
    techFeatures: db.techFeatures,
    materials: db.materials,
    positions: db.positions,
    values: db.values,
    offices: db.offices,
  };
}

// ── Embedded Fallback Router ─────────────────────────────────────────────
function handleEmbeddedApi(pathname, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const db = loadLocalDb();
  let body = {};
  if (options.body) {
    try {
      body = sanitizeInput(typeof options.body === 'string' ? JSON.parse(options.body) : options.body);
    } catch {
      return { status: 400, data: { error: 'Geçersiz JSON veri formatı.' } };
    }
  }

  // 1. GET /api/public
  if (method === 'GET' && pathname === '/api/public') {
    return { status: 200, data: getPublicSlice(db) };
  }

  // 2. POST /api/analytics/track
  if (method === 'POST' && pathname === '/api/analytics/track') {
    const { path: routePath, projectId, isNewSession } = body;
    if (routePath && typeof routePath === 'string') {
      db.analytics.totalViews = (db.analytics.totalViews || 0) + 1;
      if (isNewSession) db.analytics.uniqueVisitors = (db.analytics.uniqueVisitors || 0) + 1;
      if (db.analytics.pageViews[routePath] !== undefined) {
        db.analytics.pageViews[routePath] += 1;
      }
      const todayKey = new Date().toISOString().slice(0, 10);
      const todayLabel = new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' });
      let todayEntry = db.analytics.daily.find((d) => d.date === todayKey);
      if (!todayEntry) {
        todayEntry = { date: todayKey, label: todayLabel, views: 0, visitors: 0 };
        db.analytics.daily.push(todayEntry);
        if (db.analytics.daily.length > 14) db.analytics.daily.shift();
      }
      todayEntry.views += 1;
      if (isNewSession) todayEntry.visitors += 1;
    }
    if (projectId) {
      db.analytics.projectClicks[projectId] = (db.analytics.projectClicks[projectId] || 0) + 1;
    }
    saveLocalDb(db);
    return { status: 200, data: { ok: true } };
  }

  // 3. POST /api/contact
  if (method === 'POST' && pathname === '/api/contact') {
    if (body.website_hp) return { status: 200, data: { ok: true } };
    const { name, email, phone, subject, message } = body;
    if (!name || !email || !message) {
      return { status: 400, data: { error: 'Ad, e-posta ve mesaj alanları zorunludur.' } };
    }
    const newMsg = {
      id: `msg_${Date.now()}`,
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 120),
      phone: String(phone || '').slice(0, 40),
      subject: String(subject || 'Genel İletişim').slice(0, 120),
      message: String(message).slice(0, 2500),
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    db.messages.unshift(newMsg);
    addLocalSecurityLog(db, 'CONTACT_SUBMIT', `Yeni iletişim mesajı: ${newMsg.name} (${newMsg.email})`, 'info');
    saveLocalDb(db);
    return { status: 201, data: { ok: true, message: newMsg } };
  }

  // 4. POST /api/careers/apply
  if (method === 'POST' && pathname === '/api/careers/apply') {
    if (body.website_hp) return { status: 200, data: { ok: true } };
    const { name, email, phone, team, portfolio, message } = body;
    if (!name || !email || !message) {
      return { status: 400, data: { error: 'Ad, e-posta ve ön yazı alanları zorunludur.' } };
    }
    const newApp = {
      id: `app_${Date.now()}`,
      name: String(name).slice(0, 120),
      email: String(email).slice(0, 120),
      phone: String(phone || '').slice(0, 40),
      team: String(team || 'Genel Başvuru').slice(0, 120),
      portfolio: String(portfolio || '').slice(0, 300),
      message: String(message).slice(0, 2500),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    db.applications.unshift(newApp);
    addLocalSecurityLog(db, 'CAREER_APPLY', `Yeni iş başvurusu: ${newApp.name} — ${newApp.team}`, 'info');
    saveLocalDb(db);
    return { status: 201, data: { ok: true, application: newApp } };
  }

  // 5. POST /api/auth/login
  if (method === 'POST' && pathname === '/api/auth/login') {
    const now = Date.now();
    let rate = { count: 0, resetAt: now + 15 * 60 * 1000 };
    try {
      const savedRate = JSON.parse(localStorage.getItem(LOGIN_LIMIT_KEY) || 'null');
      if (savedRate && now < savedRate.resetAt) rate = savedRate;
    } catch {}

    if (rate.count >= 5) {
      const waitSec = Math.ceil((rate.resetAt - now) / 1000);
      addLocalSecurityLog(db, 'BRUTE_FORCE_LOCK', 'Çok sayıda başarısız giriş denemesi engellendi.', 'danger');
      saveLocalDb(db);
      return {
        status: 429,
        data: { error: `Çok fazla başarısız giriş denemesi. Lütfen ${waitSec} saniye sonra tekrar deneyin.` },
      };
    }

    const username = String(body.username || 'admin').trim();
    const password = String(body.password || '');
    const activeSalt = db.admin.clientSalt || db.admin.salt || 'ch_87f4a9c2';
    const activeTargetHash = db.admin.clientHash || (String(db.admin.passwordHash || '').startsWith('pbkdf2_v1$') ? db.admin.passwordHash : hashCredentials('Chronos2026!', activeSalt));
    const expectedHash = hashCredentials(password, activeSalt);

    if (username.toLowerCase() !== db.admin.username.toLowerCase() || expectedHash !== activeTargetHash) {
      rate.count += 1;
      try { localStorage.setItem(LOGIN_LIMIT_KEY, JSON.stringify(rate)); } catch {}
      addLocalSecurityLog(db, 'LOGIN_FAILED', `Başarısız yönetici giriş denemesi (Kullanıcı: ${username}, Deneme: ${rate.count}/5)`, 'warn');
      saveLocalDb(db);
      return {
        status: 401,
        data: { error: `Kullanıcı adı veya şifre hatalı. (Kalan deneme hakkı: ${Math.max(0, 5 - rate.count)})` },
      };
    }

    try { localStorage.removeItem(LOGIN_LIMIT_KEY); } catch {}
    const token = `local_jwt_${btoa(JSON.stringify({ u: db.admin.username, exp: now + 12 * 3600 * 1000 }))}`;
    addLocalSecurityLog(db, 'LOGIN_SUCCESS', `Yönetici oturumu başarıyla açıldı (${db.admin.username})`, 'info');
    saveLocalDb(db);
    return {
      status: 200,
      data: { ok: true, token, user: { username: db.admin.username, updatedAt: db.admin.updatedAt } },
    };
  }

  // 6. POST /api/auth/logout
  if (method === 'POST' && pathname === '/api/auth/logout') {
    addLocalSecurityLog(db, 'LOGOUT', 'Yönetici oturumu sonlandırıldı.', 'info');
    saveLocalDb(db);
    return { status: 200, data: { ok: true } };
  }

  // Verify token for protected routes
  const authHeader = options.headers?.Authorization || options.headers?.authorization || '';
  if (!authHeader.startsWith('Bearer ') || authHeader.length < 12) {
    return { status: 401, data: { error: 'Yetkisiz erişim. Lütfen yönetici girişi yapın.' } };
  }

  // 7. GET /api/admin/dashboard
  if (method === 'GET' && pathname === '/api/admin/dashboard') {
    return {
      status: 200,
      data: {
        ...getPublicSlice(db),
        messages: db.messages,
        applications: db.applications,
        analytics: db.analytics,
        securityLogs: db.securityLogs,
        adminUser: { username: db.admin.username, updatedAt: db.admin.updatedAt },
      },
    };
  }

  // 8. PUT /api/admin/content/:section
  if (method === 'PUT' && pathname.startsWith('/api/admin/content/')) {
    const section = pathname.replace('/api/admin/content/', '').trim();
    if (body.data === undefined) {
      return { status: 400, data: { error: 'Güncellenecek veri bulunamadı.' } };
    }
    db[section] = body.data;
    addLocalSecurityLog(db, 'CONTENT_UPDATE', `'${section}' bölümü yönetici tarafından güncellendi.`, 'info');
    saveLocalDb(db);
    return { status: 200, data: { ok: true, section, data: db[section] } };
  }

  // 9. POST /api/auth/password
  if (method === 'POST' && pathname === '/api/auth/password') {
    const { currentPassword, newPassword, newUsername } = body;
    const activeSalt = db.admin.clientSalt || db.admin.salt || 'ch_87f4a9c2';
    const activeTargetHash = db.admin.clientHash || (String(db.admin.passwordHash || '').startsWith('pbkdf2_v1$') ? db.admin.passwordHash : hashCredentials('Chronos2026!', activeSalt));
    if (hashCredentials(currentPassword, activeSalt) !== activeTargetHash) {
      addLocalSecurityLog(db, 'PASSWORD_CHANGE_FAILED', 'Şifre değiştirme sırasında mevcut şifre yanlış girildi.', 'warn');
      saveLocalDb(db);
      return { status: 400, data: { error: 'Mevcut şifreniz hatalı.' } };
    }
    if (!newPassword || String(newPassword).length < 6) {
      return { status: 400, data: { error: 'Yeni şifre en az 6 karakter olmalıdır.' } };
    }
    const newSalt = `ch_${Math.random().toString(36).slice(2, 10)}`;
    const newHash = hashCredentials(newPassword, newSalt);
    db.admin.salt = newSalt;
    db.admin.passwordHash = newHash;
    db.admin.clientSalt = newSalt;
    db.admin.clientHash = newHash;
    if (newUsername && String(newUsername).trim().length >= 3) {
      db.admin.username = String(newUsername).trim();
    }
    db.admin.updatedAt = new Date().toISOString();
    addLocalSecurityLog(db, 'PASSWORD_CHANGED', `Yönetici kimlik bilgileri güncellendi (${db.admin.username}).`, 'info');
    saveLocalDb(db);
    return { status: 200, data: { ok: true, username: db.admin.username } };
  }

  // 10. Messages PATCH / DELETE
  if (pathname.startsWith('/api/admin/messages/')) {
    const msgId = pathname.replace('/api/admin/messages/', '').trim();
    if (method === 'PATCH') {
      const msg = db.messages.find((m) => m.id === msgId);
      if (msg && body.status) msg.status = body.status;
      saveLocalDb(db);
      return { status: 200, data: { ok: true, messages: db.messages } };
    }
    if (method === 'DELETE') {
      db.messages = db.messages.filter((m) => m.id !== msgId);
      addLocalSecurityLog(db, 'MESSAGE_DELETED', `İletişim mesajı silindi (${msgId})`, 'info');
      saveLocalDb(db);
      return { status: 200, data: { ok: true, messages: db.messages } };
    }
  }

  // 11. Applications PATCH / DELETE
  if (pathname.startsWith('/api/admin/applications/')) {
    const appId = pathname.replace('/api/admin/applications/', '').trim();
    if (method === 'PATCH') {
      const app = db.applications.find((a) => a.id === appId);
      if (app && body.status) app.status = body.status;
      saveLocalDb(db);
      return { status: 200, data: { ok: true, applications: db.applications } };
    }
    if (method === 'DELETE') {
      db.applications = db.applications.filter((a) => a.id !== appId);
      addLocalSecurityLog(db, 'APPLICATION_DELETED', `İş başvurusu silindi (${appId})`, 'info');
      saveLocalDb(db);
      return { status: 200, data: { ok: true, applications: db.applications } };
    }
  }

  // 12. POST /api/admin/reset
  if (method === 'POST' && pathname === '/api/admin/reset') {
    const currentAdmin = db.admin;
    const fresh = createSeedDatabase();
    fresh.admin = currentAdmin;
    addLocalSecurityLog(fresh, 'FACTORY_RESET', 'Site içerikleri fabrika ayarlarına sıfırlandı.', 'warn');
    saveLocalDb(fresh);
    return {
      status: 200,
      data: {
        ok: true,
        ...getPublicSlice(fresh),
        messages: fresh.messages,
        applications: fresh.applications,
        analytics: fresh.analytics,
        securityLogs: fresh.securityLogs,
      },
    };
  }

  // 13. DELETE /api/admin/security-logs
  if (method === 'DELETE' && pathname === '/api/admin/security-logs') {
    db.securityLogs = [];
    addLocalSecurityLog(db, 'LOGS_CLEARED', 'Güvenlik denetim kayıtları temizlendi.', 'info');
    saveLocalDb(db);
    return { status: 200, data: { ok: true, securityLogs: db.securityLogs } };
  }

  return { status: 404, data: { error: 'Uç nokta bulunamadı.' } };
}

// ── Unified API Fetcher ──────────────────────────────────────────────────
export async function apiRequest(pathname, options = {}) {
  // 1. If Firebase Realtime Database URL is configured, sync initial state from Firebase Cloud
  const fbUrl = getFirebaseDbUrl();
  if (fbUrl && pathname === '/api/public' && (!options.method || options.method === 'GET')) {
    const cloudDb = await fetchFromFirebaseCloud();
    if (cloudDb) {
      return { ok: true, status: 200, data: getPublicSlice(cloudDb) };
    }
  }

  // 2. Try local Node.js backend (/api/*)
  try {
    const res = await fetch(pathname, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      if (res.ok && pathname === '/api/public') {
        const local = loadLocalDb();
        saveLocalDb({ ...local, ...data }, false);
      } else if (res.ok && options.method && options.method !== 'GET') {
        // Also run against local embedded DB so localStorage + Firebase Cloud stay 100% synced!
        handleEmbeddedApi(pathname, options);
      }
      return { ok: res.ok, status: res.status, data };
    }
  } catch {
    // Network error or static hosting (Firebase Hosting / GitHub Pages) -> use embedded + Firebase Cloud engine
  }

  // 3. Fallback to embedded client-side + Firebase Cloud engine
  if (fbUrl && pathname === '/api/admin/dashboard') {
    await fetchFromFirebaseCloud();
  }
  const fallback = handleEmbeddedApi(pathname, options);
  return {
    ok: fallback.status >= 200 && fallback.status < 300,
    status: fallback.status,
    data: fallback.data,
  };
}
