/* 大分類 → 中分類(タブ) → 小分類(チップ) の試作 */
(function(){
var qs=new URLSearchParams(location.search);
function h(it,c){return it.c.indexOf(c)>=0}
function s(it,x){return it.s.indexOf(x)>=0}
function sa(it,a){return a.some(function(x){return s(it,x)})}
function re(r){return function(it){return r.test(it.t)}}
var GROUPS=[
 {k:'food',name:'食べ物・飲み物',desc:'結婚式のお見送り、引菓子、引出物、手土産に。お菓子・シフォン・グルメを集めました。',mids:[
  {k:'petit',name:'プチギフト',f:function(it){return h(it,'petit')&&!s(it,'goods')&&sa(it,['cookie','candy','wafu','choco','tea','other'])},subs:[['cookie','クッキー'],['candy','キャンディー・金平糖'],['dragee','ドラジェ'],['wafu','和風'],['choco','チョコレート'],['tea','紅茶＆コーヒー'],['other','その他']],sf:function(it,x){return x==='dragee'?/ドラジェ/.test(it.t):x==='candy'?s(it,x)&&!/ドラジェ/.test(it.t):s(it,x)}},
  {k:'hikigashi',name:'引菓子',f:function(it){return h(it,'hikigashi')&&!h(it,'hikidemono')},subs:[]},
  {k:'gourmet',name:'引出物グルメ',f:function(it){return h(it,'hikidemono')&&!s(it,'goods')},subs:[['sweets','バーム・パン・スイーツ'],['gourmet','パスタ・スープ・調味料'],['gohan','お米・ごはん'],['bousai','防災・保存食']],sf:function(it,x){return s(it,x)}},
  {k:'chiffon',name:'シフォンケーキ',f:function(it){return h(it,'chiffon')},subs:[]}]},
 {k:'goods',name:'雑貨・実用品',desc:'耳かき、カイロ、タオルなど毎日使える実用品や、ディズニーのタオルなど。',mids:[
  {k:'goods',name:'実用品プチギフト',f:function(it){return h(it,'petit')&&s(it,'goods')},subs:[]},
  {k:'towel',name:'タオル・引出物の雑貨',f:function(it){return h(it,'hikidemono')&&s(it,'goods')&&!h(it,'parents')},subs:[]},
  {k:'set',name:'セット商品',f:function(it){return s(it,'set')&&s(it,'goods')},subs:[]},
  {k:'disney',name:'ディズニー',f:function(it){return s(it,'disney')&&s(it,'goods')},subs:[]}]},
 {k:'welcome',name:'ウェルカム飾り',desc:'ウェルカムスペースを彩るボードや小物。受付で渡すウェルカムプチギフトもこちら。',mids:[
  {k:'board',name:'ウェルカムボード',f:function(it){return h(it,'board')},subs:[['mirror','ミラー',/ミラー/],['clock','クロック',/クロック/],['bb','黒板・サムシングフォー',/黒板|サムシング/],['flower','フラワー・花',/フラワー|花/]]},
  {k:'wpetit',name:'ウェルカムプチギフト',f:function(it){return h(it,'petit')&&s(it,'welcome')},subs:[]},
  {k:'diy',name:'DIY用品',f:function(it){return h(it,'diy')},subs:[]}]},
 {k:'paper',name:'ペーパー・演出',desc:'招待状・席次表などのペーパー類、ゲストブック、結婚証明書、シャワー用品。',mids:[
  {k:'invite',name:'招待状・席次表・席札',f:function(it){return h(it,'paper')&&sa(it,['invite','seat','print'])},subs:[['invite','招待状'],['seat','席次表・席札'],['print','印刷代行']],sf:function(it,x){return s(it,x)}},
  {k:'coaster',name:'名入れコースター',f:function(it){return h(it,'paper')&&s(it,'coaster')},subs:[]},
  {k:'guest',name:'ゲストブック・証明書',f:function(it){return h(it,'enshutsu')&&sa(it,['guest','cert'])},subs:[['guest','ゲストブック・芳名帳'],['cert','結婚証明書']],sf:function(it,x){return s(it,x)}},
  {k:'shower',name:'シャワー・小物',f:function(it){return h(it,'enshutsu')&&sa(it,['shower','other'])},subs:[]},
  {k:'bag',name:'ブライダルバッグ',f:function(it){return h(it,'bag')},subs:[['set','50個セット'],['single','1個から']],sf:function(it,x){return s(it,x)}}]},
 {k:'parents',name:'両親贈呈',desc:'ご両親への感謝を伝える贈呈品。',mids:[
  {k:'doll',name:'ウェイトドール・ベア',f:function(it){return h(it,'doll')},subs:[]},
  {k:'kosodate',name:'子育て卒業証書',f:function(it){return h(it,'kosodate')},subs:[]},
  {k:'clock',name:'クロックギフト',f:function(it){return h(it,'parents')&&/クロック/.test(it.t)},subs:[]}]},
 {k:'catalog',name:'カタログギフト',desc:'引出物・内祝いに。ご予算に合わせて選べます。',mids:[
  {k:'grace',name:'Grace',f:function(it){return h(it,'catalog')&&s(it,'grace')},subs:[]},
  {k:'shikisai',name:'SHIKISAI ONE',f:function(it){return h(it,'catalog')&&s(it,'shikisai')},subs:[]},
  {k:'ocean',name:'OCEAN&TERRE',f:function(it){return h(it,'catalog')&&s(it,'ocean')},subs:[]}]},
 {k:'season',name:'季節・特集',desc:'クリスマス、バレンタインなど、季節のアイテム。',mids:[
  {k:'xmas',name:'クリスマス',f:function(it){return h(it,'season')&&!h(it,'board')&&/クリスマス|サンタ|スノー/.test(it.t)},subs:[['petit','クリスマスのプチギフト']],sf:function(it,x){return x==='petit'?h(it,'petit'):true}},
  {k:'val',name:'バレンタイン',f:function(it){return h(it,'season')&&/バレンタイン/.test(it.t)},subs:[]},
  {k:'hal',name:'ハロウィン',f:function(it){return h(it,'season')&&/ハロウィン/.test(it.t)},subs:[]},
  {k:'other',name:'お年賀・そのほか',f:function(it){return h(it,'season')&&!/クリスマス|サンタ|スノー|バレンタイン|ハロウィン/.test(it.t)},subs:[]}]}
];
var ALL={k:'all',name:'すべての商品',desc:'ルナルーチェの商品をまとめてごらんいただけます。',mids:[]};
var gk=qs.get('g')||'food';var G=GROUPS.filter(function(g){return g.k===gk})[0]||(gk==='all'?ALL:GROUPS[0]);
function midItems(m){return ITEMS.filter(m.f)}
function groupItems(g){if(g===ALL)return ITEMS;var o=[];ITEMS.forEach(function(it){if(g.mids.some(function(m){return m.f(it)}))o.push(it)});return o}
var mk=qs.get('m')||'';
var S={m:G.mids.some(function(m){return m.k===mk})?mk:'',s:qs.get('s')||'',pr:qs.get('p')||'',q:qs.get('q')||'',n:qs.get('n')==='1',f:qs.get('f')==='1',o:qs.get('o')||'rec'};
var PAGE=24,shown=PAGE;
var PRICES=[['0-499','〜499円'],['500-999','500〜999円'],['1000-1999','1,000円台'],['2000-2999','2,000円台'],['3000-4999','3,000〜4,999円'],['5000-9999','5,000〜9,999円'],['10000-','10,000円〜']];
function esc(x){return String(x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
ITEMS.forEach(function(it){it.free=/送料(無料|込)/.test(it.t);it.nm=it.g.indexOf('名入れ')>=0||/名入れ/.test(it.t)});
function inRange(it,r){var m=r.match(/^(\d+)-(\d*)$/);if(!m)return true;return it.p>=+m[1]&&it.p<=(m[2]?+m[2]:1e9)}
function curMid(){return G.mids.filter(function(m){return m.k===S.m})[0]||null}
function pool(){var m=curMid();return m?midItems(m):groupItems(G)}
function subTest(m,x){var sd=m.subs.filter(function(y){return y[0]===x})[0];if(!sd)return function(){return true};return sd[2]?function(it){return sd[2].test(it.t)}:function(it){return m.sf?m.sf(it,x):s(it,x)}}
function match(it,skip){var m=curMid();
 if(skip!=='sub'&&S.s&&m&&!subTest(m,S.s)(it))return false;
 if(skip!=='pr'&&S.pr&&!inRange(it,S.pr))return false;
 if(S.q&&(it.t+' '+it.g.join(' ')).toLowerCase().indexOf(S.q.toLowerCase())<0)return false;
 if(S.n&&!it.nm)return false;if(S.f&&!it.free)return false;return true}
function sync(){var a=['g='+G.k];if(S.m)a.push('m='+S.m);if(S.s)a.push('s='+S.s);if(S.pr)a.push('p='+S.pr);if(S.q)a.push('q='+encodeURIComponent(S.q));if(S.n)a.push('n=1');if(S.f)a.push('f=1');if(S.o!=='rec')a.push('o='+S.o);try{history.replaceState(null,'','category.html?'+a.join('&'))}catch(e){}}
function card(it){var tags=it.g.map(function(g){return '<span'+(g==='名入れ'?' class="n"':'')+'>'+esc(g)+'</span>'}).join('');
 var ph=it.i?'<img src="'+it.i+'" alt="'+esc(it.t)+'" loading="lazy" width="520" height="520">':'<span class="noimg">写真は準備中</span>';
 return '<a class="prod" href="'+esc(it.url||'item.html')+'"><div class="ph">'+ph+'</div><div class="b">'+(tags?'<div class="tags">'+tags+'</div>':'')+'<h3>'+esc(it.t)+'</h3><div class="price">'+it.pt+'<small> 税込</small></div></div></a>'}
document.getElementById('catv').innerHTML='<nav class="crumb" id="cr"></nav><div class="page-h"><h1 id="h1"></h1><p id="gd"></p></div><div class="mtabs" id="mtabs" role="tablist"></div><div class="subrow" id="subrow"></div>'
+'<div id="rank"></div><div class="fbar"><form class="fsearch" onsubmit="return false"><input id="fq" type="search" placeholder="このなかで探す（例：ピンク、10個）" value="'+esc(S.q)+'"></form><button type="button" class="fbtn" id="fbtn">絞り込み<b id="fcnt"></b></button><select id="sortsel" aria-label="並び順"><option value="rec">おすすめ順</option><option value="low">価格の安い順</option><option value="high">価格の高い順</option></select></div><div class="fpanel" id="fpanel"></div><div class="fsum" id="fsum"></div><div id="res"></div>';
var fq=document.getElementById('fq'),ss=document.getElementById('sortsel'),fp=document.getElementById('fpanel');ss.value=S.o;
function chips(arr,cur,attr){return arr.map(function(x){return '<button type="button" class="chip'+(cur===x[0]?' on':'')+'" data-'+attr+'="'+esc(x[0])+'">'+esc(x[1])+'<small>'+x[2]+'</small></button>'}).join('')}
function rangeName(r){for(var i=0;i<PRICES.length;i++)if(PRICES[i][0]===r)return PRICES[i][1];return r}
function render(){
 var m=curMid(),base=pool(),list=base.filter(function(it){return match(it)});
 if(S.o==='low')list.sort(function(a,b){return a.p-b.p});else if(S.o==='high')list.sort(function(a,b){return b.p-a.p});else list.sort(function(a,b){return a.o-b.o});
 var sd=m&&S.s?m.subs.filter(function(y){return y[0]===S.s})[0]:null;
 document.title=(sd?sd[1]+'｜':'')+(m?m.name+'｜':'')+G.name+'｜ルナルーチェ（大分類テスト）';
 var cr='<a href="top.html">ホーム</a><span>›</span>';
 if(m||sd){cr+='<a href="category.html?g='+G.k+'">'+esc(G.name)+'</a><span>›</span>';cr+=sd?'<a href="category.html?g='+G.k+'&m='+m.k+'">'+esc(m.name)+'</a><span>›</span>'+esc(sd[1]):esc(m.name)}else cr+=esc(G.name);
 document.getElementById('cr').innerHTML=cr;
 document.getElementById('h1').innerHTML=esc(sd?sd[1]:m?m.name:G.name)+'<small>'+list.length+'件</small>';
 document.getElementById('gd').textContent=G.desc;
 var featureNav=document.getElementById('category-features');if(!featureNav){featureNav=document.createElement('nav');featureNav.id='category-features';featureNav.className='chips feature-links';featureNav.setAttribute('aria-label','関連する特集');document.getElementById('gd').after(featureNav)}
 var featureLinks={food:[['preparedness-gift.html','防災・備蓄ギフト']],goods:[['neko.html','にゃんこモチーフ']],paper:[['bridal-bag.html','ブライダルバッグを選ぶ']],season:[['preparedness-gift.html','防災・備蓄ギフト'],['neko.html','にゃんこモチーフ'],['new-arrivals.html','新着商品'],['sale.html','数量限定・特価商品'],['charity-santa.html','チャリティーサンタ']]};
 featureNav.innerHTML=(featureLinks[G.k]||[]).map(function(a){return '<a class="chip" href="'+a[0]+'">'+a[1]+'</a>'}).join('');featureNav.hidden=!featureNav.innerHTML;
 // 中分類タブ
 var mt=document.getElementById('mtabs');
 if(G.mids.length){mt.style.display='';mt.innerHTML='<button type="button" role="tab" class="mt'+(!S.m?' on':'')+'" data-m="">すべて<small>'+groupItems(G).length+'</small></button>'+G.mids.map(function(x){return '<button type="button" role="tab" class="mt'+(S.m===x.k?' on':'')+'" data-m="'+x.k+'">'+esc(x.name)+'<small>'+midItems(x).length+'</small></button>'}).join('')}else mt.style.display='none';
 // 小分類
 var sr=document.getElementById('subrow');
 if(m&&m.subs.length){var arr=m.subs.map(function(y){return [y[0],y[1],base.filter(function(it){return match(it,'sub')&&subTest(m,y[0])(it)}).length]}).filter(function(x){return x[2]>0||S.s===x[0]});
  sr.style.display='';sr.innerHTML='<span class="lbl">種類</span><div class="chips sub">'+chips([['','すべて',base.filter(function(it){return match(it,'sub')}).length]].concat(arr),S.s,'s')+'</div>'}else sr.style.display='none';
 // 絞り込み
 var hh='';var pc=PRICES.map(function(p){return [p[0],p[1],base.filter(function(it){return match(it,'pr')&&inRange(it,p[0])}).length]}).filter(function(x){return x[2]>0||S.pr===x[0]});
 if(pc.length>1||S.pr)hh+='<div class="fg"><b>ご予算</b><div class="chips sub">'+chips([['','指定なし',base.filter(function(it){return match(it,'pr')}).length]].concat(pc),S.pr,'pr')+'</div></div>';
 var nn=base.filter(function(it){return it.nm}).length,ff=base.filter(function(it){return it.free}).length;
 if(nn||ff)hh+='<div class="fg"><b>こだわり</b><div class="chips sub">'+(nn?'<button type="button" class="chip'+(S.n?' on':'')+'" data-tg="n">名入れできる<small>'+nn+'</small></button>':'')+(ff?'<button type="button" class="chip'+(S.f?' on':'')+'" data-tg="f">送料無料<small>'+ff+'</small></button>':'')+'</div></div>';
 fp.innerHTML=hh;
 var act=[];if(S.pr)act.push(['pr',rangeName(S.pr)]);if(S.q)act.push(['q','「'+S.q+'」']);if(S.n)act.push(['n','名入れできる']);if(S.f)act.push(['f','送料無料']);
 document.getElementById('fcnt').textContent=act.length?'（'+act.length+'）':'';
 document.getElementById('fsum').innerHTML='<span>'+list.length+'件を表示</span>'+act.map(function(a){return '<button type="button" class="tagx" data-x="'+a[0]+'">'+esc(a[1])+' ×</button>'}).join('')+(act.length?'<button type="button" class="clr" data-x="all">すべて解除</button>':'');
 var rk=document.getElementById('rank');
 if(list.length>=3&&!act.length){var top=list.slice().sort(function(a,b){return a.o-b.o}).slice(0,20);rk.innerHTML='<div class="rankbox"><h2>売れ筋 TOP'+top.length+' <small>迷ったらまずここから・横にスワイプ</small></h2><div class="rankrow">'+top.map(function(it,i){return '<a class="rkc" href="'+esc(it.url||'item.html')+'"><i>'+(i+1)+'</i><div class="ph">'+(it.i?'<img src="'+it.i+'" alt="" loading="lazy">':'<span class="noimg">準備中</span>')+'</div><b>'+esc(it.t)+'</b><span>'+it.pt+'</span></a>'}).join('')+'</div></div>'}else rk.innerHTML='';
 var r=document.getElementById('res');
 if(!list.length)r.innerHTML='<p class="note" style="margin:24px 0">この条件に合う商品は、サンプルにはありません。 <button type="button" class="clr" data-x="all">すべて解除</button></p>';
 else r.innerHTML='<div class="prods p4">'+list.slice(0,shown).map(card).join('')+'</div>'+(list.length>shown?'<div class="morewrap"><button type="button" class="morebtn" id="moreb">もっと見る（残り'+(list.length-shown)+'件）</button></div>':'')+'<p class="note" style="margin-top:14px">サンプルのため、掲載している商品の一部のみを表示しています。</p>';
 sync();renderTree();
}
function renderTree(){var side=document.getElementById('sidecat');
 side.innerHTML='<h3>カテゴリ</h3><ul>'+GROUPS.map(function(g){var cur=g===G;
  var sub=cur?'<ul>'+g.mids.map(function(x){return '<li'+(S.m===x.k?' class="cur"':'')+'><a href="category.html?g='+g.k+'&m='+x.k+'">'+esc(x.name)+'<span>'+midItems(x).length+'</span></a></li>'}).join('')+'</ul>':'';
  return '<li'+(cur?' class="cur"':'')+'><a href="category.html?g='+g.k+'">'+esc(g.name)+'<span>'+groupItems(g).length+'</span></a>'+sub+'</li>'}).join('')+'</ul>'}
document.addEventListener('click',function(e){var t=e.target.closest('[data-m],[data-s],[data-pr],[data-tg],[data-x],#moreb,#fbtn');if(!t||!document.getElementById('catv').contains(t))return;
 if(t.id==='fbtn'){fp.classList.toggle('open');return}
 if(t.id==='moreb'){shown+=PAGE;render();return}
 if(t.dataset.m!==undefined){S.m=t.dataset.m;S.s='';}
 else if(t.dataset.s!==undefined)S.s=t.dataset.s;else if(t.dataset.pr!==undefined)S.pr=t.dataset.pr;else if(t.dataset.tg)S[t.dataset.tg]=!S[t.dataset.tg];
 else if(t.dataset.x){var x=t.dataset.x;if(x==='all'){S.pr='';S.q='';S.n=false;S.f=false;fq.value=''}else if(x==='q'){S.q='';fq.value=''}else if(x==='n'||x==='f')S[x]=false;else S[x]='';}
 shown=PAGE;render();if(t.dataset.m!==undefined||t.dataset.s!==undefined)window.dispatchEvent(new Event('luna:category-navigation'));});
var tm;fq.addEventListener('input',function(){clearTimeout(tm);tm=setTimeout(function(){S.q=fq.value.trim();shown=PAGE;render()},180)});
ss.addEventListener('change',function(){S.o=ss.value;shown=PAGE;render()});
if(S.pr||S.q||S.n||S.f)fp.classList.add('open');
render();
document.querySelectorAll('.cats a').forEach(function(a){var m=(a.getAttribute('href')||'').match(/g=(\w+)/);a.classList.toggle('on',!!m&&m[1]===G.k)});
})();
