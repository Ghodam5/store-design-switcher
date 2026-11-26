// 部品：企業・式場向けサービス。上に絵（写真・流れの図・アイコン）、下に説明と注意
const { esc, img, head, sec } = require('./_util.cjs');
const icon = require('./_icons.cjs');
const visual = x => {
  if (x.diagram) return `<ol class="blp-mini-flow">${x.diagram.map(d => `<li class="${d.who === 'shop' ? 'shop' : 'you'}">${icon(d.who === 'shop' ? 'shop' : 'person')}<span>${esc(d.text)}</span></li>`).join('')}</ol>`;
  if (x.photos) return `<div class="blp-svc-photos n${x.photos.length}">${x.photos.map(p => img(p, '')).join('')}${x.icon ? `<span class="blp-svc-ic">${icon(x.icon)}</span>` : ''}</div>`;
  return '';
};
module.exports = b => sec(b, `${head(b)}<div class="blp-services">${b.items.map(x => `<article><div class="blp-svc-vis">${visual(x)}</div><div class="blp-svc-body"><h3>${icon(x.icon, 'sm')}${esc(x.title)}</h3><p>${esc(x.text)}</p>${x.notes.length ? `<ul>${x.notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul>` : ''}</div></article>`).join('')}</div>`);
