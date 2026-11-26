// 部品：こんな時に（使う場面を写真で）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="cg-scenes">${b.items.map(s => `<article>${img(s.photo, s.alt || s.title, 500, 500)}<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div></article>`).join('')}</div>`);
