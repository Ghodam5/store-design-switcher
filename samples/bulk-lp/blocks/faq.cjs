// 部品：よくあるご質問（開いて読む形）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="blp-faq">${b.items.map((x, i) => `<details${i === 0 ? " open" : ""}><summary>${esc(x.q)}</summary><p>${esc(x.a)}</p></details>`).join('')}</div>`);
