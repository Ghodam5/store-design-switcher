(()=>{'use strict';
const root=document.querySelector('.support-page');if(!root)return;
const tabs=[...root.querySelectorAll('[data-order-tab]')];function tab(t){tabs.forEach(b=>{const yes=b===t;b.classList.toggle('active',yes);b.setAttribute('aria-selected',yes);b.tabIndex=yes?0:-1;const p=document.getElementById(b.getAttribute('aria-controls'));if(p)p.hidden=!yes;});}tabs.forEach((b,i)=>{b.addEventListener('click',()=>tab(b));b.addEventListener('keydown',e=>{let n;if(e.key==='ArrowRight')n=(i+1)%tabs.length;if(e.key==='ArrowLeft')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();tab(tabs[n]);tabs[n].focus();}});});if(tabs.length)tab(tabs[0]);
const faxTabs=[...root.querySelectorAll('[data-fax-type]')];faxTabs.forEach(b=>b.addEventListener('click',()=>{faxTabs.forEach(t=>{const yes=t===b;t.classList.toggle('active',yes);t.setAttribute('aria-selected',yes);});root.querySelectorAll('.fax-paper').forEach(p=>p.classList.toggle('active',p.id==='paper-'+b.dataset.faxType));}));
// 記入例と実際の入力を別々に扱う。個人情報は端末へ保存しない。
let sample=false;
const saved=new Map();
const sampleBtn=root.querySelector('[data-sample-toggle]');
const capture=el=>({value:el.value,checked:el.checked});
function restore(el,state){el.value=state.value;if('checked' in el)el.checked=state.checked;}
if(sampleBtn){
 const initial=sampleBtn.textContent;
 sampleBtn.setAttribute('aria-pressed','false');
 sampleBtn.addEventListener('click',()=>{
  sample=!sample;
  if(sample){
   root.querySelectorAll('[data-sample],[data-sample-check]').forEach(el=>{
    saved.set(el,capture(el));
    if(el.hasAttribute('data-sample'))el.value=el.dataset.sample;
    if(el.hasAttribute('data-sample-check'))el.checked=el.dataset.sampleCheck!=='false';
    el.classList.add('is-example');
   });
  }else{
   saved.forEach((state,el)=>{restore(el,state);el.classList.remove('is-example');});
   saved.clear();
  }
  sampleBtn.textContent=sample?'記入例を閉じて入力内容に戻す':initial;
  sampleBtn.setAttribute('aria-pressed',String(sample));
 });
}
// 記入例を自分で書き換えた欄は、実際の入力として黒字・印刷対象にする。
function keepUserInput(event){const el=event.target;if(saved.has(el)){saved.delete(el);el.classList.remove('is-example');}}
root.addEventListener('input',keepUserInput);root.addEventListener('change',keepUserInput);
root.querySelectorAll('table').forEach(t=>{const heads=[...t.querySelectorAll('thead th')].map(th=>th.textContent.trim());if(heads.length)t.querySelectorAll('tbody tr').forEach(tr=>{[...tr.children].forEach((td,i)=>{if(td.tagName==='TD'&&!td.dataset.label&&heads[i])td.dataset.label=heads[i];});});});
// ボタン・Ctrl+P・ブラウザの印刷メニュー・PDF出力を同じ準備処理に通す。
let printing=false;
const printValues=new Map(),printPlaceholders=new Map();
function preparePrint(kind){
 if(printing)return;
 printing=true;
 const mode=kind||root.querySelector('[data-print]')?.dataset.print;
 if(mode)document.body.dataset.print=mode;
 saved.forEach((real,el)=>{printValues.set(el,capture(el));restore(el,real);});
 root.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>{
  printPlaceholders.set(el,el.getAttribute('placeholder'));el.removeAttribute('placeholder');
 });
 root.querySelectorAll('textarea').forEach(el=>{
  const span=document.createElement('span');span.className='print-value';span.textContent=el.value;el.before(span);
 });
}
function cleanPrint(){
 if(!printing)return;
 printValues.forEach((display,el)=>restore(el,display));printValues.clear();
 printPlaceholders.forEach((placeholder,el)=>el.setAttribute('placeholder',placeholder));printPlaceholders.clear();
 root.querySelectorAll('.print-value').forEach(el=>el.remove());
 delete document.body.dataset.print;printing=false;
}
root.querySelectorAll('[data-print]').forEach(button=>button.addEventListener('click',()=>{preparePrint(button.dataset.print);window.print();}));
window.addEventListener('beforeprint',()=>preparePrint());
window.addEventListener('afterprint',cleanPrint);
const checks=[...root.querySelectorAll('#checklistBody input[type=checkbox]')];const key='lunaluce_wedding_checklist_v1';function progress(){const n=checks.filter(c=>c.checked).length;checks.forEach(c=>c.closest('tr')?.classList.toggle('done',c.checked));const fill=document.getElementById('progressFill'),txt=document.getElementById('progressText');const pct=Math.round(n/checks.length*100);if(fill){fill.style.width=pct+'%';fill.setAttribute('aria-valuenow',String(pct));}if(txt)txt.textContent=n+'/'+checks.length+' 完了（'+pct+'%）';try{localStorage.setItem(key,JSON.stringify(checks.map(c=>c.checked)));}catch{}}if(checks.length){try{const old=JSON.parse(localStorage.getItem(key));if(Array.isArray(old))checks.forEach((c,i)=>c.checked=old[i]===true);}catch{}checks.forEach(c=>c.addEventListener('change',progress));progress();}
const search=root.querySelector('#faq-search'),qs=[...root.querySelectorAll('.faq-item')],filters=[...root.querySelectorAll('[data-faq-category]')];let cat='all';const norm=s=>s.normalize('NFKC').toLowerCase().replace(/\s+/g,' ').trim();function filter(){const text=norm(search?.value||'');let n=0;qs.forEach(q=>{const yes=(cat==='all'||q.dataset.category===cat)&&norm(q.textContent).includes(text);q.hidden=!yes;if(yes)n++;if(text&&yes)q.open=true;});const count=root.querySelector('#faq-count');if(count)count.textContent=n+'件のご質問';const empty=root.querySelector('#faq-empty');if(empty)empty.hidden=n>0;}filters.forEach(b=>b.addEventListener('click',()=>{cat=b.dataset.faqCategory;filters.forEach(t=>t.setAttribute('aria-pressed',String(t===b)));filter();}));search?.addEventListener('input',filter);if(qs.length)filter();
})();
