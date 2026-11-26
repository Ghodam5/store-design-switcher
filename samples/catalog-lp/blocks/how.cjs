// 部品：しくみを3つの絵で（贈る→選ぶ→届く）
const { esc, head, sec } = require('./_util.cjs');
const ICON = {
  gift: '<path d="M6 20h36v8H6zM9 28h30v16H9zM24 20v24"/><path d="M24 20c-3-8-14-10-12-3 1 3 7 3 12 3zM24 20c3-8 14-10 12-3-1 3-7 3-12 3z"/>',
  book: '<path d="M8 10h14a4 4 0 014 4v26a3 3 0 00-3-3H8zM40 10H28a4 4 0 00-4 4v26a3 3 0 013-3h13z"/><path d="M30 18h6M30 24h6M12 18h6"/>',
  phone: '<rect x="14" y="5" width="20" height="38" rx="4"/><path d="M21 37h6"/><path d="M19 15h10v10H19z"/>',
  truck: '<path d="M4 14h24v18H4zM28 20h9l6 7v5H28z"/><circle cx="12" cy="35" r="4"/><circle cx="35" cy="35" r="4"/>',
  home: '<path d="M6 22L24 7l18 15"/><path d="M11 19v22h26V19"/><path d="M20 41V29h8v12"/>'
};
module.exports = b => sec(b, `${head(b)}<ol class="cg-how">${b.steps.map((s, i) => `<li><span class="cg-how-no">STEP ${i + 1}</span><svg viewBox="0 0 48 48" aria-hidden="true">${ICON[s.icon] || ''}</svg><b>${esc(s.title)}</b><small>${esc(s.who)}</small><p>${esc(s.text)}</p></li>`).join('')}</ol>`);
