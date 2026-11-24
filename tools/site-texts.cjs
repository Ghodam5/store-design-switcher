'use strict';
// ページに出る見出し・ボタンの文字（site-src/site-texts.json）を確かめ、site-texts-data.js を作る。
// OMSのサイトビルダー「表示する文字」で直す（書き出しの texts → tools/apply-oms-export.cjs）。
// ページ側は window.SITE_TEXTS[key] を使い、無いときは元の文字のまま出す。
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'site-src/site-texts.json');
const OUT = path.join(root, 'site-texts-data.js');
function check(d) {
  if (!d || d.schemaVersion !== 1 || !Array.isArray(d.texts)) throw Error('site-texts.json の形が違います');
  const keys = new Set();
  for (const t of d.texts) {
    if (!/^[a-z][a-zA-Z0-9]*(\.[a-zA-Z0-9]+)+$/.test(t.key || '') || keys.has(t.key)) throw Error('表示する文字のキーが不正か重複: ' + t.key);
    keys.add(t.key);
    if (typeof t.label !== 'string' || !t.label.trim()) throw Error('表示する文字に説明がありません: ' + t.key);
    if (typeof t.text !== 'string' || !t.text.trim() || t.text.length > 60) throw Error('表示する文字は1〜60文字: ' + t.key);
    if (/[<>]/.test(t.text)) throw Error('表示する文字に < > は使えません: ' + t.key);
  }
  return d;
}
function load() { return check(JSON.parse(fs.readFileSync(SRC, 'utf8'))); }
function build(isCheck = false) {
  const d = load();
  const map = {};
  for (const t of d.texts) map[t.key] = t.text;
  const text = '/* 編集元 site-src/site-texts.json（OMSのサイトビルダー「表示する文字」） */\nwindow.SITE_TEXTS=' + JSON.stringify(map) + ';\n';
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8').replace(/\r\n/g, '\n') : '';
  if (cur !== text) { if (isCheck) throw Error('site-texts-data.js の生成漏れ'); fs.writeFileSync(OUT, text); }
  return d.texts.length;
}
module.exports = { load, check, build };
if (require.main === module) { try { console.log('表示する文字: ' + build(process.argv.includes('--check')) + '件'); } catch (e) { console.error(e.message); process.exitCode = 1; } }
