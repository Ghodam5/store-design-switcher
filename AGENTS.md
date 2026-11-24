# このリポジトリ（store-design-switcher）について ※最初に読む

- ここは**試作用の別リポジトリ**。`Ghodam5/lunaluce-sample` main v75（d79cba5）を2026-11-24に写して始めた。目的と順番は README.md。
- **`Ghodam5/lunaluce-sample` と今のOMS（VPS、oms-split-builder）は絶対に変更しない。** ここでの変更をそちらへ反映しない（林さん決定 2026-11-24）。
- 下の説明は lunaluce-sample から写したもの。「OMSの作業は oms-split-builder」などの記述は元のリポジトリの話で、ここでは当てはまらない。

---

# このリポジトリを編集するAIへ

**Codex など、これまでの会話を知らないAIは、最初に `引き継ぎ書.md` を読む。** 現状・ブランチの使い分け・確認コマンド・OMSのVPS反映手順・進行中の作業・林さんの開発方針がまとめてある。
- 返事は日本語。依頼主は林さん（GitHub `Ghodam5`）。作業の終わりに「何をどの順で、なぜやったか」を短く書く。
- OMS の作業は **oms-split-builder** ブランチ（main の oms/ は古い）。VPS の設定は **vps-oms-setup** ブランチの ops/vps/。
- 処理ごとに部品（モジュール）に分ける。担当者が JSON・CSS を触らずに済むビルダー型の画面にする。
- パスワード・トークン・鍵・お客様の個人情報は書かない、コミットしない。
- PR を出す前に `node tools/build-site.cjs --check` と CI と同じテスト（.github/workflows/check-site.yml）を通す。

先に制作ルール.md・更新履歴.md・README_編集する場所.mdを読む。

- 編集元はsite-src/pages/。直下のHTMLは公開用の生成物なので直接編集しない。
- ヘッダー・検索・大カテゴリ・メニュー・フッター・上下のロゴはsite-src/shared/で管理する。林さんの依頼が共通部分の変更を含む場合だけ変更する。
- 商品ページの形式・本文・商品データの変更では、共通部品・style.css・共通操作スクリプトを変更しない。商品専用CSS/JSを使う。
- node tools/build-site.cjsで生成し、--checkで不一致と共通部品の変更検知を確認する。共通部分の変更が依頼されているときだけ--update-shared-lockを使う。商品編集のために保護チェックを回避しない。
- 版はsite-src/version.jsonを上げる。生成してから5幅luna-qaとvisual-checkを行う。共通部分を編集しない作業でも表示確認は続ける。
- 元DB・元シート・バックアップを変更しない。既存カートと名入れの条件を保つ。274商品への詳細展開は保留中。
- 詳細な作業記録とAI間の引き継ぎは第二の脳20_Projects/Luna-Luche_HPへ残す。

## 商品編集の最短経路（v36）
- 商品1件の変更はtools/products.cjs find→show ID→site-src/products/ID.jsonだけを編集→build/check。全件バンドルproduct-data.js／product-detail-data.jsは読まない・直接編集しない。
- 商品の増減はadd／archive／restore。IDと名入れ条件を保ち、元DBを書き換えない。型の変更がない限りitem.html・ヘッダー・フッターを読み直さない。必要箇所だけ調べ、保護チェックと公開前QAで影響を確認する。
- SNSは全ページ共通の必須部品。商品作業では触らない。詳しくはREADME_編集する場所.md。

- 本番公開は受注管理・印刷・在庫連動との併用を前提。名入れ／SKU／入数／オプションの仕様変更時は本番連携の制作条件.mdを読む。f番号・選択肢番号・localStorageを本番受注のキーにせず、サーバー保存・固定ID・明細関連・注文版を設計する。連携未実装を完了と案内しない。通常の商品価格・文章だけの作業ではこのために全テンプレートを読み直さない。

## 部品とテンプレートを固定して使う（2026-11-20 林さん再指示）
- 最初にnode tools/components.cjs show product/category/promo/guide等で既存の型を確認する。指定されたIDを一つ選ぶ。依頼ごとに別のHTML構成・独自CSSを作り直さない。
- トップの章はnode tools/components.cjs section IDで対応ファイルだけ確認し、site-src/sections/top/ID.htmlを編集。{{@ top/ID}}で呼び出す。
- 新しい案内ページはtools/pages.cjs create-guideを使い、登録されたguide-page.htmlと本文部品から生成。ヘッダーからフッターまでの手作り複製をしない。
- 商品は既存item.html＋商品JSON、カテゴリは既存category.html＋分類、特集は1枚1JSON。通常は共通CSSや共通スクリプトを読み直さず変更しない。
- 新しい形式が必要なら理由とユーザー指示を確認し、部品台帳・制作ルール・検査を更新してから共通型へ追加する。
