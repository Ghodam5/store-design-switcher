// 部品：注文から製造・お届けまでの流れ図
// PC：上の段＝お客さま、下の段＝お店の2段（スイムレーン）に、左から右へ矢印でつなぐ。
// スマホ：縦に1列。お客さま（緑）は左寄せ、お店（赤）は右寄せ。
// 途中の分かれ道（間に合わないとき）は branch.after 番目のあとに点線の箱で出す。
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => {
  const n = b.steps.length;
  const cells = [];
  b.steps.forEach((s, i) => {
    const col = i * 2 + 2; // 1列目は段の名前
    cells.push(`<li class="rlp-fl-step ${s.who}" style="--c:${col}"><span class="rlp-fl-no">${i + 1}</span><span class="rlp-fl-when">${esc(s.when)}</span><b>${esc(s.label)}</b><small class="rlp-fl-who">${esc(b.lanes[s.who])}</small><p>${esc(s.text)}</p></li>`);
    if (i === b.branch?.after - 1) cells.push(`<li class="rlp-fl-branch" style="--c:${col}"><b>${esc(b.branch.title)}</b><p>${esc(b.branch.text)}</p></li>`);
    if (i < n - 1) {
      const next = b.steps[i + 1].who;
      const kind = s.who === next ? 'same ' + s.who : (s.who === 'you' ? 'down' : 'up');
      const ok = i === b.branch?.after - 1 ? `<span class="rlp-fl-ok">${esc(b.branch.okLabel || '間に合うとき')}</span>` : '';
      cells.push(`<li class="rlp-fl-arrow ${kind}" style="--c:${col + 1}" aria-hidden="true"><i></i><i></i><i></i>${ok}</li>`);
    }
  });
  return sec(b, `${head(b)}<div class="rlp-flow-wrap"><ol class="rlp-flow" style="--n:${n}"><li class="rlp-fl-lane you" aria-hidden="true">${esc(b.lanes.you)}</li><li class="rlp-fl-lane us" aria-hidden="true">${esc(b.lanes.us)}</li>${cells.join('')}</ol></div>`);
};
