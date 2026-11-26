#!/usr/bin/env node
// トップページに「大口注文」と「提携商品」の入口を置いた見本 top-entry.html を作る（今の top.html は読むだけ）。
// ① 看板の横スクロールに1枚 ② 売れ筋TOP10の下に2枚並びの帯 ③「企画から発送まで」の下にリンク2つ ④ ご利用ガイドの小さなバナーは今のまま（提携は新ページへ）
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, 'entry.json'), 'utf8'));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const img = (s, w = 700, h = 500) => `<img src="${esc(s)}" alt="" width="${w}" height="${h}" loading="lazy" decoding="async">`;
const must = (h, k) => { if (!h.includes(k)) throw new Error('top.html に見つかりません: ' + k); };

let h = fs.readFileSync(path.join(ROOT, 'top.html'), 'utf8');
h = h.replace('<head>', '<head><base href="../../">').replace('</head>', '<link rel="stylesheet" href="samples/top-entry/top-entry.css?v=1"></head>')
  .replace(/<div class="sample-bar">[\s\S]*?<\/div>/, '<div class="sample-bar">見本：トップに「大口注文」「提携商品」の入口を置いた形（①看板 ②売れ筋の下の帯 ③企画から発送までの下）｜今のトップは変えていません</div>');

// ① 看板カード
const card = Object.assign({}, d.railCard); const pos = card.position; delete card.position; delete card._説明;
const k1 = '<script src="home-promos.js'; must(h, k1);
h = h.replace(k1, `<script>window.HOME_PROMOS.splice(${pos - 1},0,${JSON.stringify(card)});</script>` + k1);

// ② 帯
const b = d.band;
const band = `<section class="sec tep" data-block="business-band" aria-labelledby="tep-h"><div class="sh"><h2 id="tep-h">${esc(b.title)}</h2></div><div class="tep-grid">
<a class="tep-big" href="${esc(b.big.href)}"><span class="tep-ph">${img(b.big.photo, 1400, 1000)}</span><span class="tep-tx"><small>${esc(b.big.kicker)}</small><strong>${esc(b.big.title)}</strong><span>${esc(b.big.text)}</span><span class="tep-tags">${b.big.tags.map(t => `<i>${esc(t)}</i>`).join('')}</span><em>${esc(b.big.label)} ›</em></span></a>
<a class="tep-small" href="${esc(b.small.href)}"><span class="tep-ph2">${b.small.photos.map(p => img(p, 650, 650)).join('')}</span><span class="tep-tx"><small>${esc(b.small.kicker)}</small><strong>${esc(b.small.title)}</strong><span>${esc(b.small.text)}</span><em>${esc(b.small.label)} ›</em></span></a>
</div></section>`;
const k2 = '<section class="sec" style="padding-top:30px">'; must(h, k2);
h = h.replace(k2, band + k2);

// ③ 企画から発送まで
const k3 = '少ない数量のご相談もお気軽にお寄せください。</p>'; must(h, k3);
h = h.replace(k3, k3 + `<p class="tep-about">${d.aboutLinks.items.map(x => `<a href="${esc(x.href)}">${esc(x.label)} ›</a>`).join('')}</p>`);

// ④ ご利用ガイドの「提携商品募集」を新ページへ
h = h.replace('<a class="support-banner" href="partners.html">', '<a class="support-banner" href="samples/partner-lp/preview.html">');
fs.writeFileSync(path.join(__dirname, 'top-entry.html'), h);
console.log('samples/top-entry/top-entry.html を書き出しました');
