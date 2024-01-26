# CityGML を RDF 変換するプログラム

## 1. 概要

本リポジトリでは、Project PLATEAU の令和 4 年度のユースケース開発業務の一部である dt23-03「不動産 ID マッチングシステム」について、その成果物である「LOD 配信システム」のうち、CityGML を RDF 変換するプログラムのソースコードを公開しています。

「LOD 配信システム」は、CityGML から情報を抽出して、今回定義したデータモデルに従って RDF（JSON-LD）を生成します。データモデルについては、[PLATEAU Linked Open Data](https://lod.geospatial.jp)を参照してください。

## 2. 「不動産 ID マッチングシステム」について

==「不動産 ID マッチングシステムの開発」について==
本システムの詳細については[技術検証レポート](https://www.mlit.go.jp/plateau/file/libraries/doc/plateau_tech_doc_0030_ver01.pdf)を参照してください。

## 3. 利用手順

本システムの構築手順及び利用手順については[利用チュートリアル](https://r5-plateau-acn.github.io/SolarPotential/)を参照してください。

## 4. システム概要

このプログラムは以下の機能を実装しています。

入力ファイルは PLATEAU 標準製品仕様書準拠の CityGML ファイル（.gml）のうち、建物モデルを想定しています。

1. CityGML を JSON-LD 形式の RDF に変換
2. JSON-LD を Ntriple 形式の RDF に変換
3. CodeList ※を Turtle 形式の RDF に変換

※ CodeList については標準製品仕様書の[i-UR 符号化仕様及びコードリスト](https://www.geospatial.jp/iur/)を参照してください。

## 5. 利用技術

主要なライブラリ。その他のライブラリは package.json で確認してください。

| 種別         | 名称    | バージョン                   | 内容                                  |
| ------------ | ------- | ---------------------------- | ------------------------------------- |
| ミドルウェア | node.js | 18.0.0 以降                  |                                       |
| ライブラリ   | xpath   | 最新の安定版を使ってください | node.js で xpath を扱えるようにする   |
|              | Jsonld  | 最新の安定版を使ってください | node.js で JSON-LD を扱えるようにする |

## 6. 動作環境

node.js の ver.18 以上が動作すること。

各種パッケージをインストールすにはインターネット環境が必要です。

## 7. 本リポジトリのフォルダ構成

主なディレクトリ構造は以下のとおりです。

| フォルダ名     | 詳細                                |
| -------------- | ----------------------------------- |
| data/gmlFiles  | 変換する CityGML ファイルを配置する |
| data/export    | 出力した JSON-LD、Ntriple を格納    |
| data/codelists | PLATEAU が配布しているコードリスト  |
| data/rdf       | コードリストを変換した RDF を格納   |

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

### node.js をインストール

ver.18 以上を推奨します。

### 必要な node モジュールをインストール

`$ yarn`

### CodeList を所定のディレクトリに格納

コードリストを次のように格納します。

`/data/codelists/*.xml`

下記のコードリストは地域名を参照するために必須となっています。

`Common_localPublicAuthorities.xml`

### 変換する CityGML を所定のディレクトリに格納

以下のように、.gml ファイルを格納します。
`/data/gmlFiles/`配下には、メッシュ ID ごと、地域ごとなどでサブディレクトリを作成してください。

`/data/gmlFiles/*/*.gml`

## データ変換

###　　コードリストの変換

`node xmlToTtl.js`

以下のように出力されます。

`/data/rdf/*.ttl`

### GML データから Json-ld ファイルへ変換

`node gmlToJson_v2.js`

以下のように出力されます。
建物ごとに、建物情報を記した JSON-LD ファイル、不動産 ID 情報を記した JSON-LD ファイルがそれぞれ出力されます。

建物の JSON-LD

`/data/export/json/building/*/*.jsonld`

不動産 ID の JSON-LD

`/data/export/json/realestateid/*/*.jsonld`

### Json-ld から Ntriple ファイルへ変換

`node jsonToNtriple.js`

以下のように出力されます。

`/data/export/Ntriple/building/*/*.nt`
`/data/export/Ntriple/realestateid/*/*.nt`

1. data/codelists ディレクトリに attribute の xml ファイルを保存します。
2. data/gmlFiles ディレクトリに cityGML の xml ファイルを保存します。
3. ターミナル（ご使用の OS 環境によって異なります）でこのプロジェクトのディレクトリに移動し、
   `node gmlToJson.js`を実行します。
4. data/Json フォルダに Json-ld ファイルが保存されたことを確認します。

### Json-ld ファイルから RDF(Ntriple)ファイルへの変換

1. data/Json フォルダに Json-ld ファイルが配置されていることを確認します。
2. ターミナル（ご使用の OS 環境によって異なります）でこのプロジェクトのディレクトリに移動し、
   `node jsonToNtriple.js`を実行します。

### Attribute の xml ファイルから RDF(turtle)ファイルへの変換

1. data/codelists フォルダに Attribute の xml ファイルが配置されていることを確認します。
2. ターミナル（ご使用の OS 環境によって異なります）でこのプロジェクトのディレクトリに移動し、
   `node xmlToTtl.js`を実行します。

---

## RDF ストアにデータをロードする

以下、参考情報です。

ここでは、RDF ストアとして、[Virtuoso](https://virtuoso.openlinksw.com)を用いて生成した RDF をロードします。

### Virtuoso の docker イメージを入手

いくつかイメージが公開されていますので、適当なイメージを選んで pull します。

```

$ docker search virtuoso

NAME                                          DESCRIPTION                                      STARS     OFFICIAL   AUTOMATED
encoflife/virtuoso                                                                             0                    [OK]
virtuosolearning/circle-ci-2                  Circle CI 2 build                                0
tenforce/virtuoso                             Docker for hosting Virtuoso.                     44                   [OK]
openlink/virtuoso-opensource-7                OpenLink Virtuoso Open Source Edition v7.2, …   10
dbpedia/virtuoso-sparql-endpoint-quickstart   Loader container that allows the deployment …   0
askomics/virtuoso                             docker virtuoso, based on alpine                 0                    [OK]
```

```

$ docker pull openlink/virtuoso-opensource-7

```

Virtuoso 用のボリュームを作成します。

```

$ docker volume create --name main-virtuoso-data
main-virtuoso-data

```

起動します。

```

$ docker volume ls
DRIVER              VOLUME NAME
local               main-virtuoso-data
$ docker run -d --restart=always --name main-virtuoso \
    -p 8890:8890 -p 1111:1111 \
    -e DBA_PASSWORD=dba \
    -e SPARQL_UPDATE=true \
    -e DEFAULT_GRAPH=http://www.example.com/graph \
    -v main-virtuoso-data:/data \
    -d openlink/virtuoso-opensource-7
05ddba27a031a5d5bf7952a53e332f72655a3d63412f462747aa7d98a9def4e6
```

```
$ docker ps
CONTAINER ID        IMAGE                                   COMMAND                  CREATED             STATUS              PORTS                                            NAMES
7f73ea2c9f38        tenforce/virtuoso:1.1.1-virtuoso7.2.4   "/bin/bash /virtuoso."   15 seconds ago      Up 14 seconds       0.0.0.0:1111->1111/tcp, 0.0.0.0:8890->8890/tcp   main-virtuoso

```

起動したら、ブラウザからもアクセスできるようになります。

`http://localhost:8890`

![Virtuoso Sparql editor](/readme-images/virtuoso1.png)

### データをロードする

virtuoso  では、isql を使ってデータをバルクロードできます。

コンテナ側でアップロードを許可するディレクトリを追記しておきます。

```
# virtuoso.ini

DirsAllowed              = ., ../vad, /usr/share/proj, ../database/Ntriple

```

設定したディレクトリにファイルをコピー

```

$ docker cp /Users/iwao/repositories/gml-to-rdf/data/export/Ntriple/building/22221 05ddba27a031a5d5bf7952a53e332f72655a3d63412f462747aa7d98a9def4e6:/database/Ntriple

```

isql を起動

```
$ docker exec -it 05ddba27a031a5d5bf7952a53e332f72655a3d63412f462747aa7d98a9def4e6 isql

```

ファイルをロード

```

SQL> ld_dir_all ('../database/Ntriple','\*.nt', 'https://lod.geospatial.jp/resource/graph/v1/');
SQL> rdf_loader_run();

```

ロードが完了したら、SPARQL をリクエストしてみます。

`http://localhost:8890/sparql/`

![Virtuoso Sparql editor](/readme-images/virtuoso2.png)

試しに、下記のクエリを入力して、"Execute Query"ボタンを押します。

```

select distinct ?s where {
    ?s a <https://lod.geospatial.jp/vocabulary/pv#Building> .
} LIMIT 100

```

![Virtuoso Sparql editor](/readme-images/virtuoso3.png)

結果が取得できれば成功です。
