// 部品：ご予算から選ぶ（価格の帯ごとにコースを並べる。中身は商品データから自動）
const { esc, yen, head, sec } = require('./_util.cjs');
module.exports = (b, ctx) => sec(b, `${head(b)}<div class="cg-budget">${b.bands.map(band => {
  const list = ctx.courses.filter(c => c.price >= band.min && c.price < (band.max ?? Infinity));
  return `<div class="cg-band"><div class="cg-band-h"><b>${esc(band.label)}</b><span>${esc(band.who)}</span></div><ul>${list.map(c => `<li><a class="br-${esc(c.brand)}" href="item.html?id=${esc(c.ids[0].id)}"><small>${esc(c.brandName)}</small>${esc(c.short)}<em>${yen(c.price)}</em></a></li>`).join('')}</ul></div>`;
}).join('')}</div>${b.note ? `<p class="cg-note">${esc(b.note)}</p>` : ''}`);
