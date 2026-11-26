// 部品：こんなときに（写真つきカード3枚）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="rlp-scenes">${b.cards.map(c => `<article>${img(c.img, '', 520, 520)}<div><h3>${esc(c.title)}</h3><p>${esc(c.text)}</p></div></article>`).join('')}</div>`);
