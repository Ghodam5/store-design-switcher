// 部品で共通に使う小さな道具（文字のエスケープ・改行）
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const img = (src, alt = '', w = 700, h = 700, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const head = (b, tag = 'h2') => `<${tag} class="blp-h">${esc(b.title)}</${tag}>${b.lead ? `<p class="blp-lead">${br(b.lead)}</p>` : ''}`;
const sec = (b, inner, extra = '') => `<section class="blp-sec blp-s-${b.type}${extra}" id="${esc(b.id || 'blp-' + b.type)}" data-block="${esc(b.type)}">${inner}</section>`;
module.exports = { esc, br, img, head, sec };
