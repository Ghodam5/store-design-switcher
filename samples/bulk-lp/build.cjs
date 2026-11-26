#!/usr/bin/env node
// 大口注文の特別ページ（見本）を作る。
// page.json の blocks を順に部品（blocks/*.cjs）で HTML にし、
// サイトの外枠（ヘッダー・フッター）は今の bulk-order.html から借りて、別ファイル samples/bulk-lp/preview.html に書き出す（サイト直下に置くと build-site の --check が止まるため）。
// 今のページ（bulk-order.html など）は読むだけで変更しない。
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
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const p = data.page;
const main = `<main class="wrap blp" id="support-main" data-special-page="${esc(p.id)}"><nav class="crumb"><a href="top.html">ホーム</a><span>›</span><a href="${esc(p.breadcrumbParent.href)}">${esc(p.breadcrumbParent.label)}</a><span>›</span>${esc(p.title)}</nav>
${body}
</main><a class="blp-sticky" href="#bulk-form">無料でお見積もりを頼む</a>`;

let html = fs.readFileSync(path.join(ROOT, 'bulk-order.html'), 'utf8');
const s = html.indexOf('<main'), e = html.indexOf('</main>') + 7;
if (s < 0 || e < 7) throw new Error('bulk-order.html に <main> が見つかりません');
html = html.slice(0, s) + main + html.slice(e);
html = html.replace('<head>', '<head><base href="../../">').replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}｜ルナルーチェ（見本）</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.description)}">`)
  .replace('</head>', `<link rel="stylesheet" href="samples/bulk-lp/bulk-lp.css?v=1"></head>`)
  .replace(/<div class="sample-bar">[\s\S]*?<\/div>/, '<div class="sample-bar">見本：大口注文の特別ページ（サイトビルダーの「特別ページ」で作る想定）｜今のページは変えていません</div>');
fs.writeFileSync(path.join(__dirname, 'preview.html'), html);
console.log(`samples/bulk-lp/preview.html を書き出しました（部品 ${data.blocks.length} 個）`);
