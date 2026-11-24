# 商品は1商品1ファイル

通常は対象のID.jsonだけを読む。全件を開かない。元DB・元シート・バックアップは読み取り専用。

| 項目 | 編集する内容 |
|---|---|
| active | 掲載中true／掲載停止false。archive・restoreで切替 |
| product | 商品名、価格、SKU、画像、分類、簡易説明、名入れ条件 |
| product.spec | 商品別の名入れ入力・最低数量条件。既存値を理由なく変えない |
| detail | 複数写真、説明段落、仕様表、パンくず、関連商品。現在は先行5件だけ |
| feature | 特集に出す場合のgroups・紹介文・写真等。特集用の文言・画像が違う場合だけここを編集。価格・SKUはproductが正 |
| listing | 一覧専用の短縮名・写真・分類がある場合だけ指定。商品共通の価格はproductを参照 |

`node tools/products.cjs find 商品名` → `show ID` → 対象JSONを編集 → `build` → `check`。
新規JSONは`add パス`で登録。掲載停止は`archive ID`、復帰は`restore ID`。新しい商品ごとにHTMLは作らない。
manifest.jsonは表示順と商品ID一覧、catalog-meta.jsonは既存サンプルのID対応。通常は触らない。
公開前はsite-src/version.jsonの版上げ、build-site.cjs、5幅QA、visual-checkを行う。
