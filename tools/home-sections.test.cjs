'use strict';
// トップの商品の段: 並べ替え・表示しない・期間・OMSで足した段・不正な設定の拒否
const test = require('node:test'), a = require('node:assert/strict'), fs = require('node:fs'), path = require('node:path'), os = require('node:os'), cp = require('node:child_process');
const root = path.resolve(__dirname, '..');
function sandbox() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'luna-home-sections-'));
  for (const f of ['tools/home-sections.cjs', 'site-src/home-sections.json', 'site-src/pages/top.html', 'site-src/home-layout.json', 'site-src/sections/top', 'site-src/products', 'site-src/pages/category.html']) {
    fs.mkdirSync(path.dirname(path.join(tmp, f)), { recursive: true });
    fs.cpSync(path.join(root, f), path.join(tmp, f), { recursive: true });
  }
  return tmp;
}
const run = (tmp, ok = true) => { const r = cp.spawnSync(process.execPath, [path.join(tmp, 'tools/home-sections.cjs')], { encoding: 'utf8' }); a.equal(r.status === 0, ok, r.stderr + r.stdout); return r; };
const region = tmp => { const s = fs.readFileSync(path.join(tmp, 'site-src/pages/top.html'), 'utf8'); return s.slice(s.indexOf('home-sections:start'), s.indexOf('home-sections:end')); };
test('いまの設定と top.html が合っている', () => {
  const r = cp.spawnSync(process.execPath, [path.join(root, 'tools/home-sections.cjs'), '--check'], { encoding: 'utf8' });
  a.equal(r.status, 0, r.stderr);
});
test('段を並べ替え・表示しない・期間つき・足した段にでき、不正は拒否する', () => {
  const tmp = sandbox();
  try {
    const file = path.join(tmp, 'site-src/home-sections.json');
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const ids = data.sections.map(s => s.id);
    data.sections.reverse();
    data.sections.find(s => s.id === 'dragee').active = false;
    data.sections.find(s => s.id === 'candy').startsAt = '2026-12-01T00:00:00+09:00';
    data.sections.unshift({ id: 'xmas-sale', kind: 'row', active: true, title: 'クリスマスセール', sub: '12/25まで', href: 'category.html?g=season', ids: ['43569', '43374'], endsAt: '2026-12-26T00:00:00+09:00' });
    fs.writeFileSync(file, JSON.stringify(data));
    run(tmp);
    const out = region(tmp);
    a.ok(out.indexOf('data-home-row="xmas-sale"') < out.indexOf('{{@ top/welcome-board}}'));
    a.ok(out.indexOf('{{@ top/welcome-board}}') < out.indexOf('{{@ top/ranking}}'));
    a.ok(!out.includes('{{@ top/dragee}}'));
    a.ok(out.includes('data-placement-id="home-sec-candy"'));
    a.ok(out.includes('item.html?id=43569') && out.includes('<span class="n">名入れ</span>'));
    const layout = JSON.parse(fs.readFileSync(path.join(tmp, 'site-src/home-layout.json'), 'utf8'));
    a.equal(layout.slots['home-sec-xmas-sale'].endsAt, '2026-12-26T00:00:00+09:00');
    a.ok(layout.slots['legacy-christmas-row']);
    a.equal(ids.length, data.sections.length - 1);
    // 足した段を消すと、期間の設定も消える
    data.sections.shift();
    fs.writeFileSync(file, JSON.stringify(data));
    run(tmp);
    a.ok(!JSON.parse(fs.readFileSync(path.join(tmp, 'site-src/home-layout.json'), 'utf8')).slots['home-sec-xmas-sale']);
    for (const bad of [
      { id: 'bad', kind: 'row', active: true, title: '商品なし', ids: [] },
      { id: 'bad', kind: 'row', active: true, title: '無い商品', ids: ['999999999'] },
      { id: 'bad', kind: 'row', active: true, title: '変なリンク', href: 'javascript:alert(1)', ids: ['43569'] },
      { id: 'bad', kind: 'fixed', active: true },
      { id: 'flavor', kind: 'fixed', active: true }
    ]) {
      const before = fs.readFileSync(path.join(tmp, 'site-src/pages/top.html'), 'utf8');
      fs.writeFileSync(file, JSON.stringify(Object.assign({}, data, { sections: data.sections.concat([bad]) })));
      run(tmp, false);
      a.equal(fs.readFileSync(path.join(tmp, 'site-src/pages/top.html'), 'utf8'), before);
    }
  } finally {
    a.ok(path.resolve(tmp).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
