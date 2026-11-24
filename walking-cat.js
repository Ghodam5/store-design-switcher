/* 林さんご提供の白猫イラスト23コマ（images/walking-cat-sheet.png）の共通部品。
   動きの判断はsite-announcements.jsが行い、ここはコマの並びと見た目だけを持つ。 */
(()=>{'use strict';
const FRAMES={walk:[0,1,2,3],run:[4,5,6,7],jump:[8,9,10,11],play:[12,13,14,15],drink:[16,17,18],sleep:[19,20,21,22]};
const FRAME_MS={walk:180,run:110,jump:160,play:240,drink:380,sleep:650};
window.LunaWalkingCat=Object.freeze({FRAMES,FRAME_MS,WIDTH:56,
  markup:()=>`<button class="cat-banner-wrap" type="button" aria-label="猫をなでる（じゃれる・水を飲む）"><span class="cat-sprite"></span><span class="cat-zz" aria-hidden="true">z z</span></button>`,
  show:(el,state,i)=>{const f=FRAMES[state]||FRAMES.walk;el.style.backgroundPositionX=`${-56*f[i%f.length]}px`;}});
})();
