'use strict';
// トップ本文の商品の段（site-src/home-sections.json）→ site-src/pages/top.html の印のあいだを作る。
// kind: fixed = いまある段（site-src/sections/top/<id>.html）、row = OMSで足した段（ids の商品を横に並べる）。
// active=false の段は出さない。startsAt/endsAt がある段は home-layout.json の home-sec-<id> で期間を決める（placement-visibility.js）。
// OMSのサイトビルダー「トップの商品の段」で並び・表示・追加を決め、書き出しの homeSections をこのファイルに入れる。
const fs = require('node:fs'), path = require('node:path');
const root = path.resolve(__dirname, '..');
const SRC = path.join(root, 'site-src/home-sections.json');
const TOP = path.join(root, 'site-src/pages/top.html');
const LAYOUT = path.join(root, 'site-src/home-layout.json');
const START = '<!-- home-sections:start（site-src/home-sections.json から tools/home-sections.cjs が作る。ここは直接直さない） -->';
const END = '<!-- home-sections:end -->';
const MAX_IDS = 30;
const read = p => fs.readFileSync(p, 'utf8').replace(/\r\n/g, '\n');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const isTime = v => /T.*(?:Z|[+-]\d{2}:\d{2})$/.test(v) && Number.isFinite(Date.parse(v));
function product(id) {
  const p = path.join(root, 'site-src/products', id + '.json');
  if (!/^\d+$/.test(id) || !fs.existsSync(p)) return null;
  return JSON.parse(read(p)).product;
}
function load() {
  const data = JSON.parse(read(SRC));
  if (data.schemaVersion !== 1 || data.timeZone !== 'Asia/Tokyo' || !Array.isArray(data.sections)) throw Error('home-sections.json の形が違います');
  const seen = new Set();
  for (const s of data.sections) {
    if (!/^[a-z0-9-]{1,40}$/.test(s.id || '') || seen.has(s.id)) throw Error('段のIDが不正か重複: ' + s.id);
    seen.add(s.id);
    if (typeof s.active !== 'boolean') throw Error('段の表示は真偽値: ' + s.id);
    for (const k of ['startsAt', 'endsAt']) if (s[k] && !isTime(s[k])) throw Error('段の日時を確認: ' + s.id);
    if (s.startsAt && s.endsAt && Date.parse(s.startsAt) >= Date.parse(s.endsAt)) throw Error('段の期間が逆: ' + s.id);
    if (s.kind === 'fixed') {
      if (!fs.existsSync(path.join(root, 'site-src/sections/top', s.id + '.html'))) throw Error('いまある段が見つかりません: ' + s.id);
    } else if (s.kind === 'row') {
      if (!s.title || s.title.length > 40) throw Error('段の題名は1〜40文字: ' + s.id);
      if (s.sub && s.sub.length > 60) throw Error('段の一言は60文字まで: ' + s.id);
      if (s.href && (!/^[a-z0-9-]+\.html(?:[?#].*)?$/.test(s.href) || !fs.existsSync(path.join(root, 'site-src/pages', s.href.split(/[?#]/)[0])))) throw Error('段の「すべて見る」の行き先が不正: ' + s.id);
      if (!Array.isArray(s.ids) || !s.ids.length || s.ids.length > MAX_IDS || new Set(s.ids).size !== s.ids.length) throw Error('段の商品は1〜' + MAX_IDS + '件・重複なし: ' + s.id);
      for (const id of s.ids) if (!product(id)) throw Error('段の商品が見つかりません: ' + s.id + ' ' + id);
    } else throw Error('段の種類は fixed か row: ' + s.id);
  }
  return data;
}
function rowHtml(s) {
  const href = s.href ? esc(s.href) : '';
  const cards = s.ids.map(id => {
    const p = product(id);
    const name = (p.tags || []).includes('名入れ') ? '<span class="n">名入れ</span>' : '';
    const img = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy" width="520" height="520">' : '';
    return '<a class="prod" href="item.html?id=' + esc(id) + '"><div class="ph">' + img + '</div><div class="b"><div class="tags">' + name + '</div><h3>' + esc(p.title) + '</h3><div class="price">' + Number(p.price).toLocaleString('ja-JP') + '円<small> 税込</small></div></div></a>';
  }).join('');
  return '<section class="rowsec" data-home-row="' + esc(s.id) + '"><div class="row-h"><h2>' + esc(s.title) + (s.sub ? ' <small>' + esc(s.sub) + '</small>' : '') + '</h2>\n' +
    (href ? '<a class="all" href="' + href + '">すべて見る ›</a>' : '') + '</div>\n' +
    '<div class="rail-wrap"><button class="rail-nav prev" type="button" aria-label="前の商品へ">‹</button><div class="rail">' + cards +
    (href ? '<a class="more-card" href="' + href + '"><i>→</i>すべて見る</a>' : '') + '</div><button class="rail-nav next" type="button" aria-label="次の商品へ">›</button></div></section>';
}
function render(data) {
  return data.sections.filter(s => s.active).map(s => {
    let html = s.kind === 'fixed' ? '{{@ top/' + s.id + '}}' : rowHtml(s);
    if (s.id === 'ranking' && s.kind === 'fixed') html = '<div id="rank">' + html + '</div>';
    if (s.startsAt || s.endsAt) html = '<div hidden data-placement-id="home-sec-' + s.id + '">' + html + '</div>';
    return html;
  }).join('\n');
}
function build(check = false) {
  const data = load();
  const top = read(TOP);
  const a = top.indexOf(START), b = top.indexOf(END);
  if (a < 0 || b < a) throw Error('top.html に段の印がありません');
  const nextTop = top.slice(0, a + START.length) + '\n' + render(data) + '\n' + top.slice(b);
  const layout = JSON.parse(read(LAYOUT));
  const slots = {};
  for (const [k, v] of Object.entries(layout.slots)) if (!k.startsWith('home-sec-')) slots[k] = v;
  for (const s of data.sections) if (s.active && (s.startsAt || s.endsAt)) {
    const row = { active: true, timeZone: 'Asia/Tokyo' };
    if (s.startsAt) row.startsAt = s.startsAt;
    if (s.endsAt) row.endsAt = s.endsAt;
    slots['home-sec-' + s.id] = row;
  }
  const nextLayout = JSON.stringify(Object.assign({}, layout, { slots }), null, 2) + '\n';
  const outs = [[TOP, nextTop], [LAYOUT, nextLayout]];
  for (const [p, text] of outs) {
    const cur = read(p);
    if (check) { if (cur !== text) throw Error(path.relative(root, p) + ' がトップの段の設定と合っていません（node tools/home-sections.cjs を実行）'); }
    else if (cur !== text) fs.writeFileSync(p, text);
  }
  return data.sections.length;
}
module.exports = { load, render, build, rowHtml };
if (require.main === module) {
  try { console.log('トップの段: ' + build(process.argv.includes('--check')) + '件'); } catch (e) { console.error(e.message); process.exitCode = 1; }
}
