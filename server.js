// Static server + leaderboard API for High-Top Dash (e.g. on Railway). No dependencies.
//
//   GET  /api/scores            -> { scores: [{ name, best, at }] }  (best distance in meters, highest first)
//   POST /api/scores {name, meters, time?} -> keeps each name's best run: farther wins; at the 5K finish
//                                         (5000 m) the faster time in seconds wins
//
// Scores are saved to $DATA_DIR/scores.json (default ./data). On Railway, attach a volume and set
// DATA_DIR to its mount path (for example /data) so scores survive redeploys.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const FILE = path.join(DATA_DIR, 'scores.json');
const FINISH_M = 5000;
const MAX_METERS = FINISH_M;
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
const PRIVATE = new Set(['server.js', 'package.json', 'package-lock.json']);

let scores = {};
try { scores = JSON.parse(fs.readFileSync(FILE, 'utf8')) || {}; } catch (e) { scores = {}; }

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      fs.writeFileSync(FILE + '.tmp', JSON.stringify(scores));
      fs.renameSync(FILE + '.tmp', FILE);
    } catch (e) { console.error('Could not save scores:', e.message); }
  }, 250);
}

function top(n = 50) {
  return Object.values(scores)
    .sort((a, b) => b.best - a.best || (a.time || 1e9) - (b.time || 1e9) || a.at - b.at).slice(0, n)
    .map(({ name, best, time, at }) => (time ? { name, best, time, at } : { name, best, at }));
}

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20;
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(body));
}

function handleApi(req, res) {
  if (req.method === 'GET') return json(res, 200, { scores: top() });
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';
  if (rateLimited(ip)) return json(res, 429, { error: 'Too many posts, try again in a minute' });
  let body = '';
  req.on('data', chunk => { body += chunk; if (body.length > 2048) req.destroy(); });
  req.on('end', () => {
    let data;
    try { data = JSON.parse(body); } catch (e) { return json(res, 400, { error: 'Invalid JSON' }); }
    const name = String(data.name || '').replace(/[^A-Za-z0-9 _.'-]/g, '').trim().slice(0, 16);
    const meters = Math.floor(Number(data.meters));
    if (!name) return json(res, 400, { error: 'Name is required' });
    if (!Number.isFinite(meters) || meters < 0 || meters > MAX_METERS) return json(res, 400, { error: 'Invalid distance' });
    let time = Math.round(Number(data.time));
    if (meters < FINISH_M || !Number.isFinite(time) || time < 30 || time > 36000) time = 0;
    const key = name.toLowerCase();
    const cur = scores[key];
    const better = !cur || meters > cur.best || (meters === cur.best && time && (!cur.time || time < cur.time));
    if (better) {
      scores[key] = time ? { name, best: meters, time, at: Date.now() } : { name, best: meters, at: Date.now() };
      save();
    }
    json(res, 200, { ok: true, scores: top() });
  });
}

http.createServer((req, res) => {
  const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
  if (urlPath === '/api/scores') return handleApi(req, res);
  let p = urlPath === '/' || urlPath === '' ? '/index.html' : urlPath;
  const file = path.normalize(path.join(ROOT, p));
  const base = path.basename(file);
  if (!file.startsWith(ROOT + path.sep) || base.startsWith('.') || PRIVATE.has(base) || file.startsWith(DATA_DIR)) {
    res.writeHead(404); return res.end('Not found');
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(PORT, () => console.log(`High-Top Dash running on port ${PORT}`));
