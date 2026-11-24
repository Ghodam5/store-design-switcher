'use strict';
// 商品の「お届けまでの日数」を、本文（説明・注意事項・最低数量の注記）の書き方から読み取る。
// 使い方: node tools/delivery-days.cjs          … 読み取れる商品と読み取れない商品を一覧にする（何も書かない）
//         node tools/delivery-days.cjs --write  … delivery が空の商品にだけ、読み取った日数を入れる（source: "本文"）
// 本店の商品ページの取り込み（別の作業）で正しい日数が入ったら、そちら（source: "本店"）を優先する。ここでは上書きしない。
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..'), dir = path.join(root, 'site-src/products');
const Z = s => String(s || '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
// 「お届けまで(に)(約)14日」「お届けまでに約1~2週間」「お届けまでの目安は約1週間」
const RE = /お届けまで(?:に|の目安は)?\s*(?:約|およそ)?\s*(\d{1,2})\s*(?:[~〜～\-－]\s*(\d{1,2}))?\s*(日|週間)/;
function read(text) {
  const m = RE.exec(Z(text));
  if (!m) return null;
  const k = m[3] === '週間' ? 7 : 1;
  const min = Number(m[1]) * k, max = Number(m[2] || m[1]) * k;
  if (!min || max < min || max > 120) return null;
  return { min, max, made: /受注|製造|生産|制作/.test(text), source: '本文' };
}
function scan(write) {
  const ids = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  const found = [], missing = [];
  for (const id of ids) {
    const f = path.join(dir, id + '.json');
    const row = JSON.parse(fs.readFileSync(f, 'utf8'));
    const p = row.product;
    if (p.delivery) { found.push([id, p.delivery, '済']); continue; }
    const d = read([p.notice, p.description, p.minnote].join('\n'));
    if (!d) { missing.push(id); continue; }
    found.push([id, d, '本文']);
    if (write) { p.delivery = d; fs.writeFileSync(f, JSON.stringify(row, null, 2) + '\n'); }
  }
  return { found, missing };
}
module.exports = { read, scan };
if (require.main === module) {
  const r = scan(process.argv.includes('--write'));
  console.log('日数あり ' + r.found.length + '件 / 日数なし ' + r.missing.length + '件');
  for (const [id, d, s] of r.found) console.log(id + '\t' + d.min + (d.max !== d.min ? '〜' + d.max : '') + '日' + (d.made ? '\t受注生産' : '') + '\t' + s);
}
