'use strict';
// トップの「メッセージのカード」（写真・バッジ・見出し・説明・ボタン2つ）。編集元は site-src/home-promos/*.json の kind: "message"。
// 検査（check）と、ページに最初から書き込むHTML（html）だけを受け持つ。並べ替え・期間の表示切り替えは home-promos.js。
// 見出しは改行をそのまま使い、accent に書いた言葉（見出しの中の言葉。改行は無視して探す）だけ強調の色にする。
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const STYLES = { main: 'co', sub: 'wh' };
// 写真の上の演出（CSS は home-promos.css の data-fx）。書いていなければ花びら
const EFFECTS = ['petals', 'snow', 'confetti', 'sparkle', 'none'];
// 写真の縦横（ページの揺れを防ぐ width/height 用）。JPEG・PNG だけ読む。読めなければ null
function imageSize(file) {
  try {
    const b = fs.readFileSync(path.join(root, file));
    if (b[0] === 0x89 && b.toString('ascii', 1, 4) === 'PNG') return [b.readUInt32BE(16), b.readUInt32BE(20)];
    for (let i = 2; i + 9 < b.length;) {
      if (b[i] !== 0xff) return null;
      const m = b[i + 1], len = b.readUInt16BE(i + 2);
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
      i += 2 + len;
    }
  } catch (e) { /* 読めない写真は大きさを書かない */ }
  return null;
}
const esc = v => String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
// 見出しの中で accent が入っている所（改行を飛ばして探す）。見つからなければ null
function accentRange(headline, accent) {
  const a = String(accent || '').replace(/\n/g, '');
  if (!a) return null;
  const pos = [];
  let flat = '';
  for (let i = 0; i < headline.length; i++) if (headline[i] !== '\n') { pos.push(i); flat += headline[i]; }
  const at = flat.indexOf(a);
  if (at < 0) return null;
  return [pos[at], pos[at + a.length - 1] + 1];
}
function headlineHtml(headline, accent) {
  const h = String(headline || '');
  const r = accentRange(h, accent);
  const lines = s => esc(s).replace(/\n/g, '<br>');
  if (!r) return lines(h);
  return lines(h.slice(0, r[0])) + '<span>' + lines(h.slice(r[0], r[1])) + '</span>' + lines(h.slice(r[1]));
}
function check(row, id, ok) {
  const s = (k, max) => typeof row[k] === 'string' && row[k].trim() && row[k].length <= max;
  if (!s('headline', 80)) throw Error(id + ': 見出しを1〜80文字で入れてください');
  if (row.accent && (typeof row.accent !== 'string' || !accentRange(row.headline, row.accent))) throw Error(id + ': 強調する言葉が見出しの中にありません');
  if (!s('text', 160)) throw Error(id + ': 説明を1〜160文字で入れてください');
  if (row.badge !== undefined && (typeof row.badge !== 'string' || row.badge.length > 30)) throw Error(id + ': バッジは30文字まで');
  if (row.alt !== undefined && (typeof row.alt !== 'string' || row.alt.length > 120)) throw Error(id + ': 写真の説明は120文字まで');
  if (!ok.image(row.image)) throw Error(id + ': 写真がありません');
  if (row.effect !== undefined && !EFFECTS.includes(row.effect)) throw Error(id + ': 写真の上の演出が不正');
  if (!Array.isArray(row.buttons) || row.buttons.length < 1 || row.buttons.length > 2) throw Error(id + ': ボタンは1〜2つ');
  for (const b of row.buttons) {
    if (!b || typeof b.label !== 'string' || !b.label.trim() || b.label.length > 30) throw Error(id + ': ボタンの文字を1〜30文字で入れてください');
    if (!STYLES[b.style]) throw Error(id + ': ボタンの色が不正');
    if (!(ok.link(b.href) || /^#[a-z][a-z0-9-]{0,40}$/.test(String(b.href || '')))) throw Error(id + ': ボタンのリンク先がサイトにありません: ' + b.href);
  }
  return row;
}
function card(row, first) {
  const tag = first ? 'h1' : 'h2';
  const wh = imageSize(row.image);
  // スマホ用の小さい写真（同じ名前の -1100.webp。tools/optimize-images.py --hero で作る）があれば、画面に合う方をブラウザが選ぶ。無ければ元の写真だけ。
  // 写真は高さ220pxに合わせて切り抜くので、横幅はどの画面でも約580px分を描く（sizes）
  const small = String(row.image).replace(/\.(jpe?g|png)$/i, '-1100.webp');
  const srcset = small !== row.image && fs.existsSync(path.join(root, small)) && wh && wh[0] > 1100 ? ' srcset="' + esc(small) + ' 1100w, ' + esc(row.image) + ' ' + wh[0] + 'w" sizes="580px"' : '';
  const img = '<img src="' + esc(row.image) + '"' + srcset + ' alt="' + esc(row.alt || '') + '"' + (wh ? ' width="' + wh[0] + '" height="' + wh[1] + '"' : '') + (first ? ' fetchpriority="high"' : ' loading="lazy"') + '>';
  const fx = row.effect || 'petals';
  const petals = fx === 'none' ? '' : ['l1', 'l2', 'l3', 'r1', 'r2', 'r3'].map(c => '<i class="pt ' + c + '"></i>').join('');
  const btns = row.buttons.map(b => '<a class="btn ' + STYLES[b.style] + '" href="' + esc(b.href) + '">' + esc(b.label) + '</a>').join('');
  return '<div class="main-bn" data-promo-id="' + esc(row.id) + '"' + (row.theme && row.theme !== 'cream' ? ' data-theme="' + esc(row.theme) + '"' : '') + (fx !== 'petals' ? ' data-fx="' + fx + '"' : '') + '><div class="ph">' + img + petals + '</div>\n' +
    '  <div class="tx">' + (row.badge && row.badge.trim() ? '<span class="pill">' + esc(row.badge) + '</span>' : '') + '<' + tag + '>' + headlineHtml(row.headline, row.accent) + '</' + tag + '>\n' +
    '   <p>' + esc(row.text) + '</p>\n' +
    '   <div class="btns">' + btns + '</div></div></div>';
}
// 掲載中のメッセージのカードを並び順に。最初の1枚の見出しがページの見出し（h1）になる
function html(rows) {
  return rows.filter(r => r.kind === 'message').map((r, i) => card(r, i === 0)).join('\n');
}
module.exports = { check, html, headlineHtml, accentRange, EFFECTS };
