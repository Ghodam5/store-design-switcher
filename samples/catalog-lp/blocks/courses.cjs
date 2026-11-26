// 部品：コース一覧（ブランドごと。冊子とカードがあるコースは1枚のカードにまとめる。中身は商品データから自動）
const { esc, yen, img, head, sec } = require('./_util.cjs');
module.exports = (b, ctx) => sec(b, `${head(b)}${ctx.brands.map(br => {
  const list = ctx.courses.filter(c => c.brand === br.key);
  return `<div class="cg-courses" id="cg-courses-${esc(br.key)}"><h3>${esc(br.name)}<span>${list.length}コース</span></h3><ul class="cg-rail">${list.map(c => `<li><a href="item.html?id=${esc(c.ids[0].id)}">${img(c.image, c.title, 500, 500)}</a><div><b>${esc(c.short)}</b><p class="cg-price">${yen(c.price)}<small>（税込）</small></p><div class="cg-forms">${c.ids.map(x => `<a href="item.html?id=${esc(x.id)}">${esc(x.form)}</a>`).join('')}</div></div></li>`).join('')}</ul></div>`;
}).join('')}`);
