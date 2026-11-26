// 部品：よくあるご質問（開いて読む）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="cg-faq">${b.items.map(q => `<details><summary>${esc(q.q)}</summary><p>${esc(q.a)}</p></details>`).join('')}</div>`);
