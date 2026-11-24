// お店の案内（ヘッダーの案内バー・フッターの「お届けと送料」）・送料・税率と、商品ごとの税の種類を確かめて store-info-data.js を作る。
// 編集元: site-src/store-info.json と site-src/product-tax.json（OMSの「お店の案内・送料・税率」から書き出す）。
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),'utf8'));
const DATE=/^\d{4}-\d{2}-\d{2}$/,ID=/^[a-z0-9-]+$/,HREF=/^[a-z0-9-]+\.html(?:[?#][\w=&%-]*)?$/;
const PLACE=/{(free|fee:[a-z0-9-]+)}/g;
function text(t,max,where,regions){
  if(typeof t!=='string'||!t.trim()||t.length>max||/[<>]/.test(t))throw Error(where+': 文字は1〜'+max+'文字（<>なし）');
  for(const m of t.matchAll(PLACE))if(m[1]!=='free'&&!regions.has(m[1].slice(4)))throw Error(where+': {'+m[1]+'} の地域がありません');
  if(/{[^}]*}/.test(t.replace(PLACE,'')))throw Error(where+': 差し込みは {free} か {fee:地域id} だけです');
}
function check(info,tax,root_=root){
  if(info.schemaVersion!==1)throw Error('store-info.json の schemaVersion');
  const s=info.shipping;
  if(!Number.isInteger(s.freeThreshold)||s.freeThreshold<0||s.freeThreshold>1000000)throw Error('送料無料の金額は0〜1,000,000の整数');
  if(!['excl','incl'].includes(s.freeBasis))throw Error('送料無料の判定は excl（税別）か incl（税込）');
  const regions=new Set();
  if(!Array.isArray(s.regions)||!s.regions.length)throw Error('送料の地域がありません');
  for(const r of s.regions){if(!ID.test(r.id)||regions.has(r.id))throw Error('送料の地域id: '+r.id);regions.add(r.id);
    if(typeof r.name!=='string'||!r.name||r.name.length>20)throw Error('地域名: '+r.id);
    if(!Number.isInteger(r.fee)||r.fee<0||r.fee>100000)throw Error('送料: '+r.name);
    if(!['excl','incl'].includes(r.feeBasis))throw Error('送料の税: '+r.name);if(typeof r.freeApplies!=='boolean')throw Error('送料無料の対象: '+r.name);}
  for(const n of s.notes||[])text(n,120,'送料の注意',regions);
  const ids=new Set(),seen=k=>{if(!ID.test(k)||ids.has(k))throw Error('id が重なっています: '+k);ids.add(k)};
  for(const b of info.bar){seen(b.id);if(typeof b.active!=='boolean')throw Error('案内バー '+b.id+': active');text(b.label,6,'案内バーの見出し '+b.id,regions);text(b.text,40,'案内バー '+b.id,regions);
    if(!HREF.test(b.href)||!fs.existsSync(path.join(root_,'site-src/pages',b.href.split(/[?#]/)[0])))throw Error('案内バー '+b.id+': リンク先のページがありません');}
  text(info.footer.title,20,'フッターの見出し',regions);
  for(const l of info.footer.lines){seen(l.id);if(typeof l.active!=='boolean')throw Error('フッター '+l.id+': active');text(l.text,80,'フッター '+l.id,regions);}
  const t=info.tax,classes=new Set(t.classes.map(c=>c.id));
  if(!classes.has('standard')||!classes.has('food'))throw Error('税の種類に standard と food が必要');
  if(!DATE.test(t.priceBasisDate))throw Error('価格の基準日');
  if(!['floor','round'].includes(t.rounding))throw Error('端数は floor か round');
  const dates=new Set();
  for(const r of t.rates){seen(r.id);if(!DATE.test(r.from)||dates.has(r.from))throw Error('税率の切替日: '+r.from);dates.add(r.from);if(typeof r.active!=='boolean')throw Error('税率 '+r.from+': active');
    for(const c of classes)if(typeof r[c]!=='number'||r[c]<0||r[c]>30)throw Error('税率 '+r.from+' の '+c);}
  const on=t.rates.filter(r=>r.active).sort((a,b)=>a.from<b.from?-1:1);
  if(!on.length||on[0].from>t.priceBasisDate)throw Error('価格の基準日の時点で使う税率（オン）がありません');
  if(tax.schemaVersion!==1||!classes.has(tax.default))throw Error('product-tax.json の形');
  for(const [id,row] of Object.entries(tax.products)){
    if(!/^\d+$/.test(id)||!fs.existsSync(path.join(root_,'site-src/products',id+'.json')))throw Error('税の種類: 商品 '+id+' がありません');
    if(!(classes.has(row.class)||row.class==='set'))throw Error('税の種類: 商品 '+id+' の class');if(typeof row.checked!=='boolean')throw Error('税の種類: 商品 '+id+' の checked');}
}
function build(isCheck=false){
  const info=read('site-src/store-info.json'),tax=read('site-src/product-tax.json');check(info,tax);
  const data={...info,productTax:{default:tax.default,products:Object.fromEntries(Object.entries(tax.products).map(([k,v])=>[k,v.class]))}};
  const out='/* 編集元 site-src/store-info.json・site-src/product-tax.json（OMSの「お店の案内・送料・税率」）。tools/store-info.cjs が作る */\nwindow.STORE_INFO='+JSON.stringify(data)+';\n';
  const p=path.join(root,'store-info-data.js');const cur=fs.existsSync(p)?fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n'):null;
  if(isCheck){if(cur!==out)throw Error('store-info-data.js の生成漏れ。node tools/build-site.cjs を実行');}else if(cur!==out)fs.writeFileSync(p,out);
  return data;
}
module.exports={build,check};
if(require.main===module)console.log(Object.keys(build(process.argv.includes('--check')).productTax.products).length+'商品の税の種類');
