#!/usr/bin/env node
// 提携商品の特別ページ（見本）を作る。
// page.json の blocks を順に部品（blocks/*.cjs）で HTML にし、外枠（ヘッダー・フッター）は今の partners.html から借りる。
// あわせて、トップページに入口のバナー（部品 banner）を置いた見本 top-preview.html も作る。
// 今のページ（partners.html・top.html）は読むだけで変更しない。サイト直下に置くと build-site の --check が止まるので、samples/partner-lp/ に書き出す。
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const { esc } = require('./blocks/_util.cjs');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'page.json'), 'utf8'));
const blocks = {};
for (const f of fs.readdirSync(path.join(__dirname, 'blocks'))) if (!f.startsWith('_') && f.endsWith('.cjs')) blocks[f.replace('.cjs', '')] = require('./blocks/' + f);

const problems = [];
const body = data.blocks.map((b, i) => {
  const r = blocks[b.type];
  if (!r) { problems.push(`${i + 1}番目の部品「${b.type}」は登録されていません`); return ''; }
  return r(b);
}).join('\n');
for (const b of data.blocks) for (const k of ['photo', 'photos']) for (const p of [].concat(b[k] || [])) if (!fs.existsSync(path.join(ROOT, p))) problems.push(`写真が見つかりません: ${p}`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const css = `<link rel="stylesheet" href="samples/partner-lp/partner-lp.css?v=1">`;
const frame = (file, bar) => fs.readFileSync(path.join(ROOT, file), 'utf8').replace('<head>', '<head><base href="../../">').replace('</head>', css + '</head>')
  .replace(/<div class="sample-bar">[\s\S]*?<\/div>/, `<div class="sample-bar">${bar}</div>`);

// 1) 特別ページ
const p = data.page;
const main = `<main class="wrap plp" id="support-main" data-special-page="${esc(p.id)}"><nav class="crumb"><a href="top.html">ホーム</a><span>›</span><a href="${esc(p.breadcrumbParent.href)}">${esc(p.breadcrumbParent.label)}</a><span>›</span>${esc(p.title)}</nav>
${body}
</main>`;
let html = frame('partners.html', '見本：提携商品の特別ページ（サイトビルダーの「特別ページ」で作る想定）｜今のページは変えていません');
const s = html.indexOf('<main'), e = html.indexOf('</main>') + 7;
if (s < 0 || e < 7) throw new Error('partners.html に <main> が見つかりません');
html = html.slice(0, s) + main + html.slice(e);
html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}｜ルナルーチェ（見本）</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.description)}">`);
fs.writeFileSync(path.join(__dirname, 'preview.html'), html);

// 2) トップページの入口バナー見本（「ご利用ガイド・ご相談」の上に置く。下の小さな「提携商品募集」も新しいページへつなぐ）
let top = frame('top.html', '見本：トップページに「提携商品」の入口バナーを置いた形｜今のトップは変えていません');
const at = top.indexOf('<section id="home-guides"');
if (at < 0) throw new Error('top.html に home-guides が見つかりません');
top = top.slice(0, at) + blocks.banner(data.banner) + top.slice(at);
top = top.replace('<a class="support-banner" href="partners.html">', `<a class="support-banner" href="${esc(data.banner.href)}">`).replace('<h3>提携商品募集</h3><p>作り手のみなさまへ</p>', '<h3>提携商品</h3><p>ご紹介と募集</p>');
fs.writeFileSync(path.join(__dirname, 'top-preview.html'), top);
console.log(`preview.html（部品 ${data.blocks.length} 個）と top-preview.html を書き出しました`);
