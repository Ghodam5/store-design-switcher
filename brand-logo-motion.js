/* ルナルーチェのロゴの動き（2026-11-24 林さん決定版・横長バナー）。原本: Dropbox 新規サイト ルナルーチェ/Logo/ロゴの動き_決定版_2026-11-24
   流れ: ひし形の鼓動→弾けてハート→満月→三日月→流星が2周してらせんで当たる→散る→星が回る中でロゴ→星がひし形へ */
(function(){
'use strict';
var LOGO_SRC='data:image/png;base64,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';
// 時間割（秒）
var T={pulse:0.6,hit1:3.75,spread:4.3,gather:6.9,solid:7.6,moon:10.4,shadeStart:10.8,shade:13.4,fly:14.2,orbit:16.4,hit2:16.65,scatter:17.8,stars:19.0,logo:19.4,converge:21.4,dia:22.5,end:26};
var STEP_AT=[T.pulse,T.hit1,T.spread,T.gather,T.solid,T.shadeStart,T.shade,T.hit2,T.scatter,T.logo,T.converge];
var MC={x:150,y:146},R=36;            // 月の中心と半径
var DIA={x:150,y:160.5};               // ひし形の位置
var PINK='#e2577a',PEAK=11,HCY=139,BH=52,Y0g=0,Sg=1;   // 横長：上下は150±BHの帯に収める
function clamp(v,a,b){return v<a?a:v>b?b:v;}
function prog(t,a,b){return clamp((t-a)/(b-a),0,1);}
function eo(p){return 1-Math.pow(1-p,3);}
function eo5(p){return 1-Math.pow(1-p,5);}
function ss(p){return p*p*p*(p*(p*6-15)+10);}
function eio(p){return p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;}
function lerp(a,b,p){return a+(b-a)*p;}
function rnd(seed){return function(){seed=(seed*16807)%2147483647;return (seed-1)/2147483646;};}
var r=rnd(23);
function heartXY(t,s,cx,cy){if(cx==null){cx=MC.x;cy=MC.y;}return {x:cx+s*16*Math.pow(Math.sin(t),3),y:cy-6*s/2.25-s*(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))};}
function heartPath(ctx,cx,cy,s){ctx.beginPath();for(var i=0;i<=80;i++){var h=heartXY(i/80*Math.PI*2,s,cx,cy);ctx.lineTo(h.x,h.y);}ctx.closePath();}
function star(ctx,x,y,rad,rot,fill,glow){ctx.save();ctx.translate(x,y);ctx.rotate(rot);if(glow){ctx.shadowColor=glow;ctx.shadowBlur=rad*1.4;}ctx.beginPath();for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?rad*.45:rad;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fillStyle=fill;ctx.fill();ctx.restore();}
function diamond(ctx,s){ctx.save();ctx.translate(DIA.x,DIA.y);ctx.scale(s,s);ctx.fillStyle='#e2b5a6';ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(5,0);ctx.lineTo(0,5);ctx.lineTo(-5,0);ctx.fill();ctx.restore();}

var logo=new Image(),parts=[],burst=[],ready=false;
logo.onload=function(){
  var c=document.createElement('canvas');c.width=c.height=300;var g=c.getContext('2d');g.drawImage(logo,0,0);var d=g.getImageData(0,0,300,300).data,pts=[];
  for(var y=0;y<300;y+=2)for(var x=0;x<300;x+=2){var i=(y*300+x)*4;if(d[i+3]>120)pts.push({x:x,y:y});}
  var step=Math.max(1,Math.floor(pts.length/400));
  for(var k=0;k<pts.length;k+=step){var p=pts[k],t=r()*Math.PI*2,s=Math.sqrt(r());var h=heartXY(t,2.25*s+0.1);
    // 当たった所から外へ勢いよく
    var ang=Math.atan2(p.y-150,p.x-150)+(r()-.5)*2.2,rad=.22+.78*Math.sqrt(r());
    parts.push({lx:p.x,ly:p.y,sx:6+r()*288,sy:(150-BH)+r()*BH*2,hx:h.x,hy:h.y,sz:2.2+r()*1.5,c:['#d2466a','#e2577a','#ef87a2'][(r()*3)|0],d:r()*.5,ph:r()*6});}
  for(var dk=0;dk<220;dk++){var da=r()*Math.PI*2,hp0=heartXY(r()*Math.PI*2,.36*PEAK*Math.sqrt(r()),DIA.x,HCY+1.5*PEAK);var dx=hp0.x,dy=hp0.y,t2=r()*Math.PI*2,s2=Math.sqrt(r());var h2=heartXY(t2,2.25*s2+0.1);var rad2=.25+.75*Math.sqrt(r());
    var oa2=Math.atan2(dy-150,dx-150)+(r()-.5)*.8;parts.push({lx:dx,ly:dy,sx:6+r()*288,sy:(150-BH)+r()*BH*2,hx:h2.x,hy:h2.y,sz:2.4+r()*1.6,c:['#d2466a','#e2577a','#ef87a2'][(r()*3)|0],d:r()*.5,ph:r()*6});}
  // 月が散る粒：画面全体へ均等に
  for(var j=0;j<460;j++){var a=r()*Math.PI*2,rr=R*Math.sqrt(r());var x0=MC.x+Math.cos(a)*rr,y0=MC.y+Math.sin(a)*rr;
    var tx=8+r()*284,ty=150-BH+r()*BH*2;
    var isStar=j<48;
    burst.push({x0:x0,y0:y0,tx:tx,ty:ty,sz:2.2+r()*2.8,c:['#e8a81e','#f6c64a','#e2577a','#f19a3e','#f6c64a'][(r()*5)|0],star:isStar,rot:r()*6,sp:(r()-.5)*3,
      oa:30+r()*115,ob:.22+r()*.25,tilt:(r()-.5)*1.1,ph:Math.atan2(ty-150,tx-150),w:(r()<.5?1:-1)*(1.1+r()*.9),big:8+r()*6,dly:r()*.35});}
  ready=true;
};
logo.src=LOGO_SRC;

// 月の絵（shapeP: 0=ハート 1=丸、rot: 回転、w: 影 0→1、sh: 影の濃さ）
var moonC=document.createElement('canvas');moonC.width=moonC.height=600;var mg=moonC.getContext('2d');
function drawMoon(ctx,shapeP,rot,w,time){
  mg.setTransform(1,0,0,1,0,0);mg.clearRect(0,0,600,600);mg.setTransform(2,0,0,2,0,0);
  var grd=mg.createRadialGradient(MC.x-R*.35,MC.y-R*.4,R*.2,MC.x,MC.y,R*1.05);grd.addColorStop(0,'#fff3c4');grd.addColorStop(.7,'#f3d27a');grd.addColorStop(1,'#e3b24f');
  var wob=Math.sin(shapeP*Math.PI);   // 途中だけゆがむ
  mg.beginPath();
  for(var i=0;i<=140;i++){var t=i/140*Math.PI*2,h=heartXY(t,2.25),ox=MC.x+Math.sin(t)*R,oy=MC.y-Math.cos(t)*R;
    var x=lerp(h.x,ox,shapeP),y=lerp(h.y,oy,shapeP);
    var dx=x-MC.x,dy=y-MC.y,k=1;
    var ca=Math.cos(rot),sa=Math.sin(rot);var rx=dx*k,ry=dy*k;mg.lineTo(MC.x+rx*ca-ry*sa,MC.y+rx*sa+ry*ca);}
  mg.closePath();
  var col='rgb('+Math.round(lerp(226,243,shapeP))+','+Math.round(lerp(87,210,shapeP))+','+Math.round(lerp(122,122,shapeP))+')';
  mg.fillStyle=col;mg.fill();if(shapeP>0){mg.globalAlpha=ss(shapeP);mg.fillStyle=grd;mg.fill();mg.globalAlpha=1;}
  var ca2=Math.pow(shapeP,2);if(ca2>0){mg.globalCompositeOperation='source-atop';
    [[-14,7,6.5,.30],[-5,-14,4,.26],[-20,-6,3,.24]].forEach(function(c){var cg=mg.createRadialGradient(MC.x+c[0]+1,MC.y+c[1]+1,0,MC.x+c[0],MC.y+c[1],c[2]);cg.addColorStop(0,'rgba(196,146,56,'+(c[3]*ca2)+')');cg.addColorStop(.75,'rgba(196,146,56,'+(c[3]*.8*ca2)+')');cg.addColorStop(1,'rgba(196,146,56,0)');mg.fillStyle=cg;mg.beginPath();mg.arc(MC.x+c[0],MC.y+c[1],c[2],0,6.3);mg.fill();});
    mg.globalCompositeOperation='source-over';}
  if(w>0){ // 背景を抜いて欠けていく（どんな背景色でも形がきれいに出る）
    mg.globalCompositeOperation='destination-out';mg.fillStyle='#000';mg.beginPath();mg.arc(MC.x+lerp(R*2.05,R*.58,w),MC.y-R*.05,R*.98,0,6.3);mg.fill();mg.globalCompositeOperation='source-over';}
  ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(moonC,0,0,600,600,0,-Y0g*Sg,300*Sg,300*Sg);ctx.restore();
}
function orbitPos(a){var ex=60,ey=24,tilt=-.32;var x=Math.cos(a)*ex,y=Math.sin(a)*ey;return {x:MC.x+x*Math.cos(tilt)-y*Math.sin(tilt),y:MC.y+x*Math.sin(tilt)+y*Math.cos(tilt),front:Math.sin(a)>0};}
// 散った星のくるくる楕円（奥と手前）
function starOrbit(b,t){var a=b.ph+b.w*(t-T.scatter);var x=Math.cos(a)*b.oa,y=Math.sin(a)*Math.min(b.oa*b.ob,BH*.85);var ct=Math.cos(b.tilt),st=Math.sin(b.tilt);return {x:150+x*ct-y*st,y:150+x*st+y*ct,depth:Math.sin(a)};}

function frame(ctx,t){
  var S=ctx.canvas.width/300,Y0=(300-300*ctx.canvas.height/ctx.canvas.width)/2;Y0g=Y0;Sg=S;ctx.setTransform(1,0,0,1,0,0);ctx.fillStyle='#ffffff';ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);ctx.setTransform(S,0,0,S,0,-Y0*S);
  if(!ready)return;
  // 1 ロゴの真ん中のひし形が鼓動する（ひし形⇄ハート、だんだん大きく）→ ハートになりきらずに爆発
  if(t<T.hit1+.05){ctx.drawImage(logo,0,0);
    // 鼓動ごとにハートが大きくなる。4回目はロゴより大きくなって、耐えきれずに弾ける
    var B=[T.pulse,T.pulse+.75,T.pulse+1.45,T.pulse+2.1],PK=[2,3.6,6.2,PEAK],m=0,sz=1,shx=0,shy=0;
    B.forEach(function(b0,i){if(t<b0)return;if(i<3){var p=prog(t,b0,b0+.62);if(p<1){var u=Math.sin(p*Math.PI);u=p<.35?eo(p/.35):Math.sin(p*Math.PI);m=u;sz=lerp(1,PK[i],u);}}
      else{var q=prog(t,b0,T.hit1);m=.9*ss(Math.min(1,q*4));sz=lerp(1,PK[3],Math.pow(q,1.5));var tr=q*q*2.2;shx=(Math.sin(t*61)+Math.sin(t*37))*tr;shy=(Math.cos(t*53)+Math.sin(t*29))*tr;}});
    ctx.save();ctx.translate(DIA.x+shx,lerp(DIA.y,HCY,clamp((sz-1)/(PEAK-1),0,1))+shy);ctx.scale(sz,sz);ctx.beginPath();
    for(var i=0;i<=90;i++){var th=i/90*Math.PI*2,h=heartXY(th,.36,0,0),ang=Math.atan2(h.y,h.x),dd=5/(Math.abs(Math.cos(ang))+Math.abs(Math.sin(ang)));
      ctx.lineTo(lerp(Math.cos(ang)*dd,h.x,m),lerp(Math.sin(ang)*dd,h.y+1.5,m));}
    ctx.closePath();ctx.fillStyle='rgb(226,'+Math.round(lerp(181,87,m))+','+Math.round(lerp(166,122,m))+')';
    if(m>.05){ctx.shadowColor='rgba(226,87,122,'+(.5*m)+')';ctx.shadowBlur=6*m;}ctx.globalAlpha=lerp(1,.9,clamp((sz-3)/15,0,1));ctx.fill();ctx.restore();ctx.globalAlpha=1;}
  // 2 当たってバーンと散る → ふわーっと戻ってハート
  if(t>=T.hit1&&t<T.solid+.4){
    var fl=1-prog(t,T.hit1,T.hit1+.4);if(fl>0){ctx.globalAlpha=fl*.9;var gr=ctx.createRadialGradient(150,150,0,150,150,110);gr.addColorStop(0,'rgba(255,214,226,1)');gr.addColorStop(1,'rgba(255,214,226,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,300,300);ctx.globalAlpha=1;}
    var pb=eo5(prog(t,T.hit1,T.spread)),fade=1-prog(t,T.solid,T.solid+.4);
    parts.forEach(function(p){var ph=ss(prog(t,T.spread+p.d*.4,T.gather+p.d*.3));
      var fx=Math.sin(t*1.7+p.ph)*4*(1-ph),fy=Math.cos(t*1.3+p.ph)*4*(1-ph);   // 浮いている間ふわふわ
      var x=lerp(lerp(p.lx,p.sx,pb),p.hx,ph)+fx*pb,y=lerp(lerp(p.ly,p.sy,pb),p.hy,ph)+fy*pb;
      ctx.globalAlpha=fade;ctx.fillStyle=p.c;ctx.beginPath();ctx.arc(x,y,p.sz,0,6.3);ctx.fill();});
    ctx.globalAlpha=1;}
  // 3 くっきりしたハート → ふわっと回転・ゆがみながら月 → 影で三日月
  if(t>=T.gather+.2&&t<T.hit2+.05){var hp=ss(prog(t,T.gather+.2,T.solid));var sp=ss(prog(t,T.solid+.3,T.moon));var rot=0;var w=ss(prog(t,T.shadeStart,T.shade));
    ctx.save();ctx.globalAlpha=hp;drawMoon(ctx,sp,rot,w,t);ctx.restore();ctx.setTransform(S,0,0,S,0,-Y0*S);}
  // 4 ほうき星が飛んできて2周 → 三日月に当たる
  if(t>=T.shade-.3&&t<T.hit2){var pos,trail=[];
    // 止まらずに一続きで：外から渦を描くように入ってきて、そのまま2周
    var A0=-Math.PI*.15-1.3,LAP=1.3+Math.PI*4,AT=LAP+Math.PI*1.15,t0=T.shade-.3;
    var comet=function(tt){var u=clamp((tt-t0)/(T.hit2-t0),0,1);var a=A0+AT*u;var f=Math.max(0,1-(a-A0)/2.4);var k=1+8*f*f;
      k*=lerp(1,.5,ss(clamp((a-A0-LAP)/(AT-LAP),0,1)));   // 2周したら、そのまま内側へらせんを描いて三日月へ
      var o=orbitPos(a);return {x:MC.x+(o.x-MC.x)*k,y:MC.y+(o.y-MC.y)*k,front:k>1.25||o.front};};
    pos=comet(t);for(var q2=1;q2<12;q2++)trail.push(comet(t-q2*.028));
    trail.forEach(function(p,i){ctx.globalAlpha=.55*(1-i/trail.length);ctx.fillStyle='#f0b429';ctx.beginPath();ctx.arc(p.x,p.y,2.6*(1-i/trail.length)+.6,0,6.3);ctx.fill();});ctx.globalAlpha=1;
    star(ctx,pos.x,pos.y,11,t*5,'#f2b51e','rgba(240,170,30,.8)');
    if(!pos.front){drawMoon(ctx,1,0,1,t);ctx.setTransform(S,0,0,S,0,-Y0*S);}}
  // 5 画面全体へ均等にバーンと散る（細かい粒はゆっくり消える）
  if(t>=T.hit2){var e=t-T.hit2;
    var fl2=1-prog(t,T.hit2,T.hit2+.4);if(fl2>0){ctx.globalAlpha=fl2;var g2=ctx.createRadialGradient(MC.x,MC.y,0,MC.x,MC.y,150);g2.addColorStop(0,'rgba(255,236,170,1)');g2.addColorStop(1,'rgba(255,236,170,0)');ctx.fillStyle=g2;ctx.fillRect(0,0,300,300);ctx.globalAlpha=1;}
    var rp=prog(t,T.hit2,T.hit2+.8);if(rp>0&&rp<1){ctx.globalAlpha=1-rp;ctx.lineWidth=3*(1-rp)+.5;ctx.strokeStyle='#f2b51e';ctx.beginPath();ctx.arc(MC.x,MC.y,R+rp*160,0,6.3);ctx.stroke();ctx.strokeStyle='#e2577a';ctx.beginPath();ctx.arc(MC.x,MC.y,R*.6+rp*120,0,6.3);ctx.stroke();ctx.globalAlpha=1;}
    var sp2=eo5(prog(e,0,1.3));
    if(e<4.2)burst.forEach(function(b){if(b.star)return;var al=1-ss(prog(e,1.2,4.2));if(al<=0)return;
      var x=lerp(b.x0,b.tx,sp2)+Math.sin(t*1.5+b.rot)*3*sp2,y=lerp(b.y0,b.ty,sp2)+Math.cos(t*1.2+b.rot)*3*sp2+e*2;
      ctx.globalAlpha=al;ctx.fillStyle=b.c;ctx.shadowColor='rgba(240,160,40,.7)';ctx.shadowBlur=5;ctx.beginPath();ctx.arc(x,y,b.sz*lerp(1,.6,prog(e,1,4)),0,6.3);ctx.fill();ctx.shadowBlur=0;});
    ctx.globalAlpha=1;
    // 6 星がくるくる楕円を描きながら大きくなる → ロゴが現れる → 星がひし形へ
    var stars=burst.filter(function(b){return b.star;});
    var mo=ss(prog(t,T.hit2+.9,T.stars)),cg=ss(prog(t,T.converge,T.dia)),reveal=ss(prog(t,T.logo,T.converge-.4));
    function drawStar(b){var bx=lerp(b.x0,b.tx,sp2),by=lerp(b.y0,b.ty,sp2);var o=starOrbit(b,t);
      var x=lerp(bx,o.x,mo),y=lerp(by,o.y,mo);var depth=o.depth*mo;
      x=lerp(x,DIA.x,cg);y=lerp(y,DIA.y,cg);
      var m=ss(prog(e,.25+b.dly,1.5+b.dly));var sz=lerp(b.sz,b.big,ss(prog(t,T.scatter+b.dly,T.stars+.6)))*(1+.38*depth)*(1-cg);
      if(sz<.15)return;var al=(.72+.28*depth)*(1-cg*.3);
      if(m<1){ctx.globalAlpha=(1-m)*al;ctx.fillStyle=b.c;ctx.beginPath();ctx.arc(x,y,b.sz,0,6.3);ctx.fill();}
      ctx.globalAlpha=m*al;star(ctx,x,y,Math.max(sz,b.sz*m),b.rot+t*b.sp,'#f2b51e','rgba(240,170,30,.6)');ctx.globalAlpha=1;}
    stars.forEach(function(b){if(starOrbit(b,t).depth*mo<0)drawStar(b);});          // 奥の星
    if(reveal>0){ctx.save();ctx.globalAlpha=reveal;var sc=lerp(1.12,1,reveal);ctx.translate(150,150);ctx.scale(sc,sc);ctx.translate(-150,-150);ctx.drawImage(logo,0,0);ctx.restore();}
    stars.forEach(function(b){if(starOrbit(b,t).depth*mo>=0)drawStar(b);});         // 手前の星
    var dp=prog(t,T.dia-.15,T.dia+.35);if(dp>0){diamond(ctx,dp<1?Math.sin(dp*Math.PI)*.5+dp:1);
      if(dp<1){ctx.globalAlpha=1-dp;ctx.strokeStyle='#f2b51e';ctx.lineWidth=1;ctx.beginPath();ctx.arc(DIA.x,DIA.y,6+dp*16,0,6.3);ctx.stroke();ctx.globalAlpha=1;}}
  }
}
// ── サイトのロゴ枠に組み込む ──
// 最初は軽い静止画（今までの1コマ目）を見せ、ページを読み終えてから、画面に見えているロゴだけ1回動かす。
// 動きを減らす設定の人には動かさない。終わったら最後の絵（静止画と同じ）で止まる。
var DONE=T.dia+1.2;
function run(cv){var fr=cv.parentNode,ctx=cv.getContext('2d'),t0=0,raf=0,visible=false,done=false,paused=0;
  function size(){var d=Math.min(2,window.devicePixelRatio||1);cv.width=Math.round(cv.clientWidth*d);cv.height=Math.round(cv.clientHeight*d);}
  function tick(now){raf=0;if(!t0)t0=now;var t=(now-t0)/1000;if(!ready){raf=requestAnimationFrame(tick);return;}
    if(t>=DONE){frame(ctx,T.end);done=true;return;}fr.classList.add('is-playing');frame(ctx,t);if(visible&&!document.hidden)raf=requestAnimationFrame(tick);}
  function go(){if(done||raf||!visible||document.hidden)return;if(paused){t0+=performance.now()-paused;paused=0;}raf=requestAnimationFrame(tick);}
  function stop(){if(raf){cancelAnimationFrame(raf);raf=0;paused=performance.now();}}
  size();
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){visible=es[0].isIntersecting;visible?go():stop();}).observe(cv);else{visible=true;go();}
  document.addEventListener('visibilitychange',function(){document.hidden?stop():go();});}
function start(){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;[].forEach.call(document.querySelectorAll('canvas.brand-motion'),run);}
function later(){var f=function(){setTimeout(start,300);};if('requestIdleCallback' in window)requestIdleCallback(f,{timeout:1500});else f();}
if(document.readyState==='complete')later();else addEventListener('load',later,{once:true});
})();
