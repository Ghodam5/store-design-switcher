// 部品で共通に使う小さな道具（文字のエスケープ・改行・写真・見出し・区切り）
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const yen = n => Number(n).toLocaleString('ja-JP') + '円';
const img = (src, alt = '', w = 700, h = 700, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const head = b => `${b.kicker ? `<p class="cg-kick">${esc(b.kicker)}</p>` : ''}<h2 class="cg-h">${esc(b.title)}</h2>${b.lead ? `<p class="cg-lead">${br(b.lead)}</p>` : ''}`;
const sec = (b, inner) => `<section class="cg-sec cg-s-${b.type}" id="${esc(b.id || 'cg-' + b.type)}" data-block="${esc(b.type)}">${inner}</section>`;
module.exports = { esc, br, yen, img, head, sec };
