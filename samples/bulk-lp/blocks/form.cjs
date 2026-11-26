// 部品：大口のご相談フォーム（かんたん版）。項目は page.json の fields、相談欄の「よくある書き出し」は hints で増減。
// 本番では送信先を OMS の「大口のご相談」受付にする想定。見本なので送信しない。
const { esc, head, sec } = require('./_util.cjs');
const field = f => {
  const id = 'blp-f-' + f.name, req = f.required ? ' <em>必須</em>' : '';
  const lab = `<label for="${id}">${esc(f.label)}${req}${f.help ? `<small>${esc(f.help)}</small>` : ''}</label>`;
  const ph = f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : '';
  if (f.kind === 'memo') return `<div class="blp-field wide blp-memo">${lab}<div class="blp-hints" role="group" aria-label="よくある書き出し">${(f.hints || []).map(h => `<button type="button" data-hint="${esc(h)}">＋ ${esc(h)}</button>`).join('')}</div><textarea id="${id}" rows="6"${ph}></textarea></div>`;
  if (f.kind === 'textarea') return `<div class="blp-field wide">${lab}<textarea id="${id}" rows="4"${ph}></textarea></div>`;
  const type = { number: 'number', email: 'email', tel: 'tel', date: 'date' }[f.kind] || 'text';
  return `<div class="blp-field${f.wide ? ' wide' : ''}">${lab}<input id="${id}" type="${type}"${type === 'number' ? ' inputmode="numeric" min="1"' : ''}${ph}></div>`;
};
module.exports = b => sec(b, `${head(b)}<form class="blp-form" onsubmit="return false" aria-label="${esc(b.title)}">${b.fields.map(field).join('')}<p class="blp-note wide">${esc(b.notice)}</p><button class="blp-btn wide" type="submit" disabled title="見本のため送信できません">${esc(b.submitLabel)}</button><p class="blp-sample-note wide">※見本のため送信できません。本番では送った内容がOMSの「大口のご相談」に届きます。</p></form>
<script>(function(){var f=document.currentScript.previousElementSibling,t=f.querySelector('.blp-memo textarea');f.querySelectorAll('[data-hint]').forEach(function(b){b.addEventListener('click',function(){t.value=(t.value?t.value.replace(/\\s*$/,'')+'\\n':'')+b.dataset.hint+'：';t.focus();b.classList.add('used');});});})();</script>`);
