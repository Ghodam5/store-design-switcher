// 部品：冊子タイプとカードタイプの違い（写真＋見比べ表）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="cg-types"><figure>${img(b.photo, b.photoAlt, 1000, 640)}</figure><div class="cg-types-cols">${b.cols.map(c => `<article class="t-${esc(c.key)}"><h3>${esc(c.title)}</h3><p class="cg-types-catch">${esc(c.catch)}</p><dl>${b.rows.map((r, i) => `<div><dt>${esc(r)}</dt><dd>${esc(c.values[i])}</dd></div>`).join('')}</dl></article>`).join('')}</div></div>${b.note ? `<p class="cg-note">${esc(b.note)}</p>` : ''}`);
