// 部品：ブランドの紹介（写真・ひとこと・コース数と価格の幅は商品データから自動）
const { esc, yen, img, head, sec } = require('./_util.cjs');
module.exports = (b, ctx) => sec(b, `${head(b)}<div class="cg-brands">${ctx.brands.map(br => {
  const list = ctx.courses.filter(c => c.brand === br.key);
  const min = Math.min(...list.map(c => c.price)), max = Math.max(...list.map(c => c.price));
  return `<article class="cg-brand b-${esc(br.key)}">${img(br.photo, br.name + ' の表紙', 900, 600)}<div><p class="cg-brand-genre">${esc(br.genre)}</p><h3>${esc(br.name)}</h3><p>${esc(br.text)}</p><ul class="cg-brand-facts"><li><b>${list.length}</b>コース</li><li><b>${yen(min)}</b>〜${yen(max)}</li><li>${esc(br.forms)}</li></ul><a class="cg-more" href="#cg-courses-${esc(br.key)}">コースを見る ›</a></div></article>`;
}).join('')}</div>`);
