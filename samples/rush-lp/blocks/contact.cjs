// 部品：電話の案内
const { esc, sec } = require('./_util.cjs');
module.exports = b => sec(b, `<h2 class="rlp-h">${esc(b.title)}</h2><a class="rlp-tel" href="tel:${esc(b.tel.replace(/-/g, ''))}">${esc(b.tel)}</a><p>${esc(b.hours)}</p><p>${esc(b.text)}</p>`);
