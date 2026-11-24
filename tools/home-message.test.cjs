'use strict';
// トップのメッセージのカード（kind: message）: 見出しの強調・検査・ページに書くHTML
const test = require('node:test'), a = require('node:assert/strict');
const m = require('./home-message.cjs');
const ok = { image: f => f === 'images/main-flavor.jpg', link: h => h === 'name-preview.html' };
const row = () => ({ id: 'intro', active: true, kind: 'message', theme: 'cream', image: 'images/main-flavor.jpg', alt: '写真', badge: '10個からお名入れOK', headline: 'ゲストの数だけ、\n名前入りの\nありがとうを。', accent: '名前入りのありがとう', text: '説明', buttons: [{ label: '試す', href: 'name-preview.html', style: 'main' }, { label: '売れ筋', href: '#rank', style: 'sub' }] });
test('見出しの改行を残し、強調の言葉（改行を飛ばして探す）だけ色の印を付ける', () => {
  a.equal(m.headlineHtml('ゲストの数だけ、\n名前入りの\nありがとうを。', '名前入りのありがとう'), 'ゲストの数だけ、<br><span>名前入りの<br>ありがとう</span>を。');
  a.equal(m.headlineHtml('<b>見出し</b>', ''), '&lt;b&gt;見出し&lt;/b&gt;');
});
test('正しいカードは通し、おかしな所は断る', () => {
  m.check(row(), 'intro', ok);
  const bad = [r => { r.accent = '無い言葉'; }, r => { r.headline = ''; }, r => { r.buttons = []; }, r => { r.buttons[0].href = 'javascript:x'; }, r => { r.buttons[1].style = 'red'; }, r => { r.image = 'images/none.jpg'; }, r => { r.buttons.push({ label: '3つ目', href: '#a', style: 'sub' }); }];
  for (const f of bad) { const r = row(); f(r); a.throws(() => m.check(r, 'intro', ok)); }
});
test('最初の1枚だけ h1、2枚目からは h2。ボタンは色の種類ごとのクラス', () => {
  const two = [row(), Object.assign(row(), { id: 'second', theme: 'rose', badge: '' })];
  const html = m.html(two);
  a.equal((html.match(/<h1>/g) || []).length, 1);
  a.equal((html.match(/<h2>/g) || []).length, 1);
  a.match(html, /data-promo-id="second" data-theme="rose"/);
  a.match(html, /<a class="btn co" href="name-preview.html">試す<\/a><a class="btn wh" href="#rank">売れ筋<\/a>/);
  a.equal((html.match(/class="pill"/g) || []).length, 1);
});
test('写真の上の演出: 書いていなければ花びら、none は粒を出さない、知らない名前は断る', () => {
  a.match(m.html([row()]), /<i class="pt l1">/);
  a.doesNotMatch(m.html([row()]), /data-fx/);
  const snow = Object.assign(row(), { effect: 'snow' });
  a.match(m.html([snow]), /data-fx="snow"/);
  const none = Object.assign(row(), { effect: 'none' });
  a.doesNotMatch(m.html([none]), /class="pt/);
  a.throws(() => m.check(Object.assign(row(), { effect: 'fireworks' }), 'intro', ok));
  for (const e of m.EFFECTS) m.check(Object.assign(row(), { effect: e }), 'intro', ok);
});
