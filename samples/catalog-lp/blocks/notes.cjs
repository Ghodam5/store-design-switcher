// 部品：ご注意（大事なことを省かずに。見出しつきの箱で目立たせる）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="cg-notes">${b.groups.map(g => `<div class="cg-note-box${g.strong ? ' strong' : ''}"><h3>${esc(g.title)}</h3><ul>${g.items.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>`).join('')}</div>`);
