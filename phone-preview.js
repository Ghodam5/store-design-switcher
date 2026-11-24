/* 一覧のスマホ見本：390pxの表示を、枠の内寸に合わせて一度だけ縮小する。 */
(()=>{'use strict';
const phones=[...document.querySelectorAll('.phone')];
function fit(phone){const frame=phone.querySelector('iframe'),width=phone.clientWidth,height=phone.clientHeight;if(!frame||!width||!height)return;const scale=width/390;phone.style.setProperty('--preview-scale',String(scale));frame.style.height=(height/scale)+'px';}
if('ResizeObserver' in window){const observer=new ResizeObserver(entries=>entries.forEach(e=>fit(e.target)));phones.forEach(p=>observer.observe(p));}else window.addEventListener('resize',()=>phones.forEach(fit));
phones.forEach(fit);
})();
