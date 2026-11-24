const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),os=require('node:os');
const root=path.resolve(__dirname,'..'),contract=require('./page-contract.cjs'),styles=require('./styles.cjs');
test('共通部品・数量・資産・読込位置の欠落と独自styleを拒否し、新規ページへ旧例外を広げない',()=>{
 const rules=contract.load(),file='top.html',source=fs.readFileSync(path.join(root,'site-src/pages',file),'utf8'),html=fs.readFileSync(path.join(root,file),'utf8');
 contract.checkSource(file,source,rules);contract.checkRendered(file,html,rules,root);
 assert.throws(()=>contract.checkRendered(file,html.replace('class="hd"','class="missing-header"'),rules,root),/共通外枠/);
 assert.throws(()=>contract.checkRendered(file,html.replace('<title>','<invalid-title>'),rules,root),/タイトル/);
 for(const part of [...rules.requiredIncludes,'footer'])assert.throws(()=>contract.checkSource(file,source.replace('{{> '+part+'}}',''),rules),/必須共通部品/);
 const legacy=fs.readFileSync(path.join(root,'site-src/pages/campaign.html'),'utf8');contract.checkSource('campaign.html',legacy,rules);assert.throws(()=>contract.checkSource('new-guide.html',legacy,rules),/footer/);
 assert.throws(()=>contract.checkSource(file,source+'<style>.logo{display:none}</style>',rules),/styleタグ/);
 assert.throws(()=>contract.checkSource(file,source+'<input name="quantity" type="number">',rules),/数量/);
 for(const asset of [...rules.headAssets,...rules.requiredAssets])assert.throws(()=>contract.checkRendered(file,html.replace(asset+'?v=',asset+'-missing?v='),rules,root),/資産/);
 assert.throws(()=>contract.checkRendered(file,html+'<script src="pilot-inputs.js?v=56"></script>',rules,root),/重複/);
 const moved=html.replace(/<script src="pilot-inputs.js[^>]*><\/script>/,'');assert.throws(()=>contract.checkRendered(file,moved+'<script src="pilot-inputs.js?v=56"></script>',rules,root),/head先読み/);
});
test('CSSは登録順で生成し、編集元の変更・公開CSSの直接変更・未登録CSSを検出する',()=>{
 const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'luna-css-'));
 try{
  fs.cpSync(path.join(root,'site-src/styles'),path.join(tmp,'site-src/styles'),{recursive:true});styles.build(false,tmp);styles.build(true,tmp);
  const before=fs.readFileSync(path.join(tmp,'style.css'),'utf8');assert.equal(before,fs.readFileSync(path.join(root,'style.css'),'utf8').replace(/\r\n/g,'\n'));
  const src=path.join(tmp,'site-src/styles/00-foundation.css');fs.appendFileSync(src,'\n/* test token */\n');assert.throws(()=>styles.build(true,tmp),/生成漏れ/);styles.build(false,tmp);assert.ok(fs.readFileSync(path.join(tmp,'style.css'),'utf8').includes('test token'));
  fs.appendFileSync(path.join(tmp,'pilot-inputs.css'),'/* direct */');assert.throws(()=>styles.build(true,tmp),/直接編集/);styles.build(false,tmp);
  fs.writeFileSync(path.join(tmp,'rogue.css'),'');assert.throws(()=>styles.build(true,tmp),/未登録CSS/);fs.unlinkSync(path.join(tmp,'rogue.css'));
  fs.writeFileSync(path.join(tmp,'site-src/styles/rogue.css'),'');assert.throws(()=>styles.build(true,tmp),/未登録CSS編集元/);
  fs.writeFileSync(path.join(tmp,'broken.js'),'function (');assert.throws(()=>contract.checkScripts(tmp),SyntaxError);
 }finally{assert.ok(path.resolve(tmp).startsWith(path.resolve(os.tmpdir())+path.sep)&&path.basename(tmp).startsWith('luna-css-'));fs.rmSync(tmp,{recursive:true,force:true});}
});
