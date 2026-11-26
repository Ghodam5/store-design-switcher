// 部品：ご相談から販売開始までの流れ図（スマホは縦、PCは横に並ぶ。だれがする段階かで色を分ける）
const { esc, head, sec } = require('./_util.cjs');
const cls = w => w === 'ルナルーチェ' ? 'us' : w === '一緒に' ? 'both' : 'you';
module.exports = b => sec(b, `${head(b)}<ul class="plp-legend"><li class="you">つくり手さま</li><li class="both">一緒に</li><li class="us">ルナルーチェ</li></ul>
<ol class="plp-flow">${b.steps.map((s, i) => `<li class="${cls(s.who)}"><span class="plp-flow-no">${i + 1}</span><b>${esc(s.label)}</b><small>${esc(s.who)}</small><p>${esc(s.text)}</p></li>`).join('')}</ol>`);
