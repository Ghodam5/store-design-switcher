// 部品：見積もりフォーム（項目は page.json の fields で増減。見本なので送信しない）
const { esc, head, sec } = require('./_util.cjs');
const field = f => {
  const id = 'blp-f-' + f.name, req = f.required ? ' <em>必須</em>' : '';
  const lab = `<label for="${id}">${esc(f.label)}${req}</label>`;
  switch (f.kind) {
    case 'choice': return `<fieldset class="blp-choice"><legend>${esc(f.label)}</legend>${f.options.map((o, i) => `<label><input type="radio" name="${f.name}"${i === 0 ? ' checked' : ''}><span>${esc(o)}</span></label>`).join('')}</fieldset>`;
    case 'checks': return `<fieldset class="blp-checks"><legend>${esc(f.label)}</legend>${f.options.map(o => `<label><input type="checkbox" name="${f.name}"><span>${esc(o)}</span></label>`).join('')}</fieldset>`;
    case 'select': return `<div class="blp-field">${lab}<select id="${id}"><option value="">選んでください</option>${f.options.map(o => `<option>${esc(o)}</option>`).join('')}</select></div>`;
    case 'textarea': return `<div class="blp-field wide">${lab}<textarea id="${id}" rows="4"></textarea></div>`;
    case 'budget': return `<div class="blp-field">${lab}<input id="${id}" type="text" placeholder="${esc(f.placeholder)}"></div>`;
    default: return `<div class="blp-field">${lab}<input id="${id}" type="${f.kind === 'number' ? 'number' : esc(f.kind)}"${f.kind === 'number' ? ' inputmode="numeric" min="1"' : ''}${f.placeholder ? ` placeholder="${esc(f.placeholder)}"` : ''}></div>`;
  }
};
module.exports = b => sec(b, `${head(b)}<form class="blp-form" onsubmit="return false" aria-label="${esc(b.title)}">${b.fields.map(field).join('')}<p class="blp-note wide">${esc(b.notice)}</p><button class="blp-btn wide" type="submit" disabled title="見本のため送信できません">${esc(b.submitLabel)}</button><p class="blp-sample-note wide">※見本のため、このフォームは送信できません。</p></form>`);
