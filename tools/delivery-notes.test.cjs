'use strict';
// お届け日数の読み取り・定型文と商品の notes / delivery の確かめ
const test = require('node:test'), a = require('node:assert/strict');
const { read } = require('./delivery-days.cjs');
const nt = require('./notice-templates.cjs');
test('本文からお届け日数を読む（出荷・賞味期限の日数は読まない）', () => {
  a.deepEqual(read('※受注生産品の為お届けまでに14日ほどお時間をいただきます'), { min: 14, max: 14, made: true, source: '本文' });
  a.deepEqual(read('※お届けまでに約1~2週間ほどお時間'), { min: 7, max: 14, made: false, source: '本文' });
  a.deepEqual(read('お届けまでの目安は約１週間です。受注生産のため'), { min: 7, max: 7, made: true, source: '本文' });
  a.equal(read('賞味期限：出荷日より180日'), null);
});
test('定型文は全部正しく、商品の notes・delivery の間違いは止める', () => {
  const ids = new Set(nt.load().templates.map(t => t.id));
  a.ok(ids.has('made-to-order'));
  a.doesNotThrow(() => nt.checkProduct({ id: '1', delivery: { min: 7, max: 14, made: true }, notes: ['made-to-order'] }, ids));
  a.throws(() => nt.checkProduct({ id: '1', notes: ['no-such'] }, ids), /notes/);
  a.throws(() => nt.checkProduct({ id: '1', delivery: { min: 14, max: 7, made: true } }, ids), /delivery/);
  a.throws(() => nt.checkProduct({ id: '1', notes: ['min-qty', 'min-qty'] }, ids), /notes/);
});

test('v66 定型文を選んでいない商品にも決まりに沿って出す', () => {
  const d = nt.load();
  a.deepEqual(nt.autoNotes({ id: 'x' }, d), ['order-mail', 'spec-change', 'season-delay']);
  const made = nt.autoNotes({ id: 'y', delivery: { min: 14, max: 14, made: true }, expiry: '30日', minq: 10 }, d);
  for (const id of ['made-to-order', 'cancel-if-late', 'no-cancel-after', 'food-no-return', 'min-qty']) a.ok(made.includes(id), id);
});

test('v66 商品ページの段組みは部品の重なり・無い部品・SNSを外すのを断る', () => {
  const pl = require('./product-layout.cjs');
  const d = pl.load();
  a.ok(d.below.includes('share'));
  pl.checkProduct({ id: 'ok', layout: { side: ['buy', 'notes', 'description'], below: ['share', 'recommend', 'delivery'] } }, d);
  a.throws(() => pl.checkProduct({ id: 'a', layout: { side: ['buy', 'notes'], below: ['notes', 'share'] } }, d), /2回/);
  a.throws(() => pl.checkProduct({ id: 'b', layout: { side: ['buy', 'nope'], below: ['share'] } }, d), /無い部品/);
  a.throws(() => pl.checkProduct({ id: 'c', layout: { side: ['buy', 'notes'], below: ['recommend'] } }, d), /外せません/);
  a.throws(() => pl.checkProduct({ id: 'e', layout: { side: ['notes'], below: ['buy', 'share'] } }, d), /購入欄/);
  a.ok(d.parts.some(x => x.id === 'delivery') && d.side.indexOf('delivery') < d.side.indexOf('buy'), 'お届け日数は購入欄の上が最初の並び');
});

test('v68 定型文を段組みに1つずつ置ける（note:定型文のid）。無い定型文は断る', () => {
  const pl = require('./product-layout.cjs');
  const d = pl.load();
  pl.checkProduct({ id: 'ok', layout: { side: ['buy', 'notes', 'note:order-mail'], below: ['share'] } }, d);
  a.throws(() => pl.checkProduct({ id: 'x', layout: { side: ['buy', 'note:nope'], below: ['share'] } }, d), /無い部品/);
});
test('v68 本店の注意書きがある商品は、定型文か「この商品のご注意」のどちらかで必ず出す', () => {
  const fs = require('node:fs'), path = require('node:path');
  const nt = require('./notice-templates.cjs').load();
  const ids = new Set(nt.templates.map(t => t.id));
  const dir = path.join(__dirname, '..', 'site-src/products');
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json'))) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), p = j.product || j;
    if (!p.notice) continue;
    n++;
    if (Array.isArray(p.notes)) a.ok(p.notes.length && p.notes.every(id => ids.has(id)), p.id);
  }
  a.ok(n > 100);
});
