# SPARQL の利用方法

## SPARQL クエリサービス

SPARQL エンドポイントを公開しています。自由にクエリすることができます。

- SPARQL1.1
- GEO SPARQL に対応
- ASK, CONSTRUCT, SELECT に対応

### SPARQL エンドポイント

[http://3.115.24.167:8890/sparql](http://3.115.24.167:8890/sparql)

## SPARQL サンプルクエリ

以下に、いくつかサンプルクエリを示します。

### 建物 ID を取得する

```
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX schema: <http://schema.org/>
select distinct ?s ?buildingID where {
?s a <https://lod.geospatial.jp/vocabulary#Building> ;
schema:identifier/schema:value ?buildingID .
} LIMIT 100
```

### 建物 ID を指定して建物を探す

```
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX schema: <http://schema.org/>
select distinct ?s where {
?s a <https://lod.geospatial.jp/vocabulary#Building> ;
schema:identifier/schema:name "ビルディングID" ;
# 建物IDを指定
schema:identifier/schema:value "37201-bldg-289948" .
} LIMIT 100
```

### 不動産 ID が複数付与されている建物を探す

```
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
select distinct ?s ?num where {
?s a <https://lod.geospatial.jp/vocabulary#Building> ;
pv:realEstateID/pv:landRealEstateNumber ?num .
FILTER(?num > 1)
} LIMIT 100
```

### 指定した座標から近い順に建物オブジェクトを取得

※地理座標の座標系は（WGS84）

```
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary/pv#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>
PREFIX uom: <http://www.opengis.net/def/uom/OGC/1.0/>

SELECT ?building ?distance
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
              schema:geo/schema:latitude ?lat ;
              schema:geo/schema:longitude ?long .

    # 緯度経度をWKT形式に変換
    BIND(concat("POINT(", str(?long), " ", str(?lat), ")") AS ?wkt)
    BIND(strdt(?wkt, geo:wktLiteral) as ?location)

    # 座標を指定
    BIND("POINT(133.99974486338468 34.23144859665626)"^^geo:wktLiteral as ?targetLocation)

    # 2点間の距離を計算
    BIND(geof:distance(?location, ?targetLocation, uom:metre) as ?distance)
}
ORDER BY ?distance
LIMIT 100
```

### 指定した矩形範囲に含まれる建物オブジェクトを取得

※地理座標の座標系は（WGS84）

```
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary/pv#>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#location>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
              schema:geo/schema:latitude ?lat ;
              schema:geo/schema:longitude ?long .

    # 緯度経度をWKT形式に変換
    BIND(concat("POINT(", str(?long), " ", str(?lat), ")") AS ?wkt)
    BIND(strdt(?wkt, geo:wktLiteral) as ?location)

    # 矩形の範囲を定義
    BIND("POLYGON((133.9814498 34.3974288, 133.8928726 34.222741, 134.2162826 34.2295538, 134.1187789 34.3979954, 133.9814498 34.3974288))"^^geo:wktLiteral as ?boundingBox)

    # 矩形の範囲内にあるかどうかを判定
    FILTER(geof:sfWithin(?location, ?boundingBox))
}
```

### 自治体名を指定して建物オブジェクトを取得

```
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX geof: <http://www.opengis.net/def/function/geosparql/>
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> .
    # 自治体名を指定
    ?building pv:location/schema:address "香川県高松市" .
} LIMIT 100
```

### 建物用途を指定して建物オブジェクトを取得

```
PREFIX uro: <https://lod.geospatial.jp/vocabulary/uro/uro#>
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
    # コードリストで値を指定
    uro:buildingDetailAttribute/uro:orgUsage <https://lod.geospatial.jp/codelists/BuildingDetailAttribute_orgUsage#12> .
} LIMIT 100
```

### 複数階の建物オブジェクトを取得

```
PREFIX uro: <https://lod.geospatial.jp/vocabulary/uro/uro#>
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building ?levelNum
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
    bldg:storeysAboveGround ?levelNum .
    FILTER(?levelNum > 1)
} LIMIT 100
```

### 建物不動産 ID を指定して建物オブジェクトを取得

```
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
    # 不動産IDを指定
pv:realEstateID/pv:buildingRealEstateID "4703000378489-0000" .
} LIMIT 100
```

### 土地不動産 ID を指定して建物オブジェクトを取得

```
PREFIX schema: <http://schema.org/>
PREFIX pv: <https://lod.geospatial.jp/vocabulary#>
PREFIX bldg: <https://lod.geospatial.jp/vocabulary/citygml/bldg#>

SELECT distinct ?building
WHERE {
    ?building a <https://lod.geospatial.jp/vocabulary#Building> ;
    # 土地不動産IDを指定
pv:realEstateID/pv:landRealEstateID "4703001114477-0000-3" .
} LIMIT 100
```
