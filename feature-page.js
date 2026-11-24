(function(){
'use strict';
var root=document.querySelector('[data-feature]');if(!root)return;
var key=root.dataset.feature,definition=FEATURE_CATALOG.definitions[key],all=FEATURE_CATALOG.products.filter(function(p){return p.groups.indexOf(key)>=0}),pack='all';
document.querySelectorAll('.cats a').forEach(function(a){a.classList.toggle('on',(a.getAttribute('href')||'')==='category.html?g='+definition.group)});
var side=document.getElementById('sidecat');if(side)side.innerHTML='<h3>カテゴリ・特集</h3><ul><li class="cur"><a href="category.html?g='+definition.group+'">'+definition.groupTitle+'</a><ul>'+Object.values(FEATURE_CATALOG.definitions).filter(function(d){return d.group===definition.group}).map(function(d){return '<li'+(d===definition?' class="cur"':'')+'><a href="'+d.file+'">'+d.title+'</a></li>'}).join('')+'</ul></li><li><a href="category.html?g=all">すべての商品</a></li></ul>';
function esc(s){return String(s||'').replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function money(n){return n.toLocaleString('ja-JP')+'円'}
function card(p){
 var product=ShopCatalog.get(p.id),url=ShopCatalog.link(product),unit=p.pack===50?'セット':'個';
 var photo=p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" loading="lazy">':'<span class="feature-noimage">商品写真は準備中です</span>';
 var details=key==='bag'?'<p class="bag-description">'+esc(p.description)+'</p><dl><dt>サイズ</dt><dd>'+esc(p.size||'本店商品情報をご確認ください')+'</dd><dt>材質</dt><dd>'+esc(p.material)+'</dd></dl>':'';
 return '<article class="feature-product" id="product-'+p.id+'"><a class="feature-photo" href="'+url+'" aria-label="'+esc(p.title)+'の商品ページを開く">'+photo+'</a><div class="feature-product-body"><p class="product-code">'+esc(p.code)+'</p><h2><a href="'+url+'">'+esc(p.title)+'</a></h2><p class="feature-price">'+money(p.price)+(p.maxPrice>p.price?'〜':'')+'<small>税込'+(key==='bag'?'／'+(p.pack===50?'50個セット':'1個'):'')+'</small></p>'+details+'<form class="bag-buy" data-add="'+p.id+'"><label for="quantity-'+p.id+'">数量（'+unit+'）</label><div><input id="quantity-'+p.id+'" name="quantity" data-quantity-picker type="number" min="1" max="999" step="1" value="1" required inputmode="numeric"><button class="btn co" type="submit">ダミーカートに入れる</button></div><p class="cart-feedback" role="status" aria-live="polite"></p></form><a class="source-link" href="'+url+'">商品詳細・タイプ選択'+(product.hasName?'・名入れ試験':'')+'へ</a><a class="source-link" href="'+esc(p.url)+'" target="_blank" rel="noopener">本店の商品情報を見る ↗</a></div></article>';
}
function render(){
 var products=all.filter(function(p){return pack==='all'||(pack==='set'?p.pack===50:p.pack===1)}),order=document.getElementById('feature-sort').value;
 if(order==='low')products.sort(function(a,b){return a.price-b.price});if(order==='high')products.sort(function(a,b){return b.price-a.price});
 document.getElementById('feature-count').textContent=products.length+'件の商品';document.getElementById('feature-products').innerHTML=products.map(card).join('');
}
document.getElementById('feature-sort').addEventListener('change',render);
root.querySelectorAll('[data-pack]').forEach(function(b){b.addEventListener('click',function(){pack=b.dataset.pack;root.querySelectorAll('[data-pack]').forEach(function(x){x.classList.toggle('on',x===b);x.setAttribute('aria-pressed',String(x===b))});render()})});
root.addEventListener('submit',function(e){var f=e.target.closest('[data-add]');if(!f)return;e.preventDefault();var feedback=f.querySelector('.cart-feedback');try{DemoCart.add(f.dataset.add,f.elements.quantity.value);feedback.innerHTML='追加しました。<a href="sample-cart.html">カートを確認する</a>'}catch(err){feedback.textContent=err.message}});
render();if(location.hash)requestAnimationFrame(function(){var target=document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView()});
})();
