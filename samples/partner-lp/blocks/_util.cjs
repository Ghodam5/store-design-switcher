// 部品で共通に使う小さな道具（文字のエスケープ・改行）
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const br = s => esc(s).replace(/\n/g, '<br>');
const img = (src, alt = '', w = 700, h = 700, lazy = true) => `<img src="${esc(src)}" alt="${esc(alt)}" width="${w}" height="${h}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const head = (b, tag = 'h2') => `<${tag} class="plp-h">${esc(b.title)}</${tag}>${b.lead ? `<p class="plp-lead">${br(b.lead)}</p>` : ''}`;
const sec = (b, inner, extra = '') => `<section class="plp-sec plp-s-${b.type}${extra}" id="${esc(b.id || 'plp-' + b.type)}" data-block="${esc(b.type)}">${inner}</section>`;
module.exports = { esc, br, img, head, sec };
// 線のアイコン（色はCSSで付ける）
const ICONS = {
  page: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8 14h3"/>',
  made: '<path d="M4 20l6-6M14 4l6 6-8 8-6-6z"/><path d="M12 6l6 6"/>',
  star: '<path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 16.6 6.6 19.5l1.2-6L3.3 9.3l6.1-.7z"/>',
  factory: '<path d="M3 21V10l6 4V10l6 4V5h6v16z"/><path d="M7 18h2M12 18h2M17 18h2"/>',
  cake: '<path d="M4 21h16V13H4z"/><path d="M4 16c2 1.5 4 1.5 5.3 0 1.4 1.5 4 1.5 5.4 0 1.3 1.5 3.3 1.5 5.3 0"/><path d="M12 13V9M12 6.5c-1-1-1-2 0-3.5 1 1.5 1 2.5 0 3.5z"/>',
  flower: '<circle cx="12" cy="9" r="2.4"/><path d="M12 6.6c0-3 3-3 3-.6 2.4 0 2.4 3 0 3 2.4 0 2.4 3 0 3 0 2.4-3 2.4-3-.6M12 6.6c0-3-3-3-3-.6-2.4 0-2.4 3 0 3-2.4 0-2.4 3 0 3 0 2.4 3 2.4 3-.6"/><path d="M12 12v9M12 17c-2 0-3.5-1.2-4-3M12 18c2 0 3.5-1 4-3"/>',
  pen: '<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/>',
  mic: '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3M9 21h6"/>'
};
const icon = k => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONS[k] || ICONS.star}</svg>`;
module.exports.icon = icon;
