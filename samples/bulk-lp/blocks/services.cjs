// 部品：企業・式場向けサービス（写真＋説明＋注意）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="blp-services">${b.items.map(x => `<article>${img(x.photo, '')}<div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${x.notes.length ? `<ul>${x.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}</div></article>`).join('')}</div>`);
