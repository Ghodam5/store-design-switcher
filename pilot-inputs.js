/* 全ページ共通の数量ホイール。確定時だけ既存入力へ渡す。日付は従来の対象条件を保持。 */
(function(){
'use strict';
if(window.PilotInputs)return;
var quantitySelector='input[data-quantity-picker],.qty input:not([type=checkbox]):not([type=radio]),input[name=quantity]';
var ids=['47484','58190','42902','21013','72349'],active=null,dialog=null,wheels=[],oldOverflow='';
function target(id){return ids.indexOf(String(id))>=0}
function parseDate(value){
 var s=String(value||'').trim(),m=s.match(/^(\d{4})[年.\/\-](\d{1,2})[月.\/\-](\d{1,2})日?$/)||s.match(/^(\d{4})(\d{2})(\d{2})$/);
 if(!m)return null;var y=+m[1],mo=+m[2],d=+m[3],dt=new Date(0);dt.setFullYear(y,mo-1,d);dt.setHours(0,0,0,0);
 return y>=1900&&mo>=1&&mo<=12&&d>=1&&dt.getFullYear()===y&&dt.getMonth()===mo-1&&dt.getDate()===d?[y,mo,d]:null;
}
function pad(n){return String(n).padStart(2,'0')}
function dateError(p,f,value){return target(p.id)&&f.role==='d'&&f.part==='text'&&value&&!parseDate(value)?f.label+'は実在する年月日を入力してください（例：2027.04.18）。':''}
function build(){
 if(dialog)return;
 dialog=document.createElement('dialog');dialog.className='pilot-picker';dialog.setAttribute('aria-labelledby','picker-title');
 dialog.innerHTML='<div class="picker-head"><button type="button" data-cancel>キャンセル</button><h2 id="picker-title"></h2><button type="button" data-done>決定</button></div><p class="picker-note"></p><div class="picker-wheels"></div><div class="picker-direct"></div><p class="picker-error" role="alert"></p>';
 document.body.appendChild(dialog);
 dialog.querySelector('[data-cancel]').onclick=function(){dialog.close()};
 dialog.querySelector('[data-done]').onclick=commit;
 dialog.addEventListener('click',function(e){if(e.target===dialog){var r=dialog.getBoundingClientRect();if(e.clientY<r.top||e.clientY>r.bottom||e.clientX<r.left||e.clientX>r.right)dialog.close()}});
 dialog.addEventListener('close',function(){document.documentElement.style.overflow=oldOverflow;var a=active;active=null;wheels=[];if(a&&a.trigger.isConnected)a.trigger.focus()});
}
function range(a,b){return Array.from({length:b-a+1},function(_,i){return a+i})}
function wheel(label,values,initial,change){
 var wrap=document.createElement('div');wrap.className='picker-column';var cap=document.createElement('div');cap.textContent=label;cap.className='picker-label';wrap.appendChild(cap);
 var el=document.createElement('div');el.className='picker-wheel';el.tabIndex=0;el.setAttribute('role','spinbutton');el.setAttribute('aria-label',label+'。上下にスワイプ、または矢印キーで変更');wrap.appendChild(el);
 var w={el:el,values:values,value:initial,change:change,timer:0};
 function mark(){var idx=Math.max(0,Math.min(w.values.length-1,Math.round(el.scrollTop/44)));w.value=w.values[idx];el.setAttribute('aria-valuenow',w.value);el.setAttribute('aria-valuetext',w.value+label);el.querySelectorAll('.picker-option').forEach(function(n,i){n.classList.toggle('selected',i===idx)});}
 w.read=function(){mark();return w.value};
 w.go=function(value){var i=Math.max(0,w.values.indexOf(value));el.scrollTop=i*44;mark()};
 w.paint=function(vals,value){w.values=vals;el.innerHTML=vals.map(function(n,i){return '<div class="picker-option" aria-hidden="true" data-index="'+i+'">'+n+'</div>'}).join('');el.setAttribute('aria-valuemin',vals[0]);el.setAttribute('aria-valuemax',vals[vals.length-1]);w.go(value)};
 w.paint(values,initial);
 el.addEventListener('scroll',function(){mark();if(label==='個数'&&w.change)w.change(w.value);clearTimeout(w.timer);w.timer=setTimeout(function(){mark();if(w.change)w.change(w.value)},140)},{passive:true});
 el.addEventListener('click',function(e){var o=e.target.closest('[data-index]');if(o){w.go(w.values[+o.dataset.index]);if(w.change)w.change(w.value)}});
 el.addEventListener('keydown',function(e){var i=w.values.indexOf(w.read()),next=i;if(e.key==='ArrowUp')next=i-1;else if(e.key==='ArrowDown')next=i+1;else if(e.key==='Home')next=0;else if(e.key==='End')next=w.values.length-1;else return;e.preventDefault();w.go(w.values[Math.max(0,Math.min(w.values.length-1,next))]);if(w.change)w.change(w.value)});
 dialog.querySelector('.picker-wheels').appendChild(wrap);wheels.push(w);return w;
}
function open(input,trigger,kind){
 build();active={input:input,trigger:trigger,kind:kind};wheels=[];dialog.querySelector('.picker-wheels').innerHTML='';dialog.querySelector('.picker-direct').innerHTML='';dialog.querySelector('.picker-error').textContent='';
 dialog.querySelector('#picker-title').textContent=kind==='quantity'?'数量を選ぶ':'日付を選ぶ';
 dialog.querySelector('.picker-note').textContent=kind==='quantity'?'上下に回して選択。多い個数は下の欄へ直接入力できます。':'年・月・日を上下に回して選択。この日付は印字・刺繍用です。';
 oldOverflow=document.documentElement.style.overflow;document.documentElement.style.overflow='hidden';dialog.showModal();
 if(kind==='quantity'){
  var min=Number(input.min)||1,max=Number(input.max)||999,n=Math.max(min,Math.min(max,Number(input.value)||min));
  var direct=dialog.querySelector('.picker-direct');direct.innerHTML='<details class="picker-keyboard"><summary>キーボードで直接入力する</summary><label for="picker-number">直接入力（'+min+'〜'+max+'）</label><input id="picker-number" type="number" inputmode="numeric" min="'+min+'" max="'+max+'" step="1" value="'+n+'"></details><div class="picker-quick" aria-label="よく使う数量">'+[10,20,30,50,100].filter(function(v){return v>=min&&v<=max}).map(function(v){return '<button type="button" data-number="'+v+'">'+v+'</button>'}).join('')+'</div>';
  var number=direct.querySelector('input'),q=wheel('個数',range(min,max),n,function(v){number.value=v});
  number.addEventListener('input',function(){var v=Number(number.value);if(Number.isInteger(v)&&v>=min&&v<=max)q.go(v)});
  direct.querySelectorAll('button').forEach(function(b){b.onclick=function(){number.value=b.dataset.number;q.go(+b.dataset.number)}});
  requestAnimationFrame(function(){q.go(n);q.el.focus()});
 }else{
  var now=new Date(),initial=parseDate(input.value)||[now.getFullYear(),now.getMonth()+1,now.getDate()],year,month,day;
  function days(y,m){return new Date(y,m,0).getDate()}
  function fixDays(){var chosen=day.read(),count=days(year.read(),month.read());day.paint(range(1,count),Math.min(chosen,count));sync()}
  function sync(){if(year&&month&&day)dialog.querySelector('#picker-calendar').value=year.read()+'-'+pad(month.read())+'-'+pad(day.read())}
  dialog.querySelector('.picker-direct').innerHTML='<label for="picker-calendar">カレンダー・キーボードでも指定できます</label><input id="picker-calendar" type="date" min="1900-01-01" max="'+(now.getFullYear()+30)+'-12-31">';
  year=wheel('年',range(1900,Math.max(now.getFullYear()+30,initial[0])),initial[0],fixDays);month=wheel('月',range(1,12),initial[1],fixDays);day=wheel('日',range(1,days(initial[0],initial[1])),initial[2],sync);
  dialog.querySelector('#picker-calendar').addEventListener('change',function(e){var v=parseDate(e.target.value);if(v){year.go(v[0]);month.go(v[1]);day.paint(range(1,days(v[0],v[1])),v[2])}});
  requestAnimationFrame(function(){year.go(initial[0]);month.go(initial[1]);day.go(initial[2]);sync();year.el.focus()});
 }
}
function commit(){
 if(!active)return;var value,error=dialog.querySelector('.picker-error');
 if(active.kind==='quantity'){
  var field=dialog.querySelector('#picker-number');if(!field.reportValidity()||field.value===''){error.textContent='指定できる範囲の整数を入力してください。';return}value=String(Number(field.value));
 }else{
  var date=dialog.querySelector('#picker-calendar');if(!date.reportValidity()||!parseDate(date.value)){error.textContent='実在する年月日を指定してください。';return}var year=wheels[0].read(),month=wheels[1].read(),day=Math.min(wheels[2].read(),new Date(year,month,0).getDate());value=year+'.'+pad(month)+'.'+pad(day);
 }
 active.input.value=value;active.input.dispatchEvent(new Event('input',{bubbles:true}));active.input.dispatchEvent(new Event('change',{bubbles:true}));dialog.close();scan();
}
function enhanceQuantity(input){
 if(input.dataset.pilotInput)return;input.dataset.pilotInput='quantity';var box=input.closest('.qty');if(!box){box=document.createElement('span');box.className='quantity-picker-slot';input.before(box);box.appendChild(input);}box.classList.add('pilot-qty');
 var button=document.createElement('button');button.type='button';button.className='pilot-quantity-button';button.setAttribute('aria-haspopup','dialog');input.before(button);input._quantityTrigger=button;button.onclick=function(){open(input,button,'quantity')};
 function sync(){button.textContent=(input.value||'1')+' ▾';button.setAttribute('aria-label','数量 '+(input.value||'1')+'。上下に回して選ぶ')}
 input.addEventListener('input',sync);input.addEventListener('change',sync);box.addEventListener('click',function(){setTimeout(sync,0)});var minimum=document.getElementById('use-minimum');if(minimum)minimum.addEventListener('click',sync);sync();
}
function enhanceDate(input){
 if(input.dataset.pilotInput)return;input.dataset.pilotInput='date';input.inputMode='numeric';var button=document.createElement('button');button.type='button';button.className='pilot-date-button';button.textContent='年月日を回して選ぶ';button.setAttribute('aria-haspopup','dialog');input.after(button);button.onclick=function(){open(input,button,'date')};
 var note=document.createElement('p');note.className='pilot-date-note';note.id=input.id+'-date-note';note.textContent='例：2027.04.18 または 20270418。印字・刺繍する日付です。';input.setAttribute('aria-describedby',note.id);button.after(note);
 function validate(){var bad=input.value&&!parseDate(input.value);input.setCustomValidity(bad?'実在する年月日を入力してください。':'');input.setAttribute('aria-invalid',String(!!bad));note.textContent=bad?'日付を確認してください。例：2027.04.18':'例：2027.04.18 または 20270418。印字・刺繍する日付です。';note.classList.toggle('invalid',!!bad)}input.addEventListener('input',validate);validate();
}
function scan(){
 document.querySelectorAll(quantitySelector).forEach(enhanceQuantity);document.querySelectorAll('input[data-date-picker]').forEach(enhanceDate);if(!window.ShopCatalog)return;
 document.querySelectorAll('.ci[data-product]').forEach(function(row){var p=ShopCatalog.get(row.dataset.product);row.querySelectorAll('.qty input[type=number]').forEach(enhanceQuantity);if(!target(row.dataset.product)||!p?.spec)return;row.querySelectorAll('.ff[data-i]').forEach(function(field){var f=p.spec.fields[Number(field.dataset.i)],input=field.querySelector('input:not([type=checkbox]):not([type=radio])');if(f&&f.role==='d'&&f.part==='text'&&input)enhanceDate(input)})});
}
window.PilotInputs={parseDate:parseDate,dateError:dateError};
function tappedQuantity(e){
 if(!matchMedia('(max-width:1023px)').matches)return;
 var input=e.target.matches?.(quantitySelector)?e.target:null,label=e.target.closest?.('label');
 if(!input&&label){var candidate=label.htmlFor?document.getElementById(label.htmlFor):label.querySelector(quantitySelector);if(candidate?.matches(quantitySelector))input=candidate;}
 if(!input||input.disabled)return;e.preventDefault();enhanceQuantity(input);if(!dialog?.open)open(input,input._quantityTrigger,'quantity');
}
document.addEventListener('pointerdown',tappedQuantity,{capture:true,passive:false});
document.addEventListener('touchstart',tappedQuantity,{capture:true,passive:false});
scan();document.addEventListener('DOMContentLoaded',scan,{once:true});var scheduled=false;new MutationObserver(function(){if(!scheduled){scheduled=true;requestAnimationFrame(function(){scheduled=false;scan()})}}).observe(document.documentElement,{childList:true,subtree:true});
})();
