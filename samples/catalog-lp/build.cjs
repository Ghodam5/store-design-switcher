#!/usr/bin/env node
// カタログギフトの特別ページ（見本）を作る。
// page.json の blocks を順に部品（blocks/*.cjs）で HTML にする。コースの名前・価格・写真は商品データ（site-src/products）から読む。
// 外枠（ヘッダー・フッター）は今の bulk-order.html から借り、samples/catalog-lp/preview.html に書き出す（サイト直下に置くと build-site の --check が止まるため）。
// 今のページ・商品データは読むだけで変更しない。
const fs = require('fs'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const { esc } = require('./blocks/_util.cjs');
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'page.json'), 'utf8'));

// 商品データからコースを作る（冊子とカードの2つがあるコースは1つにまとめる）
const prods = fs.readdirSync(path.join(ROOT, 'site-src/products')).filter(f => /^\d+\.json$/.test(f))
  .map(f => JSON.parse(fs.readFileSync(path.join(ROOT, 'site-src/products', f), 'utf8')))
  .filter(d => d.active !== false && d.product && (d.product.categories || []).includes(data.page.category)).map(d => d.product);
const byKey = new Map();
for (const p of prods) {
  const brand = (p.subs || [])[0];
  const meta = data.brands.find(b => b.key === brand);
  if (!meta) continue;
  const m = p.title.match(/^(.*?)\s*＜(.+?)＞\s*$/);
  const base = m ? m[1] : p.title;
  const form = m ? (m[2].includes('カード') ? 'カード' : '冊子') : (brand === 'ocean' ? '冊子・カード' : '冊子');
  const k = brand + '|' + base;
  if (!byKey.has(k)) byKey.set(k, { brand, brandName: meta.name, title: base, short: base.replace(meta.name, '').replace(/^\s+/, '') || base, price: p.price, image: p.image, ids: [] });
  byKey.get(k).ids.push({ id: p.id, form });
  if (form === '冊子') byKey.get(k).image = p.image; // 写真は冊子の表紙を優先
}
const courses = [...byKey.values()].map(c => (c.ids.sort((a, b) => a.form === '冊子' ? -1 : 1), c)).sort((a, b) => a.price - b.price);
const ctx = { courses, brands: data.brands };

const blocks = {};
for (const f of fs.readdirSync(path.join(__dirname, 'blocks'))) if (!f.startsWith('_') && f.endsWith('.cjs')) blocks[f.replace('.cjs', '')] = require('./blocks/' + f);
const problems = [];
const body = data.blocks.map((b, i) => {
  const r = blocks[b.type];
  if (!r) { problems.push(`${i + 1}番目の部品「${b.type}」は登録されていません`); return ''; }
  return r(b, ctx);
}).join('\n');
for (const b of data.brands) if (!courses.some(c => c.brand === b.key)) problems.push(`ブランド「${b.name}」の商品が見つかりません`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }

const p = data.page;
const main = `<main class="wrap cg" id="support-main" data-special-page="${esc(p.id)}"><nav class="crumb"><a href="top.html">ホーム</a><span>›</span><a href="${esc(p.breadcrumbParent.href)}">${esc(p.breadcrumbParent.label)}</a><span>›</span>${esc(p.title)}</nav>
${body}
</main><a class="cg-sticky" href="#cg-budget">ご予算からコースを選ぶ</a>`;

let html = fs.readFileSync(path.join(ROOT, 'bulk-order.html'), 'utf8');
const s = html.indexOf('<main'), e = html.indexOf('</main>') + 7;
if (s < 0 || e < 7) throw new Error('bulk-order.html に <main> が見つかりません');
html = html.slice(0, s) + main + html.slice(e);
html = html.replace('<head>', '<head><base href="../../">').replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}｜ルナルーチェ（見本）</title>`)
  .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.description)}">`)
  .replace('</head>', `<link rel="stylesheet" href="samples/catalog-lp/catalog-lp.css?v=1"></head>`)
  .replace(/<div class="sample-bar">[\s\S]*?<\/div>/, '<div class="sample-bar">見本：カタログギフトの特別ページ（サイトビルダーの「特別ページ」で作る想定）｜今のページは変えていません</div>');
fs.writeFileSync(path.join(__dirname, 'preview.html'), html);
console.log(`samples/catalog-lp/preview.html を書き出しました（部品 ${data.blocks.length} 個・コース ${courses.length} 件・商品 ${prods.length} 件）`);
