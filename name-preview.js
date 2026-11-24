/* お試し専用。入力はDOM内だけで扱い、注文・保存・送信へ接続しない。 */
(()=>{'use strict';
 const descriptions={seal:['ミニシール','メッセージとお名前を、小さなシールの見本に入れてみましょう。'],place:['席札','ゲストのお名前を入力して、席札の見え方をお試しください。'],seating:['席次表','ゲストのお名前をTable Aの先頭に表示します。配置を編集する機能ではなく、架空の席次表の見本です。']};
 document.querySelectorAll('[data-name-preview]').forEach(root=>{
  const input=key=>root.querySelector('[data-preview-input="'+key+'"]');
  function update(){const values={message:input('message').value,names:input('names').value.trim()||'お名前',guest:input('guest').value.trim()||'ゲストのお名前',date:input('date').value.replace(/-/g,'.')||'日付'};root.querySelectorAll('[data-preview-value]').forEach(e=>e.textContent=values[e.dataset.previewValue]);}
  function select(type){if(!Object.hasOwn(descriptions,type))return;const [title,description]=descriptions[type];root.querySelectorAll('[data-preview-type]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.previewType===type)));root.querySelectorAll('[data-preview-panel]').forEach(e=>e.hidden=e.dataset.previewPanel!==type);root.querySelector('[data-preview-background-field]').hidden=type!=='seal';root.querySelector('[data-preview-message-field]').hidden=type==='place'||type==='seating';root.querySelector('[data-preview-guest-field]').hidden=type!=='place'&&type!=='seating';root.querySelector('[data-preview-heading]').textContent=title+'の見本';root.querySelector('[data-preview-description]').textContent=description;root.querySelector('[data-preview-status]').textContent='選択中：'+title;update();}
  const choices=window.SEAL_PREVIEW_DATA?.seals||[],selectSeal=root.querySelector('[data-seal-choice]');
  choices.forEach(row=>{const option=document.createElement('option');option.value=row.id;option.textContent=row.label;selectSeal.append(option);});
  function seal(){const row=choices.find(x=>x.id===selectSeal.value);if(!row)return;const image=root.querySelector('[data-seal-image]');image.src=row.previewImage;image.alt=row.label+'の元画像見本';root.querySelector('[data-preview-status]').textContent='選択中：ミニシール ／ '+row.label;}
  selectSeal.addEventListener('change',seal);seal();
  root.querySelectorAll('[data-preview-type]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.previewType)));
  root.querySelectorAll('[data-preview-input]').forEach(e=>{e.addEventListener('input',update);e.addEventListener('change',update);});select('seal');
 });
})();
