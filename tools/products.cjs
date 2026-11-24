'use strict';
// One product per file. Public bundles are generated; original DB/backups are never edited.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'site-src/products');
const read=f=>JSON.parse(fs.readFileSync(f,'utf8'));
function validId(id){if(typeof id!=='string'||!/^\d+$/.test(id))throw Error('商品IDは数字の文字列にしてください');return id;}
function validate(row,id){
 const p=row.product;validId(id);
 if(!p||p.id!==id||typeof row.active!=='boolean')throw Error(id+': id / activeが不正');
 if(typeof p.code!=='string'||!p.code.trim()||typeof p.title!=='string'||!p.title.trim())throw Error(id+': 商品コード・商品名が必要');
 if(!Number.isFinite(p.price)||p.price<0||!Number.isInteger(p.minq)||p.minq<1)throw Error(id+': 価格・最低数量が不正');
 if(!Array.isArray(p.skus)||!p.skus.length||p.skus.some(s=>!Number.isFinite(s.price)||s.price<0))throw Error(id+': SKU・価格が不正');
 for(const k of ['categories','subs'])if(!Array.isArray(p[k]))throw Error(id+': '+k+'が必要');
 if(typeof p.image!=='string'||(p.image&&(!p.image.startsWith('images/')||p.image.includes('..')||!fs.existsSync(path.join(root,p.image)))))throw Error(id+': 商品画像が見つかりません');
 if(row.detail&&(typeof row.detail!=='object'||Array.isArray(row.detail)))throw Error(id+': detailが不正');
 const nt=require('./notice-templates.cjs');nt.checkProduct(p,new Set(nt.load().templates.map(t=>t.id)));require('./product-layout.cjs').checkProduct(p);
 return row;
}
function load(){
 const ids=read(path.join(dir,'manifest.json'));if(!Array.isArray(ids)||new Set(ids).size!==ids.length)throw Error('商品ID一覧の重複または不正');
 const rows=ids.map(id=>validate(read(path.join(dir,validId(id)+'.json')),id));
 const codes=rows.map(r=>r.product.code.toLowerCase());if(new Set(codes).size!==codes.length)throw Error('商品コード重複');
 const orphans=fs.readdirSync(dir).filter(f=>/^\d+\.json$/.test(f)&&!ids.includes(f.slice(0,-5)));if(orphans.length)throw Error('商品一覧への登録漏れ: '+orphans.join(','));
 return {ids,rows};
}
function build(check=false){
 const {rows}=load(),meta=read(path.join(dir,'catalog-meta.json')),active=rows.filter(r=>r.active),inactive=rows.filter(r=>!r.active).map(r=>r.product.id);
 const data={...meta,products:active.map(r=>r.product)};
 const order=meta.featureOrder||[];delete data.featureOrder;
 data.featureProducts=active.filter(r=>r.feature).flatMap(r=>(Array.isArray(r.feature)?r.feature:[r.feature]).map(f=>({name:r.product.title,title:r.product.title,url:r.product.sourceUrl,groups:[],image:r.product.image,description:r.product.description,size:r.product.size,material:r.product.material,pack:r.product.pack,canDemo:true,updated:meta.sourceDate,...f,id:f.id||r.product.id,code:r.product.code,price:r.product.price,skus:r.product.skus,maxPrice:Math.max(...r.product.skus.map(s=>s.price))}))).sort((a,b)=>{const rank=id=>order.includes(id)?order.indexOf(id):order.length;return rank(a.id)-rank(b.id);});
 const listings=Object.fromEntries(active.filter(r=>r.listing).map(r=>[r.product.id,r.listing]));if(Object.keys(listings).length)data.listing=listings;if(inactive.length)data.inactiveIds=inactive;
 const details=Object.fromEntries(active.filter(r=>r.detail).map(r=>[r.product.id,r.detail]));
 const services=Object.fromEntries(active.filter(r=>r.commerce).map(r=>[r.product.id,r.commerce]));
 // v73 速度対策：商品ページの1枚目の写真を、全商品データ（product-data.js）を待たずに先読みする小さな索引
 const hero={};for(const r of active){const d=details[r.product.id],src=d&&d.photos&&d.photos[0]&&d.photos[0].src||r.product.image;if(!src)continue;hero[r.product.id]=src;}
 const preload='/* 自動生成（tools/products.cjs）。商品ページの1枚目の写真を先に読み始めるだけの索引。表示や注文には使わない。 */\n(function(){var m='+JSON.stringify(hero)+',f='+JSON.stringify(meta.featureMap||{})+';try{var id=new URLSearchParams(location.search).get(\'id\')||\'ecoflavor-104-101\';id=f[id]||id;var s=m[id];if(!s)return;var l=document.createElement(\'link\');l.rel=\'preload\';l.as=\'image\';l.href=s;l.setAttribute(\'fetchpriority\',\'high\');document.head.appendChild(l)}catch(e){}})();\n';
 const outputs={'item-photo-preload.js':preload,'product-services-data.js':'/* 自動生成。商品別の編集元はsite-src/products/ID.jsonのcommerce。 */\nwindow.PRODUCT_SERVICES='+JSON.stringify(services)+';\n','product-data.js':'/* 自動生成。編集元はsite-src/products/<商品ID>.json。元DBは変更しない。 */\nwindow.SAMPLE_CATALOG='+JSON.stringify(data)+';\n','product-detail-data.js':'/* 自動生成。先行5商品のみ詳細あり。残り274商品の詳細作成は保留。 */\nwindow.PRODUCT_DETAIL_DATA='+JSON.stringify(details)+';\n'};
 for(const [file,text] of Object.entries(outputs)){const dest=path.join(root,file);if(check){if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8').replace(/\r\n/g,'\n')!==text)throw Error(file+'の生成漏れ。node tools/products.cjs build を実行');}else if(!fs.existsSync(dest)||fs.readFileSync(dest,'utf8').replace(/\r\n/g,'\n')!==text)fs.writeFileSync(dest,text);}
 return {total:rows.length,active:active.length,details:Object.keys(details).length};
}
function main(args){
 const [cmd,value]=args;
 if(cmd==='build'||cmd==='check'){console.log(JSON.stringify(build(cmd==='check')));return;}
 if(cmd==='find'){const q=(value||'').toLowerCase();const {rows}=load();for(const r of rows)if([r.product.id,r.product.code,r.product.title].some(s=>s.toLowerCase().includes(q)))console.log(r.product.id+'\t'+(r.active?'掲載':'停止')+'\t'+r.product.code+'\t'+r.product.title);return;}
 if(cmd==='show'){const id=validId(value);console.log(JSON.stringify(read(path.join(dir,id+'.json')),null,2));return;}
 if(cmd==='archive'||cmd==='restore'){
  const id=validId(value),p=path.join(dir,id+'.json'),row=validate(read(p),id);row.active=cmd==='restore';fs.writeFileSync(p,JSON.stringify(row,null,2)+'\n');console.log(JSON.stringify(build()));return;
 }
 if(cmd==='add'){
  const row=read(path.resolve(value)),id=validId(row.product?.id);validate(row,id);const {ids,rows}=load();if(ids.includes(id)||rows.some(r=>r.product.code.toLowerCase()===row.product.code.toLowerCase()))throw Error('既存商品を上書きしません');
  fs.writeFileSync(path.join(dir,id+'.json'),JSON.stringify(row,null,2)+'\n',{flag:'wx'});fs.writeFileSync(path.join(dir,'manifest.json'),JSON.stringify([...ids,id],null,2)+'\n');console.log(JSON.stringify(build()));return;
 }
 throw Error('使い方: node tools/products.cjs find キーワード | show ID | build | check | add 新規JSON | archive ID | restore ID');
}
if(require.main===module)try{main(process.argv.slice(2));}catch(e){console.error(e.message);process.exitCode=1;}
module.exports={build,load};
