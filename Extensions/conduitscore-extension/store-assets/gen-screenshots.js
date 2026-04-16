/**
 * ConduitScore Chrome Extension — Store Screenshots Generator
 * Outputs 3x PNG at 1280×720 to ./screenshots/
 */
const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'screenshots');
const ICON_PATH = path.join(__dirname, '..', 'public', 'icons', 'icon-128.png');

// Design tokens
const C = {
  indigo:   '#6366F1',
  indigoD:  '#4F46E5',
  lime:     '#84CC16',
  limeD:    '#65A30D',
  white:    '#FFFFFF',
  surface:  '#F8FAFC',
  border:   '#E2E8F0',
  textP:    '#0F172A',
  textS:    '#64748B',
  textM:    '#94A3B8',
  green:    '#22C55E',
  red:      '#EF4444',
  amber:    '#F59E0B',
  bgDark:   '#1E293B',
  bgDarker: '#0F172A',
  bgBrowser:'#DEE1E6', // Chrome toolbar gray
  bgTab:    '#FFFFFF',
  tabBorder:'#C5C8CC',
};

const W = 1280;
const H = 720;

// ── helpers ──────────────────────────────────────────────────────────────────

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/** Draw a realistic Chrome browser chrome at the top */
function drawBrowserFrame(ctx, title = 'example.com', url = 'https://example.com') {
  // Window bar
  ctx.fillStyle = C.bgBrowser;
  ctx.fillRect(0, 0, W, 96);

  // Title bar (thin strip)
  ctx.fillStyle = '#AEB2B8';
  ctx.fillRect(0, 0, W, 32);

  // Window controls (traffic lights)
  ['#FF5F57', '#FFBD2E', '#28C840'].forEach((col, i) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.arc(20 + i * 22, 16, 6, 0, Math.PI * 2);
    ctx.fill();
  });

  // Tab strip
  ctx.fillStyle = C.bgBrowser;
  ctx.fillRect(0, 32, W, 42);

  // Active tab
  ctx.fillStyle = C.bgTab;
  roundRect(ctx, 68, 34, 240, 36, 8);
  ctx.fill();
  ctx.strokeStyle = C.tabBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Favicon circle in tab
  ctx.fillStyle = '#6366F1';
  ctx.beginPath();
  ctx.arc(88, 52, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('C', 88, 56);

  // Tab title
  ctx.fillStyle = C.textP;
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(title, 102, 57);

  // + tab button
  ctx.fillStyle = C.textS;
  ctx.font = '18px sans-serif';
  ctx.fillText('+', 318, 57);

  // Navigation bar background
  ctx.fillStyle = C.bgBrowser;
  ctx.fillRect(0, 74, W, 22);

  // Back/forward/reload buttons
  ctx.fillStyle = '#70757A';
  ctx.font = '16px sans-serif';
  ctx.textAlign = 'center';
  ['←', '→', '↻'].forEach((ch, i) => ctx.fillText(ch, 20 + i * 28, 90));

  // Address bar
  ctx.fillStyle = C.white;
  roundRect(ctx, 80, 79, 1100, 14, 7);
  ctx.fill();
  ctx.strokeStyle = C.tabBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  // Lock icon
  ctx.fillStyle = '#70757A';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('🔒', 88, 91);

  // URL text
  ctx.fillStyle = C.textP;
  ctx.font = '12px sans-serif';
  ctx.fillText(url, 110, 91);

  // Extension icon area (puzzle)
  ctx.fillStyle = '#70757A';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('⋮', 1220, 91);
  ctx.fillText('⊕', 1195, 91);
}

/** Draw the popup container (white card with shadow) */
function drawPopupCard(ctx, px, py, pw, ph) {
  // Shadow
  ctx.shadowColor = 'rgba(0,0,0,0.22)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = C.white;
  roundRect(ctx, px, py, pw, ph, 12);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

/** Draw the popup header bar */
function drawPopupHeader(ctx, px, py, pw, icon) {
  // Gradient header
  const grad = ctx.createLinearGradient(px, py, px + pw, py);
  grad.addColorStop(0, '#6366F1');
  grad.addColorStop(1, '#8B5CF6');
  ctx.fillStyle = grad;
  roundRect(ctx, px, py, pw, 52, 12);
  ctx.fill();
  // Square off bottom corners
  ctx.fillRect(px, py + 26, pw, 26);

  // Logo text
  ctx.fillStyle = C.white;
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('ConduitScore', px + 14, py + 32);

  // Small tagline
  ctx.font = '10px sans-serif';
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.fillText('AI Visibility Scanner', px + 14, py + 46);
}

function drawCaption(ctx, text) {
  // Semi-transparent band at bottom
  const grad = ctx.createLinearGradient(0, H - 80, 0, H);
  grad.addColorStop(0, 'rgba(15,23,42,0)');
  grad.addColorStop(1, 'rgba(15,23,42,0.82)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, H - 80, W, 80);

  ctx.fillStyle = C.white;
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(text, W / 2, H - 28);
}

function drawWebpageBackground(ctx) {
  // Page background
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 96, W, H - 96);

  // Fake webpage hero
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(60, 120, W - 120, 140);

  // Fake heading lines
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(80, 138, 320, 22);
  ctx.fillRect(80, 170, 240, 14);
  ctx.fillRect(80, 194, 280, 14);
  ctx.fillRect(80, 218, 200, 14);

  // Fake image placeholder
  ctx.fillStyle = '#E2E8F0';
  ctx.fillRect(500, 128, 320, 124);
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('🖼', 660, 202);

  // Nav bar
  ctx.fillStyle = C.bgDarker;
  ctx.fillRect(0, 96, W, 26);
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  [100, 160, 220, 280, 340].forEach(x => {
    ctx.fillRect(x, 103, 48, 12);
  });
}

function save(canvas, name) {
  const buf = canvas.toBuffer('image/png');
  const fp = path.join(OUT, name);
  fs.writeFileSync(fp, buf);
  console.log(`Saved: ${fp} (${buf.length} bytes)`);
}

// ── Screenshot 1: Empty popup ─────────────────────────────────────────────────
async function screenshot1() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#EEF2FF';
  ctx.fillRect(0, 0, W, H);

  drawWebpageBackground(ctx);
  drawBrowserFrame(ctx, 'ConduitScore – AI Visibility', 'https://conduitscore.com');

  // Popup card
  const px = W - 360 - 30, py = 96, pw = 360, ph = 340;
  drawPopupCard(ctx, px, py, pw, ph);
  drawPopupHeader(ctx, px, py, pw);

  // Domain label
  ctx.fillStyle = C.textP;
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Website or Domain', px + 16, py + 80);

  // Input field
  ctx.fillStyle = C.surface;
  ctx.strokeStyle = C.indigo;
  ctx.lineWidth = 2;
  roundRect(ctx, px + 16, py + 88, pw - 32, 40, 8);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = C.textM;
  ctx.font = '13px sans-serif';
  ctx.fillText('example.com', px + 28, py + 113);

  // Cursor blink effect
  ctx.fillStyle = C.indigo;
  ctx.fillRect(px + 120, py + 99, 2, 18);

  // Scan button
  const grad = ctx.createLinearGradient(px + 16, 0, px + pw - 16, 0);
  grad.addColorStop(0, '#6366F1');
  grad.addColorStop(1, '#8B5CF6');
  ctx.fillStyle = grad;
  roundRect(ctx, px + 16, py + 142, pw - 32, 44, 10);
  ctx.fill();

  ctx.fillStyle = C.white;
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Scan Domain', px + pw / 2, py + 170);

  // Divider
  ctx.strokeStyle = C.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(px + 16, py + 204);
  ctx.lineTo(px + pw - 16, py + 204);
  ctx.stroke();

  // Features list
  const features = [
    ['✓', 'SSL & HTTPS status'],
    ['✓', 'Performance score'],
    ['✓', 'Accessibility grade'],
    ['✓', 'AI visibility rating'],
  ];
  features.forEach(([icon, text], i) => {
    ctx.fillStyle = C.green;
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(icon, px + 20, py + 228 + i * 24);
    ctx.fillStyle = C.textS;
    ctx.font = '12px sans-serif';
    ctx.fillText(text, px + 38, py + 228 + i * 24);
  });

  // Extension pin indicator (small arrow pointing to toolbar)
  ctx.fillStyle = 'rgba(99,102,241,0.15)';
  ctx.strokeStyle = C.indigo;
  ctx.lineWidth = 2;
  roundRect(ctx, W - 60, 82, 28, 14, 4);
  ctx.fill();
  ctx.stroke();

  drawCaption(ctx, 'Check any domain\'s trust score in one click');

  save(canvas, 'screenshot-1-empty-popup.png');
}

// ── Screenshot 2: Results ─────────────────────────────────────────────────────
async function screenshot2() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#EEF2FF';
  ctx.fillRect(0, 0, W, H);

  drawWebpageBackground(ctx);
  drawBrowserFrame(ctx, 'example.com – Domain Info', 'https://example.com');

  // Popup card — taller for results
  const px = W - 380 - 20, py = 96, pw = 380, ph = 560;
  drawPopupCard(ctx, px, py, pw, ph);
  drawPopupHeader(ctx, px, py, pw);

  // URL chip
  ctx.fillStyle = '#EEF2FF';
  roundRect(ctx, px + 16, py + 58, pw - 32, 24, 12);
  ctx.fill();
  ctx.fillStyle = C.indigo;
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('example.com', px + pw / 2, py + 75);

  // Score circle
  const cx2 = px + pw / 2, cy2 = py + 166, r = 58;
  // Outer ring background
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.arc(cx2, cy2, r, -Math.PI / 2, Math.PI * 2 - Math.PI / 2);
  ctx.stroke();

  // Score arc (84/100 = 302.4 degrees)
  const arcEnd = -Math.PI / 2 + (84 / 100) * Math.PI * 2;
  const arcGrad = ctx.createLinearGradient(cx2 - r, cy2, cx2 + r, cy2);
  arcGrad.addColorStop(0, '#84CC16');
  arcGrad.addColorStop(1, '#4ADE80');
  ctx.strokeStyle = arcGrad;
  ctx.lineWidth = 10;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx2, cy2, r, -Math.PI / 2, arcEnd);
  ctx.stroke();
  ctx.lineCap = 'butt';

  // Score number
  ctx.fillStyle = C.textP;
  ctx.font = 'bold 38px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('84', cx2, cy2 + 14);

  // /100 subscript
  ctx.fillStyle = C.textM;
  ctx.font = '12px sans-serif';
  ctx.fillText('/100', cx2, cy2 + 30);

  // Grade badge
  ctx.fillStyle = C.lime;
  roundRect(ctx, cx2 - 20, cy2 - r - 18, 40, 26, 13);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('B', cx2, cy2 - r - 1);

  // "Good" label
  ctx.fillStyle = C.limeD;
  ctx.font = 'bold 11px sans-serif';
  ctx.fillText('GOOD', cx2, cy2 + 48);

  // Category rows
  const cats = [
    { name: 'SSL & Security',    score: 92, pass: true  },
    { name: 'Performance',       score: 78, pass: true  },
    { name: 'Accessibility',     score: 85, pass: true  },
    { name: 'AI Visibility',     score: 71, pass: true  },
    { name: 'Content Structure', score: 88, pass: true  },
  ];

  const rowY0 = py + 248;
  const rowH2 = 46;

  cats.forEach((cat, i) => {
    const ry = rowY0 + i * rowH2;

    // Row background (alternating)
    ctx.fillStyle = i % 2 === 0 ? C.white : C.surface;
    ctx.fillRect(px + 12, ry, pw - 24, rowH2 - 2);

    // Check icon
    ctx.fillStyle = cat.pass ? C.green : C.red;
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(cat.pass ? '✓' : '✗', px + 20, ry + 28);

    // Category name
    ctx.fillStyle = C.textP;
    ctx.font = '12px sans-serif';
    ctx.fillText(cat.name, px + 40, ry + 28);

    // Score pill
    const scoreColor = cat.score >= 80 ? C.lime : cat.score >= 60 ? C.amber : C.red;
    ctx.fillStyle = scoreColor + '22';
    roundRect(ctx, px + pw - 60, ry + 10, 44, 24, 12);
    ctx.fill();
    ctx.fillStyle = cat.score >= 80 ? C.limeD : cat.score >= 60 ? '#B45309' : '#B91C1C';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cat.score, px + pw - 38, ry + 27);
  });

  // View full report button
  ctx.strokeStyle = C.indigo;
  ctx.lineWidth = 2;
  ctx.fillStyle = '#EEF2FF';
  roundRect(ctx, px + 16, py + ph - 52, pw - 32, 38, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = C.indigo;
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('View Full Report →', px + pw / 2, py + ph - 27);

  drawCaption(ctx, 'Get instant SSL, security, performance, and accessibility scores');

  save(canvas, 'screenshot-2-results.png');
}

// ── Screenshot 3: Context menu ────────────────────────────────────────────────
async function screenshot3() {
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Page background
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 0, W, H);

  // Draw a richer webpage
  ctx.fillStyle = C.bgDarker;
  ctx.fillRect(0, 0, W, 50);

  // Nav brand
  ctx.fillStyle = C.white;
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('example.com', 30, 33);

  // Nav links
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = '13px sans-serif';
  ['Home', 'About', 'Products', 'Contact'].forEach((l, i) => ctx.fillText(l, 260 + i * 90, 33));

  // Browser frame
  drawBrowserFrame(ctx, 'Example Domain', 'https://example.com');

  // Page content behind browser frame
  ctx.fillStyle = C.white;
  ctx.fillRect(0, 96, W, H - 96);

  // Hero area
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 96, W, 200);
  ctx.fillStyle = C.textP;
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Example Domain', 80, 160);
  ctx.fillStyle = C.textS;
  ctx.font = '15px sans-serif';
  ctx.fillText('This domain is for use in illustrative examples in documents.', 80, 192);
  ctx.fillStyle = C.textM;
  ctx.font = '13px sans-serif';
  ctx.fillText('You may use this domain in literature without prior coordination.', 80, 218);

  // A "link" that's being right-clicked
  const linkX = 200, linkY = 290;
  ctx.fillStyle = '#2563EB';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('More information...', linkX, linkY);
  // Underline
  ctx.strokeStyle = '#2563EB';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(linkX, linkY + 2);
  ctx.lineTo(linkX + 130, linkY + 2);
  ctx.stroke();

  // Context menu
  const mx = linkX + 20, my = linkY + 10;
  const mw = 280, mh = 268;

  // Menu shadow + card
  ctx.shadowColor = 'rgba(0,0,0,0.25)';
  ctx.shadowBlur = 18;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = C.white;
  roundRect(ctx, mx, my, mw, mh, 8);
  ctx.fill();
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Menu border
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  roundRect(ctx, mx, my, mw, mh, 8);
  ctx.stroke();

  // Regular menu items
  const items = [
    { text: 'Open link in new tab',   icon: '⊕', highlight: false },
    { text: 'Open link in new window',icon: '□', highlight: false },
    { text: 'Open in incognito',      icon: '🕵', highlight: false },
    { text: '─────────────────────', icon: '',  highlight: false, divider: true },
    { text: 'Check ConduitScore for this link', icon: '◈', highlight: true },
    { text: '─────────────────────', icon: '',  highlight: false, divider: true },
    { text: 'Copy link address',      icon: '⧉', highlight: false },
    { text: 'Inspect',                icon: '🔍', highlight: false },
  ];

  items.forEach((item, i) => {
    const iy = my + 8 + i * 32;
    if (item.divider) {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mx + 8, iy + 8);
      ctx.lineTo(mx + mw - 8, iy + 8);
      ctx.stroke();
      return;
    }

    if (item.highlight) {
      // Highlighted row
      ctx.fillStyle = '#EEF2FF';
      ctx.fillRect(mx + 2, iy - 4, mw - 4, 30);
      ctx.strokeStyle = C.indigo;
      ctx.lineWidth = 1;
      ctx.strokeRect(mx + 2, iy - 4, mw - 4, 30);
    }

    ctx.fillStyle = item.highlight ? C.indigo : C.textP;
    ctx.font = item.highlight ? 'bold 13px sans-serif' : '13px sans-serif';
    ctx.textAlign = 'left';
    if (item.icon && item.icon !== '') {
      ctx.fillText(item.icon, mx + 14, iy + 15);
    }
    ctx.fillText(item.text, mx + 36, iy + 15);
  });

  // ConduitScore icon in highlighted item
  ctx.fillStyle = C.indigo;
  ctx.beginPath();
  ctx.arc(mx + 22, my + 8 + 4 * 32 + 11, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = C.white;
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('C', mx + 22, my + 8 + 4 * 32 + 15);

  drawCaption(ctx, 'Check any link with right-click');

  save(canvas, 'screenshot-3-context-menu.png');
}

// ── Run all ───────────────────────────────────────────────────────────────────
(async () => {
  try {
    await screenshot1();
    await screenshot2();
    await screenshot3();
    console.log('\nAll 3 screenshots generated at 1280×720.');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
