// 部品：お問い合わせ（外部フォームへのボタン＋電話）
const { esc, head, sec } = require('./_util.cjs');
module.exports = b => sec(b, `${head(b)}<div class="plp-contact">
<div class="plp-contact-box"><b>フォームで</b><a class="plp-btn" href="${esc(b.form.href)}" target="_blank" rel="noopener">${esc(b.form.label)} ↗</a><small>${esc(b.form.note)}</small></div>
<div class="plp-contact-box"><b>お電話で</b><a class="plp-tel" href="tel:${esc(b.tel.replace(/-/g, ''))}">${esc(b.tel)}</a><small>${esc(b.hours)}<br>${esc(b.person)}</small></div>
</div>`);
