// 部品：特典の丸いバッジ
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<ul class="blp-benefits">${b.items.map((x, i) => `<li class="c${i % 5}"><b>${esc(x.label)}</b><span>${esc(x.text)}</span></li>`).join('')}</ul>`);
