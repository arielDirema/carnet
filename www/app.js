/* Carnet — prise de notes et dessin au stylet */
(() => {
'use strict';

// ============================================================ Utilitaires
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const r2 = v => Math.round(v * 100) / 100;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ============================================================ Icônes
const I = {
  back: '<path d="M15 18l-6-6 6-6"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  highlighter: '<path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/>',
  eraser: '<path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/>',
  lasso: '<path d="M7 22a5 5 0 0 1-2-4"/><path d="M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1"/><circle cx="5" cy="16" r="2"/>',
  line: '<path d="M5 19 19 5"/>',
  arrow: '<path d="M5 19 19 5"/><path d="M10 5h9v9"/>',
  rect: '<rect x="4" y="5" width="16" height="14" rx="1.5"/>',
  ellipse: '<ellipse cx="12" cy="12" rx="9" ry="7"/>',
  undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
  redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>',
  paper: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M9.5 11.5h6M9.5 15.5h6"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  sliders: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  trash: '<path d="M4 7h16"/><path d="M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13"/><path d="M9 7V4h6v3"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13.5 6.5 4 4"/>',
  file: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M14 3v5h5"/>',
  image: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/>',
  vector: '<path d="M4 18C8 6 16 6 20 18"/><rect x="2" y="16" width="4" height="4"/><rect x="18" y="16" width="4" height="4"/>',
  stylus: '<path d="M4 20l3-1 11-11-2-2L5 17z"/><path d="m14 6 4 4"/><path d="M20 4l-2 2"/>',
  pageadd: '<path d="M6 3h8.5L19 7.5V21H6z"/><path d="M12.5 11v6M9.5 14h6"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  books: '<path d="M5 4h4v16H5z"/><path d="M9 4h4v16H9z"/><path d="m14 5.2 3.8-1 3.9 14.5-3.9 1z"/>',
  star: '<path d="m12 3.5 2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z"/>',
  pages: '<rect x="3" y="4" width="7" height="16" rx="1.5"/><path d="M14 5h7M14 9.5h7M14 14h7M14 18.5h5"/>',
  shapes: '<path d="M8.5 3.5 13 11H4z"/><rect x="13" y="13" width="7.5" height="7.5" rx="1"/><circle cx="7.5" cy="17" r="3.5"/>',
  settings2: '<circle cx="12" cy="12" r="3"/>',
  text: '<path d="M5 7V4.5h14V7"/><path d="M12 4.5v15"/><path d="M9 19.5h6"/>',
  insert: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M12 8v8M8 12h8"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21"/>',
  audio: '<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
  link: '<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2"/>',
  camera: '<path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  open: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v6H4V6h6"/>',
  bold: '<path d="M7 4h6a4 4 0 0 1 0 8H7z"/><path d="M7 12h7a4 4 0 0 1 0 8H7z"/>',
};
const icon = n => `<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${I[n] || ''}</svg>`;
function hydrateIcons(root = document) {
  $$('[data-icon]', root).forEach(el => {
    if (!el.querySelector(':scope > svg')) el.insertAdjacentHTML('afterbegin', icon(el.dataset.icon));
  });
}

// ============================================================ Constantes
const MM = 3.7795; // px par mm (96 dpi)
const PAGE = { portrait: { w: 794, h: 1123 }, landscape: { w: 1123, h: 794 } };
const GAP = 28;
const MIN_S = 0.2, MAX_S = 6;
const HL_ALPHA = 0.42;

const PAPERS = [
  { id: 'blank', name: 'Vierge' },
  { id: 'lined', name: 'Lignes' },
  { id: 'seyes', name: 'Seyès' },
  { id: 'grid', name: 'Carreaux' },
  { id: 'dots', name: 'Points' },
  { id: 'mm', name: 'Millimétré' },
  { id: 'iso', name: 'Isométrique' },
  { id: 'cornell', name: 'Cornell' },
];
const PAPER_COLORS = [
  { id: 'white', name: 'Blanc', bg: '#ffffff', line: 'rgba(60,95,150,0.18)', strong: 'rgba(60,95,150,0.36)', margin: 'rgba(210,80,80,0.45)' },
  { id: 'cream', name: 'Crème', bg: '#faf6ec', line: 'rgba(120,95,60,0.18)', strong: 'rgba(120,95,60,0.36)', margin: 'rgba(200,85,65,0.45)' },
  { id: 'gray', name: 'Gris', bg: '#eff0f2', line: 'rgba(40,50,70,0.15)', strong: 'rgba(40,50,70,0.30)', margin: 'rgba(200,80,80,0.40)' },
  { id: 'dark', name: 'Ardoise', bg: '#25272c', line: 'rgba(255,255,255,0.09)', strong: 'rgba(255,255,255,0.19)', margin: 'rgba(240,120,120,0.40)', dark: true },
];
const PEN_COLORS = ['#1f2328', '#5b6270', '#a3a8b0', '#ffffff', '#2f5bd3', '#0e7490', '#1f8a5b', '#b45309', '#c2410c', '#c9302c', '#be185d', '#7c3aed'];
const HL_COLORS = ['#fcd34d', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74', '#c4b5fd'];
const SHAPES = [
  { id: 'line', name: 'Ligne' }, { id: 'arrow', name: 'Flèche' },
  { id: 'rect', name: 'Rectangle' }, { id: 'ellipse', name: 'Ellipse' },
];
const ERASER_SIZES = [8, 16, 30];
const FONT = '-apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const TEXT_SIZES = [16, 22, 32];
const LH = 1.35;      // interligne du texte
const CHIP_H = 56;    // hauteur des pastilles son / lien
const COVERS = ['#2f3a4a', '#3f6b5a', '#a4553f', '#c79a3b', '#5a4e7c', '#4a7a9c', '#8a8f98', '#1f2328', '#d9cbb3', 'page'];

// ============================================================ Réglages
const LS_KEY = 'carnet.settings';
const settings = Object.assign({
  theme: 'auto',            // auto | light | dark
  penMode: 'auto',          // auto | on | off   (stylet uniquement)
  pressure: true,
  paper: { style: 'lined', color: 'white' },
  orientation: 'portrait',
  pen: { color: '#1f2328', w: 2.2 },
  hl: { color: '#fcd34d', w: 18 },
  penSlots: ['#1f2328', '#2f5bd3', '#c9302c', '#1f8a5b', '#b45309'],
  hlSlots: ['#fcd34d', '#86efac', '#93c5fd', '#f9a8d4', '#fdba74'],
  penSizes: [1.2, 2.2, 4.5],
  hlSizes: [10, 18, 28],
  cover: '#2f3a4a',
  shape: 'line',
  eraserR: 16,
  text: { color: '#1f2328', fs: 22, bold: false },
}, (() => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } })());
function saveSettings() { try { localStorage.setItem(LS_KEY, JSON.stringify(settings)); } catch {} }

function applyTheme() {
  const r = document.documentElement;
  if (settings.theme === 'auto') delete r.dataset.theme; else r.dataset.theme = settings.theme;
  requestAnimationFrame(() => {
    const cs = getComputedStyle(r);
    deskColor = cs.getPropertyValue('--desk').trim() || '#e9e9e5';
    edgeColor = cs.getPropertyValue('--page-edge').trim() || 'rgba(0,0,0,.08)';
    selColor = cs.getPropertyValue('--sel').trim() || '#3a6ff0';
    $('meta[name=theme-color]').content = cs.getPropertyValue('--surface').trim();
    requestRender();
  });
}
let deskColor = '#e9e9e5', edgeColor = 'rgba(0,0,0,.08)', selColor = '#3a6ff0';
matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', applyTheme);

// ============================================================ Base de données (IndexedDB)
let _db = null;
function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((res, rej) => {
    const r = indexedDB.open('carnet', 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      d.createObjectStore('meta', { keyPath: 'id' });
      d.createObjectStore('data', { keyPath: 'id' });
    };
    r.onsuccess = () => { _db = r.result; res(_db); };
    r.onerror = () => rej(r.error);
  });
}
const reqP = r => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
const db = {
  async allMeta() { const d = await openDB(); return reqP(d.transaction('meta').objectStore('meta').getAll()); },
  async getMeta(id) { const d = await openDB(); return reqP(d.transaction('meta').objectStore('meta').get(id)); },
  async getData(id) { const d = await openDB(); return reqP(d.transaction('data').objectStore('data').get(id)); },
  async save(meta, data) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const t = d.transaction(['meta', 'data'], 'readwrite');
      t.objectStore('meta').put(meta);
      if (data) t.objectStore('data').put(data);
      t.oncomplete = () => res(); t.onerror = () => rej(t.error);
    });
  },
  async del(id) {
    const d = await openDB();
    return new Promise((res, rej) => {
      const t = d.transaction(['meta', 'data'], 'readwrite');
      t.objectStore('meta').delete(id); t.objectStore('data').delete(id);
      t.oncomplete = () => res(); t.onerror = () => rej(t.error);
    });
  },
};
try { navigator.storage?.persist?.(); } catch {}

// ============================================================ Papier
function paperColor(paper) { return PAPER_COLORS.find(p => p.id === paper.color) || PAPER_COLORS[0]; }

function drawPaper(c, w, h, paper) {
  const pc = paperColor(paper);
  c.fillStyle = pc.bg;
  c.fillRect(0, 0, w, h);
  const lines = (col, lw, fn) => { c.beginPath(); fn(); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); };
  const H = (y, x0 = 0, x1 = w) => { c.moveTo(x0, y); c.lineTo(x1, y); };
  const V = (x, y0 = 0, y1 = h) => { c.moveTo(x, y0); c.lineTo(x, y1); };
  c.save();
  switch (paper.style) {
    case 'lined': {
      const sp = 8 * MM, top = 22 * MM;
      lines(pc.line, 1, () => { for (let y = top; y < h - 8 * MM; y += sp) H(y); });
      lines(pc.margin, 1, () => V(24 * MM));
      break;
    }
    case 'seyes': {
      const u = 2 * MM, big = 8 * MM, top = 20 * MM, left = 26 * MM;
      let last = top;
      lines(pc.line, 0.55, () => {
        for (let k = 0, y = top; y < h - 6 * MM; k++, y = top + k * u) { if (k % 4) H(y); last = y; }
      });
      lines(pc.strong, 0.9, () => {
        for (let y = top; y <= last + 0.1; y += big) H(y);
        for (let x = left + big; x < w; x += big) V(x, top, last);
      });
      lines(pc.margin, 1, () => V(left));
      break;
    }
    case 'grid': {
      const sp = 5 * MM, ox = (w % sp) / 2, oy = (h % sp) / 2;
      lines(pc.line, 0.7, () => {
        for (let x = ox; x <= w; x += sp) V(x);
        for (let y = oy; y <= h; y += sp) H(y);
      });
      break;
    }
    case 'dots': {
      const sp = 5 * MM, ox = (w % sp) / 2 || sp / 2, oy = (h % sp) / 2 || sp / 2, r = 1.05;
      c.fillStyle = pc.strong;
      c.beginPath();
      for (let x = ox; x < w; x += sp) for (let y = oy; y < h; y += sp) { c.moveTo(x + r, y); c.arc(x, y, r, 0, Math.PI * 2); }
      c.fill();
      break;
    }
    case 'mm': {
      const cm = 10 * MM;
      const ox = (w - Math.floor(w / cm) * cm) / 2, oy = (h - Math.floor(h / cm) * cm) / 2;
      const nx = Math.round((w - 2 * ox) / MM), ny = Math.round((h - 2 * oy) / MM);
      const grid = (step, col, lw, skip) => lines(col, lw, () => {
        for (let k = 0; k <= nx; k++) if (k % step === 0 && !(skip && k % skip === 0)) V(ox + k * MM, oy, h - oy);
        for (let k = 0; k <= ny; k++) if (k % step === 0 && !(skip && k % skip === 0)) H(oy + k * MM, ox, w - ox);
      });
      grid(1, pc.line, 0.3, 5);
      grid(5, pc.line, 0.75, 10);
      grid(10, pc.strong, 1.0, 0);
      break;
    }
    case 'iso': {
      const d = 6 * MM;
      c.beginPath(); c.rect(0, 0, w, h); c.clip();
      lines(pc.line, 0.7, () => {
        for (const ang of [90, 30, 150]) {
          const t = ang * Math.PI / 180, dx = Math.cos(t), dy = Math.sin(t), nx = -dy, ny = dx;
          const ks = [0, w * nx, h * ny, w * nx + h * ny];
          const k0 = Math.floor(Math.min(...ks) / d), k1 = Math.ceil(Math.max(...ks) / d), L = w + h;
          for (let k = k0; k <= k1; k++) { const px = nx * k * d, py = ny * k * d; c.moveTo(px - dx * L, py - dy * L); c.lineTo(px + dx * L, py + dy * L); }
        }
      });
      break;
    }
    case 'cornell': {
      const sp = 8 * MM, top = 30 * MM, cue = 62 * MM, bottom = h - 50 * MM;
      lines(pc.line, 1, () => { for (let y = top + sp; y < bottom - 2; y += sp) H(y, cue); });
      lines(pc.strong, 1.2, () => { H(top); V(cue, top, bottom); H(bottom); });
      break;
    }
  }
  c.restore();
}

// ============================================================ Traits
// Trait : { id, page, tool:'pen'|'hl', color, w, pts:[x,y,p,...], pr:bool (pression), sm:0|1 (lissage), bb:[x0,y0,x1,y1] }
const widthAt = (s, p) => s.w * (0.3 + 1.4 * p);

function computeBB(pts, w) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < pts.length; i += 3) {
    const x = pts[i], y = pts[i + 1];
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
  }
  const m = w;
  return [r2(x0 - m), r2(y0 - m), r2(x1 + m), r2(y1 + m)];
}
const bbHit = (a, b) => a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

function tracePath(c, P, smooth, dx, dy) {
  const n = P.length / 3;
  c.moveTo(P[0] + dx, P[1] + dy);
  if (!smooth || n < 3) {
    for (let i = 1; i < n; i++) c.lineTo(P[i * 3] + dx, P[i * 3 + 1] + dy);
    return;
  }
  for (let i = 1; i < n - 1; i++) {
    const x = P[i * 3], y = P[i * 3 + 1];
    c.quadraticCurveTo(x + dx, y + dy, (x + P[i * 3 + 3]) / 2 + dx, (y + P[i * 3 + 4]) / 2 + dy);
  }
  c.lineTo(P[(n - 1) * 3] + dx, P[(n - 1) * 3 + 1] + dy);
}

function drawStroke(c, s, dx = 0, dy = 0, darkPaper = false) {
  const P = s.pts, n = P.length / 3;
  if (!n) return;
  const hl = s.tool === 'hl';
  c.strokeStyle = c.fillStyle = s.color;
  c.lineCap = 'round'; c.lineJoin = 'round';
  if (hl) { c.globalAlpha = HL_ALPHA; if (!darkPaper) c.globalCompositeOperation = 'multiply'; }
  if (n === 1) {
    const r = (s.pr ? widthAt(s, P[2]) : s.w) / 2;
    c.beginPath(); c.arc(P[0] + dx, P[1] + dy, Math.max(r, 0.4), 0, Math.PI * 2); c.fill();
  } else if (!s.pr) {
    c.lineWidth = s.w;
    c.beginPath(); tracePath(c, P, s.sm !== 0, dx, dy); c.stroke();
  } else {
    // largeur variable : segments regroupés par largeur quantifiée
    let sx = P[0], sy = P[1], cur = -1;
    for (let i = 1; i < n; i++) {
      const x = P[i * 3], y = P[i * 3 + 1];
      const lw = Math.max(0.3, Math.round(widthAt(s, P[i * 3 + 2]) * 4) / 4);
      if (lw !== cur) {
        if (cur > 0) c.stroke();
        c.beginPath(); c.moveTo(sx + dx, sy + dy); c.lineWidth = lw; cur = lw;
      }
      if (i < n - 1) {
        const ex = (x + P[i * 3 + 3]) / 2, ey = (y + P[i * 3 + 4]) / 2;
        c.quadraticCurveTo(x + dx, y + dy, ex + dx, ey + dy); sx = ex; sy = ey;
      } else { c.lineTo(x + dx, y + dy); }
    }
    c.stroke();
  }
  if (hl) { c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; }
}

function distSeg(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy;
  let t = l2 ? ((px - ax) * vx + (py - ay) * vy) / l2 : 0;
  t = clamp(t, 0, 1);
  const qx = ax + t * vx - px, qy = ay + t * vy - py;
  return Math.sqrt(qx * qx + qy * qy);
}
function hitStroke(s, x, y, r) {
  const R = r + (s.pr ? s.w * 0.85 : s.w / 2);
  const b = s.bb;
  if (x < b[0] - r || x > b[2] + r || y < b[1] - r || y > b[3] + r) return false;
  const P = s.pts, n = P.length / 3;
  if (n === 1) return Math.hypot(P[0] - x, P[1] - y) <= R;
  for (let i = 0; i < n - 1; i++) if (distSeg(x, y, P[i * 3], P[i * 3 + 1], P[i * 3 + 3], P[i * 3 + 4]) <= R) return true;
  return false;
}
function inPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 2; i < poly.length; j = i, i += 2) {
    const xi = poly[i], yi = poly[i + 1], xj = poly[j], yj = poly[j + 1];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function makeShape(kind, a, b, w) {
  const pts = [];
  const P = (x, y) => pts.push(r2(x), r2(y), 0.5);
  if (kind === 'line') { P(a.x, a.y); P(b.x, b.y); }
  else if (kind === 'arrow') {
    const ang = Math.atan2(b.y - a.y, b.x - a.x), len = Math.max(10, w * 4.5), sp = 0.48;
    P(a.x, a.y); P(b.x, b.y);
    P(b.x - len * Math.cos(ang - sp), b.y - len * Math.sin(ang - sp)); P(b.x, b.y);
    P(b.x - len * Math.cos(ang + sp), b.y - len * Math.sin(ang + sp));
  } else if (kind === 'rect') {
    P(a.x, a.y); P(b.x, a.y); P(b.x, b.y); P(a.x, b.y); P(a.x, a.y);
  } else if (kind === 'ellipse') {
    const cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, rx = Math.abs(b.x - a.x) / 2, ry = Math.abs(b.y - a.y) / 2;
    const N = 72;
    for (let i = 0; i <= N; i++) { const t = i / N * Math.PI * 2; P(cx + rx * Math.cos(t), cy + ry * Math.sin(t)); }
  }
  return pts;
}

// ============================================================ Objets (texte, image, son, lien)
// Objet : { id, page, type:'text'|'image'|'audio'|'link', x, y, w, h, ... }
//   text  : text, color, fs, bold      image : src (data URL)
//   audio : src, name, dur (s)         link  : url, label
const objBB = o => [o.x, o.y, o.x + o.w, o.y + o.h];
const textFont = o => `${o.bold ? 650 : 400} ${o.fs}px ${FONT}`;
const fmtDur = sec => { sec = Math.max(0, Math.round(sec || 0)); return Math.floor(sec / 60) + ':' + String(sec % 60).padStart(2, '0'); };

let measureCtx = null;
function wrapText(c, text, maxW) {
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const tok of para.split(/(\s+)/)) {
      if (!tok) continue;
      if (c.measureText(line + tok).width <= maxW) { line += tok; continue; }
      if (/^\s+$/.test(tok)) { out.push(line); line = ''; continue; }
      if (line) { out.push(line); line = ''; }
      let w = tok; // mot plus long que la zone : on le coupe
      while (w.length > 1 && c.measureText(w).width > maxW) {
        let n = w.length - 1;
        while (n > 1 && c.measureText(w.slice(0, n)).width > maxW) n--;
        out.push(w.slice(0, n)); w = w.slice(n);
      }
      line = w;
    }
    out.push(line);
  }
  return out;
}
const layoutCache = new WeakMap();
function layoutText(o) {
  let L = layoutCache.get(o);
  if (L) return L;
  const c = measureCtx || (measureCtx = document.createElement('canvas').getContext('2d'));
  c.font = textFont(o);
  const lines = wrapText(c, o.text, o.w);
  L = { lines, h: r2(Math.max(1, lines.length) * o.fs * LH) };
  layoutCache.set(o, L);
  return L;
}

const imgs = new Map(); // src -> HTMLImageElement
function imgEl(src) {
  let im = imgs.get(src);
  if (!im) {
    im = new Image();
    im.onload = () => { for (const e of cache.values()) e.valid = false; requestRender(); refreshPagesSoon(); };
    im.src = src; imgs.set(src, im);
  }
  return im;
}
function getImg(src) { const im = imgEl(src); return im.complete && im.naturalWidth ? im : null; }
function loadImages() {
  return Promise.all(ed.objs.filter(o => o.type === 'image').map(o => {
    const im = imgEl(o.src);
    return im.complete ? null : (im.decode ? im.decode().catch(() => {}) : new Promise(r => { im.addEventListener('load', r); im.addEventListener('error', r); }));
  }));
}

const chipColors = dark => dark
  ? { bg: '#34373e', bd: 'rgba(255,255,255,.12)', tx: '#eceef2', mu: '#a0a5ae', ac: '#8fb0ff', ic: '#1c1d21' }
  : { bg: '#f2f4f7', bd: 'rgba(20,30,50,.13)', tx: '#1f2328', mu: '#6b7280', ac: '#2f5bd3', ic: '#ffffff' };
function rrect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function ellipsize(c, t, maxW) {
  t = String(t);
  if (c.measureText(t).width <= maxW) return t;
  while (t.length > 1 && c.measureText(t + '…').width > maxW) t = t.slice(0, -1);
  return t + '…';
}
const linkTitle = o => o.label || (() => { try { return new URL(o.url).hostname.replace(/^www\./, ''); } catch { return o.url; } })();
const linkSub = o => o.url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// st (facultatif) : état de lecture { playing, t } pour un son
function drawObj(c, o, dx = 0, dy = 0, dark = false, st = null) {
  const x = o.x + dx, y = o.y + dy;
  if (o.type === 'image') {
    const im = getImg(o.src);
    if (im) c.drawImage(im, x, y, o.w, o.h);
    else { c.fillStyle = dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; c.fillRect(x, y, o.w, o.h); }
    return;
  }
  if (o.type === 'text') {
    const { lines } = layoutText(o), lh = o.fs * LH;
    c.font = textFont(o); c.fillStyle = o.color; c.textBaseline = 'middle';
    lines.forEach((l, i) => c.fillText(l, x, y + lh * (i + 0.5)));
    c.textBaseline = 'alphabetic';
    return;
  }
  // pastille son / lien
  const k = chipColors(dark), h = o.h;
  rrect(c, x, y, o.w, h, 12); c.fillStyle = k.bg; c.fill();
  c.lineWidth = 1; c.strokeStyle = k.bd; c.stroke();
  const cx = x + h / 2, cy = y + h / 2;
  c.beginPath(); c.arc(cx, cy, h * 0.31, 0, Math.PI * 2); c.fillStyle = k.ac; c.fill();
  c.fillStyle = c.strokeStyle = k.ic;
  let title, sub;
  if (o.type === 'audio') {
    if (st && st.playing) { c.fillRect(cx - 5.5, cy - 6.5, 4, 13); c.fillRect(cx + 1.5, cy - 6.5, 4, 13); }
    else { c.beginPath(); c.moveTo(cx - 4, cy - 7); c.lineTo(cx + 7, cy); c.lineTo(cx - 4, cy + 7); c.closePath(); c.fill(); }
    title = o.name || 'Son';
    sub = st ? `${fmtDur(st.t)} / ${fmtDur(o.dur)}` : fmtDur(o.dur);
  } else {
    c.lineWidth = 2; c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(cx - 5, cy + 5); c.lineTo(cx + 5, cy - 5);
    c.moveTo(cx - 1.5, cy - 5); c.lineTo(cx + 5, cy - 5); c.lineTo(cx + 5, cy + 1.5); c.stroke();
    title = linkTitle(o); sub = linkSub(o);
  }
  const tx = x + h + 2, tw = o.w - h - 14;
  c.textBaseline = 'alphabetic';
  c.font = `600 15px ${FONT}`; c.fillStyle = o.type === 'link' ? k.ac : k.tx;
  c.fillText(ellipsize(c, title, tw), tx, y + h * 0.45);
  c.font = `13px ${FONT}`; c.fillStyle = k.mu;
  c.fillText(ellipsize(c, sub, tw), tx, y + h * 0.77);
  if (st && o.dur) {
    const pw = o.w - 24, f = clamp(st.t / o.dur, 0, 1);
    c.fillStyle = k.bd; c.fillRect(x + 12, y + h - 4, pw, 2);
    c.fillStyle = k.ac; c.fillRect(x + 12, y + h - 4, pw * f, 2);
  }
}
function objAt(page, x, y, pad = 4) {
  const list = ed.objs.filter(o => o.page === page);
  for (let i = list.length - 1; i >= 0; i--) {
    const o = list[i];
    if (x >= o.x - pad && x <= o.x + o.w + pad && y >= o.y - pad && y <= o.y + o.h + pad) return o;
  }
  return null;
}

// ============================================================ État de l'éditeur
const ed = {
  note: null,          // { meta }
  strokes: [],
  objs: [],            // textes, images, sons, liens
  editing: null,       // zone de texte en cours de saisie { id, obj }
  ver: 0,
  tool: 'pen',
  history: [], future: [],
  view: { s: 1, x: 0, y: 0 },
  sel: null,           // { page, ids:Set, items:[], bb, dx, dy, moving }
  dirty: false,
};
let penSeen = false;
const penOnly = () => settings.penMode === 'on' || (settings.penMode === 'auto' && penSeen);
const meta = () => ed.note.meta;
const pageSize = () => PAGE[meta().orientation] || PAGE.portrait;
const pageTop = i => i * (pageSize().h + GAP);
const family = () => ed.tool === 'hl' ? 'hl' : 'pen';
const isDarkPaper = () => !!paperColor(meta().paper).dark;
const objsOn = i => ed.objs.filter(o => o.page === i);

function bump() { ed.ver++; }
let idx = null, idxVer = -1;
function strokesOn(i) {
  if (idxVer !== ed.ver) {
    idx = new Map();
    for (const s of ed.strokes) { let a = idx.get(s.page); if (!a) idx.set(s.page, a = []); a.push(s); }
    idxVer = ed.ver;
  }
  return idx.get(i) || [];
}

function pushHistory() {
  ed.history.push(snapshot());
  if (ed.history.length > 150) ed.history.shift();
  ed.future.length = 0;
  updateUndo();
}
function snapshot() { return { strokes: ed.strokes.slice(), objs: ed.objs.slice(), pages: meta().pageCount }; }
function restore(snap) {
  ed.strokes = snap.strokes; ed.objs = snap.objs || []; meta().pageCount = snap.pages;
  clearSel(); bump(); cache.clear(); clampView(); markDirty(); requestRender(); updateUndo();
}
function undo() {
  if (action) return;
  commitText();
  const s = ed.history.pop(); if (!s) return;
  ed.future.push(snapshot());
  restore(s);
}
function redo() {
  if (action) return;
  commitText();
  const s = ed.future.pop(); if (!s) return;
  ed.history.push(snapshot());
  restore(s);
}
function updateUndo() {
  $('#btn-undo').disabled = !ed.history.length;
  $('#btn-redo').disabled = !ed.future.length;
}

// ============================================================ Canvas & rendu
const stage = $('#stage');
const cvMain = $('#cv-main'), cvOver = $('#cv-over');
const ctx = cvMain.getContext('2d', { alpha: false });
const octx = cvOver.getContext('2d');
let dpr = 1, vw = 0, vh = 0, stageRect = { left: 0, top: 0 };
let gesturing = false;

function resize() {
  if (!ed.note) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2.5);
  vw = stage.clientWidth; vh = stage.clientHeight;
  for (const cv of [cvMain, cvOver]) {
    cv.width = Math.round(vw * dpr); cv.height = Math.round(vh * dpr);
    cv.style.width = vw + 'px'; cv.style.height = vh + 'px';
  }
  stageRect = stage.getBoundingClientRect();
  cache.clear();
  clampView();
  if (ed.editing) keepEditorVisible();
  render(); // tout de suite : un canvas redimensionné est vidé (noir)
}
new ResizeObserver(() => resize()).observe(stage);

const cache = new Map(); // page -> { cv, k, valid }
const CACHE_MAX_PX = 9e6;

function renderPage(c, i, cull) {
  const { w, h } = pageSize();
  drawPaper(c, w, h, meta().paper);
  const dark = isDarkPaper();
  const hide = ed.sel && ed.sel.moving && ed.sel.page === i ? ed.sel.ids : null;
  const editId = ed.editing && ed.editing.id;
  for (const o of objsOn(i)) {
    if ((hide && hide.has(o.id)) || o.id === editId) continue;
    if (cull && !bbHit(objBB(o), cull)) continue;
    drawObj(c, o, 0, 0, dark);
  }
  for (const s of strokesOn(i)) {
    if (hide && hide.has(s.id)) continue;
    if (cull && !bbHit(s.bb, cull)) continue;
    drawStroke(c, s, 0, 0, dark);
  }
}

function pageCache(i, k) {
  const { w, h } = pageSize();
  if (w * h * k * k > CACHE_MAX_PX) { cache.delete(i); return null; }
  let e = cache.get(i);
  if (e && e.valid && (e.k === k || gesturing)) return e;
  if (!e) { e = { cv: document.createElement('canvas'), k: 0, valid: false }; cache.set(i, e); }
  e.cv.width = Math.round(w * k); e.cv.height = Math.round(h * k);
  const c = e.cv.getContext('2d', { alpha: false });
  c.setTransform(k, 0, 0, k, 0, 0);
  renderPage(c, i);
  e.k = k; e.valid = true;
  return e;
}
function invalidate(i) { const e = cache.get(i); if (e) e.valid = false; }
function drawOnCache(s) {
  const e = cache.get(s.page);
  if (!e || !e.valid) return;
  const c = e.cv.getContext('2d');
  c.setTransform(e.k, 0, 0, e.k, 0, 0);
  drawStroke(c, s, 0, 0, isDarkPaper());
}

let rq = false, oq = false;
function requestRender() { if (!rq) { rq = true; requestAnimationFrame(render); } }
function requestOverlay() { if (!oq && !rq) { oq = true; requestAnimationFrame(renderOverlay); } }

function visiblePages() {
  const { h } = pageSize(), v = ed.view, n = meta().pageCount;
  const a = Math.floor((-v.y / v.s) / (h + GAP)), b = Math.floor(((vh - v.y) / v.s) / (h + GAP));
  return [clamp(a, 0, n - 1), clamp(b, 0, n - 1)];
}

function render() {
  rq = false;
  if (!ed.note || !vw) return;
  const v = ed.view, { w, h } = pageSize(), k = v.s * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = deskColor;
  ctx.fillRect(0, 0, cvMain.width, cvMain.height);
  const [a, b] = visiblePages();
  for (const key of cache.keys()) if (key < a - 1 || key > b + 1) cache.delete(key);
  for (let i = a; i <= b; i++) {
    const sx = v.x, sy = v.y + pageTop(i) * v.s, pw = w * v.s, ph = h * v.s;
    if (sy > vh || sy + ph < 0) continue;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = edgeColor;
    ctx.fillRect(sx - 1, sy - 1, pw + 2, ph + 2);
    const e = pageCache(i, k);
    if (e) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(e.cv, sx * dpr, sy * dpr, pw * dpr, ph * dpr);
    } else {
      ctx.save();
      ctx.setTransform(k, 0, 0, k, sx * dpr, sy * dpr);
      ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      renderPage(ctx, i, [-sx / v.s, -sy / v.s, (vw - sx) / v.s, (vh - sy) / v.s]);
      ctx.restore();
    }
  }
  renderOverlay();
  updatePager();
}

function setPageXf(c, i) {
  const v = ed.view, k = v.s * dpr;
  c.setTransform(k, 0, 0, k, v.x * dpr, (v.y + pageTop(i) * v.s) * dpr);
}

let cursor = null; // { x, y } écran, pour la gomme
function renderOverlay() {
  oq = false;
  if (!ed.note) return;
  const c = octx, v = ed.view, { w, h } = pageSize();
  c.setTransform(1, 0, 0, 1, 0, 0);
  c.clearRect(0, 0, cvOver.width, cvOver.height);
  const a = action;
  if (a && (a.type === 'draw' || a.type === 'shape') && a.stroke) {
    c.save(); setPageXf(c, a.page);
    c.beginPath(); c.rect(0, 0, w, h); c.clip();
    drawStroke(c, a.stroke, 0, 0, isDarkPaper());
    c.restore();
  }
  if (a && a.type === 'lasso' && a.poly.length > 2) {
    c.save(); setPageXf(c, a.page);
    c.beginPath();
    c.moveTo(a.poly[0], a.poly[1]);
    for (let i = 2; i < a.poly.length; i += 2) c.lineTo(a.poly[i], a.poly[i + 1]);
    c.closePath();
    c.globalAlpha = 0.06; c.fillStyle = selColor; c.fill(); c.globalAlpha = 1;
    c.setLineDash([6 / v.s, 5 / v.s]); c.lineWidth = 1.4 / v.s; c.strokeStyle = selColor; c.stroke();
    c.restore();
  }
  const po = playingObj();
  if (po) {
    const [pa, pb] = visiblePages();
    if (po.page >= pa && po.page <= pb && !(ed.sel && ed.sel.moving && ed.sel.ids.has(po.id))) {
      c.save(); setPageXf(c, po.page);
      drawObj(c, po, 0, 0, isDarkPaper(), { playing: !player.paused, t: player.currentTime });
      c.restore();
    }
  }
  const sel = ed.sel;
  if (sel) {
    c.save(); setPageXf(c, sel.page);
    if (sel.moving) {
      for (const o of sel.objs) drawObj(c, o, sel.dx, sel.dy, isDarkPaper());
      for (const s of sel.items) drawStroke(c, s, sel.dx, sel.dy, isDarkPaper());
    }
    const p = 6 / v.s, bb = sel.bb;
    c.setLineDash([6 / v.s, 5 / v.s]); c.lineWidth = 1.4 / v.s; c.strokeStyle = selColor;
    c.strokeRect(bb[0] + sel.dx - p, bb[1] + sel.dy - p, bb[2] - bb[0] + 2 * p, bb[3] - bb[1] + 2 * p);
    if (resizable(sel)) {
      c.setLineDash([]);
      c.beginPath(); c.arc(bb[2] + sel.dx + p, bb[3] + sel.dy + p, 8 / v.s, 0, Math.PI * 2);
      c.fillStyle = '#fff'; c.fill(); c.lineWidth = 2 / v.s; c.stroke();
    }
    c.restore();
  }
  if (cursor && (ed.tool === 'eraser' || (a && a.type === 'erase'))) {
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.beginPath(); c.arc(cursor.x, cursor.y, settings.eraserR, 0, Math.PI * 2);
    c.lineWidth = 1.2; c.strokeStyle = 'rgba(120,120,125,.9)'; c.stroke();
    c.fillStyle = 'rgba(120,120,125,.08)'; c.fill();
  }
  positionSelBar();
  positionTextEditor();
}

// ---------- Vue
function clampView() {
  if (!ed.note || !vw) return;
  const v = ed.view, { w, h } = pageSize(), n = meta().pageCount, m = 20;
  const cw = w * v.s, ch = (n * (h + GAP) - GAP) * v.s;
  if (cw + 2 * m <= vw) v.x = (vw - cw) / 2; else v.x = clamp(v.x, vw - cw - m, m);
  if (ch + 2 * m + 70 <= vh) v.y = m; else v.y = clamp(v.y, vh - ch - m - 70, m);
}
function fitWidth(keepPage = true) {
  const { w, h } = pageSize(), v = ed.view;
  const cur = keepPage ? currentPage() : 0;
  v.s = clamp(Math.min((vw - 32) / w, 1.6), MIN_S, MAX_S);
  v.y = 20 - pageTop(cur) * v.s;
  clampView(); requestRender();
}
function currentPage() {
  const { h } = pageSize(), v = ed.view;
  return clamp(Math.floor(((vh / 2 - v.y) / v.s) / (h + GAP)), 0, meta().pageCount - 1);
}
function zoomAt(sx, sy, s) {
  const v = ed.view; s = clamp(s, MIN_S, MAX_S);
  v.x = sx - (sx - v.x) / v.s * s; v.y = sy - (sy - v.y) / v.s * s; v.s = s;
  clampView(); requestRender();
}
function updatePager() {
  $('#page-info').textContent = `Page ${currentPage() + 1} / ${meta().pageCount}`;
  $('#btn-zoom').textContent = Math.round(ed.view.s * 100) + ' %';
  updatePagesActive();
}
function scrollToPage(i) {
  ed.view.y = 20 - pageTop(i) * ed.view.s; clampView(); requestRender();
}

// ============================================================ Saisie (stylet / doigt / souris)
let action = null;            // action de dessin en cours
const touches = new Map();    // doigts posés : id -> {x,y}
let gesture = null;

const localPt = e => ({ x: e.clientX - stageRect.left, y: e.clientY - stageRect.top });
const toWorld = p => ({ x: (p.x - ed.view.x) / ed.view.s, y: (p.y - ed.view.y) / ed.view.s });
function pageHit(wp) {
  const { w, h } = pageSize();
  const i = Math.floor(wp.y / (h + GAP));
  if (i < 0 || i >= meta().pageCount) return null;
  const ly = wp.y - pageTop(i);
  if (ly > h || wp.x < 0 || wp.x > w) return null;
  return { i, x: wp.x, y: ly };
}
const toPage = (wp, i) => ({ x: wp.x, y: wp.y - pageTop(i) });

function noticePen() {
  if (penSeen) return;
  penSeen = true;
  if (settings.penMode === 'auto') toast('Stylet détecté : le doigt sert maintenant à naviguer');
}

stage.addEventListener('pointerdown', e => {
  if (!ed.note || e.target !== cvMain) return; // barres flottantes, zone de texte…
  closePop();
  if (e.pointerType === 'pen') noticePen();
  const lp = localPt(e);
  if (e.pointerType === 'touch') {
    touches.set(e.pointerId, lp);
    if (touches.size >= 2) { cancelAction(); startGesture(); return; }
    if (penOnly()) { startGesture(); return; }
  }
  if (e.pointerType === 'mouse' && (e.button === 1 || (e.button === 0 && spaceDown))) {
    touches.set(e.pointerId, lp); stage.setPointerCapture(e.pointerId); startGesture(); return;
  }
  if (e.pointerType === 'mouse' && e.button !== 0) return;
  if (action) return;
  try { stage.setPointerCapture(e.pointerId); } catch {}
  beginAction(e, lp);
});

stage.addEventListener('pointermove', e => {
  if (!ed.note) return;
  const lp = localPt(e);
  if (touches.has(e.pointerId)) {
    touches.set(e.pointerId, lp);
    if (gesture) { moveGesture(); return; }
  }
  if (action && action.pid === e.pointerId) { moveAction(e); return; }
  if (ed.tool === 'eraser' && e.pointerType !== 'touch') { cursor = lp; requestOverlay(); }
});

function endPointer(e, cancelled) {
  if (touches.has(e.pointerId)) {
    touches.delete(e.pointerId);
    if (gesture) {
      if (touches.size === 0) endGesture(); else startGesture(true);
      return;
    }
  }
  if (action && action.pid === e.pointerId) {
    if (cancelled && action.ptype === 'touch') cancelAction(); else endAction();
  }
}
stage.addEventListener('pointerup', e => endPointer(e, false));
stage.addEventListener('pointercancel', e => endPointer(e, true));
stage.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch' && !action) { cursor = null; requestOverlay(); } });
stage.addEventListener('contextmenu', e => e.preventDefault());

// ---------- Gestes (pincer / glisser)
function startGesture(keep) {
  const ps = [...touches.values()];
  const c = { x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length };
  const d = ps.length > 1 ? Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) : 0;
  const prev = keep && gesture ? gesture : { t0: performance.now(), moved: 0, maxN: 0, scaled: false };
  gesture = { ...prev, c, d, s: ed.view.s, vx: ed.view.x, vy: ed.view.y, maxN: Math.max(prev.maxN, ps.length) };
  gesturing = true;
}
function moveGesture() {
  const g = gesture, ps = [...touches.values()], v = ed.view;
  if (ps.length !== (g.d ? 2 : 1) && ps.length < 3) { startGesture(true); return; }
  const c = { x: ps.reduce((a, p) => a + p.x, 0) / ps.length, y: ps.reduce((a, p) => a + p.y, 0) / ps.length };
  let s = g.s;
  if (ps.length > 1 && g.d > 0) {
    s = clamp(g.s * Math.hypot(ps[0].x - ps[1].x, ps[0].y - ps[1].y) / g.d, MIN_S, MAX_S);
    if (Math.abs(s / g.s - 1) > 0.04) g.scaled = true;
  }
  v.x = c.x - (g.c.x - g.vx) / g.s * s;
  v.y = c.y - (g.c.y - g.vy) / g.s * s;
  v.s = s;
  g.moved = Math.max(g.moved, Math.hypot(c.x - g.c.x, c.y - g.c.y));
  clampView(); requestRender();
}
function endGesture() {
  const g = gesture; gesture = null; gesturing = false;
  // tapoter à 2 doigts = annuler, à 3 doigts = rétablir
  if (g && g.moved < 12 && !g.scaled && performance.now() - g.t0 < 320) {
    if (g.maxN === 2) undo(); else if (g.maxN >= 3) redo();
    else if (g.maxN === 1) fingerTap(g.c);
  }
  requestRender();
}

// Doigt posé puis levé sans bouger (mode stylet uniquement) : ouvre l'objet touché
function fingerTap(lp) {
  const hit = pageHit(toWorld(lp));
  const wasEditing = !!ed.editing;
  commitText();
  if (!hit) return;
  const o = objAt(hit.i, hit.x, hit.y);
  if (o) activate(o);
  else if (!wasEditing && ed.tool === 'text') newTextAt(hit.i, hit.x, hit.y);
}
// Ouvre un objet : modifier le texte, écouter le son, ouvrir le lien, sélectionner l'image
function activate(o) {
  if (o.type === 'text') { setTool('text'); editText(o); }
  else if (o.type === 'audio') toggleAudio(o);
  else if (o.type === 'link') openLink(o.url);
  else { setTool('lasso'); setSelection(o.page, [], [o]); }
}

// ---------- Actions
function beginAction(e, lp) {
  const wp = toWorld(lp), hit = pageHit(wp);
  let tool = ed.tool;
  if (e.pointerType === 'pen' && (e.buttons & 32 || e.buttons & 2)) tool = 'eraser';
  const base = { pid: e.pointerId, ptype: e.pointerType };

  if (ed.editing) {
    // toucher ailleurs termine la saisie en cours
    commitText();
    if (tool === 'text') { action = { ...base, type: 'none' }; return; }
  }

  if (ed.sel && resizable(ed.sel)) {
    const bb = ed.sel.bb, v = ed.view, top = pageTop(ed.sel.page), p = 6 / v.s;
    const hx = v.x + (bb[2] + p) * v.s, hy = v.y + (top + bb[3] + p) * v.s;
    if (Math.hypot(lp.x - hx, lp.y - hy) < 24) {
      action = { ...base, type: 'resize', orig: ed.sel.objs[0] };
      ed.sel.moving = true; invalidate(ed.sel.page); $('#sel-bar').hidden = true;
      requestRender(); return;
    }
  }
  if (ed.sel && (tool === 'lasso' || (resizable(ed.sel) && tool !== 'eraser'))) {
    const p = toPage(wp, ed.sel.page), bb = ed.sel.bb, pad = 14 / ed.view.s;
    if (p.x >= bb[0] - pad && p.x <= bb[2] + pad && p.y >= bb[1] - pad && p.y <= bb[3] + pad) {
      action = { ...base, type: 'move', start: p };
      ed.sel.moving = true; invalidate(ed.sel.page); $('#sel-bar').hidden = true;
      requestRender(); return;
    }
  }
  if (ed.sel) clearSel();

  if (tool === 'lasso' && hit) {
    const o = objAt(hit.i, hit.x, hit.y);
    if (o) {
      setSelection(hit.i, [], [o]);
      action = { ...base, type: 'move', start: { x: hit.x, y: hit.y } };
      ed.sel.moving = true; invalidate(hit.i); $('#sel-bar').hidden = true;
      requestRender(); return;
    }
  }

  if (tool === 'text') {
    if (!hit) return;
    action = { ...base, type: 'tap', page: hit.i, at: { x: hit.x, y: hit.y }, sp: lp, moved: false };
    return;
  }

  if (tool === 'pen' || tool === 'hl') {
    if (!hit) return;
    const st = settings[tool];
    const usePr = tool === 'pen' && e.pointerType === 'pen' && settings.pressure;
    const p0 = usePr ? (e.pressure || 0.5) : 0.5;
    action = {
      ...base, type: 'draw', page: hit.i, lp: p0, t0: performance.now(),
      stroke: { id: uid(), page: hit.i, tool, color: st.color, w: st.w, pts: [hit.x, hit.y, p0], pr: usePr, sm: 1 },
    };
    requestOverlay();
  } else if (tool === 'eraser') {
    action = { ...base, type: 'erase', snap: false, last: wp };
    cursor = lp; eraseAt(wp);
  } else if (tool === 'shape') {
    if (!hit) return;
    action = { ...base, type: 'shape', page: hit.i, a: { x: hit.x, y: hit.y }, stroke: null };
  } else if (tool === 'lasso') {
    if (!hit) return;
    action = { ...base, type: 'lasso', page: hit.i, poly: [hit.x, hit.y] };
  }
}

function moveAction(e) {
  const a = action;
  const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  const list = evs.length ? evs : [e];
  if (a.type === 'draw') {
    const P = a.stroke.pts, minD = 0.6 / ed.view.s;
    for (const ev of list) {
      const p = toPage(toWorld(localPt(ev)), a.page);
      const lx = P[P.length - 3], ly = P[P.length - 2];
      if (Math.hypot(p.x - lx, p.y - ly) < minD) continue;
      let pr = 0.5;
      if (a.stroke.pr) { pr = a.lp * 0.65 + (ev.pressure || a.lp) * 0.35; a.lp = pr; }
      P.push(p.x, p.y, pr);
    }
    requestOverlay();
  } else if (a.type === 'erase') {
    for (const ev of list) {
      const lp = localPt(ev), wp = toWorld(lp);
      const d = Math.hypot(wp.x - a.last.x, wp.y - a.last.y), step = settings.eraserR / ed.view.s * 0.6;
      const n = Math.max(1, Math.ceil(d / step));
      for (let k = 1; k <= n; k++) eraseAt({ x: a.last.x + (wp.x - a.last.x) * k / n, y: a.last.y + (wp.y - a.last.y) * k / n });
      a.last = wp; cursor = lp;
    }
    requestOverlay();
  } else if (a.type === 'shape') {
    const p = toPage(toWorld(localPt(e)), a.page);
    let b = { x: p.x, y: p.y };
    const kind = settings.shape;
    if (kind === 'line' || kind === 'arrow') {
      // aimantation à 45°
      const ang = Math.atan2(b.y - a.a.y, b.x - a.a.x), len = Math.hypot(b.x - a.a.x, b.y - a.a.y);
      const snap = Math.round(ang / (Math.PI / 4)) * (Math.PI / 4);
      if (Math.abs(ang - snap) < 0.07) b = { x: a.a.x + Math.cos(snap) * len, y: a.a.y + Math.sin(snap) * len };
    }
    a.b = b;
    const st = settings.pen;
    a.stroke = { id: uid(), page: a.page, tool: 'pen', color: st.color, w: st.w, pts: makeShape(kind, a.a, b, st.w), pr: false, sm: 0 };
    requestOverlay();
  } else if (a.type === 'lasso') {
    for (const ev of list) {
      const p = toPage(toWorld(localPt(ev)), a.page);
      const P = a.poly;
      if (Math.hypot(p.x - P[P.length - 2], p.y - P[P.length - 1]) > 3 / ed.view.s) P.push(p.x, p.y);
    }
    requestOverlay();
  } else if (a.type === 'move') {
    const p = toPage(toWorld(localPt(e)), ed.sel.page);
    ed.sel.dx = p.x - a.start.x; ed.sel.dy = p.y - a.start.y;
    requestOverlay();
  } else if (a.type === 'resize') {
    const p = toPage(toWorld(localPt(e)), ed.sel.page), o = a.orig;
    const r = resizedObj(o, p.x - o.x);
    ed.sel.objs = [r]; ed.sel.bb = objBB(r);
    requestOverlay();
  } else if (a.type === 'tap') {
    const lp = localPt(e);
    if (Math.hypot(lp.x - a.sp.x, lp.y - a.sp.y) > 10) a.moved = true;
  }
}
function resizedObj(o, w) {
  const { w: pw } = pageSize();
  if (o.type === 'image') {
    w = clamp(w, 30, pw * 1.5);
    return { ...o, w: r2(w), h: r2(w * o.h / o.w) };
  }
  if (o.type === 'text') {
    const r = { ...o, w: r2(clamp(w, 60, pw * 1.5)) };
    r.h = layoutText(r).h; return r;
  }
  return { ...o, w: r2(clamp(w, 170, 640)) };
}

function eraseAt(wp) {
  const hit = pageHit(wp);
  if (!hit) return;
  const r = settings.eraserR / ed.view.s;
  const gone = strokesOn(hit.i).filter(s => hitStroke(s, hit.x, hit.y, r));
  if (!gone.length) return;
  if (!action.snap) { pushHistory(); action.snap = true; }
  const set = new Set(gone);
  ed.strokes = ed.strokes.filter(s => !set.has(s));
  bump(); invalidate(hit.i); markDirty(); requestRender();
}

function finalizeStroke(s) {
  s.pts = s.pts.map((v, i) => i % 3 === 2 ? Math.round(v * 1000) / 1000 : r2(v));
  if (s.pr) {
    let mn = 1, mx = 0;
    for (let i = 2; i < s.pts.length; i += 3) { mn = Math.min(mn, s.pts[i]); mx = Math.max(mx, s.pts[i]); }
    if (mx - mn < 0.02) { s.pr = false; s.w = widthAt(s, (mn + mx) / 2); }
  }
  s.bb = computeBB(s.pts, s.pr ? s.w * 1.7 : s.w);
  return s;
}

function addStrokes(list, objs = []) {
  pushHistory();
  for (const s of list) { ed.strokes.push(s); }
  for (const o of objs) { ed.objs.push(o); }
  bump();
  for (const s of list) drawOnCache(s);
  markDirty();
}

function endAction() {
  const a = action; action = null;
  if (!a) return;
  if (a.type === 'draw') {
    // toucher bref sur un son ou un lien = l'ouvrir plutôt que faire un point
    const P = a.stroke.pts;
    let far = false;
    for (let k = 3; k < P.length && !far; k += 3) if (Math.hypot(P[k] - P[0], P[k + 1] - P[1]) * ed.view.s > 6) far = true;
    if (!far && performance.now() - a.t0 < 350) {
      const o = objAt(a.page, P[0], P[1], 0);
      if (o && (o.type === 'audio' || o.type === 'link')) { activate(o); requestOverlay(); return; }
    }
    addStrokes([finalizeStroke(a.stroke)]);
    requestRender();
  } else if (a.type === 'shape') {
    if (a.stroke && a.b && Math.hypot(a.b.x - a.a.x, a.b.y - a.a.y) > 3) addStrokes([finalizeStroke(a.stroke)]);
    requestRender();
  } else if (a.type === 'erase') {
    if (a.ptype !== 'mouse' && a.ptype !== 'pen') cursor = null;
    requestOverlay();
  } else if (a.type === 'lasso') {
    selectInPoly(a.page, a.poly);
    requestRender();
  } else if (a.type === 'tap') {
    if (!a.moved) {
      const o = objAt(a.page, a.at.x, a.at.y);
      if (o && o.type === 'text') editText(o);
      else newTextAt(a.page, a.at.x, a.at.y);
    }
  } else if (a.type === 'resize') {
    const sel = ed.sel, r = sel.objs[0];
    sel.moving = false;
    if (r !== a.orig) {
      pushHistory();
      ed.objs = ed.objs.map(o => o.id === r.id ? r : o);
      bump(); markDirty();
    }
    invalidate(sel.page); requestRender();
  } else if (a.type === 'move') {
    const sel = ed.sel;
    sel.moving = false;
    if (Math.abs(sel.dx) > 0.5 || Math.abs(sel.dy) > 0.5) {
      pushHistory();
      const moved = new Map();
      for (const s of sel.items) {
        const pts = s.pts.map((v, i) => i % 3 === 0 ? r2(v + sel.dx) : i % 3 === 1 ? r2(v + sel.dy) : v);
        moved.set(s.id, { ...s, pts, bb: [s.bb[0] + sel.dx, s.bb[1] + sel.dy, s.bb[2] + sel.dx, s.bb[3] + sel.dy] });
      }
      ed.strokes = ed.strokes.map(s => moved.get(s.id) || s);
      sel.items = [...moved.values()];
      const mo = new Map(sel.objs.map(o => [o.id, { ...o, x: r2(o.x + sel.dx), y: r2(o.y + sel.dy) }]));
      ed.objs = ed.objs.map(o => mo.get(o.id) || o);
      sel.objs = [...mo.values()];
      sel.bb = [sel.bb[0] + sel.dx, sel.bb[1] + sel.dy, sel.bb[2] + sel.dx, sel.bb[3] + sel.dy];
      bump(); markDirty();
    }
    sel.dx = sel.dy = 0;
    invalidate(sel.page); requestRender();
  }
}

function cancelAction() {
  if (!action) return;
  if (action.type === 'move' && ed.sel) { ed.sel.moving = false; ed.sel.dx = ed.sel.dy = 0; invalidate(ed.sel.page); }
  if (action.type === 'resize' && ed.sel) { ed.sel.moving = false; ed.sel.objs = [action.orig]; ed.sel.bb = objBB(action.orig); invalidate(ed.sel.page); }
  action = null;
  requestRender();
}

// ---------- Sélection
function selectInPoly(page, poly) {
  if (poly.length < 6) return;
  const items = strokesOn(page).filter(s => {
    const P = s.pts, n = P.length / 3, step = Math.max(1, Math.floor(n / 40));
    let tot = 0, inn = 0;
    for (let i = 0; i < n; i += step) { tot++; if (inPoly(P[i * 3], P[i * 3 + 1], poly)) inn++; }
    return inn / tot >= 0.5;
  });
  const objs = objsOn(page).filter(o => inPoly(o.x + o.w / 2, o.y + o.h / 2, poly));
  if (!items.length && !objs.length) return;
  setSelection(page, items, objs);
}
const resizable = sel => !!sel && sel.objs.length === 1 && !sel.items.length;
function setSelection(page, items, objs = []) {
  const bb = [Infinity, Infinity, -Infinity, -Infinity];
  for (const b of [...items.map(s => s.bb), ...objs.map(objBB)]) { bb[0] = Math.min(bb[0], b[0]); bb[1] = Math.min(bb[1], b[1]); bb[2] = Math.max(bb[2], b[2]); bb[3] = Math.max(bb[3], b[3]); }
  ed.sel = { page, ids: new Set([...items.map(s => s.id), ...objs.map(o => o.id)]), items, objs, bb, dx: 0, dy: 0, moving: false };
  renderSelBar();
  $('#sel-bar').hidden = false;
  renderSubbar();
  requestOverlay();
}
function clearSel() {
  if (!ed.sel) return;
  if (ed.sel.moving) invalidate(ed.sel.page);
  ed.sel = null; $('#sel-bar').hidden = true; requestOverlay();
  renderSubbar();
}
function positionSelBar() {
  const bar = $('#sel-bar');
  if (!ed.sel || ed.sel.moving) { bar.hidden = true; return; }
  bar.hidden = false;
  const v = ed.view, bb = ed.sel.bb, top = pageTop(ed.sel.page);
  const bw = bar.offsetWidth || 220, bh = bar.offsetHeight || 46;
  let x = v.x + (bb[0] + bb[2]) / 2 * v.s - bw / 2;
  let y = v.y + (top + bb[1]) * v.s - bh - 14;
  if (y < 8) y = v.y + (top + bb[3]) * v.s + 14;
  bar.style.left = clamp(x, 8, vw - bw - 8) + 'px';
  bar.style.top = clamp(y, 72, vh - bh - 70) + 'px';
}
function renderSelBar() {
  const sel = ed.sel, btn = (k, ic, l, cls = '') => `<button data-sel="${k}"${cls ? ` class="${cls}"` : ''}>${icon(ic)}${l}</button>`;
  let h = '';
  if (resizable(sel)) {
    const o = sel.objs[0];
    if (o.type === 'text') h += btn('edit', 'edit', 'Modifier');
    else if (o.type === 'audio') h += btn('play', 'play', 'Écouter');
    else if (o.type === 'link') h += btn('open', 'open', 'Ouvrir') + btn('editlink', 'edit', 'Modifier');
  }
  $('#sel-bar').innerHTML = h + btn('dup', 'copy', 'Dupliquer') + btn('del', 'trash', 'Supprimer', 'danger');
}
$('#sel-bar').addEventListener('click', async e => {
  const b = e.target.closest('[data-sel]'); if (!b || !ed.sel) return;
  const sel = ed.sel, k = b.dataset.sel, o = sel.objs[0];
  if (k === 'del') {
    pushHistory();
    ed.strokes = ed.strokes.filter(s => !sel.ids.has(s.id));
    ed.objs = ed.objs.filter(x => !sel.ids.has(x.id));
    if (playing && sel.ids.has(playing.id)) stopAudio();
    bump(); invalidate(sel.page); clearSel(); markDirty(); requestRender();
  } else if (k === 'dup') {
    const off = 20;
    const copies = sel.items.map(s => ({ ...s, id: uid(), pts: s.pts.map((v, i) => i % 3 === 2 ? v : r2(v + off)), bb: s.bb.map(v => v + off) }));
    const ocopies = sel.objs.map(x => ({ ...x, id: uid(), x: r2(x.x + off), y: r2(x.y + off) }));
    addStrokes(copies, ocopies);
    setSelection(sel.page, copies, ocopies);
    invalidate(sel.page); requestRender();
  } else if (k === 'edit') { setTool('text'); editText(o); }
  else if (k === 'play') toggleAudio(o);
  else if (k === 'open') openLink(o.url);
  else if (k === 'editlink') {
    const v = await linkDialog(o); if (!v) return;
    const n = { ...o, ...v };
    pushHistory(); ed.objs = ed.objs.map(x => x.id === o.id ? n : x);
    bump(); invalidate(sel.page); markDirty(); setSelection(sel.page, [], [n]); requestRender();
  }
});
function recolorSelection(color) {
  const sel = ed.sel;
  pushHistory();
  const map = new Map(sel.items.map(s => [s.id, { ...s, color }]));
  ed.strokes = ed.strokes.map(s => map.get(s.id) || s);
  sel.items = [...map.values()];
  const om = new Map(sel.objs.map(o => [o.id, o.type === 'text' ? { ...o, color } : o]));
  ed.objs = ed.objs.map(o => om.get(o.id) || o);
  sel.objs = [...om.values()];
  bump(); invalidate(sel.page); markDirty(); requestRender();
}

// ---------- Molette / clavier (ordinateur)
let spaceDown = false;
stage.addEventListener('wheel', e => {
  if (!ed.note) return;
  e.preventDefault();
  if (e.ctrlKey || e.metaKey) {
    gesturing = true; clearTimeout(wheelT); wheelT = setTimeout(() => { gesturing = false; requestRender(); }, 180);
    const lp = localPt(e); zoomAt(lp.x, lp.y, ed.view.s * Math.exp(-e.deltaY * 0.01));
  } else {
    ed.view.x -= e.shiftKey ? e.deltaY : e.deltaX; ed.view.y -= e.shiftKey ? 0 : e.deltaY;
    clampView(); requestRender();
  }
}, { passive: false });
let wheelT = 0;

document.addEventListener('keydown', e => {
  if (!ed.note || $('#editor').hidden || !$('#modal').hidden) return;
  if (e.target.matches('input, textarea')) return;
  const k = e.key.toLowerCase();
  if ((e.ctrlKey || e.metaKey) && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
  if ((e.ctrlKey || e.metaKey) && k === 'y') { e.preventDefault(); redo(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (k === ' ') { spaceDown = true; return; }
  const map = { p: 'pen', h: 'hl', e: 'eraser', s: 'shape', l: 'lasso', t: 'text' };
  if (map[k]) setTool(map[k]);
  if ((k === 'delete' || k === 'backspace') && ed.sel) $('[data-sel=del]').click();
  if (k === 'escape') { clearSel(); closePop(); }
  if (k === 'i') openPop($('#btn-insert'), buildInsertPop);
});
document.addEventListener('keyup', e => { if (e.key === ' ') spaceDown = false; });

// ============================================================ Zones de texte
let txtEl = null;
function textEditor() {
  if (txtEl) return txtEl;
  txtEl = document.createElement('textarea');
  txtEl.className = 'txt-edit'; txtEl.hidden = true;
  txtEl.setAttribute('autocapitalize', 'sentences');
  stage.appendChild(txtEl);
  txtEl.addEventListener('input', () => { fitTextEditor(); keepEditorVisible(); });
  txtEl.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); commitText(); } });
  return txtEl;
}
function newTextAt(page, x, y) {
  const st = settings.text, { w: pw, h: ph } = pageSize();
  x = clamp(x, 8, pw - 140);
  y = clamp(y - st.fs * LH / 2, 4, ph - st.fs * LH - 4);
  const o = { id: uid(), page, type: 'text', x: r2(x), y: r2(y), w: r2(Math.min(420, pw - x - 24)), h: 0, text: '', color: st.color, fs: st.fs, bold: !!st.bold };
  o.h = layoutText(o).h;
  editText(o);
}
function editText(o) {
  commitText(); clearSel();
  const el = textEditor();
  ed.editing = { id: o.id, obj: o };
  el.value = o.text; el.hidden = false;
  styleTextEditor();
  invalidate(o.page); requestRender();
  renderSubbar();
  el.focus({ preventScroll: true });
  el.setSelectionRange(el.value.length, el.value.length);
}
function styleTextEditor() {
  const o = ed.editing.obj, el = txtEl;
  el.style.width = o.w + 'px';
  el.style.font = textFont(o);
  el.style.lineHeight = (o.fs * LH) + 'px';
  el.style.color = o.color;
  fitTextEditor(); positionTextEditor();
}
function fitTextEditor() { txtEl.style.height = '0px'; txtEl.style.height = txtEl.scrollHeight + 'px'; }
function positionTextEditor() {
  if (!ed.editing || !txtEl) return;
  const o = ed.editing.obj, v = ed.view;
  txtEl.style.left = (v.x + o.x * v.s) + 'px';
  txtEl.style.top = (v.y + (pageTop(o.page) + o.y) * v.s) + 'px';
  txtEl.style.transform = `scale(${v.s})`;
}
// garde la zone de saisie visible (clavier ouvert)
function keepEditorVisible() {
  if (!ed.editing || !txtEl) return;
  const o = ed.editing.obj, v = ed.view;
  const bottom = v.y + (pageTop(o.page) + o.y) * v.s + txtEl.offsetHeight * v.s;
  if (bottom > vh - 24) { v.y -= bottom - (vh - 24); requestRender(); }
}
function commitText() {
  const e = ed.editing; if (!e) return;
  ed.editing = null;
  const el = txtEl; el.hidden = true; el.blur();
  const text = el.value.replace(/\s+$/, '');
  const old = ed.objs.find(x => x.id === e.id);
  if (!text.trim()) {
    if (old) { pushHistory(); ed.objs = ed.objs.filter(x => x !== old); markDirty(); }
  } else {
    const n = { ...e.obj, text }; n.h = layoutText(n).h;
    const same = old && old.text === n.text && old.color === n.color && old.fs === n.fs && !!old.bold === !!n.bold && old.w === n.w;
    if (!same) {
      pushHistory();
      if (old) ed.objs = ed.objs.map(x => x === old ? n : x); else ed.objs.push(n);
      markDirty();
    }
  }
  bump(); invalidate(e.obj.page); requestRender(); renderSubbar();
}
const curText = () => ed.editing ? ed.editing.obj : settings.text;
function applyTextStyle(patch) {
  Object.assign(settings.text, patch); saveSettings();
  if (ed.editing) { ed.editing.obj = { ...ed.editing.obj, ...patch }; styleTextEditor(); }
  renderSubbar();
}

// ============================================================ Insertion (image, son, lien)
function insertSpot(w, h) {
  const c = toWorld({ x: vw / 2, y: vh / 2 }), hit = pageHit(c), { w: pw, h: ph } = pageSize();
  const page = hit ? hit.i : currentPage(), cy = hit ? hit.y : ph / 2;
  let x = clamp(c.x - w / 2, 10, Math.max(10, pw - w - 10)), y = clamp(cy - h / 2, 10, Math.max(10, ph - h - 10));
  // décaler en cascade si un objet occupe déjà cette place
  for (let k = 0; k < 12 && objsOn(page).some(o => Math.abs(o.x - x) < 20 && Math.abs(o.y - y) < 20); k++) { x += 24; y += 24; }
  return { page, x: r2(x), y: r2(y) };
}
function addObj(o) {
  pushHistory(); ed.objs.push(o); bump(); invalidate(o.page); markDirty();
  setTool('lasso'); setSelection(o.page, [], [o]); requestRender();
}
const fileToDataURL = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(f); });

let mediaInput = null;
function pickFile(accept, capture) {
  return new Promise(res => {
    if (mediaInput) mediaInput.remove();
    const inp = mediaInput = document.createElement('input');
    inp.type = 'file'; inp.accept = accept; inp.hidden = true;
    if (capture) inp.setAttribute('capture', capture);
    inp.addEventListener('change', () => res(inp.files[0] || null));
    document.body.appendChild(inp); inp.click();
  });
}

async function insertImage(capture) {
  const f = await pickFile('image/*', capture ? 'environment' : null);
  if (!f) return;
  const url = URL.createObjectURL(f);
  try {
    const im = new Image(); im.src = url; await im.decode();
    const MAX = 2000, k = Math.min(1, MAX / Math.max(im.naturalWidth, im.naturalHeight));
    const cv = document.createElement('canvas');
    cv.width = Math.max(1, Math.round(im.naturalWidth * k)); cv.height = Math.max(1, Math.round(im.naturalHeight * k));
    cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
    const png = /png|gif|webp|svg/.test(f.type) && cv.width * cv.height <= 1.6e6;
    const src = cv.toDataURL(png ? 'image/png' : 'image/jpeg', 0.88);
    const { w: pw, h: ph } = pageSize();
    let w = Math.min(cv.width, pw * 0.6), h = w * cv.height / cv.width;
    if (h > ph * 0.55) { h = ph * 0.55; w = h * cv.width / cv.height; }
    const sp = insertSpot(w, h);
    addObj({ id: uid(), type: 'image', ...sp, w: r2(w), h: r2(h), src });
  } catch (err) { toast('Impossible de lire cette image'); console.error(err); }
  finally { URL.revokeObjectURL(url); }
}

function insertAudioObj(src, name, dur) {
  const w = 280, sp = insertSpot(w, CHIP_H);
  addObj({ id: uid(), type: 'audio', ...sp, w, h: CHIP_H, src, name, dur: Math.round(dur * 10) / 10 });
}
async function insertAudioFile() {
  const f = await pickFile('audio/*');
  if (!f) return;
  if (f.size > 30e6) { toast('Fichier trop lourd (30 Mo maximum)'); return; }
  const src = await fileToDataURL(f);
  const dur = await new Promise(res => {
    const a = new Audio(); let done = false;
    const end = v => { if (!done) { done = true; res(v); } };
    a.addEventListener('loadedmetadata', () => end(isFinite(a.duration) ? a.duration : 0));
    a.addEventListener('error', () => end(0));
    setTimeout(() => end(0), 4000);
    a.src = src;
  });
  insertAudioObj(src, f.name.replace(/\.[^.]+$/, ''), dur);
}
async function recordAudio() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) { toast('Enregistrement non disponible sur cet appareil'); return; }
  let stream;
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
  catch { toast('Accès au micro refusé'); return; }
  const mime = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg'].find(t => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(t)) || '';
  const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
  const chunks = [];
  rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); };
  const stopped = new Promise(r => { rec.onstop = r; });
  const t0 = Date.now(); let timer = 0;
  rec.start(500);
  const keep = await new Promise(res => {
    dlgResolve = res;
    modal.dataset.sticky = '1';
    showDialog(`<h2>Enregistrement</h2>
      <div class="rec"><span class="rec-dot"></span><span class="rec-time">0:00</span></div>
      <div class="actions"><button class="btn ghost" data-b="no">Annuler</button><button class="btn primary" data-b="ok">Arrêter et insérer</button></div>`, d => {
      timer = setInterval(() => { $('.rec-time', d).textContent = fmtDur((Date.now() - t0) / 1000); }, 250);
      d.addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (b) hideDialog(b.dataset.b === 'ok'); });
    });
  });
  delete modal.dataset.sticky;
  clearInterval(timer);
  const dur = (Date.now() - t0) / 1000;
  rec.stop(); await stopped;
  stream.getTracks().forEach(t => t.stop());
  if (!keep || !chunks.length) return;
  const src = await fileToDataURL(new Blob(chunks, { type: rec.mimeType || mime || 'audio/webm' }));
  const name = 'Enregistrement · ' + new Date().toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  insertAudioObj(src, name, dur);
}

// ---------- Lecture des sons
const player = new Audio();
let playing = null; // objet son en cours
const playingObj = () => playing && ed.objs.find(o => o.id === playing.id);
function audioTick() { requestOverlay(); if (playing && !player.paused) requestAnimationFrame(audioTick); }
player.addEventListener('play', audioTick);
player.addEventListener('pause', () => requestOverlay());
player.addEventListener('ended', () => { playing = null; requestOverlay(); });
function toggleAudio(o) {
  if (playing && playing.id === o.id) {
    if (player.paused) player.play().catch(() => {}); else player.pause();
    return;
  }
  player.pause();
  playing = o; player.src = o.src;
  player.play().catch(() => { playing = null; toast('Lecture impossible'); requestOverlay(); });
  requestOverlay();
}
function stopAudio() { player.pause(); playing = null; requestOverlay(); }

// ---------- Liens
function normUrl(u) {
  u = String(u || '').trim();
  if (!u) return null;
  if (/^[\w.+-]+@[\w-]+\.[\w.-]+$/.test(u)) u = 'mailto:' + u;
  else if (!/^[a-z][a-z0-9+.-]*:/i.test(u)) u = 'https://' + u;
  try {
    const p = new URL(u);
    if (!/^(https?|mailto|tel):$/.test(p.protocol)) return null;
    return p.href;
  } catch { return null; }
}
function openLink(url) {
  if (!normUrl(url)) return;
  window.open(url, '_blank', 'noopener');
}
function linkDialog(o) {
  return new Promise(res => {
    dlgResolve = res;
    showDialog(`<h2>${o ? 'Modifier le lien' : 'Insérer un lien'}</h2>
      <div class="nb-label">Adresse</div>
      <input class="field" id="ln-url" type="url" inputmode="url" autocapitalize="off" spellcheck="false" placeholder="exemple.com" value="${esc(o ? o.url : '')}">
      <div class="nb-label">Texte affiché (facultatif)</div>
      <input class="field" id="ln-label" maxlength="120" value="${esc(o ? o.label || '' : '')}">
      <div class="ln-err" hidden>Adresse invalide</div>
      <div class="actions"><button class="btn ghost" data-b="no">Annuler</button><button class="btn primary" data-b="ok">${o ? 'Enregistrer' : 'Insérer'}</button></div>`, d => {
      const ok = () => {
        const url = normUrl($('#ln-url', d).value);
        if (!url) { $('.ln-err', d).hidden = false; return; }
        hideDialog({ url, label: $('#ln-label', d).value.trim() });
      };
      d.addEventListener('click', e => { const b = e.target.closest('[data-b]'); if (!b) return; if (b.dataset.b === 'ok') ok(); else hideDialog(null); });
      d.addEventListener('keydown', e => { if (e.key === 'Enter') ok(); });
      setTimeout(() => $('#ln-url', d).focus(), 30);
    });
  });
}
async function insertLink() {
  const v = await linkDialog(null);
  if (!v) return;
  const w = 300, sp = insertSpot(w, CHIP_H);
  addObj({ id: uid(), type: 'link', ...sp, w, h: CHIP_H, url: v.url, label: v.label });
}

function buildInsertPop(p) {
  p.innerHTML = `<div class="menu">
    <button data-ins="text">${icon('text')}Zone de texte</button>
    <hr>
    <button data-ins="image">${icon('image')}Image</button>
    <button data-ins="photo">${icon('camera')}Prendre une photo</button>
    <hr>
    <button data-ins="rec">${icon('mic')}Enregistrer un son</button>
    <button data-ins="audio">${icon('audio')}Fichier audio</button>
    <hr>
    <button data-ins="link">${icon('link')}Lien</button>
  </div>`;
  p.addEventListener('click', e => {
    const b = e.target.closest('[data-ins]'); if (!b) return;
    closePop();
    const k = b.dataset.ins;
    if (k === 'text') {
      setTool('text');
      const st = settings.text, sp = insertSpot(360, st.fs * LH);
      newTextAt(sp.page, sp.x, sp.y + st.fs * LH / 2);
    } else if (k === 'image') insertImage(false);
    else if (k === 'photo') insertImage(true);
    else if (k === 'rec') recordAudio();
    else if (k === 'audio') insertAudioFile();
    else if (k === 'link') insertLink();
  });
}

// ============================================================ Barre d'outils
function setTool(t) {
  if (ed.tool !== t) { clearSel(); if (t !== 'text') commitText(); }
  ed.tool = t;
  if (t !== 'eraser') { cursor = null; requestOverlay(); }
  closePop();
  updateToolbar();
}
function updateToolbar() {
  $$('#tools .tool').forEach(b => {
    b.classList.toggle('active', b.dataset.tool === ed.tool);
    if ($('.ind', b)) b.style.setProperty('--ic', settings[b.dataset.tool].color);
  });
  renderSubbar();
}
const sizeDot = (w, fam) => clamp(fam === 'hl' ? w * 0.55 : w * 1.9 + 2, 4, 20);
function renderSubbar() {
  const sb = $('#subbar'), t = ed.tool;
  const colors = (fam, cur) => settings[fam + 'Slots'].map((c, i) =>
    `<button class="sb-color${c === cur ? ' active' : ''}" data-slot="${i}" title="Touchez à nouveau pour changer la couleur"><span style="background:${c}"></span></button>`).join('');
  const sizes = fam => settings[fam + 'Sizes'].map((w, i) => {
    const d = sizeDot(w, fam);
    return `<button class="sb-size${Math.abs(w - settings[fam].w) < 0.01 ? ' active' : ''}" data-size="${i}" title="Touchez à nouveau pour régler"><i style="width:${d}px;height:${d}px"></i></button>`;
  }).join('');
  const sep = '<span class="sb-sep"></span>';
  let h = '';
  if (t === 'pen' || t === 'hl') h = colors(t, settings[t].color) + sep + sizes(t);
  else if (t === 'shape') {
    h = SHAPES.map(s => `<button class="sb-shape${settings.shape === s.id ? ' active' : ''}" data-shape="${s.id}" title="${s.name}">${icon(s.id)}</button>`).join('')
      + sep + colors('pen', settings.pen.color) + sep + sizes('pen');
  } else if (t === 'eraser') {
    h = ERASER_SIZES.map(s => `<button class="sb-size ring${settings.eraserR === s ? ' active' : ''}" data-er="${s}"><i style="width:${s * 0.75}px;height:${s * 0.75}px"></i></button>`).join('')
      + sep + '<span class="sb-hint">Efface les traits touchés</span>';
  } else if (t === 'lasso') {
    const colorable = ed.sel && (ed.sel.items.length || ed.sel.objs.some(o => o.type === 'text'));
    h = colorable ? '<span class="sb-label">Couleur de la sélection</span>' + colors('pen', null)
      : ed.sel ? '<span class="sb-hint">Faites glisser pour déplacer, le rond pour redimensionner</span>'
      : '<span class="sb-hint">Entourez ou touchez des éléments pour les sélectionner</span>';
  } else if (t === 'text') {
    const cur = curText();
    h = colors('pen', cur.color) + sep
      + TEXT_SIZES.map((fs, i) => `<button class="sb-size sb-fs${cur.fs === fs ? ' active' : ''}" data-fs="${fs}" title="Taille ${fs}"><b style="font-size:${13 + i * 4}px">A</b></button>`).join('')
      + `<button class="sb-shape${cur.bold ? ' active' : ''}" data-bold title="Gras">${icon('bold')}</button>`
      + (ed.editing ? '' : sep + '<span class="sb-hint">Touchez la page pour écrire</span>');
  }
  sb.innerHTML = h;
}
$('#subbar').addEventListener('click', e => {
  const fam = ed.tool === 'hl' ? 'hl' : 'pen';
  const slot = e.target.closest('[data-slot]');
  if (slot) {
    const i = +slot.dataset.slot, c = settings[fam + 'Slots'][i];
    if (ed.sel) { recolorSelection(c); return; }
    if (ed.tool === 'text') {
      if (curText().color === c) openPop(slot, p => buildColorPop(p, 'pen', i));
      else applyTextStyle({ color: c });
      return;
    }
    if (settings[fam].color === c) { openPop(slot, p => buildColorPop(p, fam, i)); return; }
    settings[fam].color = c; saveSettings(); updateToolbar(); return;
  }
  const sz = e.target.closest('[data-size]');
  if (sz) {
    const i = +sz.dataset.size, w = settings[fam + 'Sizes'][i];
    if (Math.abs(settings[fam].w - w) < 0.01) { openPop(sz, p => buildSizePop(p, fam, i)); return; }
    settings[fam].w = w; saveSettings(); updateToolbar(); return;
  }
  const fs = e.target.closest('[data-fs]');
  if (fs) { applyTextStyle({ fs: +fs.dataset.fs }); return; }
  if (e.target.closest('[data-bold]')) { applyTextStyle({ bold: !curText().bold }); return; }
  const sh = e.target.closest('[data-shape]');
  if (sh) { settings.shape = sh.dataset.shape; saveSettings(); updateToolbar(); return; }
  const er = e.target.closest('[data-er]');
  if (er) { settings.eraserR = +er.dataset.er; saveSettings(); updateToolbar(); }
});
// garder le clavier ouvert quand on change le style du texte
$('#subbar').addEventListener('mousedown', e => { if (ed.editing) e.preventDefault(); });
$('#btn-insert').addEventListener('click', e => openPop(e.currentTarget, buildInsertPop));
$('#tools').addEventListener('click', e => {
  const b = e.target.closest('.tool'); if (b) setTool(b.dataset.tool);
});
$('#btn-undo').addEventListener('click', undo);
$('#btn-redo').addEventListener('click', redo);
$('#btn-paper').addEventListener('click', e => openPop(e.currentTarget, buildPaperPop));
$('#btn-more').addEventListener('click', e => openPop(e.currentTarget, buildMorePop));
$('#btn-zoom').addEventListener('click', () => fitWidth());
$('#btn-addpage').addEventListener('click', addPage);
$('#pp-add').addEventListener('click', addPage);
$('#btn-pages').addEventListener('click', togglePages);
$('#btn-back').addEventListener('click', () => { if (history.state && history.state.editor) history.back(); else closeEditor(); });
$('#note-title').addEventListener('click', renameCurrent);

// ============================================================ Popovers
let pop = $('#pop');
let popAnchor = null;
function openPop(anchor, build) {
  if (popAnchor === anchor && !pop.hidden) { closePop(); return; }
  const fresh = pop.cloneNode(false); // nouvel élément = pas d'anciens écouteurs
  pop.replaceWith(fresh); pop = fresh;
  pop.hidden = false;
  popAnchor = anchor;
  build(pop);
  hydrateIcons(pop);
  placePop();
}
function placePop() {
  if (!popAnchor || pop.hidden) return;
  const r = popAnchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
  let left = clamp(r.left + r.width / 2 - pw / 2, 8, innerWidth - pw - 8);
  let top = r.bottom + 8;
  if (top + ph > innerHeight - 8) top = Math.max(8, r.top - ph - 8);
  pop.style.left = left + 'px'; pop.style.top = top + 'px';
}
function closePop() { pop.hidden = true; popAnchor = null; }
document.addEventListener('pointerdown', e => {
  if (pop.hidden) return;
  if (pop.contains(e.target) || (popAnchor && popAnchor.contains(e.target))) return;
  closePop();
}, true);
addEventListener('resize', placePop);

function buildColorPop(p, fam, slot) {
  const colors = fam === 'hl' ? HL_COLORS : PEN_COLORS;
  const cur = () => ed.tool === 'text' && fam === 'pen' ? curText().color : settings[fam].color;
  p.innerHTML = `
    <div class="pop-title">Couleur</div>
    <div class="swatches">
      ${colors.map(c => `<button class="swatch" data-c="${c}" style="background:${c}" title="${c}"></button>`).join('')}
      <label class="swatch custom" title="Autre couleur">${icon('plus')}<input type="color" value="${cur()}"></label>
    </div>`;
  const refresh = () => $$('.swatch[data-c]', p).forEach(b => b.classList.toggle('active', b.dataset.c === cur()));
  const pick = c => {
    settings[fam + 'Slots'][slot] = c; settings[fam].color = c;
    saveSettings(); updateToolbar(); refresh();
    if (ed.tool === 'text' && fam === 'pen') applyTextStyle({ color: c });
  };
  p.addEventListener('click', e => { const sw = e.target.closest('[data-c]'); if (sw) pick(sw.dataset.c); });
  $('input[type=color]', p).addEventListener('input', e => pick(e.target.value));
  refresh();
}

function buildSizePop(p, fam, slot) {
  const range = fam === 'hl' ? [6, 40, 1] : [0.5, 16, 0.1];
  const st = settings[fam];
  p.innerHTML = `
    <div class="pop-title"><span>Épaisseur</span><span class="wv"></span></div>
    <div><input class="range" type="range" min="${range[0]}" max="${range[1]}" step="${range[2]}" value="${st.w}"></div>
    <canvas class="preview"></canvas>`;
  p.style.width = '280px';
  const cv = $('.preview', p), rng = $('.range', p), wv = $('.wv', p);
  const refresh = () => {
    wv.textContent = (Math.round(st.w * 10) / 10).toString().replace('.', ',');
    const W = cv.clientWidth || 246, H = 56, d = window.devicePixelRatio || 1;
    cv.width = W * d; cv.height = H * d;
    const c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0);
    const pts = [];
    for (let i = 0; i <= 40; i++) { const t = i / 40; pts.push(20 + t * (W - 40), H / 2 + Math.sin(t * Math.PI * 2) * 10, 0.5); }
    drawStroke(c, { tool: fam, color: st.color, w: st.w, pts, pr: false, sm: 1 }, 0, 0, false);
  };
  rng.addEventListener('input', () => {
    st.w = +rng.value; settings[fam + 'Sizes'][slot] = st.w;
    saveSettings(); updateToolbar(); refresh();
  });
  requestAnimationFrame(refresh);
}

function paperThumb(cv, style, color, orient) {
  const { w, h } = PAGE[orient];
  const cssW = orient === 'landscape' ? 74 : 62, cssH = orient === 'landscape' ? 52 : 84, d = window.devicePixelRatio || 1;
  cv.width = cssW * d; cv.height = cssH * d;
  const c = cv.getContext('2d');
  // aperçu agrandi (zone en haut à gauche) pour que le motif reste lisible
  const k = (cssW * d) / (w * 0.32);
  c.setTransform(k, 0, 0, k, 0, 0);
  drawPaper(c, w, h, { style, color });
}

function buildPaperPop(p) {
  const m = meta();
  const render = () => {
    p.innerHTML = `
      <div class="pop-title">Type de papier</div>
      <div class="paper-grid">${PAPERS.map(pp =>
        `<button class="paper-tile${m.orientation === 'landscape' ? ' landscape' : ''}${pp.id === m.paper.style ? ' active' : ''}" data-ps="${pp.id}"><canvas></canvas>${pp.name}</button>`).join('')}</div>
      <div class="pop-title">Couleur du papier</div>
      <div class="chips">${PAPER_COLORS.map(pc =>
        `<button class="chip${pc.id === m.paper.color ? ' active' : ''}" data-pc="${pc.id}"><i style="background:${pc.bg}"></i>${pc.name}</button>`).join('')}</div>
      <div class="pop-title">Orientation</div>
      <div class="seg"><button data-or="portrait" class="${m.orientation === 'portrait' ? 'active' : ''}">Portrait</button><button data-or="landscape" class="${m.orientation === 'landscape' ? 'active' : ''}">Paysage</button></div>
      <div style="margin-top:12px"><button class="pop-link" data-default>Utiliser par défaut pour les nouvelles notes</button></div>`;
    $$('.paper-tile', p).forEach(t => paperThumb($('canvas', t), t.dataset.ps, m.paper.color, m.orientation));
    placePop();
  };
  const apply = () => { cache.clear(); clampView(); markDirty(); requestRender(); render(); renderPagesPanel(true); };
  p.addEventListener('click', e => {
    const t = e.target.closest('[data-ps],[data-pc],[data-or],[data-default]'); if (!t) return;
    if (t.dataset.ps) { m.paper = { ...m.paper, style: t.dataset.ps }; apply(); }
    else if (t.dataset.pc) { m.paper = { ...m.paper, color: t.dataset.pc }; apply(); }
    else if (t.dataset.or) { if (m.orientation !== t.dataset.or) { const cur = currentPage(); m.orientation = t.dataset.or; apply(); fitWidth(false); scrollToPage(cur); } }
    else if (t.hasAttribute('data-default')) {
      settings.paper = { ...m.paper }; settings.orientation = m.orientation; saveSettings();
      toast('Papier défini par défaut'); closePop();
    }
  });
  render();
}

function buildMorePop(p) {
  const po = penOnly();
  p.innerHTML = `<div class="menu">
    <button data-m="add">${icon('pageadd')}Ajouter une page</button>
    <button data-m="delpage" class="danger">${icon('trash')}Supprimer cette page</button>
    <hr>
    <button data-m="pdf">${icon('file')}Exporter en PDF</button>
    <button data-m="png">${icon('image')}Exporter la page en PNG</button>
    <button data-m="svg">${icon('vector')}Exporter la page en SVG</button>
    <hr>
    <button data-m="pen">${icon('stylus')}Stylet uniquement<span class="check${po ? ' on' : ''}"></span></button>
    <button data-m="fit">${icon('fit')}Ajuster à la largeur</button>
  </div>`;
  p.addEventListener('click', async e => {
    const b = e.target.closest('[data-m]'); if (!b) return;
    const m = b.dataset.m;
    if (m === 'pen') {
      settings.penMode = penOnly() ? 'off' : 'on'; saveSettings();
      $('.check', b).classList.toggle('on', penOnly());
      toast(penOnly() ? 'Le doigt sert à naviguer, le stylet à écrire' : 'Le doigt peut aussi dessiner');
      return;
    }
    closePop();
    if (m === 'add') addPage();
    else if (m === 'delpage') deletePage(currentPage());
    else if (m === 'fit') fitWidth();
    else if (m === 'pdf') exportPDF();
    else if (m === 'png') exportPNG(currentPage());
    else if (m === 'svg') exportSVG(currentPage());
  });
}

// ============================================================ Pages
let pagesOpen = false, ppT = 0;
function togglePages(force) {
  pagesOpen = typeof force === 'boolean' ? force : !pagesOpen;
  $('#pages-panel').hidden = !pagesOpen;
  $('#btn-pages').classList.toggle('active', pagesOpen);
  if (pagesOpen) renderPagesPanel(true);
}
function renderPagesPanel(full) {
  if (!pagesOpen || !ed.note) return;
  const list = $('#pp-list'), n = meta().pageCount, { w, h } = pageSize();
  if (list.children.length !== n) full = true;
  while (list.children.length > n) list.lastChild.remove();
  while (list.children.length < n) {
    const it = document.createElement('div');
    it.className = 'pp-item';
    it.innerHTML = `<canvas></canvas><span></span><button class="pp-del" title="Supprimer la page">${icon('trash')}</button>`;
    list.appendChild(it);
  }
  const k = 152 / w * (window.devicePixelRatio || 1);
  const [a, b] = visiblePages();
  [...list.children].forEach((it, i) => {
    it.dataset.i = i;
    $('span', it).textContent = i + 1;
    if (!full && (i < a || i > b)) return;
    const cv = $('canvas', it);
    cv.width = Math.round(w * k); cv.height = Math.round(h * k);
    const c = cv.getContext('2d', { alpha: false });
    c.setTransform(k, 0, 0, k, 0, 0);
    renderPage(c, i);
  });
  updatePagesActive();
}
function refreshPagesSoon() {
  if (!pagesOpen) return;
  clearTimeout(ppT); ppT = setTimeout(() => renderPagesPanel(false), 400);
}
let ppActive = -1;
function updatePagesActive() {
  if (!pagesOpen) return;
  const cur = currentPage();
  const items = $$('#pp-list .pp-item');
  items.forEach((it, i) => it.classList.toggle('active', i === cur));
  if (cur !== ppActive && items[cur]) { ppActive = cur; items[cur].scrollIntoView({ block: 'nearest' }); }
}
$('#pp-list').addEventListener('click', e => {
  const it = e.target.closest('.pp-item'); if (!it) return;
  const i = +it.dataset.i;
  if (e.target.closest('.pp-del')) { deletePage(i); return; }
  scrollToPage(i);
});

function addPage() {
  pushHistory();
  meta().pageCount++;
  bump(); markDirty(); clampView();
  scrollToPage(meta().pageCount - 1);
  toast(`Page ${meta().pageCount} ajoutée`);
}
async function deletePage(i) {
  const n = meta().pageCount;
  const ok = await confirmDialog(n > 1 ? `Supprimer la page ${i + 1} ?` : 'Effacer le contenu de la page ?',
    'Vous pourrez annuler juste après avec le bouton Annuler.', n > 1 ? 'Supprimer' : 'Effacer');
  if (!ok) return;
  pushHistory();
  commitText();
  ed.strokes = ed.strokes.filter(s => s.page !== i).map(s => s.page > i ? { ...s, page: s.page - 1 } : s);
  ed.objs = ed.objs.filter(o => o.page !== i).map(o => o.page > i ? { ...o, page: o.page - 1 } : o);
  if (n > 1) meta().pageCount--;
  clearSel(); bump(); cache.clear(); clampView(); markDirty(); requestRender();
}

// ============================================================ Export
function renderPageCanvas(i, k) {
  const { w, h } = pageSize();
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  const c = cv.getContext('2d', { alpha: false });
  c.setTransform(k, 0, 0, k, 0, 0);
  renderPage(c, i);
  return cv;
}
const fileBase = () => (meta().title || 'note').replace(/[\\/:*?"<>|]+/g, '').trim().slice(0, 60) || 'note';
const toBlob = (cv, type, q) => new Promise(r => cv.toBlob(r, type, q));

const NATIVE = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const plugin = n => window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins[n];
const blobToB64 = blob => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = () => rej(r.error);
  r.readAsDataURL(blob);
});

// Enregistre un fichier. Dans l'appli Android : Documents/Carnet, sinon menu de partage.
async function downloadBlob(blob, name) {
  if (NATIVE) {
    const fs = plugin('Filesystem'), share = plugin('Share');
    const data = await blobToB64(blob);
    try {
      try { await fs.requestPermissions(); } catch {}
      await fs.writeFile({ path: 'Carnet/' + name, data, directory: 'DOCUMENTS', recursive: true });
      toast('Enregistré dans Documents/Carnet');
    } catch (err) {
      try {
        const r = await fs.writeFile({ path: name, data, directory: 'CACHE' });
        await share.share({ title: name, files: [r.uri], dialogTitle: 'Enregistrer ou partager' });
      } catch (e2) { toast('Impossible d’enregistrer le fichier'); console.error(err, e2); }
    }
    return;
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 8000);
  toast('Enregistré dans Téléchargements');
}

async function exportPNG(i) {
  commitText(); await loadImages();
  const blob = await toBlob(renderPageCanvas(i, 2.5), 'image/png');
  downloadBlob(blob, `${fileBase()} - page ${i + 1}.png`);
}

function objSVG(o, dark) {
  const f = v => Math.round((+v || 0) * 100) / 100;
  if (o.type === 'image') return RE_IMG.test(o.src) ? `<image href="${o.src}" x="${f(o.x)}" y="${f(o.y)}" width="${f(o.w)}" height="${f(o.h)}" preserveAspectRatio="none"/>\n` : '';
  if (o.type === 'text') {
    const lh = o.fs * LH;
    return `<text font-family="${esc(FONT)}" font-size="${f(o.fs)}" font-weight="${o.bold ? 650 : 400}" fill="${safeColor(o.color)}" dominant-baseline="central" xml:space="preserve">`
      + layoutText(o).lines.map((l, i) => `<tspan x="${f(o.x)}" y="${f(o.y + lh * (i + 0.5))}">${esc(l)}</tspan>`).join('') + '</text>\n';
  }
  const k = chipColors(dark), h = o.h, title = o.type === 'link' ? linkTitle(o) : (o.name || 'Son'), sub = o.type === 'link' ? linkSub(o) : fmtDur(o.dur);
  let s = `<rect x="${f(o.x)}" y="${f(o.y)}" width="${f(o.w)}" height="${h}" rx="12" fill="${k.bg}" stroke="${k.bd}"/>`
    + `<circle cx="${f(o.x + h / 2)}" cy="${f(o.y + h / 2)}" r="${f(h * 0.31)}" fill="${k.ac}"/>`
    + `<text x="${f(o.x + h + 2)}" y="${f(o.y + h * 0.45)}" font-family="${esc(FONT)}" font-size="15" font-weight="600" fill="${o.type === 'link' ? k.ac : k.tx}">${esc(title)}</text>`
    + `<text x="${f(o.x + h + 2)}" y="${f(o.y + h * 0.77)}" font-family="${esc(FONT)}" font-size="13" fill="${k.mu}">${esc(sub)}</text>`;
  if (o.type === 'link' && normUrl(o.url)) s = `<a href="${esc(normUrl(o.url))}">${s}</a>`;
  return s + '\n';
}
async function exportSVG(i) {
  commitText();
  const { w, h } = pageSize(), pc = paperColor(meta().paper);
  const f = v => Math.round(v * 100) / 100;
  let out = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">\n<rect width="100%" height="100%" fill="${pc.bg}"/>\n`;
  for (const o of objsOn(i)) out += objSVG(o, !!pc.dark);
  for (const s of strokesOn(i)) {
    const P = s.pts, n = P.length / 3;
    const op = s.tool === 'hl' ? ` stroke-opacity="${HL_ALPHA}"` : '';
    const color = safeColor(s.color);
    let avgW = s.w;
    if (s.pr) { let t = 0; for (let k = 2; k < P.length; k += 3) t += widthAt(s, P[k]); avgW = t / n; }
    if (n === 1) { out += `<circle cx="${f(P[0])}" cy="${f(P[1])}" r="${f(avgW / 2)}" fill="${color}"${op.replace('stroke-', 'fill-')}/>\n`; continue; }
    let d = `M${f(P[0])} ${f(P[1])}`;
    if (s.sm === 0 || n < 3) for (let k = 1; k < n; k++) d += `L${f(P[k * 3])} ${f(P[k * 3 + 1])}`;
    else {
      for (let k = 1; k < n - 1; k++) d += `Q${f(P[k * 3])} ${f(P[k * 3 + 1])} ${f((P[k * 3] + P[k * 3 + 3]) / 2)} ${f((P[k * 3 + 1] + P[k * 3 + 4]) / 2)}`;
      d += `L${f(P[(n - 1) * 3])} ${f(P[(n - 1) * 3 + 1])}`;
    }
    out += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${f(avgW)}" stroke-linecap="round" stroke-linejoin="round"${op}/>\n`;
  }
  out += '</svg>';
  downloadBlob(new Blob([out], { type: 'image/svg+xml' }), `${fileBase()} - page ${i + 1}.svg`);
}

async function exportPDF() {
  commitText();
  toast('Création du PDF…');
  await loadImages();
  const { w, h } = pageSize();
  const ptW = w * 0.75, ptH = h * 0.75; // 96 dpi -> points
  const enc = new TextEncoder();
  const parts = []; let off = 0; const offs = [];
  const add = x => { const b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); off += b.length; };
  const n = meta().pageCount;
  // liens cliquables : une annotation par lien, numérotées après les pages
  const links = ed.objs.filter(o => o.type === 'link' && o.page < n);
  const annId = new Map(links.map((o, k) => [o.id, 3 + n * 3 + k]));
  const total = 2 + n * 3 + links.length;
  add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
  const obj = (id, fn) => { offs[id] = off; add(`${id} 0 obj\n`); fn(); add('\nendobj\n'); };
  obj(1, () => add('<< /Type /Catalog /Pages 2 0 R >>'));
  obj(2, () => add(`<< /Type /Pages /Kids [${Array.from({ length: n }, (_, i) => `${3 + i * 3} 0 R`).join(' ')}] /Count ${n} >>`));
  for (let i = 0; i < n; i++) {
    const cv = renderPageCanvas(i, 2.2);
    const jpg = new Uint8Array(await (await toBlob(cv, 'image/jpeg', 0.9)).arrayBuffer());
    const pid = 3 + i * 3, cid = pid + 1, iid = pid + 2;
    const annots = links.filter(o => o.page === i).map(o => `${annId.get(o.id)} 0 R`);
    obj(pid, () => add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${ptW.toFixed(2)} ${ptH.toFixed(2)}] /Resources << /XObject << /Im0 ${iid} 0 R >> >> /Contents ${cid} 0 R${annots.length ? ` /Annots [${annots.join(' ')}]` : ''} >>`));
    const content = `q ${ptW.toFixed(2)} 0 0 ${ptH.toFixed(2)} 0 0 cm /Im0 Do Q`;
    obj(cid, () => add(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
    obj(iid, () => {
      add(`<< /Type /XObject /Subtype /Image /Width ${cv.width} /Height ${cv.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`);
      add(jpg); add('\nendstream');
    });
  }
  for (const o of links) {
    const u = o.url.replace(/[^\x20-\x7e]/g, c => encodeURIComponent(c)).replace(/[\\()]/g, '\\$&');
    const r = [o.x * 0.75, (h - o.y - o.h) * 0.75, (o.x + o.w) * 0.75, (h - o.y) * 0.75].map(v => v.toFixed(2)).join(' ');
    obj(annId.get(o.id), () => add(`<< /Type /Annot /Subtype /Link /Rect [${r}] /Border [0 0 0] /A << /S /URI /URI (${u}) >> >>`));
  }
  const xref = off;
  let x = `xref\n0 ${total + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= total; id++) x += String(offs[id]).padStart(10, '0') + ' 00000 n \n';
  add(x);
  add(`trailer\n<< /Size ${total + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  downloadBlob(new Blob(parts, { type: 'application/pdf' }), `${fileBase()}.pdf`);
}

// ============================================================ Sauvegarde
let saveT = 0;
function markDirty() {
  ed.dirty = true;
  refreshPagesSoon();
  clearTimeout(saveT);
  saveT = setTimeout(saveNote, 1000);
}
function makeThumb() {
  const { w, h } = pageSize(), k = 320 / w;
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * k); cv.height = Math.round(h * k);
  const c = cv.getContext('2d', { alpha: false });
  c.setTransform(k, 0, 0, k, 0, 0);
  renderPage(c, 0);
  return cv.toDataURL('image/jpeg', 0.8);
}
async function saveNote() {
  clearTimeout(saveT);
  if (!ed.note || !ed.dirty) return;
  ed.dirty = false;
  const m = meta();
  m.updated = Date.now();
  try { m.thumb = makeThumb(); } catch {}
  try { await db.save({ ...m }, { id: m.id, strokes: ed.strokes, objs: ed.objs }); }
  catch (err) { ed.dirty = true; toast('Erreur d’enregistrement'); console.error(err); }
}
document.addEventListener('visibilitychange', () => { if (document.hidden) { commitText(); saveNote(); } });
addEventListener('pagehide', () => saveNote());

// ============================================================ Navigation
function defaultTitle() {
  return 'Carnet du ' + new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}
async function newNote() {
  const v = await notebookDialog(null);
  if (!v) return;
  const m = {
    id: uid(), title: v.title, cover: v.cover, fav: false,
    created: Date.now(), updated: Date.now(),
    paper: v.paper, orientation: v.orientation,
    pageCount: 1, thumb: null,
  };
  settings.paper = { ...v.paper }; settings.orientation = v.orientation; settings.cover = v.cover; saveSettings();
  await db.save(m, { id: m.id, strokes: [], objs: [] });
  openNote(m.id);
}

async function openNote(id) {
  const m = await db.getMeta(id);
  if (!m) return;
  const data = await db.getData(id);
  ed.note = { meta: m };
  ed.strokes = (data && data.strokes) || [];
  ed.objs = (data && data.objs) || [];
  ed.history = []; ed.future = []; ed.sel = null; ed.editing = null; ed.dirty = false; action = null;
  if (txtEl) txtEl.hidden = true;
  bump(); cache.clear();
  $('#home').hidden = true; $('#editor').hidden = false;
  $('#note-title').textContent = m.title;
  if (!history.state || !history.state.editor) history.pushState({ editor: id }, '');
  updateToolbar(); updateUndo();
  resize();
  fitWidth(false);
  renderPagesPanel(true);
}

async function closeEditor() {
  if (!ed.note) return;
  closePop(); commitText(); clearSel(); stopAudio();
  await saveNote();
  ed.note = null; cache.clear(); imgs.clear();
  $('#editor').hidden = true; $('#home').hidden = false;
  showHome();
}
addEventListener('popstate', () => { if (ed.note) closeEditor(); });

async function renameCurrent() {
  const t = await promptDialog('Renommer le carnet', meta().title);
  if (t == null) return;
  meta().title = t.trim() || 'Sans titre';
  $('#note-title').textContent = meta().title;
  markDirty();
}

// ============================================================ Accueil
const fmtDate = ts => {
  const d = new Date(ts), now = new Date();
  if (d.toDateString() === now.toDateString()) return 'Aujourd’hui, ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric' });
};
let allNotes = [], homeView = 'all';

function coverHTML(n, extraClass = '') {
  const land = n.orientation === 'landscape' ? ' landscape' : '';
  const fav = n.fav ? `<span class="fav">${icon('star')}</span>` : '';
  const cover = safeCover(n.cover), thumb = safeThumb(n.thumb);
  if (cover === 'page') {
    const pc = paperColor(n.paper || {});
    return `<div class="cover page${land} ${extraClass}" style="--pbg:${pc.bg}">${thumb ? `<img src="${thumb}" alt="">` : ''}${fav}</div>`;
  }
  return `<div class="cover${land} ${extraClass}" style="--c:${cover}"><span class="spine"></span><span class="band"></span>
    <span class="plate">${esc(n.title)}</span>${fav}</div>`;
}

async function showHome() {
  allNotes = (await db.allMeta()).sort((a, b) => b.updated - a.updated);
  renderGrid();
}
function setHomeView(v) {
  homeView = v;
  $$('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === v));
  renderGrid();
}
function renderGrid() {
  const q = $('#search').value.trim().toLowerCase();
  const favs = allNotes.filter(n => n.fav);
  $('#count-all').textContent = allNotes.length || '';
  $('#count-fav').textContent = favs.length || '';
  $('#home-title').textContent = homeView === 'fav' ? 'Favoris' : 'Tous les carnets';
  let list = homeView === 'fav' ? favs : allNotes;
  $('#home-sub').textContent = list.length ? `${list.length} carnet${list.length > 1 ? 's' : ''}` : '';
  if (q) list = list.filter(n => String(n.title || '').toLowerCase().includes(q));
  const grid = $('#grid');
  if (homeView === 'fav' && !favs.length) {
    grid.innerHTML = `<div class="empty"><strong>Aucun favori</strong>Ajoutez un carnet aux favoris depuis son menu « ⋯ ».</div>`;
    return;
  }
  if (q && !list.length) { grid.innerHTML = `<div class="empty">Aucun résultat pour « ${esc(q)} »</div>`; return; }
  const newCard = homeView === 'all' && !q
    ? `<div class="card new-card" data-act="new"><div class="cover"><span class="plus">${icon('plus')}</span>Nouveau carnet</div></div>` : '';
  grid.innerHTML = newCard + list.map(n => `<div class="card" data-id="${esc(n.id)}">
      ${coverHTML(n)}
      <div class="card-foot">
        <div class="card-text"><div class="card-title">${esc(n.title)}</div>
        <div class="card-date">${esc(fmtDate(n.updated))}${n.pageCount > 1 ? ` · ${Math.round(+n.pageCount) || 1} p.` : ''}</div></div>
        <button class="icon-btn sm" data-act="menu" title="Options">${icon('more')}</button>
      </div></div>`).join('');
}
$('#search').addEventListener('input', renderGrid);
$('#btn-new').addEventListener('click', newNote);
$$('[data-view]').forEach(b => b.addEventListener('click', () => setHomeView(b.dataset.view)));
$$('[data-open=settings]').forEach(b => b.addEventListener('click', openSettings));
$('#grid').addEventListener('click', e => {
  if (e.target.closest('[data-act=new]')) { newNote(); return; }
  const card = e.target.closest('.card'); if (!card) return;
  const id = card.dataset.id;
  const mb = e.target.closest('[data-act=menu]');
  if (mb) { openPop(mb, p => buildCardMenu(p, id)); return; }
  openNote(id);
});
function buildCardMenu(p, id) {
  const n = allNotes.find(x => x.id === id) || {};
  p.innerHTML = `<div class="menu">
    <button data-c="open">${icon('file')}Ouvrir</button>
    <button data-c="edit">${icon('edit')}Modifier le carnet</button>
    <button data-c="fav">${icon('star')}${n.fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}</button>
    <button data-c="dup">${icon('copy')}Dupliquer</button>
    <hr><button data-c="del" class="danger">${icon('trash')}Supprimer</button></div>`;
  p.addEventListener('click', async e => {
    const b = e.target.closest('[data-c]'); if (!b) return;
    closePop();
    const m = await db.getMeta(id); if (!m) return;
    const c = b.dataset.c;
    if (c === 'open') openNote(id);
    else if (c === 'edit') {
      const v = await notebookDialog(m);
      if (v) { Object.assign(m, { title: v.title, cover: v.cover, paper: v.paper, orientation: v.orientation }); await db.save(m); showHome(); }
    } else if (c === 'fav') { m.fav = !m.fav; await db.save(m); showHome(); }
    else if (c === 'dup') {
      const d = await db.getData(id);
      const nm = { ...m, id: uid(), title: m.title + ' (copie)', created: Date.now(), updated: Date.now(), fav: false };
      await db.save(nm, { id: nm.id, strokes: (d && d.strokes) || [], objs: (d && d.objs) || [] }); showHome();
    } else if (c === 'del') {
      if (await confirmDialog(`Supprimer « ${m.title} » ?`, 'Ce carnet et toutes ses pages seront définitivement supprimés.', 'Supprimer')) { await db.del(id); showHome(); }
    }
  });
}

// ---------- Création / modification d'un carnet
function notebookDialog(existing) {
  const v = existing
    ? { title: existing.title, cover: existing.cover || 'page', paper: { ...existing.paper }, orientation: existing.orientation }
    : { title: '', cover: settings.cover, paper: { ...settings.paper }, orientation: settings.orientation };
  return new Promise(res => {
    dlgResolve = res;
    showDialog(`
      <h2>${existing ? 'Modifier le carnet' : 'Nouveau carnet'}</h2>
      <div class="nb-layout">
        <div class="nb-preview" id="nb-prev"></div>
        <div class="nb-form">
          <input class="field" id="nb-title" maxlength="120" placeholder="${esc(defaultTitle())}" value="${esc(v.title)}">
          <div class="nb-label">Couverture</div>
          <div class="cover-swatches" id="nb-covers">${COVERS.map(c => c === 'page'
            ? `<button class="cover-sw pagecov" data-cv="page" title="Aperçu de la première page">${icon('paper')}</button>`
            : `<button class="cover-sw" data-cv="${c}" style="background:${c}"></button>`).join('')}</div>
          <div class="nb-label">Papier</div>
          <div class="paper-grid nb-papers" id="nb-papers">${PAPERS.map(pp =>
            `<button class="paper-tile" data-ps="${pp.id}"><canvas></canvas>${pp.name}</button>`).join('')}</div>
          <div class="nb-label">Couleur du papier</div>
          <div class="chips" id="nb-pcolors">${PAPER_COLORS.map(pc =>
            `<button class="chip" data-pc="${pc.id}"><i style="background:${pc.bg}"></i>${pc.name}</button>`).join('')}</div>
          <div class="nb-label">Orientation</div>
          <div class="seg" id="nb-or"><button data-or="portrait">Portrait</button><button data-or="landscape">Paysage</button></div>
        </div>
      </div>
      <div class="actions"><button class="btn ghost" data-b="no">Annuler</button><button class="btn primary" data-b="ok">${existing ? 'Enregistrer' : 'Créer'}</button></div>`, d => {
      d.classList.add('wide');
      const titleIn = $('#nb-title', d);
      const sync = () => {
        $$('[data-cv]', d).forEach(b => b.classList.toggle('active', b.dataset.cv === v.cover));
        $$('[data-ps]', d).forEach(b => b.classList.toggle('active', b.dataset.ps === v.paper.style));
        $$('[data-pc]', d).forEach(b => b.classList.toggle('active', b.dataset.pc === v.paper.color));
        $$('[data-or]', d).forEach(b => b.classList.toggle('active', b.dataset.or === v.orientation));
        $$('#nb-papers .paper-tile', d).forEach(t => {
          const cv = $('canvas', t), r = window.devicePixelRatio || 1, W = 54, H = 73;
          cv.width = W * r; cv.height = H * r;
          const c = cv.getContext('2d'), k = (W * r) / (794 * 0.32);
          c.setTransform(k, 0, 0, k, 0, 0);
          drawPaper(c, 794, 1123, { style: t.dataset.ps, color: v.paper.color });
        });
        const prevThumb = existing && existing.thumb;
        $('#nb-prev', d).innerHTML = coverHTML({ title: titleIn.value.trim() || defaultTitle(), cover: v.cover, paper: v.paper, orientation: v.orientation, thumb: prevThumb });
        if (v.cover === 'page' && !prevThumb) {
          const box = $('#nb-prev .cover', d), cv = document.createElement('canvas');
          const { w, h } = PAGE[v.orientation], k = 300 / w;
          cv.width = w * k; cv.height = h * k; cv.style.cssText = 'width:100%;height:100%;display:block';
          const c = cv.getContext('2d'); c.setTransform(k, 0, 0, k, 0, 0); drawPaper(c, w, h, v.paper);
          box.prepend(cv);
        }
      };
      d.addEventListener('click', e => {
        const t = e.target.closest('[data-cv],[data-ps],[data-pc],[data-or],[data-b]'); if (!t) return;
        if (t.dataset.cv) v.cover = t.dataset.cv;
        else if (t.dataset.ps) v.paper.style = t.dataset.ps;
        else if (t.dataset.pc) v.paper.color = t.dataset.pc;
        else if (t.dataset.or) v.orientation = t.dataset.or;
        else if (t.dataset.b) {
          if (t.dataset.b === 'ok') { v.title = titleIn.value.trim() || defaultTitle(); hideDialog(v); }
          else hideDialog(null);
          return;
        }
        sync();
      });
      titleIn.addEventListener('input', () => { const pl = $('#nb-prev .plate', d); if (pl) pl.textContent = titleIn.value.trim() || defaultTitle(); });
      titleIn.addEventListener('keydown', e => { if (e.key === 'Enter') titleIn.blur(); });
      sync();
    });
  });
}

// ---------- Réglages
function openSettings() {
  const seg = (key, opts) => `<div class="seg" data-key="${key}">${opts.map(([v, l]) =>
    `<button data-v="${v}" class="${String(settings[key]) === String(v) ? 'active' : ''}">${l}</button>`).join('')}</div>`;
  showDialog(`
    <h2>Réglages</h2>
    <div class="set-row set-col"><div><div class="lbl">Apparence</div></div>
      ${seg('theme', [['auto', 'Automatique'], ['light', 'Clair'], ['dark', 'Sombre']])}</div>
    <div class="set-row set-col"><div><div class="lbl">Stylet uniquement</div>
      <div class="sub">Quand c’est actif, le doigt sert seulement à faire défiler et zoomer (anti-paume).</div></div>
      ${seg('penMode', [['auto', 'Auto'], ['on', 'Oui'], ['off', 'Non']])}</div>
    <div class="set-row set-col"><div><div class="lbl">Sensibilité à la pression</div>
      <div class="sub">Si votre stylet la gère, le trait s’épaissit quand vous appuyez.</div></div>
      ${seg('pressure', [['true', 'Activée'], ['false', 'Désactivée']])}</div>
    <div class="set-row set-col"><div><div class="lbl">Sauvegarde</div>
      <div class="sub">Les notes sont stockées sur cet appareil. Exportez-les régulièrement.</div></div>
      <div class="set-btns"><button class="btn" data-b="export">Exporter tout</button><button class="btn" data-b="import">Importer</button></div></div>
    <div class="actions"><button class="btn primary" data-b="close">Fermer</button></div>`, dlg => {
    dlg.addEventListener('click', async e => {
      const sb = e.target.closest('.seg button');
      if (sb) {
        const key = sb.parentElement.dataset.key, v = sb.dataset.v;
        settings[key] = key === 'pressure' ? v === 'true' : v;
        saveSettings();
        $$('button', sb.parentElement).forEach(x => x.classList.toggle('active', x === sb));
        if (key === 'theme') applyTheme();
        return;
      }
      const b = e.target.closest('[data-b]'); if (!b) return;
      if (b.dataset.b === 'close') hideDialog();
      else if (b.dataset.b === 'export') exportAll();
      else if (b.dataset.b === 'import') $('#file-import').click();
    });
  });
}
async function exportAll() {
  const metas = await db.allMeta();
  const notes = [];
  for (const m of metas) { const d = await db.getData(m.id); notes.push({ meta: m, strokes: (d && d.strokes) || [], objs: (d && d.objs) || [] }); }
  const blob = new Blob([JSON.stringify({ app: 'carnet', version: 1, exported: Date.now(), notes })], { type: 'application/json' });
  await downloadBlob(blob, `carnet-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`);
}
// ---------- Validation des sauvegardes importées
// Tout ce qui vient d'un fichier est considéré comme hostile : on ne garde que des valeurs
// de type et de forme connus, le reste est corrigé ou ignoré.
const RE_COLOR = /^#[0-9a-f]{3,8}$/i;
const RE_ID = /^[a-z0-9_-]{1,40}$/i;
const RE_THUMB = /^data:image\/(png|jpeg|webp);base64,[a-z0-9+/=]+$/i;
const RE_IMG = /^data:image\/(png|jpeg|webp|gif);base64,[a-z0-9+/=]+$/i;
const RE_AUDIO = /^data:audio\/[a-z0-9.+-]+(;[a-z0-9=.+-]+)*;base64,[a-z0-9+/=]+$/i;
const isNum = v => typeof v === 'number' && isFinite(v);
const num = (v, a, b, d) => isNum(v) ? clamp(v, a, b) : d;
const str = (v, max) => typeof v === 'string' ? v.slice(0, max) : '';
const safeColor = (c, d = '#1f2328') => typeof c === 'string' && RE_COLOR.test(c) ? c : d;
const safeCover = c => c === 'page' || (typeof c === 'string' && RE_COLOR.test(c)) ? c : 'page';
const safeThumb = t => typeof t === 'string' && RE_THUMB.test(t) ? t : null;

function sanitizeNote(n) {
  if (!n || typeof n !== 'object' || !n.meta || typeof n.meta !== 'object') return null;
  const m = n.meta;
  if (typeof m.id !== 'string' || !RE_ID.test(m.id)) return null;
  const pageCount = Math.round(num(m.pageCount, 1, 2000, 1));
  const paper = m.paper && typeof m.paper === 'object' ? m.paper : {};
  const meta = {
    id: m.id,
    title: str(m.title, 120).trim() || 'Sans titre',
    cover: safeCover(m.cover),
    fav: m.fav === true,
    created: num(m.created, 0, 9e15, Date.now()),
    updated: num(m.updated, 0, 9e15, Date.now()),
    paper: {
      style: PAPERS.some(p => p.id === paper.style) ? paper.style : 'blank',
      color: PAPER_COLORS.some(p => p.id === paper.color) ? paper.color : 'white',
    },
    orientation: m.orientation === 'landscape' ? 'landscape' : 'portrait',
    pageCount,
    thumb: safeThumb(m.thumb),
  };
  const page = p => Number.isInteger(p) && p >= 0 && p < pageCount;
  const strokes = [];
  for (const s of Array.isArray(n.strokes) ? n.strokes : []) {
    if (!s || typeof s !== 'object' || !page(s.page) || !Array.isArray(s.pts)) continue;
    const pts = s.pts;
    if (!pts.length || pts.length % 3 || pts.length > 600000 || !pts.every(isNum)) continue;
    const st = {
      id: typeof s.id === 'string' && RE_ID.test(s.id) ? s.id : uid(),
      page: s.page, tool: s.tool === 'hl' ? 'hl' : 'pen',
      color: safeColor(s.color), w: num(s.w, 0.1, 100, 2),
      pts: pts.slice(), pr: s.pr === true, sm: s.sm === 0 ? 0 : 1,
    };
    st.bb = computeBB(st.pts, st.pr ? st.w * 1.7 : st.w); // jamais repris du fichier
    strokes.push(st);
  }
  const objs = [];
  for (const o of Array.isArray(n.objs) ? n.objs : []) {
    if (!o || typeof o !== 'object' || !page(o.page)) continue;
    const base = {
      id: typeof o.id === 'string' && RE_ID.test(o.id) ? o.id : uid(), page: o.page, type: o.type,
      x: num(o.x, -2000, 4000, 20), y: num(o.y, -2000, 4000, 20),
      w: num(o.w, 10, 5000, 200), h: num(o.h, 10, 5000, CHIP_H),
    };
    if (o.type === 'text') {
      const t = { ...base, text: str(o.text, 20000), color: safeColor(o.color), fs: num(o.fs, 6, 200, 22), bold: o.bold === true };
      if (!t.text.trim()) continue;
      t.h = layoutText(t).h; objs.push(t);
    } else if (o.type === 'image') {
      if (typeof o.src === 'string' && RE_IMG.test(o.src)) objs.push({ ...base, src: o.src });
    } else if (o.type === 'audio') {
      if (typeof o.src === 'string' && RE_AUDIO.test(o.src)) objs.push({ ...base, h: CHIP_H, src: o.src, name: str(o.name, 200), dur: num(o.dur, 0, 86400, 0) });
    } else if (o.type === 'link') {
      const url = normUrl(o.url);
      if (url) objs.push({ ...base, h: CHIP_H, url, label: str(o.label, 120) });
    }
  }
  return { meta, strokes, objs };
}

$('#file-import').addEventListener('change', async e => {
  const f = e.target.files[0]; e.target.value = '';
  if (!f) return;
  let data;
  try {
    data = JSON.parse(await f.text());
    if (!data || data.app !== 'carnet' || !Array.isArray(data.notes)) throw new Error('format');
  } catch { toast('Fichier de sauvegarde invalide'); return; }
  let ok = 0, bad = 0;
  for (const raw of data.notes) {
    const n = sanitizeNote(raw);
    if (!n) { bad++; continue; }
    // ne jamais écraser un carnet existant : un doublon reçoit un nouvel identifiant
    if (await db.getMeta(n.meta.id)) { n.meta.id = uid(); n.meta.title = (n.meta.title + ' (importé)').slice(0, 120); }
    try { await db.save(n.meta, { id: n.meta.id, strokes: n.strokes, objs: n.objs }); ok++; }
    catch { bad++; }
  }
  toast(bad ? `${ok} carnet(s) importé(s), ${bad} ignoré(s)` : `${ok} carnet(s) importé(s)`);
  hideDialog(); showHome();
});

// ============================================================ Dialogues & toast
const modal = $('#modal');
let dlgResolve = null;
function showDialog(html, mount) {
  const old = $('#dialog');
  const fresh = old.cloneNode(false); // nouvel élément = pas d'anciens écouteurs
  fresh.innerHTML = html;
  old.replaceWith(fresh);
  modal.hidden = false;
  mount && mount(fresh);
  return fresh;
}
function hideDialog(val = null) {
  modal.hidden = true;
  if (dlgResolve) { const r = dlgResolve; dlgResolve = null; r(val); }
}
modal.addEventListener('pointerdown', e => { if (e.target === modal && !modal.dataset.sticky) hideDialog(null); });
function promptDialog(title, value) {
  return new Promise(res => {
    dlgResolve = res;
    const d = showDialog(`<h2>${esc(title)}</h2><input class="field" maxlength="120" value="${esc(value || '')}">
      <div class="actions"><button class="btn ghost" data-b="no">Annuler</button><button class="btn primary" data-b="ok">Valider</button></div>`, d => {
      d.addEventListener('click', e => {
        const b = e.target.closest('[data-b]'); if (!b) return;
        hideDialog(b.dataset.b === 'ok' ? $('.field', d).value : null);
      });
      $('.field', d).addEventListener('keydown', e => { if (e.key === 'Enter') hideDialog($('.field', d).value); });
    });
    setTimeout(() => { const f = $('.field', d); f.focus(); f.select(); }, 30);
  });
}
function confirmDialog(title, text, okLabel = 'OK') {
  return new Promise(res => {
    dlgResolve = res;
    showDialog(`<h2>${esc(title)}</h2><p>${esc(text)}</p>
      <div class="actions"><button class="btn ghost" data-b="no">Annuler</button><button class="btn danger" data-b="ok">${esc(okLabel)}</button></div>`, d => {
      d.addEventListener('click', e => {
        const b = e.target.closest('[data-b]'); if (!b) return;
        hideDialog(b.dataset.b === 'ok');
      });
    });
  });
}
let toastT = 0;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.hidden = false;
  t.style.animation = 'none'; void t.offsetWidth; t.style.animation = '';
  clearTimeout(toastT); toastT = setTimeout(() => { t.hidden = true; }, 2400);
}

// ============================================================ Démarrage
hydrateIcons();
applyTheme();
showHome();
// Appli Android : bouton retour
if (NATIVE && plugin('App')) {
  plugin('App').addListener('backButton', () => {
    if (!$('#modal').hidden) { hideDialog(null); return; }
    if (!pop.hidden) { closePop(); return; }
    if (ed.editing) { commitText(); return; }
    if (ed.sel) { clearSel(); return; }
    if (ed.note) { if (history.state && history.state.editor) history.back(); else closeEditor(); return; }
    plugin('App').exitApp();
  });
}
if (!NATIVE && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
})();
