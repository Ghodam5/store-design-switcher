// 部品：提携商品の募集（写真＋説明、しくみの図、ルナルーチェがすること4つ）
const { esc, img, head, sec, icon } = require('./_util.cjs');
const col = (c, k) => `<div class="plp-how-box ${k}"><b>${esc(c.title)}</b><ul>${c.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
const how = h => !h ? '' : `<div class="plp-how" aria-label="提携のしくみ">${col(h.you, 'you')}<span class="plp-how-arrow"><small>${esc(h.link)}</small></span>${col(h.us, 'us')}<span class="plp-how-arrow"><small>お届け</small></span>${col(h.to, 'to')}</div>`;
module.exports = b => sec(b, `<div class="plp-offer"><div class="plp-offer-ph">${img(b.photo, '', 650, 470)}</div><div>${head(b)}</div></div>
${how(b.how)}
<ul class="plp-points">${b.points.map((p, i) => `<li class="c${i % 4}"><span class="plp-ic">${icon(p.icon)}</span><b>${esc(p.title)}</b><p>${esc(p.text)}</p></li>`).join('')}</ul>`);
