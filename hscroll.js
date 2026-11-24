/* 横に並ぶ帯（あとから作られる所も含む）を、PCのマウスで横に動かす共通部品
   ・ホイールを縦に回すと横へ動く（端まで行ったらページのスクロールに戻る）
   ・つかんで左右に引っぱれる（少し動かしたら商品のクリックにしない）
   ・横に動かせる所にマウスを乗せると「ホイールで横にスクロール」の案内を出す
   ページを開いた時からある帯（.rail など）は各ページのスクリプトが担当するので、ここでは扱わない */
(function(){
var fine=window.matchMedia('(hover:hover) and (pointer:fine)');
var SEL='.rail,.season,.chips,.cats,.rankrow,.mtabs,.gal-track,.subrow .chips,.toolbar';
document.querySelectorAll('.rail,.season,.chips,.cats').forEach(function(r){r.dataset.hsOld='1'});
function scroller(t){var r=t&&t.closest?t.closest(SEL):null;
 while(r){if((!r.dataset.hsOld||r.hasAttribute('data-standard-rail'))&&r.scrollWidth>r.clientWidth+1)return r;r=r.parentElement?r.parentElement.closest(SEL):null}return null}
/* ホイール */
document.addEventListener('wheel',function(e){if(!fine.matches||e.defaultPrevented||Math.abs(e.deltaX)>Math.abs(e.deltaY))return;
 var r=scroller(e.target);if(!r)return;var max=r.scrollWidth-r.clientWidth,d=e.deltaY*(e.deltaMode===1?40:1);
 if((d>0&&r.scrollLeft>=max-1)||(d<0&&r.scrollLeft<=1))return;
 e.preventDefault();r.style.scrollSnapType='none';r.scrollLeft+=d;busy(r)},{passive:false});
/* ドラッグ */
var dr=null,sx=0,sl=0,moved=false;
document.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;var r=scroller(e.target);if(!r)return;
 dr=r;moved=false;sx=e.clientX;sl=r.scrollLeft;hide()});
window.addEventListener('pointermove',function(e){if(!dr)return;var dx=e.clientX-sx;
 if(!moved&&Math.abs(dx)>5){moved=true;dr.style.scrollSnapType='none';dr.style.cursor='grabbing';dr.classList.add('dragging')}
 if(moved)dr.scrollLeft=sl-dx});
window.addEventListener('pointerup',function(){if(!dr)return;var r=dr;dr=null;r.style.cursor='';r.classList.remove('dragging');if(moved)setTimeout(function(){moved=false},0)});
document.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener('dragstart',function(e){if(scroller(e.target))e.preventDefault()});
/* 案内 */
if(!fine.matches)return;
var tip=document.createElement('div');tip.className='hhint';tip.setAttribute('aria-hidden','true');
tip.innerHTML='<svg viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v3"/></svg><span><b class="t1">ホイールで横にスクロール</b><small class="t2">ドラッグでも動きます</small></span>';
document.body.appendChild(tip);var t1=tip.querySelector('.t1'),t2=tip.querySelector('.t2'),cur=null,hideT=0,isBusy=false;
function hide(){if(tip)tip.classList.remove('on')}
function text(r){var atEnd=r.scrollLeft>=r.scrollWidth-r.clientWidth-2;
 t1.textContent=atEnd?'ここが最後です':'ホイールで横にスクロール';t2.textContent=atEnd?'上に回すと戻ります':'ドラッグでも動きます'}
function busy(r){if(!tip)return;hide();isBusy=true;clearTimeout(hideT);hideT=setTimeout(function(){isBusy=false;if(cur){text(cur);tip.classList.add('on')}},700)}
document.addEventListener('mousemove',function(e){var r=scroller(e.target);
 if(!r||dr||e.buttons){if(!r)cur=null;hide();return}
 cur=r;text(r);var w=tip.offsetWidth,h=tip.offsetHeight,x=e.clientX+18,y=e.clientY+20;
 if(x+w>innerWidth-8)x=e.clientX-w-12;if(y+h>innerHeight-8)y=e.clientY-h-12;
 tip.style.transform='translate('+x+'px,'+y+'px)';if(!isBusy)tip.classList.add('on')},{passive:true});
document.addEventListener('mouseleave',function(){cur=null;hide()});
})();
