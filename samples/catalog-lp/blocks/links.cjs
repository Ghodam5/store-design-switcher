// 部品：あわせて読みたいページ
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="cg-links">${b.items.map(l => `<a href="${esc(l.href)}"><b>${esc(l.title)} ›</b><span>${esc(l.text)}</span></a>`).join('')}</div>`);
