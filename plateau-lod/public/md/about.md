# PLATEAU Linked Onep Data について

本サイトでは、Project PLATEAU が公開する 3D 都市モデルデータのうち、一部の地域の建物モデルについて試験的に Linked Open Data 化して公開しています。

本サイトが公開する Linked Open Data はオリジナルデータから不可逆的に生成されおり、PLATEAU のオリジナルデータが持つデータ構造や各種属性の厳密な定義など、本サイトが公開する Linked Open Data とは必ずしも等価ではありません。

オリジナルデータの仕様は[公式ドキュメント](https://www.mlit.go.jp/plateaudocument)を参照してください。

また、本ドキュメントでは Linked Open Data や SPARQL に関する解説はしていません。必要に応じて書籍やウェブサイト等を参照するようにしてください。

## 1. 言葉の定義

| 言葉                        | 定義                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| 3D 都市モデルデータ         | ことわりの無い限り、PLATEAU Project によって公開される 3D 都市モデルを指す                                                     |
| CityGML                     | 標準化団体である Open Geospatial Consortium（OGC）が策定した 3D 都市モデルのためのオープンデータモデル及びデータ形式の国際標準 |
| 建物リソース                | Linked Open Data として公開される個別の建物に関する属性情報のまとまり                                                          |
| 不動産 ID                   | 独自のアルゴリズムによって建物リソースの属性情報として付与されている。詳しくは、関連ドキュメントを参照。                       |
| 統計 LOD                    | 独立行政法人統計センターが整備している、統計に関する Linked Open Data。詳しくは、統計 LOD のサイトを参照。                     |
| データセット                | 本サイトで公開しているすべての建物リソースをひとまとめにした単位                                                               |
| 3D 都市モデル標準製品仕様書 | Project PLATEAU の成果を踏まえて策定された、3D 都市モデルを記述するのための仕様。本文中では標準製品仕様書と略して表記する。    |

## 2. 取得できるデータについて

本データセットに含まれる地域は以下のとおりです。

| 地域           | 建物リソース数 |
| -------------- | -------------- |
| 茨城県つくば市 | 999            |
| 神奈川県横浜市 | 999            |
|                |                |

## 3. データの取得方法

本サイトから建物データを取得するには以下の 2 通りの方法が用意されています。

### 個別データの取得

建物リソースの URI に対して、GET リクエストを送信することでデータを取得することができます。なお、Accept headder で返却するデータ形式をリクエストすることができます。

対応しているデータ形式は以下のとおりです。

| データ形式 | Accpet headder        |
| ---------- | --------------------- |
| Turtle     | text/turtle           |
| N-Triples  | application/n-triples |
| JSON-LD    | application/ld+json   |

```
$ curl -H 'Accept: text/turtle' https://lod.geospatial.jp/resource/bldg_428e972d-7842-4a62-ac58-71e8d2589c77
```

例）turtle 形式でデータをリクエストする例

### SPARQL Query Service を利用する

[SPARQL Query Service](http://3.115.24.167:8890/sparql) を提供しています。詳しくは、[How to use SPARQL](/sparql)を参照してください。

## 4. データ構造

[データ構造について](/datamodel/)のページを参照してください。

## 5. ライセンス

![CC-BY](/CC-BY.svg)

By PLATEAU Linked Open Data

[CC BY 4.0 DEED](https://creativecommons.org/licenses/by/4.0/)
Attribution 4.0 International
