/* 商品ページから追加した実データで、以前の名入れ・包装の試験を行う。 */
(function(){
'use strict';
if(!document.getElementById('demo-cart-lines'))return;
const esc=OrderForm.escape,FREE=20000;
let CART=[],localChange=false,hydrating=true,problems=[];
const money=n=>n.toLocaleString('ja-JP')+'円';
function mutate(fn){localChange=true;try{fn()}catch(e){document.getElementById('cart-feedback').textContent=e.message}finally{localChange=false}}
function readCart(){CART=DemoCart.read().map(r=>{const p=ShopCatalog.get(r.id);return Object.assign({},p,{product:p,row:r,id:'r'+p.id.replace(/[^\w-]/g,'')+'s'+r.sku,name:p.title,short:p.title,img:p.image.replace(/^images\//,''),price:DemoCart.price(r)})})}
function drawRows(){
 readCart();
 document.getElementById('demo-cart-lines').innerHTML=CART.length?CART.map(c=>{
  const p=c.product,r=c.row,hasFields=p.spec&&p.spec.fields.some(f=>f.part!=='notice'&&f.part!=='common');
  return '<article class="ci" data-id="'+c.id+'" data-product="'+p.id+'">'+(p.image?'<a href="'+ShopCatalog.link(p)+'"><img src="'+esc(p.image)+'" alt="'+esc(p.title)+'"></a>':'<div class="sample-noimage">商品写真は準備中</div>')+'<div><div class="tp">'+esc(p.category||'サンプル商品')+'</div><h2><a href="'+ShopCatalog.link(p)+'">'+esc(p.title)+'</a></h2><p class="product-code">商品番号：'+esc(p.code||p.id)+'</p>'+(p.skus[r.sku]?'<p>'+esc(p.skus[r.sku].t)+'</p>':'')+'<p class="note">単価 '+money(c.price)+(p.pack===50?'／50個セット':'')+'</p><form class="cart-quantity"><label for="q-'+c.id+'">数量'+(p.pack===50?'（セット）':'')+'</label><div class="row"><div class="qty"><button type="button" data-q="-1" aria-label="数量を減らす">−</button><input type="number" min="1" max="999" step="1" value="'+r.qty+'" inputmode="numeric" aria-label="数量" id="q-'+c.id+'" required><button type="button" data-q="1" aria-label="数量を増やす">＋</button></div><button type="submit">更新</button><button type="button" data-remove="'+c.id+'">削除</button></div><p class="cart-error" role="alert"></p></form><strong class="sub" id="sub-'+c.id+'"></strong><p class="line-fee" id="xf-'+c.id+'"></p></div>'+(hasFields?'<div class="nbox" id="nb-'+c.id+'"><p class="need" id="need-'+c.id+'"></p><label class="chk"><input type="checkbox" id="ck-'+c.id+'" '+(r.enabled?'checked':'')+'>'+(p.hasName?'名入れする・ご指定を入力する':'この商品のご指定を入力する')+'<small>この商品に必要な欄がすべて出ます</small></label><div class="nform" id="f-'+c.id+'">'+OrderForm.html('c'+c.id,Object.assign({},p,{spec:Object.assign({},p.spec,{skus:[]})}))+'</div>'+(p.minnote?'<p class="note">'+esc(p.minnote)+'</p>':'')+'</div>':'')+'</article>'
 }).join(''):'<div class="empty-cart"><h2>カートは空です</h2><p>商品を選び、数量を指定して追加してください。</p><a class="btn wh" href="category.html?g=all">商品を選ぶ</a><a class="btn co" href="item.html?id=58190">GOEN PBで名入れを試す</a></div>';
 CART.forEach(c=>{const f=document.getElementById('f-'+c.id);if(f)OrderForm.restore(f,'c'+c.id,c.product,c.row.values)});
 renderCart();
}
function renderCampaign(){
 let host=document.getElementById('campaign-cart-line');if(!host){host=document.createElement('div');host.id='campaign-cart-line';document.getElementById('demo-cart-lines').after(host)}
 const c=DemoCart.campaignSummary();if(!c){host.innerHTML='';return null}
 const s=c.selection;host.innerHTML='<article class="campaign-cart-item"><h2>5円でご縁キャンペーン GOEN PB</h2><p>デザイン：'+esc(s.design)+'</p><p>'+(s.named?'名入れ：'+esc([s.groom,s.bride,s.date].filter(Boolean).join('／')):'名入れなし')+'</p><p>5円の対象 '+c.discounted+'個'+(c.regular?'／通常価格 '+money(c.regularPrice)+' ×'+c.regular+'個':'')+'</p>'+(!c.valid?'<p class="bad">対象の引出物が20個未満のため、キャンペーンの条件を満たしていません。このままでは注文できません。</p>':c.regular?'<p>対象の引出物を超える分は通常価格です。</p>':'')+'<form id="campaign-cart-quantity"><label for="campaign-cart-qty">数量</label><input type="number" id="campaign-cart-qty" data-quantity-picker min="1" max="999" step="1" value="'+c.qty+'" required><button type="submit">数量を更新</button><button type="button" id="campaign-cart-remove">削除</button></form><strong>'+(c.valid?money(c.total):'条件未達・キャンペーン代金未計算')+'</strong><a href="campaign-5yen.html#order">デザイン・名入れを変更する</a></article>';
 host.querySelector('form').addEventListener('submit',e=>{e.preventDefault();try{DemoCart.setCampaignQuantity(host.querySelector('input').value)}catch(err){document.getElementById('cart-feedback').textContent=err.message}});host.querySelector('#campaign-cart-remove').addEventListener('click',()=>DemoCart.removeCampaign());
 return c;
}
function renderCart(){
 let total=0,fees=0,draft=0;const summaries=[],freeRows=[];problems=[];
 CART.forEach(c=>{
  const p=c.product,r=c.row,q=r.qty,sub=q*c.price,box=document.getElementById('f-'+c.id),ck=document.getElementById('ck-'+c.id);
  total+=sub;freeRows.push({id:p.id,price:c.price,qty:q});document.getElementById('sub-'+c.id).textContent=money(sub);
  if(!box)return;
  const enough=q>=p.minq,need=document.getElementById('need-'+c.id);
  need.hidden=enough;need.textContent='あと'+(p.minq-q)+'個で名入れできます（'+p.minq+'個から）';ck.disabled=!enough;box.classList.toggle('on',enough&&r.enabled);
  const result=OrderForm.evaluate(p,r);fees+=result.fee;draft=Math.max(draft,result.draft);OrderForm.preview(box,'c'+c.id,p,result);
  document.getElementById('xf-'+c.id).textContent=result.parts.join('／')+(result.draft?'（原稿作成料は注文全体で1回）':'');
  if(r.enabled&&enough){
   const missing=result.need.concat(result.bad);missing.forEach(t=>problems.push(p.title+'：'+t));
   summaries.push('<div class="nrow"><b>'+esc(p.title)+' ×'+q+'</b>'+result.summary.map(s=>'<small>'+esc(s.label)+'：'+esc(s.text)+'</small>').join('')+(missing.length?'<small class="bad">未入力・要確認：'+esc(missing.join('／'))+'</small>':'')+(result.fee?'<small class="fee">追加料金 '+money(result.fee)+'</small>':'')+'</div>');
  }else if(r.enabled&&!enough)problems.push(p.title+'：名入れの最低数量を満たしていません。');
 });
 const campaign=renderCampaign();if(campaign){total+=campaign.total;if(!campaign.valid)problems.push('5円でご縁キャンペーン：対象の引出物が20個に届いていないため、このままでは注文できません。対象商品を追加するかキャンペーン商品を削除してください。')}
 const options=window.optCost?window.optCost():0;total+=fees+draft+options;
 document.getElementById('nfee').innerHTML=(summaries.length?'<h3>名入れ・ご指定の内容</h3>'+summaries.join(''):'')+(fees?'<p>商品ごとの追加料金：'+money(fees)+'</p>':'')+(draft?'<p id="draft-fee">原稿作成手数料：500円（1注文につき1回）</p>':'');
 document.getElementById('tot').textContent=money(total);const S=window.LunaStore,F=S?S.info.shipping.freeThreshold:FREE,left=S?S.freeLeft(freeRows):Math.max(0,FREE-total);document.getElementById('tbar').style.width=Math.min(100,(F-left)/F*100)+'%';
 document.getElementById('tship').innerHTML=left<=0?'<b>送料無料</b>になりました（本州・四国・九州）':'あと<b>'+money(left)+'</b>'+(S&&S.info.shipping.freeBasis==='excl'?'（税別）':'')+'で送料無料';
 document.getElementById('cart-options').hidden=!CART.length&&!campaign;document.getElementById('cart-summary').hidden=!CART.length&&!campaign;
 const empty=document.querySelector('.empty-cart');if(empty)empty.hidden=!!campaign;
 document.getElementById('order-check').hidden=true;
 if(!hydrating&&typeof OP!=='undefined'){saveOrder();if(window.ShopServices){const state=DemoCart.readOrder();DemoCart.saveOrder(Object.assign({},state,{previewQuote:{total:total,valid:problems.length===0,fingerprint:ShopServices.signature(DemoCart.read(),state.options)}}));}}
}
function lineFor(el){const node=el.closest('.ci');return node&&CART.find(c=>c.id===node.dataset.id)}
function updateQty(c,value){
 const input=document.getElementById('q-'+c.id),error=input.closest('form').querySelector('.cart-error');
 try{localChange=true;DemoCart.set(c.product.id,value,c.row.sku);c.row.qty=Number(value);input.value=c.row.qty;error.textContent='';renderCart()}catch(e){error.textContent=e.message}finally{localChange=false}
}
document.getElementById('demo-cart-lines').addEventListener('submit',e=>{const c=lineFor(e.target);if(!c)return;e.preventDefault();updateQty(c,document.getElementById('q-'+c.id).value)});
document.getElementById('demo-cart-lines').addEventListener('click',e=>{const c=lineFor(e.target);if(!c)return;const button=e.target.closest('button');if(!button)return;if(button.dataset.q){updateQty(c,Math.max(1,Math.min(999,c.row.qty+Number(button.dataset.q))))}if(button.dataset.remove){mutate(()=>DemoCart.remove(c.product.id,c.row.sku));drawRows()}});
document.getElementById('demo-cart-lines').addEventListener('change',e=>{
 const c=lineFor(e.target);if(!c)return;
 if(e.target.id==='ck-'+c.id){c.row.enabled=e.target.checked;mutate(()=>DemoCart.patch(c.product.id,c.row.sku,{enabled:c.row.enabled}));renderCart()}
 if(e.target.id==='q-'+c.id)updateQty(c,e.target.value);
});
function saveFields(e){const c=lineFor(e.target);if(!c||!e.target.closest('.nform'))return;const box=document.getElementById('f-'+c.id);c.row.values=OrderForm.collect(box,'c'+c.id,c.product);mutate(()=>DemoCart.patch(c.product.id,c.row.sku,{values:c.row.values}));renderCart()}
document.getElementById('demo-cart-lines').addEventListener('input',saveFields);document.getElementById('demo-cart-lines').addEventListener('change',saveFields);
document.getElementById('check-order').addEventListener('click',()=>{
 renderCart();const box=document.getElementById('order-check');box.hidden=false;
 box.innerHTML=problems.length?'<h3>入力内容をご確認ください</h3><ul>'+problems.map(t=>'<li>'+esc(t)+'</li>').join('')+'</ul>':'<h3>試験用の内容確認</h3><p>名入れ・包装の内容は上の合計欄で確認できます。入力内容をこのブラウザに保存しました。注文・決済は行われません。</p>';
 box.scrollIntoView({block:'nearest',behavior:'smooth'});
});
window.addEventListener('democartchange',()=>{if(!localChange){restoreExternalOrder();drawRows();if(window.optCost){loadEntry();pv()}}});
drawRows();

/* 以前の袋・シール・熨斗・包装の見本、選択、料金計算を下に引き継ぐ。 */

// 包装・袋・シール（熨斗・包装の条件は今のサイトの「熨斗掛け包装オプション」の説明文から）
// 熨斗・包装は「商品ごと」に設定する。同じ商品でもお名前を分けたいときは行を足す
const OP={bag:{on:false,d:'さくら'},seal:{on:false,d:'01.ティアラ-P',q:1},paper:{on:false,q:1},wraps:[],cur:0};
const BAGIMG={'さくら':'opt-bag-sakura.jpg','レース':'opt-bag-lace.jpg','キャンディベア':'opt-bag-bear.jpg','ナチュラルバイン':'opt-bag-natural.jpg','季節限定デザイン':'opt-minibag.jpg'};
const NOSHIIMG={'A':'opt-noshi-musubikiri.jpg','B':'opt-noshi-chou.jpg','D':'opt-noshi-heart.jpg'};
const PRICE={noshi:20,both:90,wrap:90},MODE={noshi:'熨斗だけ',both:'包装＋熨斗',wrap:'包装だけ'};
const $=id=>document.getElementById(id);
const qOf=c=>c.id==='all'?CART.filter(x=>!x.petit).reduce((s,x)=>s+(parseInt(($('q-'+x.id)||{}).value)||0),0):parseInt(($('q-'+c.id)||{}).value)||0;
function petitQty(){const campaign=DemoCart.campaignSummary();return CART.filter(c=>c.petit).reduce((s,c)=>s+qOf(c),0)+(campaign?campaign.qty:0);}
function wrapItems(){return CART.filter(c=>!c.petit);}
function paperItems(){return CART.filter(c=>!c.petit&&c.price>=800);}
const sumQ=a=>a.reduce((s,c)=>s+qOf(c),0);
const itemOf=id=>id==='all'?{id:'all',short:'対象の商品',name:'対象の商品',petit:false,img:''}:CART.find(c=>c.id===id);
function clamp(id,o,max){const i=$(id);let v=Math.max(1,parseInt(i.value)||1);if(max>0)v=Math.min(v,max);i.value=v;o.q=v;}
const list=a=>a.map(c=>'<b>'+c.short+'</b>×'+qOf(c)).join('、');
function newEntry(item,q){return {item:item,q:q||1,mode:'none',noshi:'A',kake:'外のし',use:'寿',free:'',low:'',paper:'01ブラウン',pc:'opt-wrap-01.jpg',pack:'each'};}
const W=()=>OP.wraps[OP.cur];
function upperOf(e){return e.use==='__free'?e.free:e.use==='__none'?'':e.use;}
function packsOf(e){if(e.mode==='none')return 0;return (e.pack==='box'&&e.mode!=='noshi')?1:e.q;}
function usedBy(item,skip){return OP.wraps.reduce((s,e,i)=>s+(i!==skip&&e.item===item&&e.mode!=='none'?e.q:0),0);}
function maxFor(i){const e=OP.wraps[i],c=itemOf(e.item);return c?Math.max(1,qOf(c)-usedBy(e.item,i)):1;}
function entryText(e){const c=itemOf(e.item);if(!c)return '';const hasN=e.mode==='noshi'||e.mode==='both',hasW=e.mode!=='noshi';
 if(e.mode==='none')return '<b>'+esc(c.short)+'</b>×'+e.q+'　なし';
 return '<b>'+esc(c.short)+'</b>×'+e.q+'　'+MODE[e.mode]+(hasN?'・'+e.kake+'「'+(esc(upperOf(e))||'表書きなし')+'／'+(esc(e.low)||'名前なし')+'」':'')+(hasW?'・'+e.paper+(e.pack==='box'?'（まとめて1つ）':''):'');}
function renderWlist(){const wl=$('wlist');
 // 対象商品ごとの設定状況
 const st=wrapItems().map(c=>{const u=usedBy(c.id,-1),n=qOf(c);return '<div class="wst'+(u>=n?' full':'')+'">'+(c.img?'<img src="images/'+esc(c.img)+'" alt="">':'')+'<span><b>'+esc(c.short)+'</b> カートに'+n+'個 → <b>'+u+'個</b>に設定'+(u<n?'（あと'+(n-u)+'個）':'（全部）')+'</span></div>';}).join('');
 const rows=OP.wraps.map((e,i)=>'<div class="wrow'+(i===OP.cur?' on':'')+'" data-i="'+i+'"><span class="wno">'+(i+1)+'</span><span class="wt">'+entryText(e)+'</span>'+(OP.wraps.length>1?'<button type="button" class="wdel" data-del="'+i+'" aria-label="この行を消す">×</button>':'')+'</div>').join('');
 wl.innerHTML=st+rows;
 wl.querySelectorAll('.wrow').forEach(r=>r.addEventListener('click',ev=>{if(ev.target.dataset.del!==undefined){OP.wraps.splice(+ev.target.dataset.del,1);OP.cur=Math.min(OP.cur,OP.wraps.length-1);loadEntry();renderCart();return;}OP.cur=+r.dataset.i;loadEntry();renderCart();}));}
function setOn(sel,v){document.querySelectorAll(sel+' button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));}
function loadEntry(){const e=W();if(!e)return;
 $('wi').innerHTML=wrapItems().map(c=>'<option value="'+c.id+'"'+(c.id===e.item?' selected':'')+'>'+esc(c.short)+'（カートに'+qOf(c)+'個）</option>').join('');
 $('wno').textContent=OP.cur+1;$('wrap-q').value=e.q;
 setOn('.onoff[data-o="wrap"]',e.mode);setOn('.pick[data-key="noshi"]',null);
 document.querySelectorAll('.pick[data-key="noshi"] button').forEach(b=>b.classList.toggle('on',b.dataset.v[0]===e.noshi));
 setOn('.pick[data-key="kake"]',e.kake);setOn('.pick[data-key="wrap"]',e.paper);setOn('.pick[data-key="pack"]',e.pack);
 $('nuse').value=e.use;$('nup').value=e.free;$('nlow').value=e.low;pv();}
window.optCost=function(){const pq=petitQty();let t=0;
 const sb=$('sum-bag');if(OP.bag.on){t+=5*pq;sb.textContent=OP.bag.d+'×'+pq+'枚 '+(5*pq).toLocaleString()+'円';sb.classList.remove('off');}else{sb.textContent='なし';sb.classList.add('off');}
 $('cnt-bag').textContent='今のカート：プチギフト'+pq+'個 → 小袋'+pq+'枚（'+(5*pq).toLocaleString()+'円）';
 const ss=$('sum-seal');const need=Math.max(1,Math.ceil(pq/50));$('seal-hint').textContent='プチギフト'+pq+'個 → '+need+'シートあれば足ります';
 if(OP.seal.on){t+=100*OP.seal.q;ss.textContent=OP.seal.d.replace(/^\d+\./,'')+'×'+OP.seal.q+'シート '+(100*OP.seal.q)+'円';ss.classList.remove('off');}else{ss.textContent='なし';ss.classList.add('off');}
 // 紙袋：引出物・引菓子（1個800円以上）の数まで
 const pi=paperItems(),pm=sumQ(pi),sp=$('sum-paper'),ep=$('el-paper');ep.className='elig'+(pm?'':' no');
 ep.innerHTML=pm?'対象：'+list(pi)+' → <b>'+pm+'枚まで</b>':'引出物・引菓子（1個800円以上）がカートにないので選べません';
 ep.parentElement.classList.toggle('lock',!pm);clamp('paper-q',OP.paper,pm);$('paper-hint').textContent=pm?pm+'枚まで':'';
 if(OP.paper.on&&pm){t+=50*OP.paper.q;sp.textContent='×'+OP.paper.q+'枚 '+(50*OP.paper.q)+'円';sp.classList.remove('off');}else{sp.textContent=pm?'なし':'対象外';sp.classList.add('off');}
 // 熨斗・包装：プチギフト以外の商品だけ。行ごとに商品と個数を決める
 const wi=wrapItems(),wm=sumQ(wi),sw=$('sum-wrap'),el=$('el-wrap'),ng=CART.filter(c=>c.petit);
 OP.wraps=OP.wraps.filter(e=>itemOf(e.item)&&!itemOf(e.item).petit);OP.wraps=OP.wraps.slice(0,1);if(!OP.wraps.length&&wi.length)OP.wraps.push(newEntry('all',1));if(OP.wraps[0])OP.wraps[0].item='all';OP.cur=0;OP.cur=Math.min(OP.cur,Math.max(0,OP.wraps.length-1));
 OP.wraps.forEach((e,i)=>{e.q=Math.min(Math.max(1,e.q),maxFor(i));});
 el.className='elig strong'+(wm?'':' no');
 el.innerHTML=(wm?'<div class="eh">熨斗・包装できる商品</div>'+wi.map(c=>'<div>✓ '+esc(c.name)+' <b>×'+qOf(c)+'</b></div>').join(''):'<div class="eh">熨斗・包装できる商品がカートにありません</div>')
  +(ng.length?'<div class="ex">⚠ プチギフト（'+ng.map(c=>esc(c.short)).join('・')+'）は「包装・のし」の対象外です</div>':'');
 el.parentElement.classList.toggle('lock',!wm);
 if(W()){$('wrap-q').value=W().q;$('wrap-hint').textContent=W().q+'個／最大'+maxFor(OP.cur)+'個';}
 let n=0,cost=0;OP.wraps.forEach(e=>{const p=packsOf(e);if(p){cost+=PRICE[e.mode]*p;n+=p;}});if(wm)t+=cost;
 $('pack-note').textContent=W()&&W().pack==='box'?'まとめて1つのBOXに包みます（料金は包装1つ分）。合うBOXがないときは保留にしてご連絡します。':'商品を1つずつ包みます（料金は包装の数だけかかります）。';
 if(n&&wm){sw.textContent=OP.wraps.filter(e=>e.mode!=='none').length+'件・'+n+'つ '+cost.toLocaleString()+'円';sw.classList.remove('off');}else{sw.textContent=wm?'なし':'対象外';sw.classList.add('off');}
 renderWlist();setTimeout(optSummary,0);return t;};
function optSummary(){let box=$('optsum');if(!box){const t=document.querySelector('.total');if(!t)return;box=document.createElement('div');box.id='optsum';box.className='optsum';t.querySelector('.sum').after(box);}
 const it=[],pq=petitQty(),sealBtn=document.querySelector('.pick[data-key="seal"] button[data-v="'+OP.seal.d+'"]');
 if(OP.bag.on)it.push(['images/'+BAGIMG[OP.bag.d],'かわいい小袋：'+OP.bag.d,pq+'枚']);
 if(OP.seal.on)it.push(['images/'+sealBtn.dataset.img,'ミニシール：'+OP.seal.d.replace(/^\d+\./,''),'印字「'+esc($('seal-n').value||'Keiji & Yumi')+'／'+esc($('seal-d').value||'2027.04.18')+'」・'+OP.seal.q+'シート']);
 if(OP.paper.on&&paperItems().length)it.push(['images/opt-paperbag.jpg','ギフト用紙袋',OP.paper.q+'枚']);
 OP.wraps.forEach(e=>{if(e.mode==='none'||!itemOf(e.item))return;const hasW=e.mode!=='noshi';
  it.push([hasW?'images/'+e.pc:'images/'+NOSHIIMG[e.noshi],MODE[e.mode]+'：'+esc(itemOf(e.item).short),entryText(e).replace(/^<b>.*?<\/b>/,'')+'・'+packsOf(e)+'つ']);});
 box.innerHTML=it.length?'<h4>包装・袋・シール</h4>'+it.map(([img,t,d])=>'<div class="it"><img src="'+img+'" alt=""><div><b>'+t+'</b><small>'+d+'</small></div></div>').join(''):'';}
// 熨斗の文字を枠に収める（長いと小さくする）
function fitV(el,base,ratio){const h=($('pv-noshi').getBoundingClientRect().height)||214;const n=Math.max(1,[...el.textContent].length);el.style.fontSize=Math.max(9,Math.min(base,(h*ratio)/(n*1.12)))+'px';}
function sealImg(){const b=document.querySelector('.pick[data-key="seal"] button[data-v="'+OP.seal.d+'"]');return b?b.dataset.img:'opt-seal-01.jpg';}
window.sealPreview=function(){document.querySelectorAll('.pvseal').forEach(i=>{i.src='images/'+sealImg().replace('opt-seal-','opt-seal-z');i.title=OP.seal.d;});
 document.querySelectorAll('.pvsealn').forEach(s=>s.textContent=OP.seal.d.replace(/^\d+\./,''));};
function pv(){$('pv-bag').src='images/'+BAGIMG[OP.bag.d];$('pvn-bag').textContent=OP.bag.d;
 $('pv-seal').src='images/'+sealImg();$('pvn-seal').textContent=OP.seal.d;
 $('pv-seal-n').textContent=$('seal-n').value||'Keiji & Yumi';$('pv-seal-d').textContent=$('seal-d').value||'2027.04.18';
 const e=W()||newEntry('',1),m=e.mode,hasN=m==='noshi'||m==='both',hasW=m==='both'||m==='wrap';
 $('ws-noshi').hidden=!hasN;$('ws-wrap').hidden=!hasW;
 const sh=m==='wrap'?'none':'';$('pv-sheet').style.display=sh;$('pv-up').style.display=sh;$('pv-low').style.display=sh;
 $('pv-sheet').style.backgroundImage='url(images/'+NOSHIIMG[e.noshi]+')';
 $('pv-paper').style.background=hasW?'url(images/'+e.pc+') center/cover no-repeat':'#fff';
 $('nup').style.display=$('nuse').value==='__free'?'':'none';
 const up=upperOf(e),low=e.low;$('pv-up').textContent=up;$('pv-low').textContent=low;fitV($('pv-up'),22,.34);fitV($('pv-low'),15,.30);
 const miss=[];if(e.use!=='__none'){if(!up)miss.push('表書き');if(!low)miss.push('お名前');}
 $('hi-bag').src='images/'+(OP.bag.on?BAGIMG[OP.bag.d]:'opt-bag-sakura.jpg');
 $('hi-seal').src='images/'+(OP.seal.on?sealImg():'opt-seal.jpg');
 $('hi-wrap').src='images/'+(m==='none'?'opt-noshi-musubikiri.jpg':hasW?e.pc:NOSHIIMG[e.noshi]);
 $('nwarn').textContent=hasN&&miss.length?'⚠ '+miss.join('と')+'が空です。このままだと、その部分は印刷なしでお届けになります。':'';
 sealPreview();}
(function(){const lb=document.createElement('div');lb.className='lbx';lb.hidden=true;
 lb.innerHTML='<figure><img id="lbx-img" alt=""><figcaption id="lbx-cap"></figcaption><button type="button" class="x">閉じる</button></figure>';document.body.appendChild(lb);
 const close=()=>{lb.hidden=true;};lb.addEventListener('click',close);addEventListener('keydown',e=>{if(e.key==='Escape')close();});
 $('pv-seal-z').addEventListener('click',()=>{$('lbx-img').src=$('pv-seal').src.replace('opt-seal-','opt-seal-z');
  $('lbx-cap').innerHTML='<b>'+esc(OP.seal.d)+'</b><small>印字：'+esc($('seal-n').value||'Keiji & Yumi')+'／'+esc($('seal-d').value||'2027.04.18')+'</small><small>写真は今のサイトの見本（名前・日付は見本の例）。実物は約35×25mm</small>';lb.hidden=false;});})();
document.querySelectorAll('.orow>button').forEach(b=>b.addEventListener('click',()=>b.parentElement.classList.toggle('open')));
document.querySelectorAll('.onoff').forEach(g=>g.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{g.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');
 const o=g.dataset.o;if(o==='wrap'){if(W())W().mode=b.dataset.v;}else OP[o].on=b.dataset.v==='1';pv();renderCart();})));
document.querySelectorAll('.pick[data-key]').forEach(g=>g.querySelectorAll('button[data-v]').forEach(b=>b.addEventListener('click',()=>{
 g.querySelectorAll('button').forEach(x=>x.classList.remove('on'));b.classList.add('on');const k=g.dataset.key,v=b.dataset.v,e=W();
 if(k==='bag')OP.bag.d=v;if(k==='seal')OP.seal.d=v;
 if(e){if(k==='noshi')e.noshi=v[0];if(k==='wrap'){e.paper=v;e.pc=b.dataset.c;}if(k==='kake')e.kake=v;if(k==='pack')e.pack=v;
  if((k==='noshi'||k==='kake')&&e.mode==='none'){e.mode='noshi';setOn('.onoff[data-o="wrap"]','noshi');}
  if((k==='wrap'||k==='pack')&&(e.mode==='none'||e.mode==='noshi')){e.mode='both';setOn('.onoff[data-o="wrap"]','both');}}
 if(k==='bag'||k==='seal'){const on=document.querySelector('.onoff[data-o="'+k+'"] button[data-v="1"]');if(!OP[k].on)on.click();}
 pv();renderCart();})));
['seal-n','seal-d'].forEach(id=>$(id).addEventListener('input',()=>{pv();renderCart();}));
$('nuse').addEventListener('change',()=>{if(W())W().use=$('nuse').value;pv();renderCart();});
$('nup').addEventListener('input',()=>{if(W())W().free=$('nup').value;pv();renderWlist();});
$('nlow').addEventListener('input',()=>{if(W())W().low=$('nlow').value;pv();renderWlist();setTimeout(optSummary,0);});
$('wi').addEventListener('change',()=>{if(W()){W().item=$('wi').value;W().q=1;}renderCart();loadEntry();});
$('wadd').addEventListener('click',()=>{const wi=wrapItems();if(!wi.length)return;
 const free=wi.find(c=>usedBy(c.id,-1)<qOf(c))||wi[0];const prev=W();
 // 同じ商品を分けるときは、今の行から1個ゆずる
 if(usedBy(free.id,-1)>=qOf(free)&&prev&&prev.item===free.id&&prev.q>1)prev.q--;
 const e=newEntry(free.id,1);if(prev){e.mode=prev.mode==='none'?'noshi':prev.mode;e.noshi=prev.noshi;e.kake=prev.kake;e.use=prev.use;e.paper=prev.paper;e.pc=prev.pc;}
 OP.wraps.push(e);OP.cur=OP.wraps.length-1;renderCart();loadEntry();$('wedit').scrollIntoView({block:'nearest'});});
document.querySelectorAll('[data-s]').forEach(b=>b.addEventListener('click',()=>{const i=$('seal-q');i.value=Math.max(1,(parseInt(i.value)||1)+parseInt(b.dataset.s));OP.seal.q=+i.value;renderCart();}));
$('seal-q').addEventListener('input',e=>{OP.seal.q=Math.max(1,parseInt(e.target.value)||1);renderCart();});
document.querySelectorAll('[data-p]').forEach(b=>b.addEventListener('click',()=>{const i=$('paper-q');i.value=Math.max(1,(parseInt(i.value)||1)+parseInt(b.dataset.p));renderCart();}));$('paper-q').addEventListener('input',renderCart);
document.querySelectorAll('[data-w]').forEach(b=>b.addEventListener('click',()=>{if(!W())return;W().q=Math.max(1,W().q+parseInt(b.dataset.w));renderCart();}));
$('wrap-q').addEventListener('input',e=>{if(W()){W().q=Math.max(1,parseInt(e.target.value)||1);renderCart();}});

// 名入れ・オプションは、商品を探しに戻ってもこのブラウザで保持する。
function saveOrder(){DemoCart.saveOrder(Object.assign({},DemoCart.readOrder(),{options:OP,sealName:$('seal-n').value,sealDate:$('seal-d').value,memo:$('wbiko').value}))}
function restoreExternalOrder(){const state=DemoCart.readOrder();if(state.options){Object.assign(OP,state.options);setOn('.onoff[data-o="bag"]',OP.bag.on?'1':'0');setOn('.onoff[data-o="seal"]',OP.seal.on?'1':'0');setOn('.onoff[data-o="paper"]',OP.paper.on?'1':'0');setOn('.pick[data-key="bag"]',OP.bag.d);setOn('.pick[data-key="seal"]',OP.seal.d);$('seal-q').value=OP.seal.q;$('paper-q').value=OP.paper.q;}$('seal-n').value=state.sealName||'';$('seal-d').value=state.sealDate||'';$('wbiko').value=state.memo||'';}
const saved=DemoCart.readOrder(),savedOptions=saved.options;
if(savedOptions){
 if(savedOptions.bag&&BAGIMG[savedOptions.bag.d])Object.assign(OP.bag,savedOptions.bag);
 if(savedOptions.seal&&document.querySelector('.pick[data-key="seal"] button[data-v="'+String(savedOptions.seal.d).replace(/["\\]/g,'')+'"]'))Object.assign(OP.seal,savedOptions.seal);
 if(savedOptions.paper)Object.assign(OP.paper,savedOptions.paper);
 if(Array.isArray(savedOptions.wraps))OP.wraps=savedOptions.wraps.filter(e=>e&&MODE[e.mode]||e&&e.mode==='none');
 OP.cur=0;
 setOn('.onoff[data-o="bag"]',OP.bag.on?'1':'0');setOn('.onoff[data-o="seal"]',OP.seal.on?'1':'0');setOn('.onoff[data-o="paper"]',OP.paper.on?'1':'0');
 setOn('.pick[data-key="bag"]',OP.bag.d);setOn('.pick[data-key="seal"]',OP.seal.d);$('seal-q').value=OP.seal.q;$('paper-q').value=OP.paper.q;
}
$('seal-n').value=saved.sealName||'';$('seal-d').value=saved.sealDate||'';$('wbiko').value=saved.memo||'';
$('wbiko').addEventListener('input',saveOrder);document.querySelectorAll('[data-guide]').forEach(a=>a.addEventListener('click',saveOrder));
hydrating=false;renderCart();loadEntry();pv();
if(location.hash==='#wrap'){$('wrap').classList.add('open');$('wrap').scrollIntoView({block:'start'})}
})();
