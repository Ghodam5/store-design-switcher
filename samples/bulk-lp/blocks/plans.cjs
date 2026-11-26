// 部品：予算別のおまかせプラン例（写真カード）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="blp-plans">${b.items.map(x => `<article>${img(x.photo, '')}<div><p class="blp-plan-price">${esc(x.price)}${x.tag ? `<em>${esc(x.tag)}</em>` : ''}</p><h3>${esc(x.label)}</h3><p>${esc(x.text)}</p></div></article>`).join('')}</div>${b.note ? `<p class="blp-note">${esc(b.note)}</p>` : ''}`);
