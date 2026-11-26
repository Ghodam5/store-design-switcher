// 部品：特典（アイコン＋見出し＋説明）。本店の画像の丸い札を、絵と文字に分けて作り直したもの
const { esc, head, sec } = require('./_util.cjs');
const icon = require('./_icons.cjs');
module.exports = b => sec(b, `${head(b)}<ul class="blp-benefits">${b.items.map((x, i) => `<li class="c${i % 5}"><span class="blp-badge">${icon(x.icon)}</span><b>${esc(x.label)}</b><span>${esc(x.text)}</span></li>`).join('')}</ul>`);
