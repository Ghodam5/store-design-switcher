'use strict';
const fs=require('node:fs'),path=require('node:path');
function build(check=false,root=path.resolve(__dirname,'..')){
 const manifest=JSON.parse(fs.readFileSync(path.join(root,'site-src/styles/manifest.json'),'utf8'));
 const outputs=new Set(),sources=new Set();
 for(const bundle of manifest.bundles){
  if(!/^[a-z0-9-]+\.css$/.test(bundle.output)||outputs.has(bundle.output)||!bundle.sources.length)throw Error('CSS出力の重複・不正: '+bundle.output);
  outputs.add(bundle.output);
  const text=bundle.sources.map(file=>{
   if(!/^site-src\/styles\/[a-z0-9/-]+\.css$/.test(file)||sources.has(file))throw Error('CSS編集元の重複・不正: '+file);
   sources.add(file);return fs.readFileSync(path.join(root,file),'utf8').replace(/\r\n/g,'\n');
  }).join('');
  const dest=path.join(root,bundle.output),current=fs.existsSync(dest)?fs.readFileSync(dest,'utf8').replace(/\r\n/g,'\n'):null;
  if(current!==text){if(check)throw Error('CSS生成漏れ・直接編集: '+bundle.output+'。site-src/stylesを編集してビルドしてください。');fs.writeFileSync(dest,text);}
 }
 for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.css')))if(!outputs.has(file))throw Error('未登録CSS: '+file);
 function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())walk(file);else if(entry.name.endsWith('.css')){const relative=path.relative(root,file).split(path.sep).join('/');if(!sources.has(relative))throw Error('未登録CSS編集元: '+relative);}}}
 walk(path.join(root,'site-src/styles'));
 return manifest.bundles.map(b=>b.output);
}
module.exports={build};
if(require.main===module){try{build(process.argv.includes('--check'));console.log('CSS編集元・生成物の一致確認完了');}catch(e){console.error(e.message);process.exitCode=1;}}
