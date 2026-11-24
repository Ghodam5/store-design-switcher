(()=>{'use strict';
const seen=new WeakSet();
function attach(area){
 if(seen.has(area))return;seen.add(area);
 if(/^例[:：\s\d]/.test(area.getAttribute('placeholder')||''))area.dataset.examplePlaceholder='';
 const box=document.createElement('div');box.className='notes-resize-box';area.before(box);box.append(area);
 const handle=document.createElement('button');handle.type='button';handle.className='notes-resize-handle';handle.setAttribute('aria-label','入力欄の大きさを変更（矢印キーでも調整できます）');handle.title='右下をドラッグして広げる';box.append(handle);
 let drag=null;
 function limits(){const p=box.parentElement,s=getComputedStyle(p);return Math.max(0,p.clientWidth-parseFloat(s.paddingLeft||0)-parseFloat(s.paddingRight||0));}
 function resize(width,height){const max=limits();if(max>0)box.style.width=Math.min(max,Math.max(Math.min(140,max),width))+'px';area.style.height=Math.max(80,height)+'px';}
 handle.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();drag={x:e.clientX,y:e.clientY,width:box.getBoundingClientRect().width,height:area.getBoundingClientRect().height};handle.setPointerCapture(e.pointerId);});
 handle.addEventListener('pointermove',e=>{if(!drag)return;e.preventDefault();resize(drag.width+e.clientX-drag.x,drag.height+e.clientY-drag.y);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])handle.addEventListener(type,()=>{drag=null;});
 handle.addEventListener('keydown',e=>{const keys=['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'];if(!keys.includes(e.key))return;e.preventDefault();e.stopPropagation();const step=e.shiftKey?40:20;resize(box.getBoundingClientRect().width+(e.key==='ArrowRight'?step:e.key==='ArrowLeft'?-step:0),area.getBoundingClientRect().height+(e.key==='ArrowDown'?step:e.key==='ArrowUp'?-step:0));});
}
function scan(node){if(node.nodeType!==1)return;if(node.matches('textarea'))attach(node);node.querySelectorAll('textarea').forEach(attach);}
scan(document.body);new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(scan))).observe(document.body,{childList:true,subtree:true});
// ガイド以外の欄も、ブラウザ印刷時は入力例を除き、長い実入力を折り返す。
const saved=new Map();let printing=false;
addEventListener('beforeprint',()=>{if(printing)return;printing=true;document.querySelectorAll('textarea:not(.support-page textarea)').forEach(area=>{saved.set(area,area.getAttribute('placeholder'));area.removeAttribute('placeholder');const span=document.createElement('span');span.className='notes-print-value';span.textContent=area.value;area.before(span);});});
addEventListener('afterprint',()=>{saved.forEach((placeholder,area)=>{if(placeholder!==null)area.setAttribute('placeholder',placeholder);});saved.clear();document.querySelectorAll('.notes-print-value').forEach(e=>e.remove());printing=false;});
})();
