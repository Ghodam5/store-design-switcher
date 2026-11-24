'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function checkSource(file,source,contract){
 const includes=[...source.matchAll(/{{>\s*([\w-]+)\s*}}/g)].map(m=>m[1]);
 for(const name of [...contract.requiredIncludes,...(file in contract.footerExceptions?[]:['footer'])])
  if(includes.filter(x=>x===name).length!==1)throw Error('必須共通部品は1回: '+file+' / '+name);
 if(/<style\b/i.test(source))throw Error('独自styleタグは禁止。登録済みCSS編集元へ: '+file);
 for(const tag of source.match(/<input\b[^>]*>/gi)||[]){
  if(/\b(?:id|name)=["'](?:quantity[^"']*|[^"']*-qty)["']/i.test(tag)&&!tag.includes('data-quantity-picker'))throw Error('数量の共通マーカー不足: '+file+' '+tag);
 }
}
// v75：CSSを1つにまとめたリンク（build-site.cjs の bundleCss）は、data-bundle に書いた元のCSSが同じ場所に並んでいるものとして確かめる
const expandBundles=(html,root)=>html.replace(/<link rel="stylesheet" href="(bundles\/[0-9a-f]{12}\.css)\?v=\d+" data-bundle="([^"]+)">/g,(_,bundle,list)=>{if(root&&!fs.existsSync(path.join(root,bundle)))throw Error('まとめたCSSがありません: '+bundle);return list.split(' ').map(u=>'<link rel="stylesheet" href="'+u+'">').join('');});
function checkRendered(file,html,contract,root){
 html=expandBundles(html,root);
 const head=html.slice(0,html.indexOf('</head>'));
 const shell=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'');
 for(const cls of ['hd','drawer','tabs-bottom',...(file in contract.footerExceptions?[]:['ft'])]){
  const count=[...shell.matchAll(/<[a-z][^>]*\bclass=["']([^"']*)["'][^>]*>/gi)].filter(m=>m[1].split(/\s+/).includes(cls)).length;
  if(count!==1)throw Error('生成された共通外枠は1回: '+file+' / '+cls);
 }
 if((head.match(/<title\b/gi)||[]).length!==1||!/<meta\b[^>]*name=["']viewport["'][^>]*width=device-width/i.test(head))throw Error('headのタイトル・画面幅設定が不正: '+file);
 const assets=[...html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+\.(?:css|js))(?:\?[^"']*)?["'][^>]*>/gi)].map(m=>({url:m[1],tag:m[0]}));
 for(const name of [...contract.headAssets,...contract.requiredAssets]){
  if(assets.filter(a=>a.url===name).length!==1)throw Error('必須資産の不足・重複: '+file+' / '+name);
  if(contract.headAssets.includes(name)&&!head.includes(name+'?v='))throw Error('head先読み不足: '+file+' / '+name);
 }
 const seen=new Set();
 for(const {url,tag} of assets){
  if(/^(https?:)?\/\//.test(url))continue;
  if(seen.has(url))throw Error('CSS/JS重複読込: '+file+' / '+url);seen.add(url);
  if(!fs.existsSync(path.join(root,url)))throw Error('資産ファイルなし: '+file+' / '+url);
  if(!/\?v=\d+/.test(tag))throw Error('キャッシュ番号なし: '+file+' / '+url);
 }
 if(html.indexOf('style.css?')>html.indexOf('pilot-inputs.css?'))throw Error('CSS適用順が不正: '+file);
}
function load(root=path.resolve(__dirname,'..')){return JSON.parse(fs.readFileSync(path.join(root,'site-src/page-contract.json'),'utf8'));}
function checkScripts(root=path.resolve(__dirname,'..')){
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.js')))new vm.Script(fs.readFileSync(path.join(root,file),'utf8'),{filename:file});
}
module.exports={checkSource,checkRendered,checkScripts,load};
