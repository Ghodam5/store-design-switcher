/* 商品と名入れの試験用カート。旧バッグカートのID・数量も引き継ぐ。 */
(function(){
'use strict';
var KEY='lunaluce-demo-cart-v1',ORDER='lunaluce-demo-order-v2';
function item(id){return ShopCatalog.get(id)}
function qty(n){n=Number(n);if(!Number.isInteger(n)||n<1||n>999)throw Error('数量は1〜999の整数で入力してください。');return n}
function cleanValues(values){var out={};if(values&&typeof values==='object')Object.keys(values).forEach(function(k){if(/^f\d+$/.test(k))out[k]=String(values[k]).slice(0,5000)});return out}
function read(){try{var rows=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(rows))return [];var clean=[];rows.forEach(function(r){var p=r&&item(r.id);if(!p||!Number.isInteger(r.qty)||r.qty<1||r.qty>999)return;var sku=Number.isInteger(r.sku)&&r.sku>=0&&r.sku<p.skus.length?r.sku:0;var old=clean.find(function(x){return x.id===p.id&&x.sku===sku});if(old)old.qty=Math.min(999,old.qty+r.qty);else clean.push({id:p.id,qty:r.qty,sku:sku,enabled:r.enabled===true,values:cleanValues(r.values)})});return clean}catch(e){return []}}
function save(rows){try{localStorage.setItem(KEY,JSON.stringify(rows))}catch(e){throw Error('このブラウザではカートを保存できません。保存設定をご確認ください。')}updateBadges();window.dispatchEvent(new CustomEvent('democartchange'))}
function add(id,n,sku){var p=item(id);if(!p)throw Error('この商品はサンプルにありません。');n=qty(n);sku=Number(sku)||0;if(window.ShopServices&&p.skus[sku]&&ShopServices.stock(p,p.skus[sku].code).blocked)throw Error('このSKUは現在の販売状況を確認してください。');if(!Number.isInteger(sku)||sku<0||sku>=Math.max(1,p.skus.length))throw Error('商品のタイプを選び直してください。');var rows=read(),r=rows.find(function(r){return r.id===p.id&&r.sku===sku});if(r)r.qty=qty(r.qty+n);else rows.push({id:p.id,qty:n,sku:sku,enabled:false,values:{}});save(rows)}
function set(id,n,sku){n=qty(n);var rows=read(),r=rows.find(function(r){return r.id===id&&(sku===undefined||r.sku===sku)});if(!r)throw Error('商品がカートにありません。');r.qty=n;save(rows)}
function remove(id,sku){save(read().filter(function(r){return !(r.id===id&&(sku===undefined||r.sku===sku))}))}
function patch(id,sku,change){var rows=read(),r=rows.find(function(r){return r.id===id&&r.sku===sku});if(!r)return;if(change.enabled!==undefined)r.enabled=change.enabled===true;if(change.values)r.values=cleanValues(change.values);save(rows)}
function price(r){var p=item(r.id);return window.ShopServices?ShopServices.unit(p,r.sku,r.qty):(p.skus[r.sku]?p.skus[r.sku].price:p.price)}
function summary(){var s=read().reduce(function(s,r){var p=item(r.id);s.total+=price(r)*r.qty;s.pieces+=(p.pack||1)*r.qty;s.units+=r.qty;return s},{total:0,pieces:0,units:0}),c=campaignSummary();if(c){s.total+=c.total;s.pieces+=c.qty;s.units+=c.qty}return s}
function readOrder(){try{return JSON.parse(localStorage.getItem(ORDER)||'{}')||{}}catch(e){return {}}}
function saveOrder(value){try{localStorage.setItem(ORDER,JSON.stringify(value))}catch(e){throw Error('入力内容を保存できません。ブラウザの保存設定をご確認ください。')}}
function campaign(){return CampaignRules.check(read())}
function campaignSummary(){return CampaignRules.summary(readOrder().campaign,campaign())}
function addCampaign(selection,options){
 var state=campaign(),n=qty(selection.qty);if(!state.eligible||n>state.count)throw Error('カートの対象商品が20個以上、かつプチギフトは対象商品の数量までです。');
 var order=readOrder();order.campaign={qty:n,design:String(selection.design||''),named:selection.named===true,groom:selection.named?String(selection.groom||'').slice(0,100):'',bride:selection.named?String(selection.bride||'').slice(0,100):'',date:selection.named?String(selection.date||'').slice(0,100):''};
 if(options)Object.assign(order,options);saveOrder(order);updateBadges();window.dispatchEvent(new CustomEvent('democartchange'));
}
function removeCampaign(){var order=readOrder();delete order.campaign;saveOrder(order);updateBadges();window.dispatchEvent(new CustomEvent('democartchange'))}
function setCampaignQuantity(n){n=qty(n);var order=readOrder();if(!order.campaign)return;order.campaign.qty=n;saveOrder(order);updateBadges();window.dispatchEvent(new CustomEvent('democartchange'))}
window.DemoCart={read:read,add:add,set:set,remove:remove,patch:patch,summary:summary,price:price,readOrder:readOrder,saveOrder:saveOrder,campaign:campaign,campaignSummary:campaignSummary,addCampaign:addCampaign,removeCampaign:removeCampaign,setCampaignQuantity:setCampaignQuantity};
function updateBadges(){var n=summary().units;document.querySelectorAll('.hd .cnt').forEach(function(e){e.textContent=n});document.querySelectorAll('a.tab.cart').forEach(function(a){a.href='sample-cart.html';Array.from(a.childNodes).filter(function(n){return n.nodeType===3}).forEach(function(t){t.textContent=' カート（'+n+'）'})})}
function boot(){updateBadges();window.addEventListener('storage',function(e){if(e.key===KEY||e.key===ORDER||e.key===null){updateBadges();window.dispatchEvent(new CustomEvent('democartchange'))}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
