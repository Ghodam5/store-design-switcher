// 部品：よくある質問（開いて読む形）
const { esc, head, sec, check } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="rlp-faq">${b.items.map(f => `<details><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p>${check(f.check)}</details>`).join('')}</div>`);
