const test=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs'),path=require('node:path');
test('購入時の記録と商品状態を分離し、売切れ・販売終了・SKU消失を安全に表す',()=>{
 const root=path.resolve(__dirname,'..'),ctx={window:null,document:{getElementById:()=>null}};ctx.window=ctx;vm.createContext(ctx);for(const file of ['purchase-history-data.js','purchase-history.js'])vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),ctx);
 const api=ctx.PurchaseHistory,data=ctx.DEMO_PURCHASE_HISTORY,before=JSON.stringify(data.orders),line=data.orders[0].lines[0],product={id:line.productId,skus:[{code:line.skuCode,price:99999}]},catalog={get:()=>product},state=key=>({[line.productId]:{skus:{[line.skuCode]:{status:key}}}});
 assert.equal(api.resolve(line,catalog,state('available')).key,'available');
 assert.equal(api.resolve(line,catalog,state('soldout')).key,'soldout');
 assert.equal(api.resolve(line,{get:()=>undefined},{[line.productId]:{status:'discontinued'}}).key,'discontinued');
 assert.equal(api.resolve(line,{get:()=>undefined},{}).key,'unknown');
 assert.equal(api.resolve(line,{get:()=>({id:line.productId,skus:[]})},state('available')).key,'unknown');
 assert.equal(api.resolve(line,{get:()=>({...product,id:'other'})},state('available')).key,'unknown');
 assert.equal(api.resolve(line,catalog,{}).key,'unknown');
 assert.equal(api.resolve(line,catalog,{[line.productId]:{skus:{other:{status:'available'}}}}).key,'unknown');
 for(const state of ['soldout','discontinued','unknown'])assert.equal(api.resolve(line,catalog,{[line.productId]:state==='discontinued'?{status:state}:{skus:{[line.skuCode]:{status:state}}}}).url,undefined);
 assert.equal(api.total(data.orders[0]),line.snapshot.unitPrice*line.snapshot.quantity);assert.notEqual(api.total(data.orders[0]),99999);
 assert.ok(Object.isFrozen(line.snapshot));assert.ok(Object.isFrozen(data.orders));assert.equal(JSON.stringify(data.orders),before);
});
