// 部品：大口注文になる条件（大きな数字＋注意）と、条件に届かない方への案内
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="blp-cond">${b.items.map(x => `<div class="blp-cond-item"><b>${esc(x.big)}</b><strong>${esc(x.label)}</strong><span>${esc(x.note)}</span></div>`).join('<p class="blp-or">または</p>')}</div>
${b.aside ? `<aside class="blp-aside"><strong>${esc(b.aside.title)}</strong><span>${esc(b.aside.text)}</span><a href="${esc(b.aside.link.href)}">${esc(b.aside.link.label)} ›</a></aside>` : ''}`);
