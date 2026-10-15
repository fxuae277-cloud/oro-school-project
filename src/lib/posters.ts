import type { AdType, ColorScheme } from './types';

/**
 * محرك رسم المنشورات على Canvas — 5 قوالب مختلفة، دعم كامل للعربية RTL.
 * أبعاد المنشور: 1080 × 1350 (مناسب لإنستغرام وسناب شات).
 */

export const POSTER_W = 1080;
export const POSTER_H = 1350;

export interface PosterOptions {
  template: number; // 1..5
  colors: ColorScheme;
  storeName: string;
  productName: string;
  headline: string;
  body: string;
  cta: string;
  price: string;
  contact: string;
  adType: AdType;
  image: HTMLImageElement | null;
}

export const TEMPLATE_NAMES = ['الفاخر الذهبي', 'عصري جريء', 'شريط العرض', 'ناعم بسيط', 'بطاقة المتجر'];

const AD_TYPE_LABEL: Record<AdType, string> = {
  offer: 'عرض خاص',
  new: 'وصل حديثاً',
  intro: 'تعرّف علينا',
};

const TITLE_FONT = 'Cairo';
const BODY_FONT = 'Tajawal';

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** رسم نص من اليمين لليسار ابتداءً من y، وإرجاع الرسالة y التالية */
function drawRTL(
  ctx: CanvasRenderingContext2D,
  text: string,
  rightX: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 99,
): number {
  let lines = wrapText(ctx, text, maxWidth);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, '') + '…';
  }
  for (const l of lines) {
    ctx.fillText(l, rightX, y);
    y += lineHeight;
  }
  return y;
}

function drawCentered(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const prev = ctx.textAlign;
  ctx.textAlign = 'center';
  const lines = wrapText(ctx, text, maxWidth);
  for (const l of lines) {
    ctx.fillText(l, cx, y);
    y += lineHeight;
  }
  ctx.textAlign = prev;
  return y;
}

function roundRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  radius = 0,
) {
  const scale = Math.max(w / img.width, h / img.height);
  const sw = w / scale;
  const sh = h / scale;
  const sx = (img.width - sw) / 2;
  const sy = (img.height - sh) / 2;
  ctx.save();
  if (radius > 0) {
    roundRectPath(ctx, x, y, w, h, radius);
    ctx.clip();
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
  ctx.restore();
}

function bgGradient(ctx: CanvasRenderingContext2D, c: ColorScheme) {
  const g = ctx.createLinearGradient(0, 0, 0, POSTER_H);
  g.addColorStop(0, c.bg);
  g.addColorStop(1, c.bg2);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
}

/** ملاءمة احتواء (كاملة دون قص) مع محاذاة مركزية — مناسبة للصور الشفافة والمصورة */
function drawImageContain(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.min(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function footerBrand(ctx: CanvasRenderingContext2D, c: ColorScheme) {
  ctx.textAlign = 'center';
  ctx.fillStyle = c.subtext;
  ctx.font = `500 30px ${BODY_FONT}`;
  ctx.fillText('صُمّم بواسطة منصة أورو  ORO', POSTER_W / 2, POSTER_H - 34);
}

function priceLabel(price: string): string {
  const p = price.trim();
  if (!p) return '';
  return /[٠-٩0-9]/.test(p) && !/ر\.?ع|ريال/.test(p) ? `${p} ر.ع` : p;
}

/* ── القالب 1: الفاخر الذهبي (خلفية فوتوغرافية) ─────── */

// محمّل الخلفية الفاخرة — يحمّل مرة واحدة ويخزّن مؤقتاً
let luxuryBg: HTMLImageElement | null = null;
export function getLuxuryBg(): HTMLImageElement {
  if (!luxuryBg) {
    luxuryBg = new Image();
    luxuryBg.src = '/bg-luxury.jpg';
  }
  return luxuryBg;
}

const LUX = {
  text: '#2e2405',
  gold: '#8a6d1a',
  sub: '#4a3d15',
  btn: '#2e2405',
  cream: '#fdf6e3',
};

/** قوس عربي أنيق: جوانب مستقيمة وقمة مدببة ناعمة */
function archPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + w / 2);
  ctx.quadraticCurveTo(x, y, x + w / 2, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + w / 2);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
}

function drawRoyalFallbackBg(ctx: CanvasRenderingContext2D) {
  const g = ctx.createLinearGradient(0, 0, 0, POSTER_H);
  g.addColorStop(0, '#f6ead0');
  g.addColorStop(1, '#e0c491');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  // أشعة ضوء مائلة بسيطة
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.fillStyle = '#fff8e6';
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.translate(120 + i * 130, -100);
    ctx.rotate(0.32);
    ctx.fillRect(0, 0, 70, 1700);
    ctx.restore();
  }
  ctx.restore();
  // سطح رخامي مبسّط
  const m = ctx.createLinearGradient(0, 1060, 0, POSTER_H);
  m.addColorStop(0, 'rgba(255,252,244,0.9)');
  m.addColorStop(1, 'rgba(214,192,150,0.9)');
  ctx.fillStyle = m;
  ctx.fillRect(0, 1060, POSTER_W, POSTER_H - 1060);
}

function drawRoyal(ctx: CanvasRenderingContext2D, o: PosterOptions) {
  // الخلفية الفوتوغرافية الفاخرة
  const bg = getLuxuryBg();
  if (bg.complete && bg.naturalWidth > 0) {
    drawImageCover(ctx, bg, 0, 0, POSTER_W, POSTER_H);
  } else {
    drawRoyalFallbackBg(ctx);
  }

  // ستار ناعم خلف عمود النص (اليسار) لضمان وضوح القراءة
  const veil = ctx.createLinearGradient(0, 0, 660, 0);
  veil.addColorStop(0, 'rgba(255,250,236,0.85)');
  veil.addColorStop(1, 'rgba(255,250,236,0)');
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, 660, POSTER_H);

  // ── عمود النص الأيسر ──
  const colRight = 560;
  let y = 215;
  ctx.textAlign = 'right';

  ctx.fillStyle = LUX.gold;
  ctx.font = `700 46px ${TITLE_FONT}`;
  ctx.fillText(o.storeName || 'متجري', colRight, y);
  ctx.strokeStyle = LUX.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(colRight - 130, y + 24);
  ctx.lineTo(colRight, y + 24);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(colRight - 153, y + 24, 7, 0, Math.PI * 2);
  ctx.fillStyle = LUX.gold;
  ctx.fill();
  y += 135;

  // اسم المنتج بخط رفيع أنيق كبير
  ctx.fillStyle = LUX.text;
  ctx.font = `200 128px ${TITLE_FONT}`;
  y = drawRTL(ctx, o.productName || 'منتجي', colRight, y, 490, 142);
  y += 28;

  ctx.fillStyle = LUX.gold;
  ctx.font = `600 52px ${TITLE_FONT}`;
  y = drawRTL(ctx, o.headline, colRight, y, 490, 66);
  y += 16;

  ctx.fillStyle = LUX.sub;
  ctx.font = `400 34px ${BODY_FONT}`;
  y = drawRTL(ctx, o.body, colRight, y, 490, 56, 4);

  // زر داكن أنيق + شارة سعر ذهبية فوقه (محاذاة يمين دائماً)
  const price = priceLabel(o.price);
  const colLeft = 70;
  const maxW = colRight - colLeft;
  let btnLabel = o.cta || 'اكتشف المزيد';
  let btnSize = 42;
  ctx.textAlign = 'right';
  // تقليل خط الزر تدريجياً حتى يتسع داخل العمود
  let tw = 0;
  for (;;) {
    ctx.font = `700 ${btnSize}px ${TITLE_FONT}`;
    tw = ctx.measureText(btnLabel).width + 130;
    if (tw <= maxW || btnSize <= 28) break;
    btnSize -= 2;
  }
  // إن ظل أطول من العمود، اختصر العبارة بثلاث نقاط
  if (tw > maxW) {
    while (btnLabel.length > 4 && ctx.measureText(btnLabel + '…').width + 130 > maxW) {
      btnLabel = btnLabel.slice(0, -1);
    }
    btnLabel += '…';
    tw = ctx.measureText(btnLabel).width + 130;
  }
  const bx = colRight - tw;
  let by = Math.min(y + 36, 960);
  if (price) {
    ctx.font = `800 40px ${TITLE_FONT}`;
    const pw = ctx.measureText(price).width + 80;
    const grad = ctx.createLinearGradient(colRight - pw, by, colRight, by + 78);
    grad.addColorStop(0, '#d4af37');
    grad.addColorStop(1, '#b8860b');
    roundRectPath(ctx, colRight - pw, by, pw, 78, 39);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.fillStyle = '#fffdf2';
    ctx.textAlign = 'center';
    ctx.font = `800 40px ${TITLE_FONT}`;
    ctx.fillText(price, colRight - pw / 2, by + 53);
    by += 78 + 18;
  }
  ctx.font = `700 ${btnSize}px ${TITLE_FONT}`;
  roundRectPath(ctx, bx, by, tw, 92, 46);
  ctx.fillStyle = LUX.btn;
  ctx.fill();
  ctx.fillStyle = LUX.cream;
  ctx.textAlign = 'center';
  ctx.fillText(btnLabel, bx + tw / 2 + 12, by + 61);
  ctx.strokeStyle = LUX.cream;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(bx + 40, by + 36);
  ctx.lineTo(bx + 22, by + 46);
  ctx.lineTo(bx + 40, by + 56);
  ctx.stroke();

  // ── المنتج داخل قوس على الرخام (يمين) ──
  const ax = 585;
  const aw = 425;
  const atop = 520;
  const ah = 590;
  if (o.image) {
    // ظل ناعم
    ctx.save();
    ctx.shadowColor = 'rgba(60,40,5,0.4)';
    ctx.shadowBlur = 50;
    ctx.shadowOffsetY = 16;
    archPath(ctx, ax, atop, aw, ah);
    ctx.fillStyle = 'rgba(255,251,240,0.9)';
    ctx.fill();
    ctx.restore();
    // خلفية كريمية متدرجة داخل القوس
    ctx.save();
    archPath(ctx, ax, atop, aw, ah);
    ctx.clip();
    const ig = ctx.createLinearGradient(0, atop, 0, atop + ah);
    ig.addColorStop(0, '#fffdf6');
    ig.addColorStop(1, '#f3e7c9');
    ctx.fillStyle = ig;
    ctx.fillRect(ax, atop, aw, ah);
    // الصورة بملاءمة احتواء (لا قص) — تعمل مع الشفافة والمصورة
    drawImageContain(ctx, o.image, ax + 18, atop + 24, aw - 36, ah - 48);
    ctx.restore();
    // إطار ذهبي رفيع
    ctx.save();
    archPath(ctx, ax, atop, aw, ah);
    ctx.strokeStyle = 'rgba(184,134,11,0.9)';
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.restore();
  } else {
    ctx.save();
    archPath(ctx, ax, atop, aw, ah);
    ctx.fillStyle = 'rgba(255,251,240,0.55)';
    ctx.fill();
    ctx.setLineDash([16, 12]);
    ctx.strokeStyle = 'rgba(138,109,26,0.7)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = LUX.gold;
    ctx.textAlign = 'center';
    ctx.font = `600 44px ${TITLE_FONT}`;
    ctx.fillText(o.productName || 'منتجي', ax + aw / 2, atop + ah / 2 + 16);
    ctx.restore();
  }

  // ── شريط المزايا السفلي على الرخام ──
  const fy = 1255;
  const items = [
    o.contact ? `للتواصل: ${o.contact}` : '',
    AD_TYPE_LABEL[o.adType],
    o.storeName ? `توفّر لدى ${o.storeName}` : '',
  ].filter(Boolean);
  const n = items.length;
  items.forEach((t, i) => {
    const cx = 90 + (POSTER_W - 180) * (i + 0.5) / n;
    ctx.save();
    ctx.translate(cx, fy - 32);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = LUX.gold;
    ctx.fillRect(-7, -7, 14, 14);
    ctx.restore();
    ctx.fillStyle = LUX.text;
    ctx.font = `700 34px ${BODY_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(t, cx, fy + 10);
  });

  ctx.fillStyle = 'rgba(46,36,5,0.55)';
  ctx.textAlign = 'center';
  ctx.font = `500 26px ${BODY_FONT}`;
  ctx.fillText('صُمّم بواسطة منصة أورو  ORO', POSTER_W / 2, POSTER_H - 26);
}

/* ── القالب 2: عصري جريء ─────────────────────────────── */
function drawModern(ctx: CanvasRenderingContext2D, o: PosterOptions, c: ColorScheme) {
  bgGradient(ctx, c);

  // شريط علوي
  ctx.fillStyle = c.accent;
  ctx.fillRect(0, 0, POSTER_W, 150);
  ctx.fillStyle = c.accentText;
  ctx.textAlign = 'center';
  ctx.font = `800 58px ${TITLE_FONT}`;
  ctx.fillText(`${AD_TYPE_LABEL[o.adType]} — ${o.storeName || 'متجري'}`, POSTER_W / 2, 98);

  let y = 280;
  ctx.fillStyle = c.text;
  ctx.font = `900 84px ${TITLE_FONT}`;
  y = drawCentered(ctx, o.headline, POSTER_W / 2, y, POSTER_W - 180, 100);

  // بطاقة الصورة
  const iw = POSTER_W - 220;
  const ih = 520;
  const ix = 110;
  if (o.image) {
    drawImageCover(ctx, o.image, ix, 340, iw, ih, 36);
  } else {
    roundRectPath(ctx, ix, 340, iw, ih, 36);
    ctx.fillStyle = c.bg2;
    ctx.fill();
    ctx.strokeStyle = c.accent;
    ctx.lineWidth = 3;
    ctx.setLineDash([18, 14]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = c.subtext;
    ctx.font = `600 44px ${BODY_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(o.productName || 'منتجي', POSTER_W / 2, 340 + ih / 2 + 16);
  }

  // اسم المنتج فوق الصورة داخل الشريط؟ لا — تحتها
  let y2 = 340 + ih + 80;
  ctx.fillStyle = c.accent;
  ctx.font = `800 62px ${TITLE_FONT}`;
  y2 = drawCentered(ctx, o.productName, POSTER_W / 2, y2, POSTER_W - 200, 76);

  ctx.fillStyle = c.subtext;
  ctx.font = `500 36px ${BODY_FONT}`;
  y2 = drawCentered(ctx, o.body, POSTER_W / 2, y2 + 10, POSTER_W - 240, 56);

  // زر CTA
  const price = priceLabel(o.price);
  const label = price ? `${o.cta} — ${price}` : o.cta;
  ctx.font = `700 42px ${TITLE_FONT}`;
  const tw = ctx.measureText(label).width + 110;
  const bx = POSTER_W / 2 - tw / 2;
  const by = POSTER_H - 250;
  roundRectPath(ctx, bx, by, tw, 92, 46);
  ctx.fillStyle = c.accent;
  ctx.fill();
  ctx.fillStyle = c.accentText;
  ctx.textAlign = 'center';
  ctx.fillText(label, POSTER_W / 2, by + 62);

  if (o.contact) {
    ctx.fillStyle = c.subtext;
    ctx.font = `600 34px ${BODY_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`للتواصل: ${o.contact}`, POSTER_W / 2, by + 150);
  }

  footerBrand(ctx, c);
}

/* ── القالب 3: شريط العرض ────────────────────────────── */
function drawRibbon(ctx: CanvasRenderingContext2D, o: PosterOptions, c: ColorScheme) {
  bgGradient(ctx, c);

  // شريط مائل علوي
  ctx.save();
  ctx.translate(POSTER_W / 2, 120);
  ctx.rotate(-0.045);
  ctx.fillStyle = c.accent;
  ctx.fillRect(-POSTER_W, -70, POSTER_W * 2, 140);
  ctx.fillStyle = c.accentText;
  ctx.textAlign = 'center';
  ctx.font = `900 72px ${TITLE_FONT}`;
  ctx.fillText(AD_TYPE_LABEL[o.adType], 0, 26);
  ctx.restore();

  // الصورة يسار، النص يمين
  const ix = 80;
  const iy = 320;
  const iw = 440;
  const ih = 620;
  if (o.image) {
    drawImageCover(ctx, o.image, ix, iy, iw, ih, 32);
  } else {
    roundRectPath(ctx, ix, iy, iw, ih, 32);
    ctx.fillStyle = c.bg2;
    ctx.fill();
    ctx.fillStyle = c.subtext;
    ctx.font = `700 44px ${TITLE_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(o.productName || 'منتجي', ix + iw / 2, iy + ih / 2 + 16);
  }

  const right = POSTER_W - 90;
  let y = 400;
  ctx.textAlign = 'right';
  ctx.fillStyle = c.text;
  ctx.font = `900 84px ${TITLE_FONT}`;
  y = drawRTL(ctx, o.productName || 'منتجي', right, y, POSTER_W - 620, 100);
  y += 24;

  ctx.fillStyle = c.accent;
  ctx.font = `800 48px ${TITLE_FONT}`;
  y = drawRTL(ctx, o.headline, right, y, POSTER_W - 620, 62);
  y += 10;

  ctx.fillStyle = c.subtext;
  ctx.font = `500 34px ${BODY_FONT}`;
  drawRTL(ctx, o.body, right, y, POSTER_W - 620, 54, 4);

  // السعر داخل دائرة
  const price = priceLabel(o.price);
  if (price) {
    const cx = POSTER_W - 260;
    const cy = 1060;
    ctx.beginPath();
    ctx.arc(cx, cy, 130, 0, Math.PI * 2);
    ctx.fillStyle = c.accent;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, 112, 0, Math.PI * 2);
    ctx.strokeStyle = c.accentText;
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = c.accentText;
    ctx.textAlign = 'center';
    ctx.font = `800 52px ${TITLE_FONT}`;
    ctx.fillText(price, cx, cy + 18);
  }

  if (o.contact) {
    ctx.fillStyle = c.subtext;
    ctx.font = `600 36px ${BODY_FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText(`للتواصل: ${o.contact}`, POSTER_W / 2 - 120, POSTER_H - 90);
  }

  footerBrand(ctx, c);
}

/* ── القالب 4: ناعم بسيط ─────────────────────────────── */
function drawMinimal(ctx: CanvasRenderingContext2D, o: PosterOptions, c: ColorScheme) {
  ctx.fillStyle = c.bg;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);

  // خط علوي رفيع
  ctx.fillStyle = c.accent;
  ctx.fillRect(POSTER_W / 2 - 90, 120, 180, 8);

  let y = 240;
  ctx.textAlign = 'center';
  ctx.fillStyle = c.subtext;
  ctx.font = `600 40px ${BODY_FONT}`;
  ctx.fillText(o.storeName || 'متجري', POSTER_W / 2, y);
  y += 130;

  ctx.fillStyle = c.text;
  ctx.font = `900 110px ${TITLE_FONT}`;
  y = drawCentered(ctx, o.productName || 'منتجي', POSTER_W / 2, y, POSTER_W - 200, 128);
  y += 40;

  ctx.fillStyle = c.accent;
  ctx.font = `800 56px ${TITLE_FONT}`;
  y = drawCentered(ctx, o.headline, POSTER_W / 2, y, POSTER_W - 220, 70);
  y += 26;

  ctx.fillStyle = c.subtext;
  ctx.font = `500 38px ${BODY_FONT}`;
  y = drawCentered(ctx, o.body, POSTER_W / 2, y, POSTER_W - 260, 62);

  // صورة بأطراف دائرية
  if (o.image) {
    const iw = POSTER_W - 360;
    const ih = 460;
    drawImageCover(ctx, o.image, 180, Math.min(y + 30, 900), iw, ih, 230);
  }

  const price = priceLabel(o.price);
  const contact = o.contact.trim();
  if (price || contact) {
    ctx.textAlign = 'center';
    ctx.font = `700 44px ${TITLE_FONT}`;
    ctx.fillStyle = c.text;
    const parts = [price ? `السعر: ${price}` : '', contact ? `للتواصل: ${contact}` : '']
      .filter(Boolean)
      .join('   •   ');
    ctx.fillText(parts, POSTER_W / 2, POSTER_H - 160);
  }

  footerBrand(ctx, c);
}

/* ── القالب 5: بطاقة المتجر ──────────────────────────── */
function drawStoreCard(ctx: CanvasRenderingContext2D, o: PosterOptions, c: ColorScheme) {
  const card = 60;
  ctx.fillStyle = c.bg2;
  ctx.fillRect(0, 0, POSTER_W, POSTER_H);
  roundRectPath(ctx, card, card, POSTER_W - card * 2, POSTER_H - card * 2, 48);
  ctx.fillStyle = c.bg;
  ctx.fill();

  // شعار دائري بحرف أول من اسم المتجر
  const name = (o.storeName || 'أ').trim();
  const initial = name.charAt(0);
  const cx = POSTER_W / 2;
  const cy = 300;
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.fillStyle = c.accent;
  ctx.fill();
  ctx.fillStyle = c.accentText;
  ctx.textAlign = 'center';
  ctx.font = `900 110px ${TITLE_FONT}`;
  ctx.fillText(initial, cx, cy + 38);

  ctx.fillStyle = c.text;
  ctx.font = `800 62px ${TITLE_FONT}`;
  ctx.fillText(name, cx, 520);

  ctx.fillStyle = c.subtext;
  ctx.font = `600 36px ${BODY_FONT}`;
  ctx.fillText(AD_TYPE_LABEL[o.adType], cx, 580);

  // صورة منتج داخل بطاقة
  const iw = POSTER_W - 300;
  const ih = 430;
  if (o.image) {
    drawImageCover(ctx, o.image, 150, 640, iw, ih, 30);
  } else {
    roundRectPath(ctx, 150, 640, iw, ih, 30);
    ctx.fillStyle = c.bg2;
    ctx.fill();
    ctx.fillStyle = c.subtext;
    ctx.font = `700 48px ${TITLE_FONT}`;
    ctx.fillText(o.productName || 'منتجي', cx, 640 + ih / 2 + 16);
  }

  let y = 1150;
  ctx.fillStyle = c.text;
  ctx.font = `800 52px ${TITLE_FONT}`;
  y = drawCentered(ctx, o.productName || 'منتجي', cx, y, POSTER_W - 260, 64);

  ctx.fillStyle = c.accent;
  ctx.font = `700 40px ${TITLE_FONT}`;
  y = drawCentered(ctx, o.headline, cx, y + 6, POSTER_W - 260, 52);

  // شريط سفلي: سعر + تواصل
  ctx.fillStyle = c.accent;
  const bh = 110;
  roundRectPath(ctx, card, POSTER_H - card - bh, POSTER_W - card * 2, bh, 0);
  ctx.fill();
  ctx.fillStyle = c.accentText;
  ctx.textAlign = 'center';
  ctx.font = `700 42px ${TITLE_FONT}`;
  const price = priceLabel(o.price);
  const line = [price ? `السعر: ${price}` : '', o.contact ? `تواصل: ${o.contact}` : '']
    .filter(Boolean)
    .join('    |    ');
  ctx.fillText(line || 'أهلاً بكم', cx, POSTER_H - card - bh / 2 + 15);

  footerBrand(ctx, c);
}

/* ── المدخل الرئيسي ──────────────────────────────────── */
export function drawPoster(canvas: HTMLCanvasElement, o: PosterOptions, scale = 1) {
  canvas.width = Math.round(POSTER_W * scale);
  canvas.height = Math.round(POSTER_H * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(scale, scale);
  ctx.textBaseline = 'alphabetic';
  ctx.direction = 'rtl';

  switch (o.template) {
    case 1:
      drawRoyal(ctx, o);
      break;
    case 2:
      drawModern(ctx, o, o.colors);
      break;
    case 3:
      drawRibbon(ctx, o, o.colors);
      break;
    case 4:
      drawMinimal(ctx, o, o.colors);
      break;
    case 5:
      drawStoreCard(ctx, o, o.colors);
      break;
    default:
      drawRoyal(ctx, o);
  }
}
