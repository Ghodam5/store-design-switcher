/* お店の案内・送料・税率（v69）。編集元は OMS の「お店の案内・送料・税率」→ site-src/store-info.json・product-tax.json。
   ・税率は「切替日」ごとの表。オンの行のうち、今日までで一番新しい行を使う（日本時間）。
   ・商品の価格は「価格の基準日」の税率で税込になっている。食品の税率が変わった日からは、税抜に戻してから新しい税率で税込にし直す。
   ・税の種類が set（食品と雑貨のセット・税理士さんに確認中）の商品は、価格を自動で変えない。
   ・ヘッダーの案内バー［data-store-bar］・フッターの「お届けと送料」［data-store-footer］・送料表［data-store-ship-table］をここで描く。 */
(function(){
'use strict';
var I=window.STORE_INFO;if(!I)return;
// v73 速度対策：日付の書式は1回だけ作って使い回す（商品の数だけ作ると重い）
var jstFmt=null;function today(){try{jstFmt=jstFmt||new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'});return jstFmt.format(new Date())}catch(e){return new Date().toISOString().slice(0,10)}}
var rates=I.tax.rates.filter(function(r){return r.active}).sort(function(a,b){return a.from<b.from?-1:1});
function rowOn(date){var row=rates[0];rates.forEach(function(r){if(r.from<=date)row=r});return row}
function rateOn(cls,date){var r=rowOn(date||today());return r[cls]!=null?r[cls]:r.standard}
function taxClass(id){return (I.productTax.products||{})[String(id)]||I.productTax.default}
function round(n){return I.tax.rounding==='round'?Math.round(n):Math.floor(n+1e-9)}
// 基準日の税込価格 → その日の税込価格
function price(id,basePrice,date){var c=taxClass(id);if(c==='set'||!Number.isFinite(basePrice))return basePrice;
  var r0=rateOn(c,I.tax.priceBasisDate),r1=rateOn(c,date);if(r0===r1)return basePrice;
  return round(Math.round(basePrice/(1+r0/100))*(1+r1/100))}
// 税抜（送料無料の判定に使う）。set は標準税率で割る（判定が甘くならないように）
function excl(id,inclPrice,date){var c=taxClass(id);return Math.round(inclPrice/(1+rateOn(c==='set'?'standard':c,date)/100))}
function money(n){return Number(n).toLocaleString('ja-JP')}
function fee(r){return money(r.fee)+'円（'+(r.feeBasis==='incl'?'税込':'税別')+'）'}
function fill(t){return String(t).replace(/{free}/g,money(I.shipping.freeThreshold)).replace(/{fee:([a-z0-9-]+)}/g,function(_,id){var r=I.shipping.regions.find(function(x){return x.id===id});return r?fee(r):''})}
// カートの合計（rows: [{id, price(税込・その日の価格), qty}]）。送料無料まであといくらか（税別か税込かは設定どおり）
function freeLeft(rows,date){var s=0;rows.forEach(function(x){var n=x.price*x.qty;s+=I.shipping.freeBasis==='excl'?excl(x.id,n,date):n});return Math.max(0,I.shipping.freeThreshold-s)}
function applyCatalog(list){(list||[]).forEach(function(p){if(!p||p.basisPrice!=null)return;p.basisPrice=p.price;p.price=price(p.id,p.price);(p.skus||[]).forEach(function(s){if(s.basisPrice==null){s.basisPrice=s.price;s.price=price(p.id,s.price)}})})}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function draw(){
  document.querySelectorAll('[data-store-bar]').forEach(function(el){var on=I.bar.filter(function(b){return b.active});el.hidden=!on.length;
    el.innerHTML='<div class="wrap store-bar-in">'+on.map(function(b){return '<a href="'+esc(b.href)+'"><b>'+esc(b.label)+'</b>'+esc(fill(b.text))+'</a>'}).join('')+'</div>'});
  document.querySelectorAll('[data-store-footer]').forEach(function(el){var on=I.footer.lines.filter(function(l){return l.active});el.hidden=!on.length;
    el.innerHTML='<h2>'+esc(I.footer.title)+'</h2><ul>'+on.map(function(l){return '<li>'+esc(fill(l.text))+'</li>'}).join('')+'</ul><p class="store-ft-links"><a href="shipping.html">送料・お届けのご案内 ›</a><a href="bulk-order.html">大口注文のご相談 ›</a><a href="overseas-shipping.html">海外発送について ›</a></p>'});
  document.querySelectorAll('[data-store-ship-table]').forEach(function(el){var s=I.shipping,bb=(s.freeBasis==='excl'?'税別':'税込')+money(s.freeThreshold)+'円',lo=bb+'未満',hi=bb+'以上・送料無料商品';
    el.innerHTML='<table class="store-ship"><thead><tr><th scope="col">配送先</th><th scope="col">ご購入金額 '+(s.freeBasis==='excl'?'税別':'税込')+money(s.freeThreshold)+'円未満</th><th scope="col">'+(s.freeBasis==='excl'?'税別':'税込')+money(s.freeThreshold)+'円以上・送料無料商品</th></tr></thead><tbody>'+s.regions.map(function(r){return '<tr><th scope="row">'+esc(r.name)+'</th><td data-l="'+lo+'">'+fee(r)+'</td><td data-l="'+hi+'">'+(r.freeApplies?'<b>送料無料</b>':fee(r))+'</td></tr>'}).join('')+'</tbody></table>'+(s.notes||[]).map(function(n){return '<p class="note">※'+esc(fill(n))+'</p>'}).join('')});
}
window.LunaStore=Object.freeze({today:today,rateOn:rateOn,taxClass:taxClass,price:price,excl:excl,freeLeft:freeLeft,fill:fill,applyCatalog:applyCatalog,info:I,draw:draw});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',draw);else draw();
})();
