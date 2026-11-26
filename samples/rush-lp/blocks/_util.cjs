// 部品で共通に使う小さな道具（文字のエスケープ・改行・見出し・区切り）
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const img = (src, alt = '', w = 700, h = 700, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const head = b => `<h2 class="rlp-h">${esc(b.title)}</h2>${b.lead ? `<p class="rlp-lead">${br(b.lead)}</p>` : ''}`;
const sec = (b, inner) => `<section class="rlp-sec rlp-s-${b.type}" id="${esc(b.id || 'rlp-' + b.type)}" data-block="${esc(b.type)}">${inner}</section>`;
// 「確認中」の付箋（本番前に本店ページ・担当者に確かめる所）
const check = t => t ? `<p class="rlp-check"><b>確認中</b>${esc(t === true ? '本番前に確認する' : t)}</p>` : '';
module.exports = { esc, br, img, head, sec, check };
