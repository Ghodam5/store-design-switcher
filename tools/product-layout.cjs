'use strict';
// 商品ページの段組み（site-src/product-layout.json）を確かめ、product-layout-data.js を作る。
// 商品ごとの layout（{ side: [...], below: [...] }）も、ここの checkProduct で確かめる（products.cjs から呼ぶ）。
// SNSでシェア（share）は全ページ共通の必須部品なので、外せない。購入欄（buy）は写真の右（side）に必ず置く。
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'site-src/product-layout.json');
const OUT = path.join(root, 'product-layout-data.js');
const REQUIRED = ['share'];
// note:定型文のid は、注意事項の定型文を1つずつ段組みに置く部品（全商品・その商品に同じ文を出す）
function noteIds() { try { return new Set(require('./notice-templates.cjs').load().templates.map(t => t.id)); } catch (e) { return new Set(); } }
function checkLayout(l, ids, who) {
  if (!l || typeof l !== 'object' || !Array.isArray(l.side) || !Array.isArray(l.below)) throw Error(who + ': 段組みは side と below の並びで書いてください');
  const all = l.side.concat(l.below);
  if (new Set(all).size !== all.length) throw Error(who + ': 段組みに同じ部品が2回あります');
  const notes = noteIds();
  for (const id of all) if (!ids.has(id) && !(id.startsWith('note:') && notes.has(id.slice(5)))) throw Error(who + ': 段組みに無い部品があります: ' + id);
  for (const id of REQUIRED) if (!all.includes(id)) throw Error(who + ': 「' + id + '」（SNSでシェア）は外せません');
  if (!l.side.includes('buy')) throw Error(who + ': 購入欄（buy）は写真の右（side）に入れてください');
}
function load() {
  const d = JSON.parse(fs.readFileSync(SRC, 'utf8'));
  if (d.schemaVersion !== 1 || !Array.isArray(d.parts)) throw Error('product-layout.json の形が違います');
  const ids = new Set();
  for (const p of d.parts) {
    if (!/^[a-z][a-z0-9-]{1,20}$/.test(p.id || '') || ids.has(p.id)) throw Error('段組みの部品IDが不正か重複: ' + p.id);
    if (typeof p.label !== 'string' || !p.label.trim()) throw Error('段組みの部品に名前がありません: ' + p.id);
    ids.add(p.id);
  }
  checkLayout(d, ids, 'product-layout.json');
  return d;
}
function checkProduct(p, d) {
  if (p.layout === undefined) return;
  checkLayout(p.layout, new Set((d || load()).parts.map(x => x.id)), p.id);
}
function build(check = false) {
  const d = load();
  const text = '/* 編集元 site-src/product-layout.json（OMSのサイトビルダー「商品ページの段組み」） */\nwindow.PRODUCT_LAYOUT=' + JSON.stringify({ parts: d.parts, side: d.side, below: d.below }) + ';\n';
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== text) { if (check) throw Error('product-layout-data.js の生成漏れ'); fs.writeFileSync(OUT, text); }
  return d.side.length + d.below.length;
}
module.exports = { load, build, checkProduct };
if (require.main === module) { try { console.log('商品ページの段組み: ' + build(process.argv.includes('--check')) + '部品'); } catch (e) { console.error(e.message); process.exitCode = 1; } }
