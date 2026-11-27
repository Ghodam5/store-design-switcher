// 部品：提携商品のご紹介（協力先ごとにまとめ、商品写真を並べる。href がある商品だけリンクにする）
const { esc, img, head, sec } = require('./_util.cjs');
const card = (it, b) => {
  const inner = `<span class="plp-card-ph">${img(it.photo, it.name, 650, 650)}<em>${esc(b.badge || "提携商品")}</em></span><b>${esc(it.name)}</b>${it.sub ? `<small>${esc(it.sub)}</small>` : ''}${it.href ? '<span class="plp-card-go">商品を見る ›</span>' : ''}`;
  return it.href ? `<a class="plp-card" href="${esc(it.href)}">${inner}</a>` : `<div class="plp-card">${inner}</div>`;
};
module.exports = b => sec(b, `${head(b)}${b.groups.map(g => `<div class="plp-show">
<div class="plp-show-head"><h3>${esc(g.label)}</h3><p><span class="plp-hand" aria-hidden="true">🤝</span>${esc(g.partner)}</p></div>
<div class="plp-show-grid n${g.items.length}">${g.items.map(it => card(it, b)).join('')}</div></div>`).join('')}${b.note ? `<p class="plp-note">${esc(b.note)}</p>` : ''}`);
