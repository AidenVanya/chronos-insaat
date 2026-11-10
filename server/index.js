// server/index.js — Standalone Production HTTP Server (API + Static SPA Server)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiMiddleware } from './api.js';
import { applySecurityHeaders } from './security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 4000;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico':  'image/x-icon',
};

const server = http.createServer((req, res) => {
  applySecurityHeaders(res);

  if (req.url && req.url.startsWith('/api/')) {
    return apiMiddleware(req, res);
  }

  // Serve static files from dist/ if built
  const urlPath = (req.url || '/').split('?')[0];
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(DIST_DIR, safePath === '/' ? 'index.html' : safePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html');
  }

  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).toLowerCase();
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Chronos İnşaat API aktif. Ön yüz için `npm run dev` veya önce `npm run build` çalıştırın.');
  }
});

server.listen(PORT, () => {
  console.log(`\n  ✦ Chronos İnşaat Sunucusu & Güvenlik Katmanı Aktif: http://localhost:${PORT}`);
  console.log(`  ✦ Yönetim Paneli: http://localhost:${PORT}/#/panel\n`);
});
