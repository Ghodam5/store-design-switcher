// 部品：注意書き（テーマごとの箱。省略せず全部出す）
const { esc, head, sec, check } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="rlp-notes">${b.groups.map((g, i) => `<article><h3><span>${i + 1}</span>${esc(g.title)}</h3><ul>${g.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></article>`).join('')}</div>${check(b.check)}`);
