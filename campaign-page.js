(function(){
'use strict';
var $=function(id){return document.getElementById(id)},esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})},yen=function(n){return n.toLocaleString('ja-JP')+'円'};
if(!$('o-cart'))return;
var H=0,q=0,state,autoQuantity=true,warnT;
function warn(message){$('o-qwarn').textContent=message;$('o-qwarn').hidden=false;clearTimeout(warnT);warnT=setTimeout(function(){$('o-qwarn').hidden=true},3500)}
function setQ(value,manual){var max=Math.min(999,H);if(value>max&&manual)warn('対象の引出物の数（'+max+'個）まで選べます。');q=max?Math.max(1,Math.min(max,value)):0;if(manual)autoQuantity=false;$('o-qty').value=q||''}
function nameToggle(){var enabled=$('o-name-enable').checked;$('o-name-fields').hidden=!enabled;$('o-name-fields').disabled=!enabled;$('o-name-enable').setAttribute('aria-expanded',String(enabled))}
function cartHtml(){
 if(!state.lines.length)return '<b>カートに引出物が入っていません</b><small>先に対象の引出物・引菓子をカートに追加してください。</small>';
 return state.lines.map(function(p){return '<div class="cl'+(p.eligible?'':' off')+'"><span><a href="'+ShopCatalog.link(p.id)+'">'+esc(p.title)+'</a><small>単価 '+yen(p.price)+'（税込）／税別 '+yen(p.net)+(p.reason?'・'+esc(p.reason):'・対象')+'</small></span><b>×'+p.qty+'</b></div>'}).join('')+'<div class="ct">対象の引出物：<b>'+H+'個</b>（現在のカート）</div>';
}
function calc(){
 nameToggle();var key=$('o-seal').value.slice(0,2);$('o-sealimg').src='images/mini-seal/'+key+'.png';$('o-bday').hidden=key!=='52';
 var empty=H===0,eligible=state.eligible&&q>0;
 $('o-qty').disabled=empty;$('o-minus').disabled=empty;$('o-plus').disabled=empty;$('o-qbox').classList.toggle('empty',empty);$('o-qty').placeholder=empty?'対象の引出物が入っていません':'';
 var j=$('o-judge');j.className='judge '+(eligible?'ok':'ng');j.textContent=eligible?'条件を満たしています。プチギフト'+q+'個が5円です。':empty?'カートに対象の引出物が入っていません。税別800円以上の引出物・引菓子を追加してください。':'対象の引出物が'+H+'個です。20個以上で5円になります（あと'+(20-H)+'個）。';
 var total=q*5,parts=['プチギフト '+yen(total)];
 document.querySelectorAll('.cpo .chk input:checked').forEach(function(c){var n=c.dataset.per==='q'?q:c.dataset.per==='h'?H:Math.max(1,Number($('o-sq').value)||1),v=Number(c.dataset.p)*n;total+=v;parts.push(c.dataset.n+' '+yen(v))});
 $('o-sh').textContent='プチギフト'+q+'個 → '+Math.max(1,Math.ceil(q/50))+'シートあれば足ります';$('o-tot').textContent=yen(total);$('o-break').textContent=parts.join(' ＋ ');$('o-add').disabled=!eligible;$('o-added').hidden=true;
}
function refresh(){state=DemoCart.campaign();H=state.count;setQ(autoQuantity||q<1?H:q,false);$('o-cart').innerHTML=cartHtml();$('o-cart').className='cartref'+(H?'':' empty');calc()}
document.querySelectorAll('.cpo input[data-sub]').forEach(function(c){c.addEventListener('change',function(){$(c.dataset.sub).hidden=!c.checked})});
document.querySelectorAll('.cpo input:not(#o-qty),.cpo select').forEach(function(e){e.addEventListener('input',calc);e.addEventListener('change',calc)});
$('o-qty').addEventListener('input',function(){var raw=this.value.replace(/[０-９]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-65248)});if(!/^\d+$/.test(raw)){$('o-add').disabled=true;return}setQ(Number(raw),true);calc()});
$('o-qty').addEventListener('blur',function(){setQ(Number(this.value)||1,false);calc()});
$('o-minus').addEventListener('click',function(){setQ(q-1,true);calc()});$('o-plus').addEventListener('click',function(){setQ(q+1,true);calc()});
// 数字を左右へなぞって数量を変える操作を保持。
(function(){var box=$('o-qs'),down=false,x=0,acc=0;box.addEventListener('pointerdown',function(e){if(!H||(e.target===$('o-qty')&&document.activeElement===$('o-qty')))return;down=true;x=e.clientX;acc=0;box.setPointerCapture(e.pointerId)});box.addEventListener('pointermove',function(e){if(!down)return;acc+=e.clientX-x;x=e.clientX;var steps=Math.trunc(acc/18);if(steps){acc-=steps*18;setQ(q+steps,true);calc()}});['pointerup','pointercancel'].forEach(function(event){box.addEventListener(event,function(){down=false})})})();
function options(){
 var order=DemoCart.readOrder(),op=order.options||{bag:{on:false,d:'さくら'},seal:{on:false,d:'01.ティアラ-P',q:1},paper:{on:false,q:1},wraps:[],cur:0};
 document.querySelectorAll('.cpo .chk input:checked').forEach(function(c){
  if(c.dataset.sub==='s-bag')op.bag={on:true,d:$('o-bag').value};
  else if(c.dataset.sub==='s-seal')op.seal={on:true,d:$('o-seal').value,q:Math.max(1,Math.min(999,Number($('o-sq').value)||1))};
  else if(c.dataset.per==='h'&&Number(c.dataset.p)===50)op.paper={on:true,q:H};
  else if(c.dataset.per==='h'&&Number(c.dataset.p)===90)op.wraps=[{item:'all',q:H,mode:'both',noshi:'A',kake:'外のし',use:'寿',free:'',low:'',paper:'01ブラウン',pc:'opt-wrap-01.jpg',pack:'each'}];
 });
 var result={options:op};if(document.querySelector('.cpo input[data-sub="s-seal"]').checked){result.sealName=$('o-sn').value;result.sealDate=$('o-sd').value}return result;
}
$('o-add').addEventListener('click',function(){refresh();if(!state.eligible)return;try{
 DemoCart.addCampaign({qty:q,design:document.querySelector('input[name="o-design"]:checked').value,named:$('o-name-enable').checked,groom:$('o-n1').value,bride:$('o-n2').value,date:$('o-date').value},options());$('o-added').hidden=false;
}catch(e){warn(e.message)}});
var saved=DemoCart.readOrder().campaign;if(saved){autoQuantity=false;q=saved.qty;$('o-name-enable').checked=!!saved.named;$('o-n1').value=saved.groom||'';$('o-n2').value=saved.bride||'';$('o-date').value=saved.date||'';document.querySelectorAll('input[name="o-design"]').forEach(function(r){r.checked=r.value===saved.design})}
window.addEventListener('democartchange',refresh);window.addEventListener('pageshow',refresh);window.addEventListener('focus',refresh);document.addEventListener('visibilitychange',function(){if(!document.hidden)refresh()});refresh();
})();
