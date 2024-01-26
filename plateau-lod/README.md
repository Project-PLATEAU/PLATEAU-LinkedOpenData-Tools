# PLATEAU Linked Open Data を公開するプログラム

## 1. 概要

本リポジトリでは、Project PLATEAU の令和 4 年度のユースケース開発業務の一部である dt23-03「不動産 ID マッチングシステム」について、その成果物である「LOD 配信システム」のうち、CityGML から生成した PLATEAU Linked Open Data をウェブに公開するプログラムを扱います。

Firebase に PLATEAU Linked Open Data をアップロードする機能、各種技術情報を公開するポータルウェブサイト、PLATEAU Linked Open Data を公開する API で構成しています。

## 2. 「不動産 ID マッチングシステム」について

==「不動産 ID マッチングシステムの開発」について==
本システムの詳細については[技術検証レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf)を参照してください。

## 3. 利用手順

本システムの構築手順及び利用手順については[利用チュートリアル](https://r5-plateau-acn.github.io/SolarPotential/)を参照してください。

## 4. システム概要

このプログラムは以下の機能を実装しています。

入力ファイルは[CityGML を RDF 変換するプログラム](https://xxxxx.xxxx.xxx)で生成した、建物データと不動産 ID データの JSON-LD を想定しています。

1. JSON-LD を Firebase の Firestore（データベース）にアップロード
2. PLATEAU Linked Open Data を参照解決
3. 各種技術情報を公開するポータルウェブサイト

## 5. 利用技術

本プログラムの主要な構成要素。

| 種別                 | 名称     | バージョン | 内容                                                                                           |
| -------------------- | -------- | ---------- | ---------------------------------------------------------------------------------------------- |
| PaaS                 | Firebase |            | Firestore, Hosting, CloudFunctions を使用                                                      |
| ウェブフレームワーク | React.js | 18.2.0     | ウェブサイトを構築                                                                             |
| ライブラリ           | express  | 4.18.2     | CloudFunctions で http リクエストをルーティング                                                |
| ミドルウェア         | node.js  | 18         | JSON-LD を Firebase の Firestore にアップロードする機能と、CloudFunctionsCloudFunctions で利用 |

## 6. 動作環境

node.js の ver.18 以上が動作すること。Firebase tools が必要。

各種パッケージをインストールすにはインターネット環境が必要です。

## 7. 本リポジトリのフォルダ構成

主なディレクトリ構造は以下のとおりです。

| フォルダ名   | 詳細                                                                     |
| ------------ | ------------------------------------------------------------------------ |
| /admin-tools | firestore に PLATEAU Linked Open Data をアップロードするプログラムを設置 |
| /functions   | cloud functions で動作させるプログラムを設置                             |
| /public      | react アプリで参照する静的ファイルを設置                                 |
| /src         | react アプリのコンポーネント等を格納                                     |

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

## 準備

### Firebase の準備

[Firebase](https://firebase.google.com/?hl=ja) のプロジェクトをあらかじめセットアップしておいてください。
Firebase の利用手順などの情報は[Firebase のウェブサイト](https://firebase.google.com/?hl=ja) を参照してください。

## PLATEAU Linked Data 　のアップロード

1. プロジェクトルートから、admin-tools のディレクトリに移動します。
2. `yarn`を実行して必要なパッケージをインストールします。

admin-tools を使えるように設定します。

1. Firebase のコンソールからダウンロードできる JSON 形式のサービスアカウントのキーを JSON ファイルとして admin-tools 配下の任意のディレクトリに配置します。
2. .env.sample を.env に変更し、SERVICE_ACCOUNT に 1.で設定した JSON ファイルのパスを設定します。
3. 建物データを`input-resources/building/*/*.jsonld` フォルダに、不動産 ID データを`input-resources/realestateid/*/*.jsonld` ファイルを配置します。
4. `node import_data.js`を実行します。

## PLATEAU Linked Open Data を参照解決機能の公開準備

Cloud Functions 上に Linked Open Data を参照解決する仕組みを構築します。

1. functions フォルダに移動
2. `yarn`を実行

## ポータルウェブサイトの公開準備

プロジェクトルートで以下の操作をします。
.env.sample を.env に変更し、VITE_PROXY に URL を設定します。

## デプロイ

2. ローカルで動作させるには`yarn dev`を実行します。
3. firebase にデプロイするには、`firebase deploy`を実行します。

### Content negotiation

#### Linked Data Resource URI

```
https://lod.geospatial.jp/resource/bldg_000024c6-31af-478b-a404-0f69e158c83c
```

#### Turtle

```
curl -H 'Accept: text/turtle' https://lod.geospatial.jp/resource/bldg_000024c6-31af-478b-a404-0f69e158c83c
```

#### JSON-LD

```
curl -H 'Accept: application/ld+json' https://lod.geospatial.jp/resource/bldg_000024c6-31af-478b-a404-0f69e158c83c
```

#### N-Triple

```
curl -H 'Accept: application/n-triples' https://lod.geospatial.jp/resource/bldg_000024c6-31af-478b-a404-0f69e158c83c
```

#### HTML 表示（デフォルト）

```
curl https://lod.geospatial.jp/resource/bldg_000024c6-31af-478b-a404-0f69e158c83c
```
