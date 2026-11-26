// 部品：申し込み方（3ステップ、絵は線のアイコン）
const { esc, head, sec } = require('./_util.cjs');
const icons = {
  cart: '<path d="M4 6h3l3 12h10l3-9H9"/><circle cx="11" cy="22" r="1.6"/><circle cx="19" cy="22" r="1.6"/>',
  plus: '<rect x="5" y="5" width="18" height="18" rx="5"/><path d="M14 10v8M10 14h8"/>',
  card: '<rect x="3" y="7" width="22" height="15" rx="3"/><path d="M3 12h22M7 18h5"/>'
};
module.exports = b => sec(b, `${head(b)}<ol class="rlp-howto">${b.steps.map((s, i) => `<li><span class="rlp-howto-no">STEP ${i + 1}</span><svg viewBox="0 0 28 28" aria-hidden="true">${icons[s.icon] || ''}</svg><b>${esc(s.title)}</b><p>${esc(s.text)}</p></li>`).join('')}</ol>`);
