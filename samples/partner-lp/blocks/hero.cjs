// 部品：いちばん上の写真と見出し（写真は3〜4枚）
const { esc, br, img } = require('./_util.cjs');
module.exports = b => `<section class="plp-hero" data-block="hero">
<div class="plp-hero-photos n${b.photos.length}">${b.photos.map((p, i) => `<figure class="p${i + 1}">${img(p, '', 600, 600, false)}</figure>`).join('')}</div>
<div class="plp-hero-copy"><p class="plp-kicker">${esc(b.kicker)}</p><h1>${br(b.title)}</h1><p class="plp-hero-lead">${br(b.lead)}</p>
<div class="plp-ctas">${b.ctas.map(c => `<a class="plp-btn${c.ghost ? ' ghost' : ''}" href="${esc(c.href)}">${esc(c.label)}</a>`).join('')}</div></div>
</section>`;
