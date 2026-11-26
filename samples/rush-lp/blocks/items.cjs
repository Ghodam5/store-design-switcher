// 部品：特急に対応した商品（グループごとの絞り込みボタン＋商品カード）
// 商品名・価格・写真・通常の届く日数は site-src/products/<ID>.json から読む（ページに手で書かない）。
// 本番では OMS の「特急対応」の印が付いた商品を自動で並べる想定。
const fs = require('fs'), path = require('path');
const { esc, img, head, sec } = require('./_util.cjs');
const ROOT = path.resolve(__dirname, '../../..');
const load = id => JSON.parse(fs.readFileSync(path.join(ROOT, 'site-src/products', id + '.json'), 'utf8')).product;
const clean = t => t.replace(/【[^】]*】/g, '').replace(/…$/, '').trim();
module.exports = b => {
  const all = b.groups.flatMap(g => g.ids.map(id => ({ g: g.key, p: load(id) })));
  const chips = `<div class="rlp-chips" role="group" aria-label="商品の種類で絞り込む"><button type="button" aria-pressed="true" data-g="all">すべて <small>${all.length}</small></button>${b.groups.map(g => `<button type="button" aria-pressed="false" data-g="${esc(g.key)}">${esc(g.label)} <small>${g.ids.length}</small></button>`).join('')}</div>`;
  const cards = all.map(({ g, p }) => `<a class="rlp-item" data-g="${esc(g)}" href="item.html?id=${esc(p.id)}">${img(p.image, clean(p.title), 520, 520)}<span class="rlp-item-tag">特急OK</span><b>${esc(clean(p.title))}</b><span class="rlp-item-price">${p.price.toLocaleString('ja-JP')}<small>円（税込）〜</small></span><span class="rlp-item-days">通常：${esc(p.delivery?.label || '')}</span></a>`).join('');
  const js = `<script>(function(){var s=document.getElementById(${JSON.stringify(b.id)});if(!s)return;s.addEventListener('click',function(e){var t=e.target.closest('button[data-g]');if(!t)return;var g=t.dataset.g;s.querySelectorAll('button[data-g]').forEach(function(x){x.setAttribute('aria-pressed',x===t?'true':'false')});s.querySelectorAll('.rlp-item').forEach(function(a){a.hidden=!(g==='all'||a.dataset.g===g)})})})();</script>`;
  return sec(b, `${head(b)}${chips}<div class="rlp-items">${cards}</div>${js}`);
};
