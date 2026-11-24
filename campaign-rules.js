/* キャンペーンの表示・追加・カート再計算は同じ条件を使う。 */
(function(){
'use strict';
function check(rows){
 var lines=rows.map(function(r){var p=ShopCatalog.get(r.id),rule=CAMPAIGN_PRODUCTS[p.id]||{gift:false,taxRate:10},price=DemoCart.price(r),net=Math.floor(price*100/(100+rule.taxRate)+1e-7),eligible=rule.gift&&net>=800;
 return {id:p.id,sku:r.sku,title:p.title,qty:r.qty,price:price,net:net,taxRate:rule.taxRate,eligible:eligible,reason:!rule.gift?'対象の引出物・引菓子・カタログではありません':net<800?'単価が税別800円未満のため対象外':''}});
 var count=lines.reduce(function(n,p){return n+(p.eligible?p.qty:0)},0);
 return {lines:lines,count:count,eligible:count>=20};
}
function summary(selection,cart){
 if(!selection||!Number.isInteger(selection.qty)||selection.qty<1)return null;
 var count=cart.eligible?Math.min(selection.qty,cart.count):0,regular=cart.eligible?selection.qty-count:0,p=ShopCatalog.get('pb-goen');
 return {qty:selection.qty,valid:cart.eligible,discounted:count,regular:regular,total:cart.eligible?count*5+regular*p.price:0,regularPrice:p.price,selection:selection};
}
window.CampaignRules={check:check,summary:summary};
})();
