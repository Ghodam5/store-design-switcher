/* CSSのmanipulationが効かない旧iOS向け。静止した単指の連続タップだけを処理する。 */
(()=>{'use strict';let start=null,last=null;
const excluded=e=>e.target.closest?.('.viewer-viewport');
document.addEventListener('touchstart',e=>{if(e.touches.length!==1||excluded(e)||window.visualViewport?.scale>1.02){start=last=null;return;}const t=e.touches[0];start={x:t.clientX,y:t.clientY,time:performance.now(),moved:false};},{passive:true,capture:true});
document.addEventListener('touchmove',e=>{if(!start)return;if(e.touches.length!==1){start=last=null;return;}const t=e.touches[0];if(Math.hypot(t.clientX-start.x,t.clientY-start.y)>10)start.moved=true;},{passive:true,capture:true});
document.addEventListener('touchcancel',()=>{start=last=null;},{passive:true,capture:true});
document.addEventListener('touchend',e=>{const s=start;start=null;if(!s||s.moved||e.touches.length||performance.now()-s.time>350||excluded(e)){last=null;return;}const now=performance.now(),t=e.changedTouches[0];if(last&&now-last.time<350&&Math.hypot(t.clientX-last.x,t.clientY-last.y)<30&&e.cancelable){e.preventDefault();const target=e.target.closest?.('button,a[href],summary,[role="button"],input[type="checkbox"],input[type="radio"]');if(target&&!target.disabled&&target.getAttribute('aria-disabled')!=='true')target.click();}last={x:t.clientX,y:t.clientY,time:now};},{passive:false,capture:true});
})();
