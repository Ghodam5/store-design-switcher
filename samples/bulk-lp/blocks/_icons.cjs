// 部品で使う線のアイコン（色は CSS の currentColor）。名前で呼ぶ
const I = {
  sale: '<path d="M8 26 26 8h14v14L22 40z"/><circle cx="33" cy="15" r="3"/><path d="M17 27l8-8M18 21h.01M24 27h.01"/>',
  gift: '<rect x="8" y="18" width="32" height="22" rx="2"/><path d="M5 12h38v6H5zM24 12v28M24 12c-3-7-13-6-9 0M24 12c3-7 13-6 9 0"/>',
  doc: '<path d="M12 5h17l9 9v29H12z"/><path d="M29 5v9h9M18 22h14M18 29h14M18 36h8"/>',
  truck: '<path d="M4 12h24v20H4zM28 19h9l7 7v6H28z"/><circle cx="12" cy="35" r="4"/><circle cx="36" cy="35" r="4"/>',
  yen: '<circle cx="24" cy="24" r="18"/><path d="M16 13l8 11 8-11M24 24v13M17 26h14M17 32h14"/>',
  shop: '<path d="M6 18 10 8h28l4 10M6 18h36v4a6 6 0 0 1-12 0 6 6 0 0 1-12 0 6 6 0 0 1-12 0zM9 26v14h30V26M20 40V30h8v10"/>',
  person: '<circle cx="24" cy="15" r="8"/><path d="M8 42c2-10 9-14 16-14s14 4 16 14"/>',
  ticket: '<path d="M5 14h38v7a4 4 0 0 0 0 8v7H5v-7a4 4 0 0 0 0-8z"/><path d="M30 14v22" stroke-dasharray="3 3"/>',
  card: '<rect x="6" y="11" width="36" height="26" rx="3"/><circle cx="17" cy="22" r="4"/><path d="M12 31c1-3 3-4 5-4s4 1 5 4M27 20h10M27 26h8"/>',
  mail: '<rect x="5" y="11" width="38" height="26" rx="2"/><path d="m6 12 18 14 18-14"/>',
  book: '<path d="M24 12c-5-4-12-4-18-2v28c6-2 13-2 18 2 5-4 12-4 18-2V10c-6-2-13-2-18 2zM24 12v28"/>',
  bag: '<path d="M9 16h30l-2 26H11zM17 16v-3a7 7 0 0 1 14 0v3"/>'
};
module.exports = (name, cls = '') => I[name] ? `<svg class="blp-ic ${cls}" viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${I[name]}</svg>` : '';
