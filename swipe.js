/* 数量の「− 数字 ＋」をスワイプでも変えられるようにする共通部品（全ページ共通）
   数字の部分を右へなぞると増え、左へなぞると減ります（18pxごとに1）。
   中身は＋−ボタンを押すのと同じ動きなので、各ページの上限・下限の決まりもそのまま使われます。 */
(function(){var STEP=18,st=null;
function minus(q){return q.querySelector('button:first-child')}
function plus(q){return q.querySelector('button:last-child')}
document.addEventListener('pointerdown',function(e){var inp=e.target.closest&&e.target.closest('.qty input');if(!inp||e.button>0)return;
 if(document.activeElement===inp)return;var q=inp.closest('.qty');st={q:q,inp:inp,x:e.clientX,acc:0,moved:false,id:e.pointerId};try{inp.setPointerCapture(e.pointerId)}catch(_){}});
document.addEventListener('pointermove',function(e){if(!st||e.pointerId!==st.id)return;st.acc+=e.clientX-st.x;st.x=e.clientX;
 var n=Math.trunc(st.acc/STEP);if(!n)return;st.acc-=n*STEP;st.moved=true;st.q.classList.add('swiping');
 for(var i=0;i<Math.abs(n);i++){if(n<0){if((parseInt(st.inp.value)||1)<=1)break;minus(st.q).click()}else plus(st.q).click()}});
function end(){if(st){var s=st;st=null;setTimeout(function(){s.q.classList.remove('swiping')},150);if(s.moved)s.inp.blur()}}
document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end);
document.addEventListener('click',function(e){var inp=e.target.closest&&e.target.closest('.qty input');if(inp&&inp.dataset.sw){e.preventDefault()}},true);
document.addEventListener('focusin',function(e){if(e.target.closest&&e.target.closest('.qty input'))e.target.closest('.qty').classList.remove('swipable')});
document.addEventListener('focusout',function(e){if(e.target.closest&&e.target.closest('.qty input'))e.target.closest('.qty').classList.add('swipable')});
function init(){document.querySelectorAll('.qty').forEach(function(q){q.classList.add('swipable');q.title='数字の部分を左右になぞって数を変えられます'})}
init();new MutationObserver(init).observe(document.body,{childList:true,subtree:true})})();
