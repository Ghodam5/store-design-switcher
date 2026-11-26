// 部品：いちばん上の大きな写真（5枚の組み合わせ）と見出し
const { esc, br, img } = require('./_util.cjs');
module.exports = b => `<section class="rlp-hero" data-block="hero">
<div class="rlp-hero-photos">${b.photos.map((p, i) => `<figure class="p${i + 1}">${img(p, '', 700, 700, false)}</figure>`).join('')}<span class="rlp-hero-stamp" aria-hidden="true">特急</span></div>
<div class="rlp-hero-copy"><p class="rlp-kicker">${esc(b.kicker)}</p><h1>${br(b.title)}</h1><p class="rlp-hero-lead">${br(b.lead)}</p>
<ul class="rlp-badges">${b.badges.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
<div class="rlp-ctas"><a class="rlp-btn" href="${esc(b.cta.href)}">${esc(b.cta.label)}</a>${b.subCta ? `<a class="rlp-btn ghost" href="${esc(b.subCta.href)}">${esc(b.subCta.label)}</a>` : ''}</div></div>
</section>`;
