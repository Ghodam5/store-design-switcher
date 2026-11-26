// 部品：こんな方に（吹き出しの形で並べる）
const { esc, head, sec, icon } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<ul class="plp-who">${b.items.map((x, i) => `<li class="c${i % 5}"><span class="plp-ic">${icon(x.icon)}</span><p>${esc(x.text)}</p></li>`).join('')}</ul>`);
