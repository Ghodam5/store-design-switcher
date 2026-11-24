/* 以前の種類別フォーム部品を共通化。項目・順序・選択肢を引き継ぐ。 */
(function(){
'use strict';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// ===== 種類ごとの部品で、商品の入力欄を組み立てる =====
// 設計図（spec.fields）は商品データ（注文入力項目_商品別_*.json）から作る。part = 部品の種類
const PARTNAME={text:'名入れの文字（1行）',area:'名入れの文字（複数行）',msgsel:'メッセージを選ぶ',choice:'選ぶ（仕様・お急ぎなど）',agree:'同意・確認',memo:'備考・ご要望',notice:'お知らせ（表示だけ）',common:'カート共通の欄へ（熨斗・包装・配送）'};
function fieldHTML(id,f,i){
 const fid=id+'-f'+i,req=f.req?' <em class="rq">必須</em>':'',lab=esc(f.label);
 if(f.part==='notice')return '<p class="fnotice">'+lab+'</p>';
 if(f.part==='common')return '';
 let inner='';
 if(f.part==='text')inner='<input id="'+fid+'" placeholder="'+esc(f.ph||'')+'"'+(f.lim&&!f.over?' maxlength="'+f.lim+'"':'')+'>';
 else if(f.part==='area'||f.part==='memo')inner='<textarea id="'+fid+'" rows="3" placeholder="'+esc(f.ph||'')+'"></textarea>';
 else if(f.part==='msgsel'||f.part==='choice')inner='<select id="'+fid+'"><option value="">選択してください</option>'+(f.opts||[]).map((o,j)=>'<option value="'+j+'">'+esc(o.full||o.t)+'</option>').join('')+'</select>';
 else if(f.part==='agree')inner='<div class="agree">'+(f.opts||[]).map((o,j)=>'<label class="ag"><input type="'+((f.opts||[]).length===1?'checkbox':'radio')+'" name="'+fid+'" value="'+j+'"><span>'+esc(o.t)+'</span></label>').join('')+'</div>';
 const cnt=(f.lim||f.over)?'<p class="ccount" id="'+fid+'-c"></p>':'';
 return '<div class="nf ff p-'+f.part+'" data-i="'+i+'" id="'+fid+'-w"'+(f.showIf?' hidden':'')+'><label for="'+fid+'">'+lab+req+'<span>'+(f.lim?f.lim+'文字まで':'')+'</span></label>'+inner+cnt+'</div>';
}
function formHTML(id,c){
 const sp=c.spec;let h='';
 if(sp.skus&&sp.skus.length)h+='<div class="nf ff p-choice"><label>タイプ <em class="rq">必須</em><span>価格が変わります</span></label><select id="'+id+'-sku">'+sp.skus.map((s,j)=>'<option value="'+j+'">'+esc(s.t)+'（'+s.price.toLocaleString()+'円）</option>').join('')+'</select></div>';
 sp.fields.forEach((f,i)=>{h+=fieldHTML(id,f,i);});
 const com=[...new Set(sp.fields.filter(f=>f.part==='common').map(f=>f.k))];
 if(com.length)h+='<p class="note">この商品の「'+com.join('・')+'」は、カート共通の欄（熨斗・包装／配送）で選びます。</p>';
 if(sp.notes&&sp.notes.length)h+='<ul class="nnotes">'+sp.notes.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ul>';
 h+='<div class="pvw">'+(c.seal?'<img class="pvseal" alt="" src="images/opt-seal-z01.jpg">':'')+'<div class="tag2"><div class="t1" id="'+id+'-p1"></div><div class="t2" id="'+id+'-p2"></div><div class="t3" id="'+id+'-p3"></div></div><small>仕上がりのイメージ'+(c.seal?'<br>選んだシール：<span class="pvsealn">ティアラ-P</span>':'')+'</small></div>';
 return h;}
function valOf(box,id,f,i){const fid=id+'-f'+i;
 if(f.part==='agree'){const x=box.querySelector('input[name="'+fid+'"]:checked');return x?+x.value:null;}
 const e=box.querySelector('#'+fid);if(!e)return null;if(e.tagName==='SELECT')return e.value===''?null:+e.value;return e.value;}
// 合計の欄に出す「入力した内容」
function summaryVals(box,id,c){const sp=c.spec,out=[];const sk=box.querySelector('#'+id+'-sku');if(sk)out.push('タイプ：'+esc(sp.skus[+sk.value].t));
 sp.fields.forEach((f,i)=>{if(f.part==='notice'||f.part==='common')return;const w=box.querySelector('#'+id+'-f'+i+'-w');if(w&&w.hidden)return;const v=valOf(box,id,f,i);if(v===null||v==='')return;
  const t=f.opts?(f.opts[v].full||f.opts[v].t):v;out.push(esc(f.label.replace(/[（(].*$/,'').slice(0,16))+'：'+esc(t));});return out;}

function collect(box,id,p){const values={};p.spec.fields.forEach((f,i)=>{const v=valOf(box,id,f,i);if(v!==null)values['f'+i]=String(v)});return values;}
function restore(box,id,p,values){p.spec.fields.forEach((f,i)=>{const v=values['f'+i];if(v===undefined)return;if(f.part==='agree'){box.querySelectorAll('input[name="'+id+'-f'+i+'"]').forEach(e=>e.checked=e.value===v)}else{const e=box.querySelector('#'+id+'-f'+i);if(e)e.value=v}});}
function evaluate(p,row){
 const out={fee:0,draft:0,parts:[],need:[],bad:[],summary:[],counts:[],names:[],dates:[],messages:[],design:[]};
 if(!p.spec||!row.enabled||row.qty<p.minq)return out;
 const fields=p.spec.fields,values=row.values||{};
 function value(i){const v=values['f'+i],f=fields[i];if(v===undefined||v==='')return null;if(f.opts){const n=Number(v);return Number.isInteger(n)&&n>=0&&n<f.opts.length?n:null}return String(v)}
 function visible(f){if(!f.showIf)return true;const index=value(f.showIf.f),src=fields[f.showIf.f];return index!==null&&src.opts&&src.opts[index].t.indexOf(f.showIf.has)>=0}
 fields.forEach((f,i)=>{
  if(!visible(f)||f.part==='notice'||f.part==='common')return;
  const v=value(i);if(f.req&&(v===null||v===''))out.need.push(f.label);
  if(v!==null&&v!==''){
   const o=f.opts?f.opts[v]:null,text=o?(o.full||o.t):String(v);
   out.summary.push({label:f.label,text:text});
   if(window.PilotInputs){const error=PilotInputs.dateError(p,f,text);if(error)out.bad.push(error)}
   if(f.role==='n')out.names.push(text);if(f.role==='d'||f.role==='w'||f.role==='h')out.dates.push(text+(f.role==='w'?'g':f.role==='h'?'cm':''));if(f.role==='m')out.messages.push(text);if(f.role==='s')out.design.push(text);
   if(o&&o.fee){
    const drafting=o.fee.amt===500&&o.fee.per==='order'&&/文字数超過/.test(o.t);
    if(drafting)out.draft=Math.max(out.draft,500);else{const cost=o.fee.amt*(o.fee.per==='unit'?row.qty:1);out.fee+=cost;out.parts.push(text+'：'+cost.toLocaleString()+'円'+(o.fee.from?'〜':''))}
   }
  }
  if(f.lim){
   const count=[...(v===null?'':String(v))].length,extra=Math.max(0,count-f.lim);let note='合計 '+count+' / '+f.lim+' 文字';
   if(extra){
    if(f.over){
     let agreed=true;if(f.over.agreeField!==undefined){const af=fields[f.over.agreeField],av=value(f.over.agreeField);agreed=av!==null&&af.opts&&!!af.opts[av].over}
     const fee=f.over.per*extra*(f.over.perUnit?row.qty:1),shared=f.over.base===500&&f.over.per===20&&!f.over.perUnit;
     note+='　超過'+extra+'文字：'+fee.toLocaleString()+'円'+(shared?'＋原稿作成料500円（1注文1回）':'');
     if(agreed){out.fee+=fee+(shared?0:f.over.base);if(shared)out.draft=Math.max(out.draft,500);out.parts.push('文字数超過 '+(fee+(shared?0:f.over.base)).toLocaleString()+'円')}else{out.bad.push('文字数超過料金への同意を選んでください。');note+='（同意が必要）'}
    }else{out.bad.push(f.label+'の文字数上限を超えています。');note+='　上限を超えています'}
   }
   out.counts.push({i:i,text:note,over:extra>0});
  }
 });return out;
}
function preview(box,id,p,result){
 p.spec.fields.forEach((f,i)=>{if(!f.showIf)return;const src=p.spec.fields[f.showIf.f],v=valOf(box,id,src,f.showIf.f),on=v!==null&&src.opts&&src.opts[v].t.indexOf(f.showIf.has)>=0;const w=box.querySelector('#'+id+'-f'+i+'-w');if(w)w.hidden=!on});
 result.counts.forEach(c=>{const e=box.querySelector('#'+id+'-f'+c.i+'-c');if(e){e.textContent=c.text;e.classList.toggle('over',c.over)}});
 [['p1',result.design.concat(result.messages).join('／')],['p2',result.names.join(' & ')||'お名前'],['p3',result.dates.join(' ')]].forEach(x=>{const e=box.querySelector('#'+id+'-'+x[0]);if(e)e.textContent=x[1]});
}
window.OrderForm={html:formHTML,collect:collect,restore:restore,evaluate:evaluate,preview:preview,escape:esc};
})();
