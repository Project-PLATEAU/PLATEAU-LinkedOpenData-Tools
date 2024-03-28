

![概要](./img/index.png) 

## 1. 概要 
本リポジトリでは、2023年度のProject PLATEAUで開発した「PLATEAU Linked Open Data配信システム」のソースコードを公開しています。  
「PLATEAU Linked Open Data配信システム」は、3D都市モデルの建築物データから属性情報を抽出してRDF変換するプログラムと、RDFをLinked Open Dataとして公開するプログラムを含みます。建物単位でURIを付与し、URIへのGetリクエストに対して参照解決を行っています。

## 2. 「PLATEAU Linked Open Data配信システム」について
RDF変換プログラムは、CityGML形式の3D都市モデルをJSON-LD形式に変換します。指定したフォルダ内のXMLファイルを読み込み、XML構造をパースしてあらかじめ定義したデータモデル（JSON形式）に変換した上で、建物単位でJSON-LD形式のファイルとして出力・保存を行います。  
Linked Open Dataとして公開するプログラムは、JSON-LD形式のファイルをFirebaseにアップロードします。参照解決部分はCloudFunctionsで処理しています。建物リソースのURIへのリクエストに応じてデータをロードし、リクエストに応じたRDFの形式に変換して返却する機能を提供します。  
建物リソースごとの情報をブラウザで確認するため、React.jsで実装したウェブアプリも用意しています。建物リソースのURIへのリクエストは、デフォルトでHTMLのビューへリダイレクトされるように設定されています。本システムは、一般ユーザ向けのGUIを備えたオープンソースソフトウェアとしてフルスクラッチで開発されています。

## 3. 利用手順

本システムの構築手順及び利用手順については[利用チュートリアル](http://xxxx)を参照してください。

## 4. システム概要

### CityGMLをRDF変換するプログラム

入力ファイルは「3D都市モデル標準製品仕様書3.4版」準拠のCityGMLファイル（.gml）のうち、建物モデルを想定しています。

1. CityGMLをJSON-LD形式のRDFに変換
2. JSON-LDをNtriple形式のRDFに変換
3. CodeList※をTurtle形式のRDFに変換

※CodeListについては、「3D都市モデル標準製品仕様書3.4版」の[i-UR符号化仕様及びコードリスト](https://www.geospatial.jp/iur/)を参照してください。

### PLATEAU Linked Open Dataを公開するプログラム

入力ファイルは、上記の「CityGMLをRDF変換するプログラム」で生成した建物データと不動産IDデータのJSON-LDを想定しています。

1. JSON-LDをFirebaseのFirestore（データベース）にアップロード
2. PLATEAU Linked Open Dataを参照解決
3. 各種技術情報を公開するポータルウェブサイト

## 5. 利用技術

### CityGMLをRDF変換するプログラム

主要なライブラリ。その他のライブラリはpackage.jsonで確認してください。

| 種別         | 名称    | バージョン                   | 内容                                  |
| ------------ | ------- | ---------------------------- | ------------------------------------- |
| ミドルウェア | [node.js](https://nodejs.org/) | 18.0.0以降                  |                                       |
| ライブラリ   | [xpath]() | 最新の安定版を使ってください | node.jsでxpathを扱えるようにする   |
|              | [Jsonld]() | 最新の安定版を使ってください | node.jsでJSON-LDを扱えるようにする |
|              | [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)| 4.0.7 | Javascriptで動作するXMLパーサー
|              | [React.js](https://react.dev/) | 18.2.0 |ユーザーインターフェース構築のためのJavaScriptライブラリ
| データベース | [Virtuoso](https://virtuoso.openlinksw.com/)| 07.20.3238 | RDF Store（RDFに対してSPARQLでクエリできるデータベースであり、VirtuosoはGeoSPARQLにも対応している）

### PLATEAU Linked Open Data を公開するプログラム

プログラムの主要な構成要素。

| 種別                 | 名称     | バージョン | 内容                                                                                           |
| -------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------- |
| PaaS                 | Firebase |            | Firestore、Hosting、CloudFunctionsを使用                                                      |
| ウェブフレームワーク | [React.js](https://react.dev/)  | 18.2.0     | ウェブサイトを構築                                                                             |
| ライブラリ           | express  | 4.18.2     | CloudFunctionsでhttpリクエストをルーティング                                                |
| ミドルウェア         | [node.js](https://nodejs.org/) | 18         | JSON-LDをFirebaseのFirestoreにアップロードする機能と、CloudFunctionsで利用 |

## 6. 動作環境

node.jsのver.18以上が動作することが必要です。各種パッケージをインストールするにはインターネット環境が必要です。

## 7. 本リポジトリのフォルダ構成

※ 必要に応じて/dataディレクトリを作成してください。

| フォルダ名  | 詳細                                          |
| ----------- | --------------------------------------------- |
| gml-to-rdf  | CityGMLをRDF変換するプログラム             |
| plateau-lod | PLATEAU Linked Open Dataを公開するプログラム |

`gml-to-rdf`以下の主なディレクトリ構造は以下のとおりです。

| フォルダ名     | 詳細                                |
| -------------- | ----------------------------------- |
| data/gmlFiles  | 変換するCityGMLファイルを配置 |
| data/export    | 出力したJSON-LD、Ntripleを格納    |
| data/codelists | PLATEAUが配布しているコードリストを配置  |
| data/rdf       | コードリストを変換したRDFを格納   |

`plateau-lod`以下の主なディレクトリ構造は以下のとおりです。

| フォルダ名  | 詳細                                                                     |
| ----------- | ------------------------------------------------------------------------ |
| admin-tools | FirestoreにPLATEAU Linked Open Dataをアップロードするプログラムを設置 |
| functions   | Cloud functionsで動作させるプログラムを設置                             |
| public      | reactアプリで参照する静的ファイルを設置                                 |
| src         | reactアプリのコンポーネント等を格納                                     |

## 8. ライセンス

- ソースコード及び関連ドキュメントの著作権は国土交通省に帰属します。
- 本ドキュメントは[Project PLATEAUのサイトポリシー](https://www.mlit.go.jp/plateau/site-policy/)（CCBY4.0及び政府標準利用規約2.0）に従い提供されています。==ドキュメントはこれだとして、肝心のソースコードのライセンスは？？==

## 9. 注意事項

- 本リポジトリは参考資料として提供しているものです。動作保証は行っていません。
- 本リポジトリについては予告なく変更又は削除をする可能性があります。
- 本リポジトリの利用により生じた損失及び損害等について、国土交通省はいかなる責任も負わないものとします。

## 10. 参考資料
- 技術検証レポート: http://XXXX
- PLATEAU Web サイトの Use Case ページ「3D都市モデル・不動産IDマッチングシステム」: https://www.mlit.go.jp/plateau/use-case/dt23-03/
