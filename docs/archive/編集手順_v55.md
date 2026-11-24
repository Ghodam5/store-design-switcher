# 編集する場所（v30以降）

制作ルール.md・更新履歴.mdを先に読む。林さんの指示がない限り、共通部分は変更しない。

## 商品ページを作る・直す

- ページの外枠・固有の本文：`site-src/pages/item.html`
- 商品ページ内の表示・購入欄：`item-page.js`、`product-detail.js`
- 商品専用の見た目：`product-detail.css`、`pilot-inputs.css`
- 商品の写真・説明・価格・名入れ条件：`site-src/products/<商品ID>.json`（1商品1ファイル。元DB・元シートは変更しない）
- `product-data.js`／`product-detail-data.js`は自動生成物。直接読んだり編集したりしない。
- 他のページの本文：`site-src/pages/ページ名.html`

本文の前後にある `{{> header}}` などは共通部品を差し込む印。商品ページの編集ではこの印を残し、本文だけを変更する。
直下のitem.htmlやtop.html等は公開用に生成したファイル。直接直すと編集元と食い違い、生成時に戻るため、編集しない。

## 共通部分を直す（林さんの明示指示がある場合）

| 内容 | 編集元 |
|---|---|
| 上下で使うロゴ画像と代替テキスト | site-src/shared/logo.html |
| 上の配置・検索・大カテゴリ・キャンペーン導線 | site-src/shared/header.html |
| 開閉メニュー | site-src/shared/drawer.html |
| 下のロゴ・会社名・案内・会社情報・カレンダー | site-src/shared/footer.html |
| スマホ下部メニュー | site-src/shared/bottom.html |
| 送料無料などの帯 | site-src/shared/shipping.html |
| 共通の見た目 | style.css |
| 大カテゴリ収納の操作 | header-scroll.js |
| 共通アイコン・横スクロール | catico.js、hscroll.js |

現在のページ差はsite-src/pages.jsonに明記。ホームの選択状態、キャンペーン導線やおすすめ特集の有無、簡易ページの下部ナビなど、従来の状態を保持している。フッターがなかった5ページへ新しく追加する変更はしていない。

共通部品・共通CSSと操作はsite-src/shared.lock.jsonで変更を検知する。商品作業でここが変わったら、意図せず触っていないか調べて戻す。この検知は誤操作防止でありアクセス制限ではない。

## 生成して確かめる

1. 版番号はsite-src/version.jsonの数字を一つ上げる。各ページ・共通部品の `?v={{version}}` は自動で同じ番号になる。
2. `node tools/build-site.cjs` を実行し、直下の公開HTMLへ反映する。
3. `node tools/build-site.cjs --check` で生成漏れと共通部分の保護を確認する。
4. `node --test tools/build-site.test.cjs` で本文編集・共通変更検知・生成HTML直接編集検知の仕組みを確認する。
5. 従来通りluna-qa.cjsの5幅とvisual-checkを実行する。商品作業でも表示確認は省略しない。

林さんの指示による共通部分の変更を確認した場合だけ、`node tools/build-site.cjs --update-shared-lock` で変更済みの共通部品を記録して生成する。商品ページだけの作業でこの指定を使わない。
新しいページはsite-src/pages/とpages.jsonに追加する。既存ページの設定を参考にする。

## 公開の仕組み

ビルドで作った直下のHTMLをGitHub Pagesがそのまま配信する。表示中に共通部品を通信で読み込む方式ではないため、JavaScriptの読込順・カート・メニューの初期化は従来通り。
.nojekyllはテンプレートをGitHub側で再解釈させず、生成済みの静的ファイルを配信するために置いている。
将来のWordPress＋Welcart実装でも共通部分と商品テンプレートを分ける方針を引き継ぐ。この変更で本番WordPressや元DBを変更していない。

GitHubへの送信時にも「共通部品と公開HTMLの一致確認」が生成漏れと部品保護を検査する。これは5幅・visual-checkの代わりではない。

## 印刷と備考欄（v31）
印刷ページの記入例・印刷準備はsupport-ui.jsとsupport.cssで統一する。記入例と実入力を区別し、beforeprint/afterprintで記入例を除外・復帰する。印刷のために元データを消さない。
全ページの備考・複数行欄はnotes-resize.js／notes-resize.cssが担当し、site-src/shared/notes-head.htmlとnotes-script.htmlから読み込む。後から表示される欄も自動で対象になる。共通部品として保護するため、全体変更が依頼された場合だけ変更する。

## トップの案内カード（v32）
9項目のリンクと文言はsite-src/pages/top.htmlの#home-guides、専用の見た目はhome-guides.css。既存のimages/guides/のアイコンを使う。Q&Aだけ濃い背景にせず、白地・細枠と従来の印象を保つ。

## ページ移動の表示位置（v33）
navigation-position.jsを共通navigation-head.htmlから早期に読み込み、通常のページ移動・戻る・進む・再読込は先頭表示。見出しへのhashリンクと読込中に始めた操作は尊重する。カテゴリの中分類・小分類はcat2.jsから専用イベントで先頭に戻す。もっと見る・並べ替え・絞り込みでは位置を維持する。移動の仕組みを変更する場合だけ共通部品の保護を更新する。

## SNS共有（v34）
トップの配置はsite-src/pages/top.htmlのdata-share-page、商品の配置はpage-share.jsが購入欄の直後へ追加する。見た目はpage-share.css。商品・トップ以外では読み込まない。共有URLは現在のサンプル公開先を基準とし、商品IDだけを付ける。本番移行時は公開先と商品ごとのOGPを整備する。SNSへ自動投稿せず、共有画面を開く機能。


v35：5つのSNSロゴはimages/social/。Font Awesome Brands由来、同フォルダのREADME・LICENSEを保持する。スマホでも5ロゴを常時表示。Threadsは投稿画面へ、Instagramは端末共有またはコピーと案内。専用のURL投稿機能を装わず、自動投稿しない。


## 低い読み取り量で商品を編集する（v36）

最初にこの節と制作ルールの該当箇所を読む。通常はページ全体・商品全件・共通HTMLを読み直さない。

1. `node tools/products.cjs find キーワード` でIDを探す（結果はID・コード・商品名だけ）。
2. `node tools/products.cjs show 47484` または `site-src/products/47484.json` だけを読む。
3. 当該JSONのproduct（価格・SKU・名入れ等）／detail（写真・詳細説明）だけを編集する。商品IDと既存コードは維持する。
4. `node tools/products.cjs build` で一覧・詳細・カート共通の公開データを生成。`check`で生成漏れを機械検出する。
5. 型・見た目を変える場合だけitem-page.js／product-detail.js等を読む。ヘッダーやフッターは読まず・触らず、共通部品の保護チェックで確認する。
6. 公開時の版上げ・5幅・visual-checkは省略しない。ただしログは要約、異常が出た箇所だけ詳細を読む。

商品追加：既存JSONを参考に新規JSONを作り、画像をimagesへ置き、`node tools/products.cjs add 新規JSONのパス`。既存ID・コードの上書きは拒否する。ページの複製は不要、`item.html?id=ID`が共通の型で表示する。
掲載停止：`node tools/products.cjs archive ID`。元の商品JSONは残る。復帰：`node tools/products.cjs restore ID`。掲載中の一覧・商品詳細・カート参照は同一データを使用する。
順序はsite-src/products/manifest.json、旧サンプルとの対応はcatalog-meta.json。通常の1商品編集では触らない。元DB・元シートへは書き戻さない。
先行5商品の詳細だけを分離して移行した。残り274件の詳細充実は引き続き保留。

## SNS独立共通パーツ（v36）
全ページでshare-head／share-scriptを必須とし、生成時に組込漏れを検出する。page-share.js/cssも共通保護の対象。トップはメイン案内下、商品は購入欄直後、その他は見出し・導入文の近く。商品編集時は変更しない。カート・マイページではお店のトップを共有し、入力した個人情報や検索語は共有しない。

一覧固有の短縮名・写真・分類が従来の商品詳細と異なる場合は、同じ商品JSONのlistingに保持する。通常はproductを参照し、listingがあればその項目だけ一覧用の指定を優先する。分類や一覧画像を変える場合は同じファイル内のlistingも確認する。価格・SKUは常にproductが正で、一覧・商品・カートへ反映する。

現在の生成チェックは商品JSON→公開バンドルの一致も確認する。CIでは商品追加・停止／復帰・他商品の不変性・価格の一覧反映・重複拒否も検証する。通常の編集で全商品JSONをチャットへ出力したり、生成HTMLや生成バンドルを全文表示したりしない。

特集70商品の紹介文・写真・所属は同じ商品JSONのfeatureに保持する。特集の商品名・写真を別指定している場合もそのファイルだけで編集できる。feature.groupsに特集キーを指定して追加可能。特集の価格・SKU・掲載状態はproduct／activeを参照し、停止商品は特集からも外れる。feature-data.jsの固定商品リストは従来互換の控えで、実表示は商品JSONから生成した値に置換する。

旧特集で別IDが同じ商品に対応している場合、featureは配列として旧入口を保持する。価格は両入口とも実際に入る商品／SKUの価格に統一する（54865→72383の旧対応も保持）。

## 関連フォルダの入口（2026-11-19）
Luna-Luche直下のREADME_新サイトの編集場所.md、リニューアル設計資料/新サイト_商品編集と共通部品の設計.md、AI引き継ぎ/商品編集の最短手順.mdからもこの編集手順へ到達できる。Claude／Codexの入口とHP更新スキルにも同じ方針を記載。コードの正はこのGitリポジトリだけで、関連フォルダには案内・設計を置く。詳細記録は第二の脳。Dropboxの端末間同期完了は別途確認が必要。

## 本番の受注管理・印刷連携を前提にする（2026-11-19）
[本番連携の制作条件](本番連携の制作条件.md)を参照。通常の価格・文章修正は対象JSONだけでよい。名入れ・SKU・入数・オプション変更と本番移行では固定ID・明細関連・版付き保存を守る。localStorageやf番号を正式受注の仕様にせず、WordPress子テーマの未実装の名入れ保存と専用連携プラグインは別途必要。今回の調査で接続・在庫変更・印刷実装まで完了したわけではない。

## 購入履歴（v37）
会員ページの配置はsite-src/pages/mypage.html、専用表示はpurchase-history.css、読取専用の表示・状態判定はpurchase-history.js。purchase-history-data.jsはすべて架空の注文と販売状態で、実在商品の実際の在庫を示さない。購入時のsnapshotと現在状態を分離。商品／SKU不明は確認中にし、売切れ・終了・不明へ再購入リンクを出さない。カート・注文・商品マスタへ書き込まない。本番の本人確認・Welcart標準履歴・実在庫の参照は未接続。

現在の購入可否はSKU単位で参照し、商品全体の販売終了は明示状態として扱う。別SKUの在庫を使って再購入可能と判定しない。

## 案内・会員保存・購入手続き（v38）

| 変更内容 | 編集する場所 |
|---|---|
| 地域別送料・手数料・営業カレンダー | site-src/site-settings.json |
| 商品の在庫状態・ブランド・スピード・数量別価格 | site-src/products/ID.json の commerce |
| 読みもの・お知らせ1件 | site-src/editorial/entry-ID.json |
| 各案内／フォーム本文 | site-src/pages/該当ページ.html |
| 記事一覧・本文の型 | reading-page.js |
| お気に入り・閲覧履歴・販売状態・価格の共通計算 | site-services-core.js |
| 保存一覧・営業カレンダー・フォーム確認などの表示 | site-services-ui.js、site-services.css |
| 購入手続きの型と確認表示 | site-src/pages/checkout.html、checkout-page.js |

services-head／services-scriptは全ページ必須の共通部品。通常の商品編集で読み直さない。生成物site-settings.js・product-services-data.js・editorial-data.jsは直接変更しない。共通サービスの型は保護対象。今回の共通ヘッダー変更はリンク接続のみで、ロゴ・検索・大カテゴリの配置は保持。

送料はverified:falseとfee:nullで未確定を表す。0円で代用しない。数量別価格はtiersVerified:trueと検証済みtiersを登録した商品だけ適用する。今回279商品の標準割引欄に有効値はなく、特別価格は未登録。WCEX Multi Price独自設定は未確認のため補完していない。在庫は2026-11-12のバックアップ状態であり現在の確約ではない。営業日は2026-11-20取得の本店公開設定で、毎年自動更新されるわけではない。

お問い合わせ・ログイン・会員登録・アンケート・お仕立て入力・購入手続きは送信停止。sendingEnabled:false、serviceEndpoint:nullをビルドで必須にしている。単にフラグを変更して本番化しない。本番連携の制作条件.mdと本番接続_引継ぎ.mdを読み、WordPress/Welcartとサーバー側で認証・検証・料金再計算を実装してから切り替える。

検査：node --test tools/*.test.cjs、node tools/build-site.cjs --check。その後5幅のluna-qaとvisual-check。通常の商品作業では対象IDのcommerceだけ読み、記事や全体テンプレートを再調査しない。


## サンプル一覧のスマホ見本（v39）
一覧専用の編集元はsite-src/pages/index.htmlとphone-preview.js。iframeは390px幅を保ちmax-width:noneとし、枠の内寸に応じて1回だけ縮小する。全体のiframe向けmax-width:100%を変更して解決しない。ResizeObserverでウィンドウ幅の変更にも追従。実サイトのレイアウトは変更しない。


## 案内本文の横幅と特集配置（v40）
目次がないguide-shellの単独guide-contentは全列を使う（support.css）。本文を左の205pxの目次列へ配置しない。おすすめ特集はfeatures.cssで1024px以上の本文枠を隠し、既存sideだけ表示。1023px以下では既存sideが隠れ本文内だけ表示する。QAははみ出しの有無だけでなくFAQ本文がshell全幅になることと、境界1023/1024pxの可視性も確認する。


## スマホの検索専用ヘッダー（v41）
共通header.htmlのモバイル段はロゴのみ、検索段の左にメニュー。style.cssのv41節とheader-scroll.jsが収納／復帰を管理する。PCは1024px以上で従来配置。収納中はスペーサーで元の文書高を保持しスクロール位置を跳ねさせない。先頭だけカテゴリーを復帰し、下部ナビは逆スクロールで復帰。旧スワイプ停止は新指示で廃止。商品本文作業ではこの共通部品を触らない。検査では先頭・スクロール後・逆方向・メニュー・先頭復帰とPC不変を確認する。


## スクロール量と同じ速度の収納（v42）
header-scroll.jsはヘッダー直前の高さ0マーカーを文書位置の基準とし、移動距離をロゴ高・カテゴリー高へ順番に割り当てる。各クリップ枠と中身を同じpx数だけ上へ動かす。固定時間の補間は行わない。スペーサーで文書高を保持し、同じscrollYで同じ見え方となる。復帰は同じ関数の逆。CSSのmobile-logo-slot／mobile-category-slotで管理し、PCはdisplay:contents。


## トップの縦長特集カードとログイン（v43）
1枚目の写真・コピー・説明・既存CTAはsite-src/pages/top.htmlのmain-bn。続く3枚の画像・文言・一覧リンク・4商品IDはsite-src/home-promos.jsonで個別変更する。商品名・画像はShopCatalogから参照し複製しない。home-promos-data.jsは自動生成、直接編集しない。型はhome-promos.js／home-promos.css。自動送りなし、ネイティブ横スクロール・矢印・キーボード対応。ユーザー別のおすすめや実際の割引を装わない。スマホのログイン入口はshared/header.htmlとstyle.cssのv43節（共通保護対象）。実会員認証は引き続き未接続。


## ログインの光とカード色（v44）
検索とログインの距離はstyle.cssのmobile-loginのmargin-leftで確保。キランはmobile-login::afterのmember-glintのみ、6秒に1回。prefers-reduced-motionでは停止。カードのthemeはhome-promos.json（rose／mint／lavender）、1枚目はcream。home-promos.cssで淡色と細い上枠を管理する。スマホはカード幅を画面内の幅より58px小さくし、隣を46pxほど見せる。写真原本と商品リンクは変更しない。


## 特集を1枚ずつ追加する（v45・こちらが現在の方式）
- 3つの特集はsite-src/home-promos/<ID>.jsonの独立した部品。旧home-promos.jsonの配列方式は分割済み。
- 最初の写真・コピー・2ボタンはsite-src/shared/home-promo-intro.htmlの独立部品。外枠や共通ヘッダーを読み直さず、この部品だけ編集する。
- node tools/promos.cjs list／show IDで必要な特集だけ確認する。
- tools/templates/promo.jsonを新規ファイルへコピーし、固有ID・文言・画像・一覧リンク・4商品ID・themeを設定。初期値active:falseなので勝手に公開されない。
- node tools/promos.cjs add 新規JSONで追加。内容を確認してactive:trueへ変更してから全体ビルド。
- 並び順はsite-src/home-promos/manifest.jsonの順（先頭の案内カードは別）。archive IDで停止、restore IDで復帰。元JSONは削除しない。
- 最後にnode tools/build-site.cjsで生成。重複ID、4商品でない設定、無効な商品や画像／リンクを拒否する。商品マスタや元DBを変更しない。実施していないセールや値引きを記載しない。

## 丸い矢印の共通部品（v45）
rail-controls.js/cssがSVGを円の中央へ配置し、商品列・特集の上下左右の矢印で共用する。文字の＜＞を直接調整しない。共通保護対象で、商品・特集の追加時に編集しない。home-promos.jsはPCのマウスドラッグと離した後のスライド、左右ボタン、タッチ・キー操作を担当。動きを減らす設定を尊重する。左右矢印にはPC専用の余白を確保して本文を覆わない。


## 部品台帳を先に呼ぶ（v46・林さん指示）
`node tools/components.cjs list` が部品一覧、`show product`／`show category`／`show promo`／`show arrows`／`show guide` が対応する型と編集場所。機械用の正本はsite-src/component-registry.json。参照先が消えたらビルドを失敗させる。

トップの各章はsite-src/sections/top/ID.html、対応表は同manifest.json。`node tools/components.cjs section cookie`のように対象だけ調べる。mainページへは`{{@ top/cookie}}`で差し込む。元のクリスマス章もchristmas.htmlに残し、掲載設定で非表示にしている。

新しい案内は`node tools/pages.cjs create-guide new-slug "ページ名"`で、登録済みの共通テンプレート＋本文部品を作る。本文のファイルはsite-src/sections/pages/new-slug.html。CSSを追加生成せずguide-hero／guide-section／service-card等の型を使う。入力例や仮の本文を整えてから版上げ・ビルド・QA・公開。商品ページはこのツールで複製せずitem.html?id=IDを使用し、カテゴリもcategory.html?g=...&m=...&s=...を使う。

## 掲載とリンク（v46）
期間は特集JSONのstartsAt/endsAt（時差付き、日本時間）。開始を含み終了を含まない。手動停止はactive:false。配置の停止はhome-layout.json。ブラウザの表示判定だけで本番公開条件を保証せず、本番はサーバーとキャッシュでも判定する。
おすすめ5特集はrecommended-features.json、クリスマス4商品はchristmas.json。旧枠は消去せず配置を停止。TOP10はranking-top10.jsonでトップと専用ページが同じ10IDを参照。全件リンクは各分類へ、ドラジェは専用小分類、クリスマスのカードはクリスマスのプチギフトだけへ。古い全バックアップ件数の固定表示は隠し、分類ページの実数を使う。


## 現在の共通スタイルと編集の約束（v46）
- この節がv45以前の丸矢印・下段操作・PC用の左右余白の説明に優先する。矢印はrail-controls.css/jsの48×60px・角丸四角・中央SVG。スマホも特集カード左右中央に重ね、専用の下段や余白を作らない。端は半透明、ホバーの淡い緑とぼかし輪郭を共用する。
- 先頭付近の短い上スワイプはheader-scroll.jsでトップ特集の上端を検索直下へ滑らかにそろえる。指を止めたままの二段階操作ではなく、次の操作で普通に読み進める。横スワイプとフォーム操作は奪わない。
- 商品・カテゴリ・案内・特集はcomponent-registry.jsonに登録した型を必ず呼び出す。文章やIDの変更ごとに新しいCSS・ページ全体を作らない。共通CSSの変更は明示された共通仕様変更時だけ。
- おすすめの5タイルは16:9の枠＋原画像の比率を保つcontain＋下中央の見出し。季節掲載は日本時間の期間とactiveで管理する。現在は先頭案内＋5つの設定カード。サンプルのクライアント時刻判定は本番の掲載管理への接続を意味しない。
- OMS担当への設計案はdocs/OMS_サイト掲載管理_連携案.md。新WordPress側を掲載設定の正本にし、OMSは管理画面として接続する提案。原本ZIP・本店DBは変更せず、実連携はまだ行っていない。

## 矢印の操作後減光（v47・共通仕様）
rail-controls.css/jsに一元化。操作中100%、静止1.2秒で18%、端は静止10%／操作中30%。静止したホバーでも薄くなる。キーボード選択はfocus-visibleで100%、reduced-motionは即時切替。今後も既存のrail-wrap／home-promosと矢印部品を呼び出す。部品ごとに別のタイマーやCSSを追加しない。

## スマホの連続タップ拡大（v48）
style.cssのhtmlと標準ボタン／リンク等、rail-controls.cssの矢印をtouch-action:manipulationに統一。ダブルタップ拡大だけ抑え、パンとピンチを保持。ビューアのtouch-action:noneや数量ホイールのpan-yは独立した操作仕様。入力欄は既存のスマホ16px以上を保持。実機Safariの版による差はエミュレーションだけで保証しない。部品台帳show touchで参照する。

## 名入れプレビューお試し（v49）
node tools/components.cjs show name-preview。本文はsite-src/sections/top/name-preview.html、見本の見え方はname-preview.css、切替と入力反映はname-preview.js。top.htmlへ章として差し込む。入力はDOM内のtextContentだけで表示し、カート・保存・送信と接続しない。4つのdata-preview-typeとpanelのIDを一致させる。席次表は架空の固定レイアウトで編集／印刷機能ではない。共通ヘッダーや商品データを編集しない。

## 名入れお試しの専用ページと背景（v50・現在の配置）
トップ本文には表示せず、site-src/shared/home-promo-intro.htmlのCTAからname-preview.htmlへ。共通ページテンプレートで生成、本文枠はsite-src/sections/pages/name-preview.html、共用プレビュー本文はsite-src/shared/name-preview.html。背景SVG3点はimages/name-preview/、CSSのdata-preview-backgroundとJSの許可IDを一致させる。SVGは装飾だけの編集可能な見本。上下の戻るリンクはtop.htmlを指定し、履歴がない直リンクでも機能する。入力／背景はこのページ内だけ保持、保存・カート連携しない。旧v49のトップ章の配置は今回の専用ページ方式に置換。

## v51：保存商品・告知・実図柄・共通操作
- saved-products-rail.js/css：トップと商品ページの小型タブ、既存ShopServicesのlocalStorageキーを共用。会員ページの一覧は保持。
- site-src/site-notices.json：トップ帯の文言・リンク・active・時差付き開始終了。tools/site-content.cjsで生成し、DOMはtextContentで反映。価格や休日を推測して書かない。OMSとの自動公開接続は提案のみ。
- site-src/seal-preview-choices.json：カートと同じ59図柄、previewImageと原画像寸法を持つ。カート図柄名との照合をビルドで検証。低画質の図柄を高精細に復元できたと説明しない。元図柄の印字は固定例、ユーザー入力は別枠の文字で表示。
- paper-preview-evidence.json：商品CSVから抜き出した公開商品だけの根拠。本番データを変更しない。
- pilot-inputs.js：全商品の数量に同じ数量ホイール。日付の対象判定は別。
- touch-guard.js：旧iOSでの静止連続タップ用。全touchmoveやgesturestartを禁止する方式へ戻さない。

お気に入りは24件で押し出す旧上限を解消し、現行279商品すべてを保持できる安全上限1000件へ。期限では消去しない。最近見た商品は直近12件。検査のannouncement-windowは幅内で切り抜く表示窓なので、内部を横移動する文字だけは既存railと同様にluna-qaの対象外とし、ページ幅と表示窓の範囲は別途検査する。

## 歩く白猫（v52）
node tools/components.cjs show walking-cat。形はwalking-cat.jsのSVG、歩行はwalking-cat.css。4本の脚の位相差、体の小さい上下動、しっぽと瞬きを独立管理。site-announcements.jsから同じ部品を使う。帯を高くしない。脚などの子要素も停止し、reduced-motionでは全て静止。

## Gemini案の重ねる猫（v53試用）
walking-cat.js/cssを差替え、site-announcements.jsが帯のannouncement-barへ1匹だけ配置。cat-banner-wrapはabsolute/inset:0/height:100%/z1、文字z2・停止z3、pointer-eventsなし。元SVGの猫・蝶・12秒の位相を保ち、移動距離だけ画面幅へ対応。描画は帯に収めるため等比90%。停止とreduced-motionは全要素に適用。v52へは履歴から戻せる。

## 猫の方向・同速・非重複（v54・現在の方式）
猫はannouncement-track内の専用96px枠へ戻す。文字と親の移動を共用するので速度差が生じない。SVGを左右反転し左向き。catPathのXは80で固定し、枠内の上下動だけ残す。v53のabsolute重ね配置と画面横断は撤回。新規の告知も同じ型で猫のための余白を確保する。

## 全ページの数量ホイール（v55）
node tools/components.cjs show quantity-picker。先行商品／詳細／特集という分岐で部品を読み分けない。services-headがCSSとJSを先読みし、documentElementを監視。新しい数量はdata-quantity-pickerを付ける。name=quantityと既存qty入力も同じ部品に入る。モバイルのpointerdown／touchstartでnative focusを止め、ラベルタップも同じホイールを開く。直接入力はdetailsを開いてから。動的な並べ替え後も自動適用する。
