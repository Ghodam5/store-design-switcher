// 部品：通常と特急の日数くらべ（横の帯グラフ。日数は page.json の数字から自動で長さが決まる）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => {
  const pct = d => (d / b.scale * 100).toFixed(1);
  const ticks = [...new Set([0, 7, 14, b.scale])].map(d => `<span style="left:${pct(d)}%">${d === 0 ? 'ご注文' : d + '日'}</span>`).join('');
  return sec(b, `${head(b)}<div class="rlp-compare">${b.rows.map(r => `<div class="rlp-cmp-row ${esc(r.tone)}"><div class="rlp-cmp-label"><b>${esc(r.label)}</b><span>${esc(r.fee)}</span></div><div class="rlp-cmp-track"><i style="width:${pct(r.to)}%"></i>${r.from !== r.to ? `<i class="range" style="left:${pct(r.from)}%;width:${pct(r.to - r.from)}%"></i>` : ''}<em style="left:${pct(r.to)}%">${esc(r.text)}</em></div></div>`).join('')}<div class="rlp-cmp-axis">${ticks}</div></div>${b.note ? `<p class="rlp-note">${esc(b.note)}</p>` : ''}`);
};
