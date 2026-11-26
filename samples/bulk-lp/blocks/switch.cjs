// 部品：2つの大口ページを行き来する入口（今いるページを色で示す）
const { esc, sec } = require('./_util.cjs');
module.exports = b => sec(b, `<p class="blp-switch-q">${esc(b.question)}</p><nav class="blp-switch" aria-label="${esc(b.question)}">${b.items.map(x => `<a href="${esc(x.href)}"${x.current ? ' aria-current="page" class="on"' : ''}><small>${esc(x.if)}</small><b>${esc(x.label)}</b><span>${esc(x.text)}</span></a>`).join('')}</nav>`);
