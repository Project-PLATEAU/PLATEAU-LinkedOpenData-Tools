# データ構造について

3D 都市モデルを Linked Data 化するにあたって、Linked Open Data  の分散協調型データアーキテクチャの特徴を活かして、複数の主体がそれぞれの専門性を活かしてメタデータを整備し、それらが相互にリンクされることによって都市の概念モデルが充実していく世界を目指し、本サービスが公開するデータセットがそのハブとなることを期待してデータモデルを設計しています。

このような方針に則り、オリジナルデータ（3D 都市モデル標準製品仕様書）の建物クラスが含む主な要素を、基礎的なスペックデータ、建物の形状データ、アドホックに追加されるドメインスペシフィックな属性データに区別して以下のように整理しています。

| 区別                   | 例                                                             | 考え方                                                                                                                                                                                                                                 |
| ---------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 基礎的なスペックデータ | ID、所在地、用途、高さ、構造、作成年月日、不動産 ID 等         | 建物に付帯する汎用的かつ一般性の高い属性情報に限り、本データセットの基本的な構成要素とする。                                                                                                                                           |
| 形状データ             | LOD（Level of Detail）別データ                                 | 詳細な形状データは含めない。ただし、平面地図上での境界データのみ、利便性に考慮して採用する。                                                                                                                                           |
| その他属性データ       | 災害情報、商業施設の情報、建築申請に係わる情報等、専門的な情報 | 本データセットには含めない。Linked Open Data  のアーキテクチャを活かせば、専門的な情報は用途や場面に応じて適宜追加することが可能であるが、その仕様やデータは各分野ごとにその分野の専門性を備える主体によって整備されることが望ましい。 |

## 識別子について

すべての建物リソースは識別子として URI が与えられています。URI には、オリジナルデータ※の Buiding クラスのインスタンスが持つ、gml_id を用いています。（※2023 年 3 月 31 日時点のデータを使用）

以下の例では、「bldg_428e972d-7842-4a62-ac58-71e8d2589c77」部分がオリジナルデータの gml_id に該当します。

```
https://lod.geospatial.jp/resource/bldg_428e972d-7842-4a62-ac58-71e8d2589c77
```

不動産IDは建物リソースから参照される独立したリソースとして定義しました。識別しは建物リソースのgml_idを応用し、先頭に「real-estate-id-」を付与しています。以下に例を示します。

```
https://lod.geospatial.jp/resource/real-estate-id-bldg_428e972d-7842-4a62-ac58-71e8d2589c77
```



## 属性について

建物クラスおよび付随するクラスとその属性については、独自に策定したほか、Schema.org も応用して組み合わせています。
本データセットの値については、基本的にオリジナルデータを参照しています。オリジナルデータの値の定義については 3D 都市モデル標準製品仕様書を参照してください。

## コードリストについて

オリジナルデータの建物オブジェクトでは、属性値にコード値を参照するように規定されているものが多く存在します。Lined Open Data 化するにあたって、そのようなコードリストは一律、機械的に SKOS（※）に変換して、URI を付与したうえで、建物リソースから参照するようにしています。

すべてのコードリストは[コードリストの一覧ページ](/codelists/)から参照することができます。

※ [Simple Knowledge Organization System](https://www.w3.org/TR/skos-reference/) シソーラスなどを Linked Open Data として記述するための W3C 標準。

以下、オリジナルデータが参照している、Appearance_mimeType と、それを SKOS 表現した場合の例を示します。各コード値の定義（意味的な解釈や用法）は、オリジナルデータに準拠します。

なお、Linked Open Data としてのコードリストのネームスペースは一律、PREFIX として「https://lod.geospatial.jp/codelists/」を付与しています。

```
<?xml version="1.0" encoding="UTF-8"?>
<gml:Dictionary xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml" xsi:schemaLocation="http://www.opengis.net/gml http://schemas.opengis.net/gml/3.1.1/profiles/SimpleDictionary/1.0.0/gmlSimpleDictionaryProfile.xsd" gml:id="cl_a785dde6-aa40-425b-878f-740eae1d25bc">
	<gml:name>Building_usage</gml:name>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id1">
			<gml:description>業務施設</gml:description>
			<gml:name>401</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id2">
			<gml:description>商業施設</gml:description>
			<gml:name>402</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id3">
			<gml:description>宿泊施設</gml:description>
			<gml:name>403</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id4">
			<gml:description>商業系複合施設</gml:description>
			<gml:name>404</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id5">
			<gml:description>住宅</gml:description>
			<gml:name>411</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id6">
			<gml:description>共同住宅</gml:description>
			<gml:name>412</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id7">
			<gml:description>店舗等併用住宅</gml:description>
			<gml:name>413</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id8">
			<gml:description>店舗等併用共同住宅</gml:description>
			<gml:name>414</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id9">
			<gml:description>作業所併用住宅</gml:description>
			<gml:name>415</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id10">
			<gml:description>官公庁施設</gml:description>
			<gml:name>421</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id11">
			<gml:description>文教厚生施設</gml:description>
			<gml:name>422</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id12">
			<gml:description>運輸倉庫施設</gml:description>
			<gml:name>431</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id13">
			<gml:description>工場</gml:description>
			<gml:name>441</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id14">
			<gml:description>農林漁業用施設</gml:description>
			<gml:name>451</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id15">
			<gml:description>供給処理施設</gml:description>
			<gml:name>452</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id16">
			<gml:description>防衛施設</gml:description>
			<gml:name>453</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id17">
			<gml:description>その他</gml:description>
			<gml:name>454</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
	<gml:dictionaryEntry>
		<gml:Definition gml:id="id18">
			<gml:description>不明</gml:description>
			<gml:name>461</gml:name>
		</gml:Definition>
	</gml:dictionaryEntry>
</gml:Dictionary>
```

例）Building_usage の XML 記述

```
@prefix ns: <https://lod.geospatial.jp/codelists/Building_usage#> .
@prefix skos: <http://www.w3.org/2004/02/skos/core#> .

ns:Building_usage a skos:ConceptScheme .

ns:401 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "業務施設" .
ns:402 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "商業施設" .
ns:403 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "宿泊施設" .
ns:404 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "商業系複合施設" .
ns:411 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "住宅" .
ns:412 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "共同住宅" .
ns:413 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "店舗等併用住宅" .
ns:414 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "店舗等併用共同住宅" .
ns:415 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "作業所併用住宅" .
ns:421 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "官公庁施設" .
ns:422 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "文教厚生施設" .
ns:431 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "運輸倉庫施設" .
ns:441 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "工場" .
ns:451 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "農林漁業用施設" .
ns:452 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "供給処理施設" .
ns:453 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "防衛施設" .
ns:454 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "その他" .
ns:461 a skos:Concept ;
skos:inScheme ns:Building_usage ;
skos:prefLabel "不明" .
```

例）Building_usage の SKOS 表現

```
<https://lod.geospatial.jp/resource/bldg_0a0cae38-e7eb-46a7-b41b-89d36caf3b3d> <https://lod.geospatial.jp/vocabulary/pv#usage> <https://lod.geospatial.jp/codelists/Building_usage#431> .
```

例）N-Triple での記述例（Building_usage#431 を参照している）

## データモデル

### Name space

| PREFIX          | URL                                              |
| --------------- | ------------------------------------------------ |
| rdf             | http://www.w3.org/1999/02/22-rdf-syntax-ns#      |
| rdfs            | http://www.w3.org/2000/01/rdf-schema#            |
| schema          | http://schema.org/                               |
| plateau         | https://lod.geospatial.jp/resource/              |
| pv              | https://lod.geospatial.jp/vocabulary/pv#         |
| sac             | http://data.e-stat.go.jp/lod/sac/                |
| estat-attribute | http://data.e-stat.go.jp/lod/ontology/attribute/ |
| xsd             | http://www.w3.org/2001/XMLSchema#                |

### pv:Building

本データセットにおける主たるクラス。建物を表す。

| Properties                   | Range                      | Description                                           | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath）                                                            |
| ---------------------------- | -------------------------- | ----------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| **rdfs:label**               | `literal`                  | 建物のラベル                                          |              | //bldg:Building/gml:name                                                                                |
| **schema:name**              | `literal`                  | 建物の名前                                            |              | //bldg:Building/gml:name                                                                                |
| **schema:description**       | `literal`                  | 建物の説明                                            |              | //bldg:Building/gml:description                                                                         |
| **pv:usage**                 | `URI`                      | 建物の用途                                            |              | //bldg:Building/bldg:usage                                                                              |
| **pv:yearOfConstruction**    | `URI`                      | 建物建築年                                            |              | //bldg:Building/bldg:yearOfConstruction                                                                 |
| **pv:yearOfDemolition**      | `URI`                      | 建物の解体年                                          |              | //bldg:Building/bldg:yearOfDemolition                                                                   |
| **pv:roofType**              | `URI`                      | 建物の屋根形状の種類                                  |              | //bldg:Building/bldg:roofType                                                                           |
| **pv:storeysAboveGround**    | `xsd:decimal`              | 地上階数                                              |              | //bldg:Building/bldg:storeysAboveGround                                                                 |
| **pv:storeysBelowGround**    | `xsd:decimal`              | 地下階数                                              |              | //bldg:Building/bldg:storeysBelowGround                                                                 |
| **schema:datePublished**     | `xsd:date`                 | データ作成日（オリジナルデータの作成日）              | &#10003; Yes | //bldg:Building/core:creationDate                                                                       |
| **schema:identifier**        | `schema:PropertyValue`     | 建物 ID                                               | &#10003; Yes | なし                                                                                                    |
| **pv:measureHeight**         | `pv:MeasuredHeight`        | 建物の高さ                                            | &#10003; Yes | なし                                                                                                    |
| **schema:geo**               | `schema:GeoCoordinates`    | 建物の地図上での中心座標                              | &#10003; Yes | なし                                                                                                    |
| **pv:location**              | `pv:Location`              | 建物の所在地                                          | &#10003; Yes | なし                                                                                                    |
| **pv:realEstateIDAttribute** | `pv:RealEstateIDAttribute` | 建物に付与された不動産 ID                             |              | なし                                                                                                    |
| **pv:loof0FootPrint**        | `literal`                  | 建物の地図上での境界データ。ポリゴンを表す（WGS84）。 | &#10003; Yes | //bldg:Building/bldg:lod0RoofEdge/gml:surfaceMember/gml:Polygon/gml:exterior/gml:LinearRing/gml:posList |

架空のインスタンスを用いてモデル図のサンプルを示します。

[![Data Model example](/datamodel.svg)](/datamodel.svg)

### サンプルデータ

```
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix plateau: <https://lod.geospatial.jp/resource/> .
@prefix pv: <https://lod.geospatial.jp/vocabulary/pv#> .
@prefix schema: <http://schema.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix estat-attribute: <http://data.e-stat.go.jp/lod/ontology/attribute/> .
@prefix sac: <http://data.e-stat.go.jp/lod/sac/> .

plateau:bldg_9554bef1-3d9d-4791-a454-18548664e493 a pv:Building;
	rdfs:label "国土交通省ビルヂング"@ja;
	schema:name "国土交通省ビルヂング"@ja;
	schema:description "この建物に関する説明"^^xsd:literal;
	pv:usage <https://lod.geospatial.jp/codelists/Building_usage#1>;
	pv:class <https://lod.geospatial.jp/codelists/Building_class#3001>;
	pv:yearOfConstruction "1977"^^xsd:decimal;
	pv:yearOfDemolition "2023"^^xsd:decimal;
	pv:roofType <https://lod.geospatial.jp/codelists/Building_roofType#1>;
	pv:storeysAboveGround "5"^^xsd:decimal;
	pv:storeysBelowGround "2"^^xsd:decimal;
	schema:datePublished "2023-03-22"^^xsd:date;
	pv:measureHeight [
		a pv:MeasuredHeight;
		schema:unitCode estat-attribute-code:unitMeasure-meter;
		schema:value "15"^^xsd:double
	];
	schema:geo [
		a schema:GeoCoordinates;
		schema:latitude "34.22376061983865"^^xsd:double;
		schema:longitude "133.9989003754713"^^xsd:double;
		schema:elevation "99.948"^^xsd:double
	];
	pv:location [
		a pv:Location;
		pv:prefecture <https://lod.geospatial.jp/codelists/Common_localPublicAuthorities#37>;
		pv:city <https://lod.geospatial.jp/codelists/Common_localPublicAuthorities#37201>
		pv:standardAreaCode sac:C37201;
		schema:address “香川県高松市”
	];
	pv:realEstateIDAttribute plateau:real-estate-id-9554bef1-3d9d-4791-a454-18548664e493;
	pv:loof0FootPrint "133.9814498 34.3974288, 133.8928726 34.222741, 134.2162826 34.2295538, 134.1187789 34.3979954, 133.9814498 34.3974288” .

plateau:real-estate-id-9554bef1-3d9d-4791-a454-18548664e493 a pv:RealEstateIDAttribute;
    pv:realEstateIDOfBuiding "4703000378517-0000";
    pv:numberOfBuidingUnitOwnership "2"^^xsd:decimal;
    pv:realEstateIDOfBuidingUnitOwnership "4703000378517-0000","4703000378517-0000";
    pv:numberOfRealEstateIDOfLand "2"^^xsd:decimal;
    pv:realEstateIDOfLand "4703000378517-0000-1","4703000378517-0000-2";
    pv:matchingScore "99"^^xsd:decimal .
```

---

### pv:MeasuredHeight

建物オブジェクト高さ。単位はメートル。

| Properties          | Range        | Description                                   | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath） |
| ------------------- | ------------ | --------------------------------------------- | ------------ | -------------------------------------------- |
| **schema:unitCode** | `URI`        | 単位を示す。統計 LOD の単位コードを参照する。 | &#10003; Yes | なし                                         |
| **schema:value**    | `xsd:double` | 高さの値                                      | &#10003; Yes | //bldg:Building/bldg:measuredHeight          |

---

### schema:GeoCordinates

建物の中心座標を表すクラス。各値は地図上での平面形状から算出している。（WGS84）

| Properties           | Range        | Description | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath） |
| -------------------- | ------------ | ----------- | ------------ | -------------------------------------------- |
| **schema:latitude**  | `xsd:double` |             | &#10003; Yes | なし                                         |
| **schema:longitude** | `xsd:double` |             | &#10003; Yes | なし                                         |
| **schema:elevation** | `xsd:double` |             | &#10003; Yes | //bldg:Building/bldg:measuredHeight          |

---

### pv:Location

建物の所在地を表すクラス。

| Properties              | Range     | Description                                             | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath）           |
| ----------------------- | --------- | ------------------------------------------------------- | ------------ | ------------------------------------------------------ |
| **pv:standardAreaCode** | `URI`     | 統計 LOD が整備する統計に用いる標準地域コードを参照する | &#10003; Yes | なし                                                   |
| **pv:prefecture**       | `URI`     | 所在地の都道府県                                        |              | //bldg:Building/uro:buildingIDAttribute/uro:prefecture |
| **pv:city**             | `URI`     | 所在地の市区町村                                        |              | //bldg:Building/uro:buildingIDAttribute/uro:city       |
| **schema:address**      | `literal` | **pv:standardAreaCode**のラベル                         |              | なし                                                   |

---

### schema:PropertyValue

建物の ID（gml:id） を格納するクラス。

| Properties       | Range     | Description                         | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath） |
| ---------------- | --------- | ----------------------------------- | ------------ | -------------------------------------------- |
| **schema:name**  | `literal` | ID の体系（gml ID とする）          | &#10003; Yes | なし                                         |
| **schema:value** | `literal` | オリジナルデータ内での建物の gml:id | &#10003; Yes | //bldg:Building/@gml:id                      |

---

### pv:RealEstateIDAttribute

建物に関する不動産 ID を表すクラス。

| Properties                                | Range         | Description                                                   | Required     | 3D 都市モデル標準製品仕様書の参照先（XPath）                                     |
| ----------------------------------------- | ------------- | ------------------------------------------------------------- | ------------ | -------------------------------------------------------------------------------- |
| **pv:realEstateIDOfBuiding**              | `literal`     | 建物不動産 ID                                                 | &#10003; Yes | //bldg:Building/uro:RealEstateIDAttribute/uro:realEstateIDOfBuiding              |
| **pv:numberOfBuidingUnitOwnership**       | `xsd:decimal` | 区分所有数                                                    |              | //bldg:Building/uro:RealEstateIDAttribute/uro:numberOfBuidingUnitOwnership       |
| **pv:realEstateIDOfBuidingUnitOwnership** | `literal`     | 区分不動産 ID（複数ある場合はこのプロパティは複数付与される） |              | //bldg:Building/uro:RealEstateIDAttribute/uro:realEstateIDOfBuidingUnitOwnership |
| **pv:numberOfRealEstateIDOfLand**         | `xsd:decimal` | 区分所有数                                                    |              | //bldg:Building/uro:RealEstateIDAttribute/uro:numberOfRealEstateIDOfLand         |
| **pv:realEstateIDOfLand**                 | `literal`     | 土地不動産 ID（複数ある場合はこのプロパティは複数付与される） |              | //bldg:Building/uro:RealEstateIDAttribute/uro:realEstateIDOfLand                 |
| **pv:matchingScore**                      | `xsd:decimal` | マッチングスコア                                              | &#10003; Yes | //bldg:Building/uro:RealEstateIDAttribute/uro:matchingScore                      |

---
