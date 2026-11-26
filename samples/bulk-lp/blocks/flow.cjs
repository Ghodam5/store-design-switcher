// 部品：ご相談からお届けまでの流れ図（スマホは縦、PCは横に5つ）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<ol class="blp-flow">${b.steps.map((s, i) => `<li class="${s.who === 'お客さま' ? 'you' : 'us'}"><span class="blp-flow-no">${i + 1}</span><b>${esc(s.label)}</b><small>${esc(s.who)}</small><p>${esc(s.text)}</p></li>`).join('')}</ol>`);
