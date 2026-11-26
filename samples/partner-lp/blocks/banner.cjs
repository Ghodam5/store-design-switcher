// 部品：トップページなどに置く入口のバナー（写真3枚＋見出し＋ボタン。全体がリンク）
const { esc, br, img } = require('./_util.cjs');
module.exports = b => `<section class="sec plp-banner-sec" data-block="partner-banner"><a class="plp-banner" href="${esc(b.href)}">
<span class="plp-banner-ph">${b.photos.map((p, i) => `<span class="q${i + 1}">${img(p, '', 600, 600)}</span>`).join('')}</span>
<span class="plp-banner-copy"><small>${esc(b.kicker)}</small><strong>${br(b.title)}</strong><span>${esc(b.text)}</span><em>${esc(b.label)} ›</em></span></a></section>`;
