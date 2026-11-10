// server/api.js — Connect/Node HTTP compatible REST API middleware for Chronos İnşaat
import {
  applySecurityHeaders,
  checkApiRateLimit,
  checkLoginRateLimit,
  getClientIp,
  hashPassword,
  recordFailedLogin,
  resetLoginRateLimit,
  revokeToken,
  sanitizeInput,
  signToken,
  verifyPassword,
  verifyToken,
} from './security.js';
import { addSecurityLog, getDb, resetDbToDefault, saveDb } from './db.js';

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(data));
}

function readJsonBody(req, maxBytes = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      raw += chunk.toString('utf8');
    });
    req.on('end', () => {
      if (!raw) return resolve({});
      try {
        const parsed = JSON.parse(raw);
        resolve(sanitizeInput(parsed));
      } catch {
        reject(new Error('INVALID_JSON'));
      }
    });
    req.on('error', reject);
  });
}

function getAuthPayload(req) {
  const authHeader = req.headers['authorization'] || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  return verifyToken(token);
}

function getPublicPayload(db) {
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

const EDITABLE_SECTIONS = new Set([
  'settings',
  'heroSlides',
  'projects',
  'stats',
  'services',
  'processSteps',
  'timeline',
  'leadership',
  'testimonials',
  'techFeatures',
  'materials',
  'positions',
  'values',
  'offices',
]);

export async function apiMiddleware(req, res, next) {
  applySecurityHeaders(res);

  const urlObj = new URL(req.url || '/', 'http://localhost');
  const pathname = urlObj.pathname;

  if (!pathname.startsWith('/api/')) {
    return next ? next() : undefined;
  }

  const ip = getClientIp(req);
  if (!checkApiRateLimit(ip, 180)) {
    addSecurityLog('RATE_LIMIT_BLOCK', `API istek limiti aşıldı (${pathname})`, ip, 'warn');
    return sendJson(res, 429, { error: 'Çok fazla istek gönderildi. Lütfen biraz bekleyin.' });
  }

  const method = req.method || 'GET';
  const db = getDb();

  try {
    // ── PUBLIC: Get all site content ──────────────────────────────────────
    if (method === 'GET' && pathname === '/api/public') {
      return sendJson(res, 200, getPublicPayload(db));
    }

    // ── PUBLIC: Track page view / project interaction ─────────────────────
    if (method === 'POST' && pathname === '/api/analytics/track') {
      const body = await readJsonBody(req);
      const { path: routePath, projectId, isNewSession } = body;

      if (routePath && typeof routePath === 'string') {
        db.analytics.totalViews = (db.analytics.totalViews || 0) + 1;
        if (isNewSession) {
          db.analytics.uniqueVisitors = (db.analytics.uniqueVisitors || 0) + 1;
        }
        if (db.analytics.pageViews[routePath] !== undefined) {
          db.analytics.pageViews[routePath] += 1;
        } else if (!routePath.startsWith('/panel') && !routePath.startsWith('/admin')) {
          db.analytics.pageViews[routePath] = 1;
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

      if (projectId && typeof projectId === 'string') {
        db.analytics.projectClicks[projectId] = (db.analytics.projectClicks[projectId] || 0) + 1;
      }

      saveDb(db);
      return sendJson(res, 200, { ok: true });
    }

    // ── PUBLIC: Submit Contact Form ───────────────────────────────────────
    if (method === 'POST' && pathname === '/api/contact') {
      const body = await readJsonBody(req);
      // Honeypot check
      if (body.website_hp) {
        addSecurityLog('BOT_BLOCKED', 'İletişim formunda honeypot tuzağı tetiklendi.', ip, 'warn');
        return sendJson(res, 200, { ok: true });
      }
      const { name, email, phone, subject, message } = body;
      if (!name || !email || !message) {
        return sendJson(res, 400, { error: 'Ad, e-posta ve mesaj alanları zorunludur.' });
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
      saveDb(db);
      addSecurityLog('CONTACT_SUBMIT', `Yeni iletişim mesajı: ${newMsg.name} (${newMsg.email})`, ip, 'info');
      return sendJson(res, 201, { ok: true, message: newMsg });
    }

    // ── PUBLIC: Submit Career Application ─────────────────────────────────
    if (method === 'POST' && pathname === '/api/careers/apply') {
      const body = await readJsonBody(req);
      if (body.website_hp) {
        addSecurityLog('BOT_BLOCKED', 'Kariyer formunda honeypot tuzağı tetiklendi.', ip, 'warn');
        return sendJson(res, 200, { ok: true });
      }
      const { name, email, phone, team, portfolio, message } = body;
      if (!name || !email || !message) {
        return sendJson(res, 400, { error: 'Ad, e-posta ve ön yazı alanları zorunludur.' });
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
      saveDb(db);
      addSecurityLog('CAREER_APPLY', `Yeni iş başvurusu: ${newApp.name} — ${newApp.team}`, ip, 'info');
      return sendJson(res, 201, { ok: true, application: newApp });
    }

    // ── AUTH: Login ───────────────────────────────────────────────────────
    if (method === 'POST' && pathname === '/api/auth/login') {
      const limit = checkLoginRateLimit(ip);
      if (!limit.allowed) {
        addSecurityLog('BRUTE_FORCE_LOCK', `Çok sayıda başarısız giriş denemesi nedeniyle IP geçici olarak engellendi.`, ip, 'danger');
        return sendJson(res, 429, {
          error: `Çok fazla başarısız giriş denemesi. Lütfen ${limit.retryAfterSec} saniye sonra tekrar deneyin.`,
        });
      }

      const body = await readJsonBody(req);
      const username = String(body.username || 'admin').trim();
      const password = String(body.password || '');

      const isUserMatch = username.toLowerCase() === db.admin.username.toLowerCase();
      const isPassMatch = verifyPassword(password, db.admin.salt, db.admin.passwordHash);

      if (!isUserMatch || !isPassMatch) {
        const fails = recordFailedLogin(ip);
        addSecurityLog('LOGIN_FAILED', `Başarısız yönetici giriş denemesi (Kullanıcı: ${username}, Deneme: ${fails}/5)`, ip, 'warn');
        return sendJson(res, 401, {
          error: `Kullanıcı adı veya şifre hatalı. (Kalan deneme hakkı: ${Math.max(0, 5 - fails)})`,
        });
      }

      resetLoginRateLimit(ip);
      const token = signToken({ username: db.admin.username, role: 'admin' });
      addSecurityLog('LOGIN_SUCCESS', `Yönetici oturumu başarıyla açıldı (${db.admin.username})`, ip, 'info');
      return sendJson(res, 200, {
        ok: true,
        token,
        user: { username: db.admin.username, updatedAt: db.admin.updatedAt },
      });
    }

    // ── AUTH: Logout ──────────────────────────────────────────────────────
    if (method === 'POST' && pathname === '/api/auth/logout') {
      const authHeader = req.headers['authorization'] || '';
      if (authHeader.startsWith('Bearer ')) {
        revokeToken(authHeader.slice(7).trim());
      }
      addSecurityLog('LOGOUT', 'Yönetici oturumu sonlandırıldı.', ip, 'info');
      return sendJson(res, 200, { ok: true });
    }

    // ── PROTECTED ADMIN ROUTES (Require valid signed Bearer token) ────────
    const auth = getAuthPayload(req);
    if (!auth) {
      return sendJson(res, 401, { error: 'Yetkisiz erişim. Lütfen yönetici girişi yapın.' });
    }

    if (method === 'GET' && pathname === '/api/auth/me') {
      return sendJson(res, 200, {
        ok: true,
        user: { username: db.admin.username, updatedAt: db.admin.updatedAt },
      });
    }

    // Full Admin Dashboard State
    if (method === 'GET' && pathname === '/api/admin/dashboard') {
      return sendJson(res, 200, {
        ...getPublicPayload(db),
        messages: db.messages,
        applications: db.applications,
        analytics: db.analytics,
        securityLogs: db.securityLogs,
        adminUser: { username: db.admin.username, updatedAt: db.admin.updatedAt },
      });
    }

    // Update any editable content section (projects, settings, stats, services, etc.)
    if (method === 'PUT' && pathname.startsWith('/api/admin/content/')) {
      const section = pathname.replace('/api/admin/content/', '').trim();
      if (!EDITABLE_SECTIONS.has(section)) {
        return sendJson(res, 400, { error: 'Geçersiz içerik bölümü.' });
      }
      const body = await readJsonBody(req);
      if (body.data === undefined) {
        return sendJson(res, 400, { error: 'Güncellenecek veri (data) bulunamadı.' });
      }
      db[section] = body.data;
      saveDb(db);
      addSecurityLog('CONTENT_UPDATE', `'${section}' bölümü yönetici tarafından güncellendi.`, ip, 'info');
      return sendJson(res, 200, { ok: true, section, data: db[section] });
    }

    // Change Admin Username / Password
    if (method === 'POST' && pathname === '/api/auth/password') {
      const body = await readJsonBody(req);
      const { currentPassword, newPassword, newUsername } = body;
      if (!verifyPassword(currentPassword, db.admin.salt, db.admin.passwordHash)) {
        addSecurityLog('PASSWORD_CHANGE_FAILED', 'Şifre değiştirme sırasında mevcut şifre yanlış girildi.', ip, 'warn');
        return sendJson(res, 400, { error: 'Mevcut şifreniz hatalı.' });
      }
      if (!newPassword || String(newPassword).length < 6) {
        return sendJson(res, 400, { error: 'Yeni şifre en az 6 karakter olmalıdır.' });
      }
      const hashed = hashPassword(newPassword);
      db.admin.salt = hashed.salt;
      db.admin.passwordHash = hashed.hash;
      if (newUsername && String(newUsername).trim().length >= 3) {
        db.admin.username = String(newUsername).trim();
      }
      db.admin.updatedAt = new Date().toISOString();
      saveDb(db);
      addSecurityLog('PASSWORD_CHANGED', `Yönetici kimlik bilgileri güncellendi (Kullanıcı: ${db.admin.username}).`, ip, 'info');
      return sendJson(res, 200, { ok: true, username: db.admin.username });
    }

    // Update or delete a Contact Message
    if (pathname.startsWith('/api/admin/messages/')) {
      const msgId = pathname.replace('/api/admin/messages/', '').trim();
      if (method === 'PATCH') {
        const body = await readJsonBody(req);
        const msg = db.messages.find((m) => m.id === msgId);
        if (!msg) return sendJson(res, 404, { error: 'Mesaj bulunamadı.' });
        if (body.status) msg.status = body.status;
        saveDb(db);
        return sendJson(res, 200, { ok: true, messages: db.messages });
      }
      if (method === 'DELETE') {
        db.messages = db.messages.filter((m) => m.id !== msgId);
        saveDb(db);
        addSecurityLog('MESSAGE_DELETED', `İletişim mesajı silindi (${msgId})`, ip, 'info');
        return sendJson(res, 200, { ok: true, messages: db.messages });
      }
    }

    // Update or delete a Career Application
    if (pathname.startsWith('/api/admin/applications/')) {
      const appId = pathname.replace('/api/admin/applications/', '').trim();
      if (method === 'PATCH') {
        const body = await readJsonBody(req);
        const app = db.applications.find((a) => a.id === appId);
        if (!app) return sendJson(res, 404, { error: 'Başvuru bulunamadı.' });
        if (body.status) app.status = body.status;
        saveDb(db);
        return sendJson(res, 200, { ok: true, applications: db.applications });
      }
      if (method === 'DELETE') {
        db.applications = db.applications.filter((a) => a.id !== appId);
        saveDb(db);
        addSecurityLog('APPLICATION_DELETED', `İş başvurusu silindi (${appId})`, ip, 'info');
        return sendJson(res, 200, { ok: true, applications: db.applications });
      }
    }

    // Reset Site Content to Factory Defaults
    if (method === 'POST' && pathname === '/api/admin/reset') {
      const fresh = resetDbToDefault();
      addSecurityLog('FACTORY_RESET', 'Site içerikleri fabrika ayarlarına sıfırlandı.', ip, 'warn');
      return sendJson(res, 200, {
        ok: true,
        ...getPublicPayload(fresh),
        messages: fresh.messages,
        applications: fresh.applications,
        analytics: fresh.analytics,
        securityLogs: fresh.securityLogs,
      });
    }

    // Clear Security Logs
    if (method === 'DELETE' && pathname === '/api/admin/security-logs') {
      db.securityLogs = [];
      addSecurityLog('LOGS_CLEARED', 'Güvenlik denetim kayıtları yönetici tarafından temizlendi.', ip, 'info');
      return sendJson(res, 200, { ok: true, securityLogs: db.securityLogs });
    }

    return sendJson(res, 404, { error: 'API uç noktası bulunamadı.' });
  } catch (err) {
    if (err.message === 'PAYLOAD_TOO_LARGE') {
      return sendJson(res, 413, { error: 'Gönderilen veri boyutu çok büyük.' });
    }
    if (err.message === 'INVALID_JSON') {
      return sendJson(res, 400, { error: 'Geçersiz JSON veri formatı.' });
    }
    console.error('[Chronos API Error]:', err);
    return sendJson(res, 500, { error: 'Sunucu hatası oluştu.' });
  }
}
