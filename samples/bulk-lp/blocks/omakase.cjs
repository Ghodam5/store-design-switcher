// 部品：おまかせで伝えるのは3つだけ（予算・個数・使う日）
const { esc, head, sec } = require('./_util.cjs');
const ICON = {
  yen: '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="19"/><path d="M16 13l8 11 8-11M24 24v13M17 26h14M17 32h14"/></svg>',
  box: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M7 17h34v24H7zM5 11h38v6H5zM24 11v30M24 11c-4-8-14-6-10 0M24 11c4-8 14-6 10 0"/></svg>',
  cal: '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="7" y="10" width="34" height="31" rx="3"/><path d="M7 19h34M15 6v8M33 6v8M15 27h5M28 27h5M15 34h5"/></svg>'
};
module.exports = b => sec(b, `${head(b)}<ol class="blp-three">${b.steps.map(s => `<li>${ICON[s.icon] || ''}<b>${esc(s.label)}</b><span>${esc(s.text)}</span></li>`).join('')}</ol><p class="blp-result">${esc(b.result)}</p>`);
