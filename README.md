# PLATEAU Linked Open Data 配信システム <!-- OSSの対象物の名称を記載ください。分かりやすさを重視し、できるだけ日本語で命名ください。英語名称の場合は日本語説明を（）書きで併記ください。 -->

![概要](./img/index.png) <!-- OSSの対象物のスクリーンショット（画面表示がない場合にはイメージ画像）を貼り付けください -->

## 1. 概要 <!-- 本リポジトリでOSS化しているソフトウェア・ライブラリについて1文で説明を記載ください -->
本リポジトリは、3D都市モデルの建築物データから属性情報を抽出して、RDF変換するプログラムと、RDFをLinked Open Dataとして公開するプログラムを含みます。建物単位でURIを付与し、URIへのGetリクエストに対して参照解決に対応しています。

## 2. 「PLATEAU Linked Open Data 配信システム」について <!-- 「」内にユースケース名称を記載ください。本文は以下のサンプルを参考に記載ください。URLはアクセンチュアにて設定しますので、サンプルそのままでOKです。 -->
CityGML形式からJSON-LD形式に変換部分は、指定したフォルダ内のXMLファイルを読込、XML構造をパースして予め定義したデータモデル（JSON形式）に変換、建物単位でJSON-LD形式のファイルとして出力保存します。JSON-LD形式のファイルはFirebaseにアップロードされます。参照解決部分はCloudFunctionsで処理しています。建物リソースのURIへのリクエストに応じて、データをロードしてリクエストに応じたRDFの形式に変換して返却します。建物リソースごとの情報をブラウザで確認するために、React.jsで実装したウェブアプリも用意しています。建物リソースのURIへのリクエストはデフォルトでHTMLのビューへリダイレクトされるように設定されています。
本システムは、一般ユーザ向けのGUIを備えたオープンソースソフトウェアとしてフルスクラッチで開発されています。
本システムの詳細については[技術検証レポート](http://xxxx)を参照してください。

## 3. 利用手順 <!-- 下記の通り、GitHub Pagesへリンクを記載ください。URLはアクセンチュアにて設定しますので、サンプルそのままでOKです。 -->

本システムの構築手順及び利用手順については[利用チュートリアル](http://xxxx)を参照してください。

## 4. システム概要

### CityGML を RDF 変換するプログラム

入力ファイルは 「3D都市モデル標準製品仕様書3.4版」準拠の CityGML ファイル（.gml）のうち、建物モデルを想定しています。

1. CityGML を JSON-LD 形式の RDF に変換
2. JSON-LD を Ntriple 形式の RDF に変換
3. CodeList ※を Turtle 形式の RDF に変換

※ CodeList については「3D都市モデル標準製品仕様書3.4版」の[i-UR 符号化仕様及びコードリスト](https://www.geospatial.jp/iur/)を参照してください。

### PLATEAU Linked Open Data を公開するプログラム

入力ファイルは[CityGML を RDF 変換するプログラム](https://xxxxx.xxxx.xxx)で生成した、建物データと不動産 ID データの JSON-LD を想定しています。

1. JSON-LD を Firebase の Firestore（データベース）にアップロード
2. PLATEAU Linked Open Data を参照解決
3. 各種技術情報を公開するポータルウェブサイト

## 5. 利用技術

### CityGML を RDF 変換するプログラム

主要なライブラリ。その他のライブラリは package.json で確認してください。

| 種別         | 名称    | バージョン                   | 内容                                  |
| ------------ | ------- | ---------------------------- | ------------------------------------- |
| ミドルウェア | [node.js](https://nodejs.org/) | 18.0.0 以降                  |                                       |
| ライブラリ   | [xpath]() | 最新の安定版を使ってください | node.js で xpath を扱えるようにする   |
|              | [Jsonld]() | 最新の安定版を使ってください | node.js で JSON-LD を扱えるようにする |
|              | [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)| 4.0.7 | Javascriptで動作するXMLパーサー
|              | [React.js](https://react.dev/) | 18.2.0 |ユーザーインターフェース構築のための JavaScript ライブラリ
| データベース | [Virtuoso](https://virtuoso.openlinksw.com/)| 07.20.3238 | RDF Store（RDFに対してSPARQLでクエリできるデータベース、VirtuosoはGeoSPARQLにも対応している）

### PLATEAU Linked Open Data を公開するプログラム

プログラムの主要な構成要素。

| 種別                 | 名称     | バージョン | 内容                                                                                           |
| -------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------- |
| PaaS                 | Firebase |            | Firestore, Hosting, CloudFunctions を使用                                                      |
| ウェブフレームワーク | [React.js](https://react.dev/)  | 18.2.0     | ウェブサイトを構築                                                                             |
| ライブラリ           | express  | 4.18.2     | CloudFunctions で http リクエストをルーティング                                                |
| ミドルウェア         | [node.js](https://nodejs.org/) | 18         | JSON-LD を Firebase の Firestore にアップロードする機能と、CloudFunctionsCloudFunctions で利用 |

## 6. 動作環境

node.js の ver.18 以上が動作すること。
各種パッケージをインストールすにはインターネット環境が必要です。

## 7. 本リポジトリのフォルダ構成

| フォルダ名  | 詳細                                          |
| ----------- | --------------------------------------------- |
| gml-to-rdf  | CityGML を RDF 変換するプログラム             |
| plateau-lod | PLATEAU Linked Open Data を公開するプログラム |

`gml-to-rdf`以下の主なディレクトリ構造は以下のとおりです。

| フォルダ名     | 詳細                                |
| -------------- | ----------------------------------- |
| data/gmlFiles  | 変換する CityGML ファイルを配置する |
| data/export    | 出力した JSON-LD、Ntriple を格納    |
| data/codelists | PLATEAU が配布しているコードリスト  |
| data/rdf       | コードリストを変換した RDF を格納   |

`plateau-lod`以下の主なディレクトリ構造は以下のとおりです。

| フォルダ名  | 詳細                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| admin-tools | firestore に PLATEAU Linked Open Data をアップロードするプログラムを設置 |
| functions   | cloud functions で動作させるプログラムを設置                             |
| public      | react アプリで参照する静的ファイルを設置                                 |
| src         | react アプリのコンポーネント等を格納                                     |

## 8. ライセンス <!-- 変更せず、そのまま使うこと。 -->

- ソースコード及び関連ドキュメントの著作権は国土交通省に帰属します。
- ==各種ライブラリのライセンスについては個別に確認してください。==
- 本ドキュメントは[Project PLATEAU のサイトポリシー](https://www.mlit.go.jp/plateau/site-policy/)（CCBY4.0 及び政府標準利用規約 2.0）に従い提供されています。==ドキュメントはこれだとして、肝心のソースコードのライセンスは？？==

## 9. 注意事項 <!-- 変更せず、そのまま使うこと。 -->

- 本リポジトリは参考資料として提供しているものです。動作保証は行っていません。
- 本リポジトリについては予告なく変更又は削除をする可能性があります。
- 本リポジトリの利用により生じた損失及び損害等について、国土交通省はいかなる責任も負わないものとします。

## 10. 参考資料 <!-- 技術検証レポートのURLはアクセンチュアにて記載します。 -->

- 技術検証レポート: https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf
- PLATEAU Web サイトの Use case ページ「カーボンニュートラル推進支援システム」: https://www.mlit.go.jp/plateau/use-case/uc22-013/
