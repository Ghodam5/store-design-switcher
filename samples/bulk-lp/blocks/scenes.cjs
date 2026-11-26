// 部品：使う場面の写真グリッド（グループごとに3枚）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}${b.groups.map(g => `<div class="blp-scene-group"><h3>${esc(g.label)}</h3><div class="blp-scene-grid">${g.items.map(x => `<figure>${img(x.photo, x.label)}<figcaption>${esc(x.label)}</figcaption></figure>`).join('')}</div></div>`).join('')}${b.note ? `<p class="blp-note">${esc(b.note)}</p>` : ''}`);
