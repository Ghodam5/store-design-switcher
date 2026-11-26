// 部品：あなたに合う頼み方（金額で分ける）。合計の目安を計算して、見積もりか大口セット商品かを案内する
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}
${(b.routes||[]).length ? `<div class="blp-route">${b.routes.map(r => `<article class="blp-route-card ${esc(r.tone)}"><p class="blp-route-if">${esc(r.if)}</p><h3>${esc(r.title)}</h3><ul>${r.points.map(p => `<li>${esc(p)}</li>`).join('')}</ul><a class="blp-btn${r.tone === 'b' ? ' ghost' : ''}" href="${esc(r.link.href)}">${esc(r.link.label)}</a></article>`).join('')}</div>` : ''}
<div class="blp-calc" data-limit="${Number(b.calc.limit)}" data-qty="${Number(b.calc.qty)}"><h3>${esc(b.calc.title)}</h3>
<div class="blp-calc-row"><label>1個のお値段<input type="number" inputmode="numeric" min="1" value="${Number(b.calc.price0)}" data-c="price"><span>円</span></label><b>×</b><label>個数<input type="number" inputmode="numeric" min="1" value="${Number(b.calc.qty0)}" data-c="qty"><span>個</span></label></div>
<p class="blp-calc-out" aria-live="polite"></p></div>
<ul class="blp-examples">${b.examples.map(x => `<li><span>${esc(x.calc)}</span><b class="${esc(x.tone)}">${esc(x.result)}</b></li>`).join('')}</ul>
<script>(function(){var c=document.currentScript.previousElementSibling.previousElementSibling;var L=+c.dataset.limit,Q=+c.dataset.qty,p=c.querySelector('[data-c=price]'),q=c.querySelector('[data-c=qty]'),o=c.querySelector('.blp-calc-out');
function f(){var t=(+p.value||0)*(+q.value||0),ok=t>=L||(+q.value||0)>=Q;o.className='blp-calc-out '+(ok?'a':'b');o.innerHTML='合計 <b>'+t.toLocaleString('ja-JP')+'円</b>（目安） → '+(ok?'<strong>お見積もり（特別価格）</strong>でお受けします':'<strong>大口セット商品</strong>がおすすめです');}
p.addEventListener('input',f);q.addEventListener('input',f);f();})();</script>`);
