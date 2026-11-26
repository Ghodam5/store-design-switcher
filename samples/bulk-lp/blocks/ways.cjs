// 部品：選び方（写真つきカードを横に並べる）
const { esc, img, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="blp-ways">${b.items.map((x, i) => `<article>${img(x.photo, x.alt || '', 1400, 1000)}<div><span class="blp-ways-no">${i + 1}</span><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p>${x.link ? `<a class="blp-ways-link" href="${esc(x.link.href)}">${esc(x.link.label)} ›</a>` : ""}</div></article>`).join('')}</div>${b.note ? `<p class="blp-note">${esc(b.note)}</p>` : ''}`);
