(()=>{'use strict';
// 新しいページは先頭から。見出しへのリンクと、読込中に始めた操作は尊重する。
try{if('scrollRestoration' in history)history.scrollRestoration='manual';}catch{}
let interacted=false;
for(const type of ['pointerdown','touchstart','wheel','keydown'])addEventListener(type,()=>{interacted=true;},{capture:true,passive:true});
function top(){window.scrollTo({top:0,left:0,behavior:'instant'});}
if(!location.hash)top();
document.addEventListener('DOMContentLoaded',()=>{if(!location.hash&&!interacted)top();},{once:true});
addEventListener('pageshow',event=>{
 if(event.persisted){
  interacted=false;
  if(location.hash){let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}const anchor=document.getElementById(id)||document.getElementsByName(id)[0];if(anchor)anchor.scrollIntoView({block:'start',behavior:'instant'});}
  else top();
 }else if(!location.hash&&!interacted)top();
});
// 同じページ内で中分類・小分類だけを切り替えたときにも適用する。
addEventListener('luna:category-navigation',top);
})();
