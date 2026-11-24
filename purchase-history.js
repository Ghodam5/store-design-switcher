/* 購入時の記録は不変。現在の商品・SKUと状態は別に参照する。DB・カートへの書込は行わない。 */
(function(){
'use strict';
function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
const data=freeze(window.DEMO_PURCHASE_HISTORY||{orders:[],availability:{}});
function resolve(line,catalog,states){
 const productState=states[line.productId],explicit=productState?.skus?.[line.skuCode],p=catalog.get(line.productId);
 if(productState?.status==='discontinued')return {key:'discontinued',label:'販売終了',message:'この商品は販売を終了しました。ご購入時の記録は引き続きご確認いただけます。'};
 const sku=p&&p.id===line.productId&&p.skus.find(s=>s.code===line.skuCode);
 if(!p||!sku||!explicit||!['available','soldout'].includes(explicit.status))return {key:'unknown',label:'商品状況を確認中',message:'現在の商品情報を確認できません。販売終了と決まったものではありません。'};
 if(explicit.status==='soldout')return {key:'soldout',label:'売り切れ',message:'現在はご購入いただけません。再入荷についてはお問い合わせください。'};
 return {key:'available',label:'現在も購入できます',message:'現在の価格・仕様を商品ページでご確認ください。',url:'item.html?id='+encodeURIComponent(p.id)};
}
function total(order){return order.lines.reduce((sum,l)=>sum+l.snapshot.unitPrice*l.snapshot.quantity,0);}
window.PurchaseHistory=Object.freeze({orders:data.orders,resolve,total});
const root=document.getElementById('history-orders');if(!root)return;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>n.toLocaleString('ja-JP')+'円';
const date=s=>{const [y,m,d]=s.split('-');return y+'年'+Number(m)+'月'+Number(d)+'日';};
function renderLine(line){
 const snap=line.snapshot,state=resolve(line,window.ShopCatalog,data.availability);
 const photo=snap.image?'<img src="'+esc(snap.image)+'" alt="" width="80" height="80" loading="lazy">':'<span class="history-photo-empty" aria-hidden="true">写真なし</span>';
 const action=state.url?'<a class="history-action" href="'+esc(state.url)+'">商品を確認する <span aria-hidden="true">›</span></a>':state.key==='discontinued'?'<a class="history-action" href="category.html?g=food">ほかのギフトを探す <span aria-hidden="true">›</span></a>':'<a class="history-action" href="contact.html">商品について問い合わせる <span aria-hidden="true">›</span></a>';
 return '<li class="history-line" data-availability="'+state.key+'"><div class="history-photo">'+photo+'</div><div class="history-product"><h3>'+esc(snap.title)+'</h3><p class="history-at-purchase">購入時：'+money(snap.unitPrice)+' × '+snap.quantity+'個 <span>／ '+money(snap.unitPrice*snap.quantity)+'<small>税込</small></span></p><span class="history-badge is-'+state.key+'">'+state.label+'</span><p class="history-state-message">'+state.message+'</p>'+action+'</div></li>';
}
function render(){
 const year=document.getElementById('history-year').value,orders=data.orders.filter(o=>year==='all'||o.date.startsWith(year+'-'));
 root.innerHTML=orders.map(o=>'<article class="history-order" aria-labelledby="order-'+esc(o.id)+'"><header class="history-order-heading"><div><h3 id="order-'+esc(o.id)+'"><time datetime="'+esc(o.date)+'">'+date(o.date)+'</time></h3><p>注文番号 <span>'+esc(o.id)+'</span></p></div><span class="history-order-status">'+esc(o.status)+'</span></header><ul class="history-lines">'+o.lines.map(renderLine).join('')+'</ul><details class="history-detail"><summary>購入時の明細を見る</summary><div class="history-detail-body"><p class="history-detail-notice">以下はご購入時の記録です。現在の商品価格・販売状況とは異なる場合があります。</p>'+o.lines.map(l=>'<div class="history-snapshot"><h4>'+esc(l.snapshot.title)+'</h4><dl><div><dt>購入時の単価（税込）</dt><dd>'+money(l.snapshot.unitPrice)+'</dd></div><div><dt>数量</dt><dd>'+l.snapshot.quantity+'個</dd></div><div><dt>商品小計（税込）</dt><dd>'+money(l.snapshot.unitPrice*l.snapshot.quantity)+'</dd></div></dl>'+(l.snapshot.options.length?'<ul>'+l.snapshot.options.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'')+'</div>').join('')+'<p class="history-total">購入時の商品合計 <strong>'+money(total(o))+'</strong><span>税込・送料／手数料を除く</span></p></div></details></article>').join('');
 document.getElementById('history-count').textContent=orders.length+'件のご注文';document.getElementById('history-empty').hidden=orders.length>0;
}
document.getElementById('history-year').addEventListener('change',render);
document.getElementById('history-reset').addEventListener('click',()=>{document.getElementById('history-year').value='all';render();document.getElementById('history-year').focus();});
render();
})();
