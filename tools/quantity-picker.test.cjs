const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
test('全公開ページで数量部品をheadに一度だけ読み込み、特集の直接購入にも適用する',()=>{
 const pages=JSON.parse(fs.readFileSync(path.join(root,'site-src/pages.json'),'utf8'));
 for(const page of Object.keys(pages)){
  const html=fs.readFileSync(path.join(root,page),'utf8');
  for(const asset of ['pilot-inputs.js','pilot-inputs.css']){
   assert.equal(html.split(asset).length-1,1,page+': '+asset);
   assert.ok(html.indexOf(asset)<html.indexOf('</head>'),page+': head preload');
  }
 }
 assert.match(fs.readFileSync(path.join(root,'feature-page.js'),'utf8'),/data-quantity-picker/);
});
