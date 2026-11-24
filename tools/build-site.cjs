const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),src=path.join(root,'site-src');
const read=p=>fs.readFileSync(p,'utf8').replace(/\r\n/g,'\n');
const digest=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const args=new Set(process.argv.slice(2));
const styleFiles=require('./styles.cjs').build(args.has('--check'));
const pageContract=require('./page-contract.cjs'),contract=pageContract.load(root);
require('./components.cjs').check();
require('./notice-templates.cjs').build(args.has('--check'));require('./product-layout.cjs').build(args.has('--check'));require('./site-texts.cjs').build(args.has('--check'));require('./store-info.cjs').build(args.has('--check'));
require('./products.cjs').build(args.has('--check'));
require('./home-sections.cjs').build(args.has('--check'));
require('./site-content.cjs').build(args.has('--check'));
pageContract.checkScripts(root);
const version=JSON.parse(read(path.join(src,'version.json'))).version;
if(!Number.isSafeInteger(version)||version<1)throw Error('Invalid version');
const pages=JSON.parse(read(path.join(src,'pages.json')));
const sharedFiles=[...new Set(fs.readdirSync(path.join(src,'shared')).filter(f=>f.endsWith('.html')).map(f=>'site-src/shared/'+f).concat(['header-scroll.js','hscroll.js','catico.js','notes-resize.js','navigation-position.js','page-share.js','site-services-core.js','site-services-ui.js','rail-controls.js','placement-visibility.js','pilot-inputs.js','touch-guard.js','site-src/styles/manifest.json','site-src/page-contract.json'],styleFiles).concat(fs.readdirSync(path.join(root,'images/social')).filter(f=>f.endsWith('.svg')).map(f=>'images/social/'+f)))];
const hashes=Object.fromEntries(sharedFiles.sort().map(f=>[f,digest(path.join(root,f))]));
const lock=path.join(src,'shared.lock.json');
if(args.has('--update-shared-lock'))fs.writeFileSync(lock,JSON.stringify(hashes,null,2)+'\n');
if(!fs.existsSync(lock))throw Error('Common parts lock missing');
const expected=JSON.parse(read(lock));
const changed=Object.keys({...hashes,...expected}).filter(k=>hashes[k]!==expected[k]);
if(changed.length)throw Error('共通部分が変更されています。林さんの指示対象か確認してください。承認済みの共通変更だけ --update-shared-lock で記録します:\n'+changed.join('\n'));
function render(text,vars,stack=[]){
 text=text.replace(/{{@\s*([a-z0-9-]+\/[a-z0-9-]+)\s*}}/g,(_,name)=>{if(stack.includes('@'+name))throw Error('Recursive section '+name);return render(read(path.join(src,'sections',name+'.html')),vars,[...stack,'@'+name]);});
 text=text.replace(/{{>\s*([\w-]+)\s*}}/g,(_,name)=>{if(stack.includes(name))throw Error('Recursive include '+name);const p=path.join(src,'shared',name+'.html');return render(read(p),vars,[...stack,name]);});
 text=text.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g,(_,k,body)=>vars[k]?body:'');
 function value(k,chain=[]){if(!(k in vars))throw Error('Unknown variable '+k);if(chain.includes(k))throw Error('Recursive variable '+k);return String(vars[k]).replace(/{{(\w+)}}/g,(_,name)=>value(name,[...chain,k]));}
 text=text.replace(/{{(\w+)}}/g,(_,k)=>value(k));
 if(/{{[>@#/]/.test(text))throw Error('Unresolved template');return text;
}
// v75 表示速度対策：ページが読むCSS（編集元・生成物は今まで通り別々のファイル）を、公開するHTMLでは1つにまとめて読む。
// まとめたリンクには中身のCSS名を data-bundle に書き、決まりの確認（page-contract）はそれを元の並びに戻して行う。まとめたファイルは bundles/ に中身の指紋の名前で置き、同じ組み合わせのページは同じファイルを使う。
// bundles/ は1つ下のフォルダなので、CSSの中の写真の場所には ../ を付ける。
const bundleDir=path.join(root,'bundles'),bundles=new Map(),cssLink=/<link rel="stylesheet" href="([a-z0-9-]+\.css)\?v=\d+">/g;
function bundleCss(html){
 const end=html.indexOf('</head>'),head=html.slice(0,end),files=[...head.matchAll(cssLink)].map(m=>m[1]);
 if(files.length<2)return html;
 const text=files.map(f=>'/* '+f+' */\n'+read(path.join(root,f)).replace(/url\((["']?)(?![a-z][a-z0-9+.-]*:|\/|#)([^)"']+)\1\)/gi,(_,q,u)=>'url('+q+'../'+u+q+')')).join('\n');
 const name='bundles/'+crypto.createHash('sha256').update(text).digest('hex').slice(0,12)+'.css';bundles.set(name,text);
 if(!args.has('--check')){if(!fs.existsSync(bundleDir))fs.mkdirSync(bundleDir);const dest=path.join(root,name);if(!fs.existsSync(dest)||read(dest)!==text)fs.writeFileSync(dest,text);}
 let first=true;return head.replace(cssLink,()=>first?(first=false,'<link rel="stylesheet" href="'+name+'?v='+version+'" data-bundle="'+files.map(f=>f+'?v='+version).join(' ')+'">'):'')+html.slice(end);
}
let stale=[];for(const [file,settings] of Object.entries(pages)){
 if(path.basename(file)!==file||!file.endsWith('.html'))throw Error('Invalid page path');
 const source=read(path.join(src,'pages',file));
 pageContract.checkSource(file,source,contract);
 if(!source.includes('{{> services-head}}')||!source.includes('{{> services-script}}'))throw Error('サイト共通サービスが不足しています: '+file);
 if(!source.includes('{{> share-head}}')||!source.includes('{{> share-script}}'))throw Error('SNS共通パーツが不足しています: '+file);
 let out=render(source,{stripAttributes:'',...settings,version});
 // トップのメッセージのカード（site-src/home-promos の kind: message）は最初からページに書く（見出しを検索に読ませるため）
 if(out.includes('<!--home-message-cards-->'))out=out.replace('<!--home-message-cards-->',()=>require('./home-message.cjs').html(require('./promos.cjs').load()));
 out=bundleCss(out);
 pageContract.checkRendered(file,out,contract,root);
 const dest=path.join(root,file);
 if(args.has('--check')){if(!fs.existsSync(dest)||read(dest)!==out)stale.push(file);}
 else if(!fs.existsSync(dest)||read(dest)!==out)fs.writeFileSync(dest,out);
}
if(args.has('--check'))for(const [name,text] of bundles){const dest=path.join(root,name);if(!fs.existsSync(dest)||read(dest)!==text)stale.push(name);}
for(const f of fs.existsSync(bundleDir)?fs.readdirSync(bundleDir):[]){const name='bundles/'+f;if(bundles.has(name))continue;if(args.has('--check'))stale.push(name+'（使われていない）');else fs.unlinkSync(path.join(bundleDir,f));}
const orphan=fs.readdirSync(root).filter(f=>f.endsWith('.html')&&!(f in pages));if(orphan.length)throw Error('Page config missing: '+orphan.join(','));
if(stale.length)throw Error('生成HTMLと編集元が不一致です。node tools/build-site.cjs を実行してください:\n'+stale.join('\n'));
console.log((args.has('--check')?'確認':'生成')+'完了：'+Object.keys(pages).length+'ページ／v'+version+'（共通部分の保護も一致）');
