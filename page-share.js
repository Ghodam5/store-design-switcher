(()=>{'use strict';
const base='https://ghodam5.github.io/lunaluce-sample/';
const file=location.pathname.split('/').pop()||'top.html',query=new URLSearchParams(location.search);
let bar=document.querySelector('[data-share-page="top"]'),product=null;
const host=document.getElementById('sample-item');
if(host){
 const buy=host.querySelector('#product-buy');if(!buy)return;
 product=window.ShopCatalog&&ShopCatalog.get(query.get('id')||'ecoflavor-104-101');if(!product)return;
 bar=document.createElement('div');bar.className='page-share';bar.dataset.sharePage='item';const slot=host.querySelector('[data-share-slot]');if(slot){slot.replaceWith(bar);bar.classList.add('page-share-below');}else buy.after(bar);
}
if(!bar){
 const heading=document.querySelector('main h1,.review-wrap h1,h1');if(!heading)return;
 const anchor=heading.closest('.page-h,.guide-hero,.feature-heading')||heading;
 bar=document.createElement('div');bar.className='page-share';bar.dataset.sharePage='page';anchor.after(bar);
}
const privatePage=['sample-cart.html','mypage.html','index.html','checkout.html','login.html','register.html','contact.html','survey.html','tailor-input.html'].includes(file);
const url=new URL(product?'item.html':privatePage?'top.html':file,base);
if(product)url.searchParams.set('id',String(product.id));
if(file==='article.html'&&/^entry-\d+$/.test(query.get('id')||''))url.searchParams.set('id',query.get('id'));
if(file==='category.html')for(const key of ['g','m','s']){const val=query.get(key);if(val&&/^[a-z0-9-]+$/i.test(val))url.searchParams.set(key,val);}
const title=privatePage?'ルナルーチェ｜名入れギフト・ブライダルグッズ':(document.querySelector('main h1,.review-wrap h1,h1')?.textContent.trim()||document.title)+'｜ルナルーチェ';
bar.setAttribute('role','group');bar.setAttribute('aria-label',product?'この商品をシェア':'このページをシェア');
const icon='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="3"/><circle cx="18" cy="5" r="3"/><circle cx="18" cy="19" r="3"/><path d="m8.5 10.5 7-4M8.5 13.5l7 4"/></svg>';
bar.innerHTML='<div class="share-label"><span class="share-caption">'+(privatePage?'お店をシェア':product?'この商品をシェア':'このページをシェア')+'</span><span class="share-tools"><button class="share-control share-native" type="button" aria-label="ほかのアプリへ共有" title="ほかのアプリへ共有" hidden>'+icon+'</button><button class="share-control share-copy" type="button" title="リンクをコピー"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M15 8V4H4v11h4"/></svg><span>コピー</span></button></span></div><div class="share-actions"><span class="share-platforms"></span></div><p class="share-status" role="status" aria-live="polite"></p><input class="share-manual" aria-label="共有するページのリンク" readonly hidden><div class="share-instagram-help" hidden><p>共有メニューにInstagramが表示されない場合は、リンクをコピーしてメッセージなどに貼り付けて使ってください。</p><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">Instagramを開く ↗</a><button class="share-help-close" type="button" aria-label="Instagramの案内を閉じる">閉じる</button></div>';
const platforms=bar.querySelector('.share-platforms'),native=bar.querySelector('.share-native'),copy=bar.querySelector('.share-copy'),status=bar.querySelector('.share-status'),manual=bar.querySelector('.share-manual'),help=bar.querySelector('.share-instagram-help');
let instagram;
for(const [name,key,endpoint,params] of [
 ['X','x-twitter','https://twitter.com/intent/tweet',{text:title,url:url.href}],
 ['LINE','line','https://social-plugins.line.me/lineit/share',{url:url.href}],
 ['Facebook','facebook-f','https://www.facebook.com/sharer/sharer.php',{u:url.href}],
 ['Instagram','instagram',null,null],
 ['Threads','threads','https://www.threads.com/intent/post',{text:title,url:url.href}]
]){
 const control=document.createElement(endpoint?'a':'button');control.className='share-control share-brand';control.dataset.network=key;control.title=name;control.setAttribute('aria-label',name+'で共有'+(endpoint?'（別の画面で開きます）':'（共有方法を表示）'));
 const image=document.createElement('img');image.src='images/social/'+key+'.svg';image.width=20;image.height=20;image.alt='';control.append(image);
 if(endpoint){const target=new URL(endpoint);Object.entries(params).forEach(([k,v])=>target.searchParams.set(k,v));control.href=target.href;control.target='_blank';control.rel='noopener noreferrer';}
 else{control.type='button';control.classList.add('share-instagram');control.setAttribute('aria-expanded','false');instagram=control;}
 platforms.append(control);
}
function updateCategory(){if(file!=='category.html')return;const q=new URLSearchParams(location.search);url.search='';for(const k of ['g','m','s']){const v=q.get(k);if(v&&/^[a-z0-9-]+$/i.test(v))url.searchParams.set(k,v);}const t=(document.getElementById('h1')?.textContent.trim()||'商品一覧')+'｜ルナルーチェ';for(const a of platforms.querySelectorAll('a')){const u=new URL(a.href);for(const k of ['url','u'])if(u.searchParams.has(k))u.searchParams.set(k,url.href);if(u.searchParams.has('text'))u.searchParams.set('text',t);a.href=u.href;}manual.value=url.href;}
const categoryHeading=document.getElementById('h1');if(file==='category.html'&&categoryHeading)new MutationObserver(updateCategory).observe(categoryHeading,{childList:true,subtree:true,characterData:true});
manual.value=url.href;copy.setAttribute('aria-label',(product?'この商品':'このページ')+'のリンクをコピー');
const mobile=matchMedia('(max-width:767px), (pointer:coarse)');let nativeFailed=false;
const nativeAvailable=()=>typeof navigator.share==='function'&&mobile.matches&&!nativeFailed;
function mode(){native.hidden=!nativeAvailable();}
mode();if(mobile.addEventListener)mobile.addEventListener('change',mode);else mobile.addListener(mode);
function hideHelp(){help.hidden=true;instagram.setAttribute('aria-expanded','false');}
function legacyCopy(){const active=document.activeElement,input=document.createElement('input');input.value=url.href;input.readOnly=true;input.style.cssText='position:fixed;left:-9999px;top:0;font-size:16px';document.body.append(input);input.select();let result=false;try{result=document.execCommand('copy');}finally{input.remove();if(active&&active.focus)active.focus({preventScroll:true});}return result;}
async function copyURL(message){
 status.textContent='';manual.hidden=true;
 try{if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(url.href);else if(!legacyCopy())throw Error('copy unavailable');status.textContent=message;return true;}
 catch{manual.hidden=false;manual.focus();manual.select();status.textContent='このリンクを選択してコピーしてください';return false;}
}
async function openNative(forInstagram){
 status.textContent=forInstagram?'共有先にInstagramが表示されたら選んでください。':'';native.disabled=true;instagram.disabled=true;
 try{await navigator.share({title:file==='category.html'?(document.getElementById('h1')?.textContent.trim()||'商品一覧')+'｜ルナルーチェ':title,url:url.href});}
 catch(error){if(error?.name==='AbortError')status.textContent='';else{nativeFailed=true;mode();if(forInstagram)await copyURL('リンクをコピーしました。Instagramに貼り付けて使ってください');else status.textContent='共有メニューを開けませんでした。SNSのロゴを選ぶか、リンクをコピーしてください。';}}
 finally{native.disabled=false;instagram.disabled=false;}
}
native.addEventListener('click',()=>{hideHelp();openNative(false);});
copy.addEventListener('click',()=>copyURL('リンクをコピーしました'));
instagram.addEventListener('click',()=>{help.hidden=false;instagram.setAttribute('aria-expanded','true');if(nativeAvailable())openNative(true);else copyURL('リンクをコピーしました。Instagramに貼り付けて使ってください');});
bar.querySelector('.share-help-close').addEventListener('click',()=>{hideHelp();instagram.focus();});
})();
