/* 読み終えてから読むもの（v75 スマホの表示速度対策）。全ページのheadで読む小さな部品。
   ・動くロゴ：最初は軽い「止まった1コマ目」を出し、ページを読み終えてから動くロゴに差し替える（1コマ目は同じ絵なので切り替わりは見えない）。
   ・Webフォント（Noto Sans JP ほか）：初めての訪問では読み終えてから読む。2ページ目からはブラウザに残っているので、すぐ読む。
     パソコン（横1024px以上）は回線と処理に余裕があり、後から文字が変わってメニューがずれるのを防ぐため、従来どおりすぐ読む。
   フォントのURLは各ページの <noscript> と同じものを使う（JSが使えないときはnoscript側が効く）。 */
(()=>{'use strict';
const FONT_URL='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;700;900&family=Cormorant+Garamond:wght@500;600&family=Great+Vibes&display=swap';
const KEY='luna-fonts-cached';
let cached=false;try{cached=localStorage.getItem(KEY)==='1'}catch(e){}
function addFonts(){if(document.querySelector('link[data-luna-fonts]'))return;const l=document.createElement('link');l.rel='stylesheet';l.href=FONT_URL;l.dataset.lunaFonts='';l.onload=()=>{try{localStorage.setItem(KEY,'1')}catch(e){}};document.head.appendChild(l);}
function swapLogos(){document.querySelectorAll('img[data-anim-src]').forEach(img=>{const src=img.getAttribute('data-anim-src');img.removeAttribute('data-anim-src');const pre=new Image();pre.onload=()=>{img.src=src};pre.src=src;});}
const wide=matchMedia('(min-width:1024px)').matches;
function afterLoad(){const run=()=>{if(!cached&&!wide)addFonts();swapLogos();};if('requestIdleCallback' in window)requestIdleCallback(run,{timeout:1500});else setTimeout(run,200);}
if(cached||wide)addFonts();
if(document.readyState==='complete')afterLoad();else addEventListener('load',afterLoad,{once:true});
})();
