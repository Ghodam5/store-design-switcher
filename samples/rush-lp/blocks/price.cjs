// 部品：料金（カード型。スマホでも表がはみ出さない）
const { esc, head, sec, check } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="rlp-price">${b.rows.map(r => `<article><p class="rlp-price-target">${esc(r.target)}</p><h3>${esc(r.name)}</h3><p class="rlp-price-yen">${esc(r.price)}</p><p class="rlp-price-how">${esc(r.how)}</p>${check(r.check)}</article>`).join('')}</div>${b.note ? `<p class="rlp-note">${esc(b.note)}</p>` : ''}`);
