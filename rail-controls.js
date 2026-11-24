/* 角丸矢印の共通部品。文字のフォント差に依存しない対称SVGを中央へ。 */
(()=>{'use strict';const selector='.rail-nav,.home-promo-controls button,.promo-side-arrow';
const bound=new WeakSet(),standardRails=new WeakSet();
function standardRail(w){
 const r=w?.querySelector('.rail[data-standard-rail]');if(!r)return;
 function update(){const start=r.scrollLeft<=1,end=r.scrollLeft>=r.scrollWidth-r.clientWidth-2;for(const [cls,on] of [['at-start',start],['at-end',end]])if(w.classList.contains(cls)!==on)w.classList.toggle(cls,on);for(const [sel,off] of [['.prev',start],['.next',end]]){const b=w.querySelector('.rail-nav'+sel);if(b)b.disabled=off;}}
 update();if(standardRails.has(r))return;standardRails.add(r);
 for(const dir of ['prev','next']){const b=w.querySelector('.rail-nav.'+dir);if(b)b.addEventListener('click',()=>r.scrollBy({left:(dir==='prev'?-1:1)*r.clientWidth*.85,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));}
 r.addEventListener('scroll',update,{passive:true});r.addEventListener('load',update,true);new MutationObserver(update).observe(r,{subtree:true,childList:true});if(window.ResizeObserver)new ResizeObserver(update).observe(r);
}

function activity(w){
 if(!w||bound.has(w))return;bound.add(w);let timer;
 function wake(){w.classList.add('rail-controls-active');clearTimeout(timer);timer=setTimeout(()=>w.classList.remove('rail-controls-active'),1200);}
 for(const name of ['pointerenter','pointermove','pointerdown','touchstart','touchmove','wheel','click','keydown','focusin'])w.addEventListener(name,wake,{passive:true});
 w.addEventListener('scroll',wake,{passive:true,capture:true});
}
function state(w){if(!w.matches?.('.rail-wrap'))return;standardRail(w);const p=w.querySelector('.rail-nav.prev'),n=w.querySelector('.rail-nav.next');if(p)p.disabled=w.classList.contains('at-start');if(n)n.disabled=w.classList.contains('at-end');}function enhance(root){const buttons=[];if(root.matches?.(selector))buttons.push(root);root.querySelectorAll?.(selector).forEach(b=>buttons.push(b));for(const b of buttons){standardRail(b.closest('.rail-wrap'));activity(b.closest('.home-promos,.rail-wrap'));if(b.classList.contains('round-arrow'))continue;const left=b.classList.contains('prev')||b.hasAttribute('data-promo-prev');if(!b.hasAttribute('aria-label'))b.setAttribute('aria-label',left?'前へ':'次へ');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',left?'M15 6L9 12L15 18':'M9 6L15 12L9 18');svg.append(p);b.replaceChildren(svg);b.classList.add('round-arrow');const w=b.closest('.rail-wrap');if(w)state(w);}}enhance(document);new MutationObserver(records=>records.forEach(r=>{if(r.type==='attributes')state(r.target);else r.addedNodes.forEach(n=>{if(n.nodeType===1)enhance(n);});})).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});})();
