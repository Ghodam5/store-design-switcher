const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),cp=require('node:child_process'),vm=require('node:vm');
test('商品を独立編集し追加・掲載停止・復帰でき、重複・生成漏れを拒否する',()=>{
 const project=path.resolve(__dirname,'..'),tmp=fs.mkdtempSync(path.join(os.tmpdir(),'luna-products-test-'));
 const run=(args,ok=true)=>{const r=cp.spawnSync(process.execPath,[path.join(tmp,'tools/products.cjs'),...args],{encoding:'utf8'});assert.equal(r.status===0,ok,r.stdout+r.stderr);return r.stdout;};
 const data=()=>{const c={window:{}};vm.runInNewContext(fs.readFileSync(path.join(tmp,'product-data.js'),'utf8'),c);return JSON.parse(JSON.stringify(c.window.SAMPLE_CATALOG));};
 try{
  for(const f of ['site-src/products','tools/products.cjs','tools/notice-templates.cjs','site-src/notice-templates.json','tools/product-layout.cjs','site-src/product-layout.json']){fs.mkdirSync(path.dirname(path.join(tmp,f)),{recursive:true});fs.cpSync(path.join(project,f),path.join(tmp,f),{recursive:true});}
  const dir=path.join(tmp,'site-src/products'),ids=JSON.parse(fs.readFileSync(path.join(dir,'manifest.json')));
  for(const id of ids){const r=JSON.parse(fs.readFileSync(path.join(dir,id+'.json')));if(r.product.image){const p=path.join(tmp,r.product.image);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,'');}}
  run(['build']);run(['check']);const original=data(),id=ids[0],other=fs.readFileSync(path.join(dir,ids[1]+'.json'),'utf8');
  run(['archive',id]);assert.equal(data().products.length,original.products.length-1);assert.ok(data().inactiveIds.includes(id));assert.equal(fs.readFileSync(path.join(dir,ids[1]+'.json'),'utf8'),other);
  const ctx={SAMPLE_CATALOG:data(),ITEMS:[]};ctx.window=ctx;const entry=Object.entries(original.itemMap).find(([,v])=>v===id);if(entry)ctx.ITEMS.push({o:Number(entry[0]),id});vm.runInNewContext(fs.readFileSync(path.join(project,'catalog.js'),'utf8'),ctx);assert.equal(ctx.window.ShopCatalog.get(id),undefined);assert.ok(!ctx.window.ITEMS.some(p=>p.id===id));
  run(['restore',id]);assert.deepEqual(data(),original);
  const featured=ids.find(v=>JSON.parse(fs.readFileSync(path.join(dir,v+'.json'))).feature);if(featured){run(['archive',featured]);assert.ok(!data().featureProducts.some(f=>(original.featureMap[f.id]||f.id)===featured));run(['restore',featured]);assert.deepEqual(data(),original);}
  const row=JSON.parse(fs.readFileSync(path.join(dir,id+'.json')));row.product.price+=1;fs.writeFileSync(path.join(dir,id+'.json'),JSON.stringify(row));run(['check'],false);run(['build']);assert.equal(data().products.find(p=>p.id===id).price,row.product.price);assert.deepEqual(data().products.find(p=>p.id===ids[1]),original.products.find(p=>p.id===ids[1]));
  const live={SAMPLE_CATALOG:data(),ITEMS:entry?[{o:Number(entry[0])}]:[]};live.window=live;vm.runInNewContext(fs.readFileSync(path.join(project,'catalog.js'),'utf8'),live);assert.equal(live.ITEMS.find(p=>p.id===id).p,row.product.price);for(const f of data().featureProducts.filter(f=>(original.featureMap[f.id]||f.id)===id))assert.equal(f.price,row.product.price);
  row.product.id='999999999';row.product.code='test-unique';const incoming=path.join(tmp,'new.json');fs.writeFileSync(incoming,JSON.stringify(row));run(['add',incoming]);assert.equal(data().products.length,original.products.length+1);run(['add',incoming],false);run(['archive','../oops'],false);
 }finally{const resolved=path.resolve(tmp);assert.ok(resolved.startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(resolved).startsWith('luna-products-test-'));fs.rmSync(resolved,{recursive:true,force:true});}
});
