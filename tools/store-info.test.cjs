const test=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const info=()=>JSON.parse(fs.readFileSync(path.join(root,'site-src/store-info.json'),'utf8'));
const tax=()=>JSON.parse(fs.readFileSync(path.join(root,'site-src/product-tax.json'),'utf8'));
const {check}=require('./store-info.cjs');
function store(i,t){const ctx={document:{readyState:'complete',querySelectorAll:()=>[]},Intl,Date,Math,Number,String,Object};ctx.window=ctx;
  ctx.STORE_INFO={...i,productTax:{default:t.default,products:Object.fromEntries(Object.entries(t.products).map(([k,v])=>[k,v.class]))}};
  vm.runInNewContext(fs.readFileSync(path.join(root,'store-info.js'),'utf8'),ctx);return ctx.LunaStore;}
test('お店の案内・送料・税率の設定は検査を通り、間違いは止める',()=>{
  check(info(),tax());
  const bad=info();bad.shipping.freeBasis='x';a.throws(()=>check(bad,tax()),/税別/);
  const b2=info();b2.bar[0].href='nai.html';a.throws(()=>check(b2,tax()),/リンク先/);
  const b3=info();b3.footer.lines[0].text='{fee:nai}';a.throws(()=>check(b3,tax()),/地域がありません/);
  const t=tax();t.products['999999']={class:'food',checked:false};a.throws(()=>check(info(),t),/商品 999999/);
});
test('食品の税率が変わる日から、食品だけ価格が変わる（セットは変えない）',()=>{
  const i=info();i.tax.rates.find(r=>r.from==='2027-04-01').active=true;
  const t={default:'standard',products:{'1':{class:'food'},'2':{class:'set'}}};
  const S=store(i,t);
  a.equal(S.rateOn('food','2027-03-31'),8);a.equal(S.rateOn('food','2027-04-01'),1);a.equal(S.rateOn('standard','2027-04-01'),10);
  a.equal(S.price('1',1080,'2027-03-31'),1080);a.equal(S.price('1',1080,'2027-04-01'),1010);
  a.equal(S.price('2',1080,'2027-04-01'),1080);a.equal(S.price('9',1100,'2027-04-01'),1100);
  // オフの行は使わない
  const S2=store(info(),t);a.equal(S2.price('1',1080,'2027-04-01'),1080);
});
test('送料無料は税別2万円で判定し、送料の差し込み文字を埋める',()=>{
  const S=store(info(),{default:'standard',products:{'1':{class:'food'}}});
  a.equal(S.freeLeft([{id:'1',price:21600,qty:1}],'2026-12-01'),0);
  a.equal(S.freeLeft([{id:'9',price:21600,qty:1}],'2026-12-01'),20000-19636);
  a.match(S.fill('税別{free}円・{fee:honshu}・{fee:okinawa}'),/税別20,000円・800円（税込）・2,800円（税別）/);
});
