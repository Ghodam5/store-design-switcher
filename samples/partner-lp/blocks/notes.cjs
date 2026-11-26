// 部品：注意書き（大事なものは赤い文字）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `<div class="plp-notes">${head(b)}<ul>${b.items.map(x => `<li${x.strong ? ' class="strong"' : ''}>${esc(x.text)}</li>`).join('')}</ul></div>`);
