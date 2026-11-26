// 部品：いちばん上の大きな写真と見出し（写真は3〜5枚）
const { esc, br, img } = require('./_util.cjs');
module.exports = b => `<section class="blp-hero" data-block="hero">
<div class="blp-hero-photos n${b.photos.length}">${b.photos.map((p, i) => `<figure class="p${i + 1}">${img(p, '', 700, 700, false)}</figure>`).join('')}</div>
<div class="blp-hero-copy"><p class="blp-kicker">${esc(b.kicker)}</p><h1>${br(b.title)}</h1><p class="blp-hero-lead">${br(b.lead)}</p>
<ul class="blp-badges">${b.badges.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
<div class="blp-ctas"><a class="blp-btn" href="${esc(b.cta.href)}">${esc(b.cta.label)}</a>${b.subCta ? `<a class="blp-btn ghost" href="${esc(b.subCta.href)}">${esc(b.subCta.label)}</a>` : ''}</div></div>
</section>`;
