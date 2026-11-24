# 編集する場所（v56・現在の入口）

制作ルール.md・更新履歴.mdを先に読む。標準の外観・動作と例外は [共通仕様一覧.md](共通仕様一覧.md) に集約。過去のREADMEは [旧版の記録](docs/archive/編集手順_v55.md) に保存し、現在の作業指示として使わない。

## 通常は対象の部品だけ読む

`node tools/components.cjs show 部品ID` で編集対象を表示する。ページ全体・商品全件・共通ヘッダーを毎回読み直さない。

| 作業 | 編集元／手順 |
|---|---|
| 商品1件 | `node tools/products.cjs find キーワード` → `show ID` → `site-src/products/ID.json`。追加はadd、掲載停止archive、復帰restore。商品HTMLを複製しない |
| 商品ページの型 | `site-src/pages/item.html`、item-page.js／product-detail.js。本文だけを変更 |
| 分類 | 既存のcategoryテンプレートと商品JSONのcategories/subs。分類ごとにHTMLを複製しない |
| 新しい案内 | `node tools/pages.cjs create-guide スラッグ "タイトル"` → `site-src/sections/pages/スラッグ.html`の本文だけ編集 |
| 特集カード | `site-src/home-promos/`の1カード1JSON、manifestで順番、active／期間で表示管理 |
| トップの章 | `node tools/components.cjs section` → `site-src/sections/top/該当章.html` |
| お知らせ | `site-src/site-notices.json`。文言・リンク・日本時間の掲載期間。OMS公開連携は未実装 |
| 個別の既存ページ本文 | `site-src/pages/ページ名.html`。共通includeは残す |

## CSS・共通部品は全体変更を依頼された時だけ

- **CSS編集元はsite-src/styles/だけ。直下の全CSSは自動生成物。** manifest.jsonに編集元・出力と順序を登録。担当表は共通仕様一覧を参照。
- `style.css`は10分割の編集元を既存と同じ順に結合。各部品は`styles/components/同名.css`。旧ページ内CSSは`styles/pages/`。
- ヘッダー・検索・ロゴ・大カテゴリ・メニュー・フッター・下部ナビは`site-src/shared/`。商品・本文編集では触らない。
- 数量はdata-quantity-picker、印字日付はdata-date-picker、備考はtextarea、横レールはdata-standard-railを使う。専用の入力や矢印をページごとに作らない。
- 元DB・元シート・バックアップへ書き戻さない。商品データは279件を保持、詳細充実は先行5点、残り274点は保留。

## 生成・検査・公開

1. `site-src/version.json`を1つ上げる。
2. `node tools/build-site.cjs` → `node tools/build-site.cjs --check`。
3. `node --test tools/*.test.cjs`。必須外枠、CSS編集元との一致、資産の欠落／重複／head読込、JS構文、数量マーカー、生成漏れを検出。
4. 5幅luna-qaとvisual-check。新しいページ・操作は個別に触って確認。機械検査だけで任意の本文の崩れを保証しない。
5. 更新履歴・制作ルールの新決定を記録しコミット／push。ArtifactはGitHubから写す。未反映はClaudeへ依頼。

林さんから依頼された共通変更だけ`node tools/build-site.cjs --update-shared-lock`で記録する。生成CSSやHTMLへの直接編集をlock更新で通さない。

GitHub版lunaluce-sample-currentが正。古いlunaluce-sampleは編集しない。作業記録は第二の脳のLuna-Luche_HP。WordPress＋Welcart／OMSの本番接続は別工程で、サンプルのlocalStorageを本番受注に使わない。
