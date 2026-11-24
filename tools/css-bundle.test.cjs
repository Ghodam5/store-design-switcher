// v75：公開ページのCSSは1つにまとめて読む。まとめたファイルの中身が元のCSSの並びと同じかを確かめる
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
test('まとめたCSSは元のCSSを書かれた順につないだもので、写真の場所も正しい',()=>{
 const pages=Object.keys(JSON.parse(fs.readFileSync(path.join(root,'site-src/pages.json'),'utf8')));
 for(const page of pages){
  const html=fs.readFileSync(path.join(root,page),'utf8'),head=html.slice(0,html.indexOf('</head>'));
  const links=[...head.matchAll(/<link rel="stylesheet" href="(bundles\/[0-9a-f]{12}\.css)\?v=\d+" data-bundle="([^"]+)">/g)];
  assert.equal(links.length,1,page+': まとめたCSSは1つ');
  assert.doesNotMatch(head.replace(/<noscript>[\s\S]*?<\/noscript>/g,''),/<link rel="stylesheet" href="[a-z0-9-]+\.css\?/,page+': まとめ漏れ');
  const text=fs.readFileSync(path.join(root,links[0][1]),'utf8');
  let at=0;for(const item of links[0][2].split(' ')){const name=item.replace(/\?v=\d+$/,'');const pos=text.indexOf('/* '+name+' */',at);assert.ok(pos>=at,page+': 順番 '+name);at=pos;}
  for(const m of text.matchAll(/url\((["']?)([^)"']+)\1\)/g))if(!/^(data:|https?:|#)/.test(m[2]))assert.ok(fs.existsSync(path.join(root,'bundles',m[2])),page+': 写真なし '+m[2]);
 }
});
