/* 商品詳細の見本。元の商品・SKU・名入れ・カートデータを変更しない表示部品。 */
(function(){
'use strict';
var esc=OrderForm.escape;
function money(n){return n.toLocaleString('ja-JP')+'円'}
function crumbs(p,d){return '<nav class="crumb" aria-label="パンくず"><a href="top.html">ホーム</a>'+d.crumbs.map(function(c){return '<span>›</span><a href="'+esc(c.url)+'">'+esc(c.title)+'</a>'}).join('')+'<span>›</span><span aria-current="page">'+esc(p.title)+'</span></nav>'}
function fallback(p){return '<div class="detail-photo-empty"><span>商品画像を確認中です</span><p>写真は本店の商品情報でご確認いただけます。</p><a href="'+esc(p.sourceUrl)+'" target="_blank" rel="noopener">本店の商品情報を見る ↗</a></div>'}
function gallery(p,d){
 if(!d.photos.length)return fallback(p);
 return '<section class="detail-gallery" aria-label="商品写真"><div class="gal-track detail-gallery-track" tabindex="0" aria-label="商品写真。左右に移動して切り替え">'+d.photos.map(function(photo,i){return '<div class="detail-slide" role="group" aria-label="写真'+(i+1)+'／'+d.photos.length+'"><img src="'+esc(photo.src)+'" alt="'+esc(photo.alt)+'" width="'+photo.width+'" height="'+photo.height+'" '+(i?'loading="lazy"':'fetchpriority="high"')+'></div>'}).join('')+'</div>'+(d.photos.length>1?'<div class="detail-gallery-controls"><button type="button" data-photo-prev aria-label="前の写真">‹</button><span class="detail-photo-count" aria-live="polite">1 / '+d.photos.length+'</span><span class="detail-swipe-hint">左右にスワイプ</span><button type="button" data-photo-next aria-label="次の写真">›</button></div><div class="detail-thumbs" aria-label="商品写真を選ぶ">'+d.photos.map(function(photo,i){return '<button type="button" data-photo="'+i+'" aria-label="写真'+(i+1)+'を表示" aria-pressed="'+(i===0)+'"><img src="'+esc(photo.src)+'" alt="" width="'+photo.width+'" height="'+photo.height+'"></button>'}).join('')+'</div>':'<p class="detail-one-photo">本店掲載の商品写真</p>')+'<button type="button" class="detail-zoom-button" data-photo-zoom>写真を拡大する ⊕</button></section>';
}
function content(d,p){
 var main=d.sections.filter(function(s){return s.title!=='ご注文の前に'}),notice=d.sections.filter(function(s){return s.title==='ご注文の前に'});
 function renderSections(sections){return sections.map(function(s){return s.blocks.map(function(b){if(b.type==='h3')return '<h3>'+esc(b.text)+'</h3>';if(b.type==='ul')return '<ul>'+b.items.map(function(t){return '<li>'+esc(t)+'</li>'}).join('')+'</ul>';return '<p>'+esc(b.text)+'</p>'}).join('')}).join('')}
 return '<nav class="chips detail-jumps" aria-label="商品情報の見出し"><a href="#detail-description">商品説明</a><a href="#detail-specs">商品仕様</a>'+(notice.length?'<a href="#detail-notes">ご注文の前に</a>':'')+'<a href="#detail-related">関連商品</a></nav><section class="detail-section" id="detail-description"><h2>商品について</h2><div class="detail-prose">'+renderSections(main)+'</div></section><section class="detail-section" id="detail-specs"><h2>商品仕様</h2><table class="spec detail-spec"><tbody>'+d.specs.map(function(s){return '<tr><th scope="row">'+esc(s.label)+'</th><td>'+esc(s.value)+'</td></tr>'}).join('')+'</tbody></table></section>'+(notice.length?'<section class="detail-section detail-notes" id="detail-notes"><h2>ご注文の前に</h2><div class="detail-prose">'+renderSections(notice)+'</div></section>':'');
}
function help(p){
 var refs=[['quantity','数量・日付の入力','スマホで回して選ぶ／直接入力する']];
 if(p.hasName)refs.push(['personalization','名入れ・刺繍の注文方法','必要な項目・文字数・追加料金の確認']);
 if(p.id==='47484'||p.id==='72349')refs.push(['wrapping','熨斗・包装の選び方','カートで希望の内容を指定']);
 if(p.id==='21013')refs.push(['bag','袋のサイズの選び方','幅・高さ・マチを確認']);
 if(p.id==='72349')refs.push(['catalog','カタログギフトの確認点','コース内訳・有効期限を確認']);
 return '<section class="detail-section"><h2>選び方・ご注文ガイド</h2><div class="detail-help-links">'+refs.map(function(r){return '<a href="product-guide.html?id='+p.id+'#'+r[0]+'">'+r[1]+' ›<span>'+r[2]+'</span></a>'}).join('')+'</div></section>';
}
function related(d){
 var products=d.relatedIds.map(ShopCatalog.get).filter(Boolean);if(!products.length)return '';
 return '<section class="rowsec detail-related" id="detail-related"><div class="row-h"><h2>あわせて見たい商品</h2><a class="all" href="'+esc(d.crumbs[d.crumbs.length-1].url)+'">同じカテゴリを見る ›</a></div><div class="rail-wrap"><button class="rail-nav prev" type="button" aria-label="前の関連商品へ">‹</button><div class="rail">'+products.map(function(p){return '<a class="prod" href="'+ShopCatalog.link(p)+'"><div class="ph">'+(p.image?'<img src="'+esc(p.image)+'" alt="'+esc(p.title)+'" width="520" height="520" loading="lazy">':'<span class="detail-related-noimage">商品画像を確認中です</span>')+'</div><div class="b"><h3>'+esc(p.title)+'</h3><div class="price">'+money(p.price)+'<small> 税込</small></div></div></a>'}).join('')+'</div><button class="rail-nav next" type="button" aria-label="次の関連商品へ">›</button></div></section>';
}
function backLink(d){var dest=d.crumbs[d.crumbs.length-1],url=dest.url;try{var ref=new URL(document.referrer);if(ref.origin===location.origin&&ref.pathname.endsWith('/category.html'))url=ref.pathname.split('/').pop()+ref.search}catch(e){}return '<a class="detail-back" href="'+esc(url)+'">‹ '+esc(dest.title)+'に戻る</a>'}
function bind(host,p,d){
 var track=host.querySelector('.detail-gallery-track'),index=0;
 function position(){if(!track)return;index=Math.max(0,Math.min(d.photos.length-1,Math.round(track.scrollLeft/Math.max(1,track.clientWidth))));host.querySelectorAll('[data-photo]').forEach(function(b){b.setAttribute('aria-pressed',String(Number(b.dataset.photo)===index))});var counter=host.querySelector('.detail-photo-count');if(counter)counter.textContent=(index+1)+' / '+d.photos.length;var prev=host.querySelector('[data-photo-prev]'),next=host.querySelector('[data-photo-next]');if(prev)prev.disabled=index===0;if(next)next.disabled=index===d.photos.length-1}
 function go(i){if(track)track.scrollTo({left:track.clientWidth*Math.max(0,Math.min(d.photos.length-1,i)),behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})}
 if(track){track.addEventListener('scroll',position,{passive:true});track.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();go(index+(e.key==='ArrowRight'?1:-1))}});host.querySelectorAll('[data-photo]').forEach(function(b){b.addEventListener('click',function(){go(Number(b.dataset.photo))})});var prev=host.querySelector('[data-photo-prev]'),next=host.querySelector('[data-photo-next]');if(prev)prev.addEventListener('click',function(){go(index-1)});if(next)next.addEventListener('click',function(){go(index+1)});position();window.addEventListener('resize',function(){track.scrollLeft=track.clientWidth*index;position()});
 track.querySelectorAll('img').forEach(function(img){img.addEventListener('error',function(){var slide=img.closest('.detail-slide');slide.innerHTML=fallback(p)},{once:true})});}
 if(track&&window.PhotoViewer){var zoom=host.querySelector('[data-photo-zoom]');function enlarge(trigger){PhotoViewer.open(d,index,trigger,function(n){track.scrollLeft=track.clientWidth*n;position()})}if(zoom)zoom.addEventListener('click',function(){enlarge(zoom)});track.querySelectorAll('img').forEach(function(img){img.addEventListener('click',function(){enlarge(zoom||track)})});}
 var rail=host.querySelector('.detail-related .rail');if(rail){host.querySelectorAll('.detail-related .rail-nav').forEach(function(button){button.addEventListener('click',function(){rail.scrollBy({left:rail.clientWidth*.85*(button.classList.contains('next')?1:-1),behavior:'smooth'})})});}
}
window.ProductDetail={crumbs:crumbs,gallery:gallery,content:content,help:help,related:related,backLink:backLink,bind:bind};
})();
