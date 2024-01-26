const xpath = require('xpath');
const dom = require('xmldom').DOMParser;
const fs = require("fs");
const path = require('path');

class Gml2JSON {
    constructor(inputDirPath, exportDirePath, map, nameSpaces, baseXPath) {
        this.inputDirPath = inputDirPath // 入力するGMLファイルのディレクトへのパス
        this.exportDirPath = exportDirePath // 生成したJSONファイルを出力するディレクトリのパス
        this.map = map // 整形するJSONの構造を定義したObject
        this.namespace = nameSpaces // XMLのパースに必要なネームスペース
        this.baseXPath = baseXPath // XMLから取得する主たるノード
        
        // 地域名コードリストXMLファイル〜XMLオブジェクト〜セレクタ
        this.codelistXmlFilePath = './data/codelists/Common_localPublicAuthorities.xml';
        this.codelistXmlFile = fs.readFileSync(this.codelistXmlFilePath, "utf-8");
        this.codelistXmlDoc = new dom().parseFromString(this.codelistXmlFile);
        this.codelistSelector = new xpath.useNamespaces(nameSpaces); // 地名コードリスト用
    }
    
    // main function
    gererateJSON = () => {
        
        console.log("generateJSON")
        
        //　指定したディレクトリ配下のサブディレクトリ一覧を取得
        const dirList = this.getDirectories(this.inputDirPath)
        
        if (dirList && dirList.length > 0) {
            
            dirList.forEach( dir => {
                
                
                // 実行時間をはかっておく
                const start = performance.now();
                
                const currentDir = this.inputDirPath + "/" + dir
                               
                const fileList = fs.readdirSync(currentDir, {withFileTypes: true})
                .filter(dirent => dirent.isFile()).map(({name}) => name) //フォルダ除外
                .filter(function(file) {
                    return path.extname(file).toLowerCase() === '.gml'; //拡張子gmlだけ
                });
                
                // ディレクトリと件数をコンソールに出力
                console.log(currentDir + ": " + fileList.length)
                
                let counter = 0

                fileList.forEach( filePath => {
                                        
                    // パースする対象XMLファイル〜XMLオブジェクト〜セレクタ
                    this.xmlFilePath = currentDir + "/" + filePath;
                    this.xmlFile = fs.readFileSync(this.xmlFilePath, "utf-8");
                    this.xmlDoc = new dom().parseFromString(this.xmlFile);
                    this.selector = new xpath.useNamespaces(nameSpaces); // 建物用
                    
                    const nodes = this.selector(this.baseXPath, this.xmlDoc);
                    
                    counter += 1
                    console.log(">> " + filePath + " > node: " + nodes.length + " (" + counter + "/" + fileList.length + ")")
                    
                    if (nodes) {
                        const res = []
                        nodes.forEach( elm => {    
                            res.push({"@context": this.map.context, ...this.gmlToJson(this.map.body, elm)})
                        })
                        
                        // ファイル出力
                        if (res.length > 0) {
                            // ディレクトリがなかったら作成
                            if (!fs.existsSync(this.exportDirPath + "/" + dir)) {
                                fs.mkdirSync(this.exportDirPath + "/" + dir, { recursive: true });
                            }
                            
                            res.forEach(obj => {
                                
                                const fileName = obj["@id"].replace("plateau:", "") + ".jsonld"
                                const exportFilePath = this.exportDirPath + "/" + dir + "/" + fileName
                                const jsonBody = JSON.stringify(obj)
                                
                                // console.log(jsonBody)
                                
                                fs.writeFileSync(exportFilePath, jsonBody, err => {
                                    if (err) console.log(err.message);
                                });

                            })
                        }
                    } else {
                        return "no result"
                    }
                })
                
                // 実行時間
                const end = performance.now();
                const duration = end - start
                const time = this.convertMillisecondsToTime(duration)
                console.log(">>>> " + currentDir + " done! (" + time + ")");
            })
        }
    }
    
    convertMillisecondsToTime = (milliseconds) => {
        let seconds = Math.floor(milliseconds / 1000);
        let minutes = Math.floor(seconds / 60);
        let hours = Math.floor(minutes / 60);
    
        seconds = seconds % 60;
        minutes = minutes % 60;
    
        // 時、分、秒を二桁にフォーマットする
        hours = hours.toString().padStart(2, '0');
        minutes = minutes.toString().padStart(2, '0');
        seconds = seconds.toString().padStart(2, '0');
    
        return `${hours}:${minutes}:${seconds}`;
    }
        
    getDirectories = (inputDir) => {
        
        const paths = fs.readdirSync(inputDir)
        const res = []

        paths.forEach (elm => {
            const stat = fs.statSync(inputDir + "/" + elm)
            if (stat.isDirectory()) {
                res.push(elm)
            }
        })
        
        if (!res.length) {
            res.push(inputDir)
        }

        return res

    };
    
    // XMLから値を取り出す
    getXmlNodeValue = (doc, path) => {
        
        if (path.includes('@')) {
            return this.selector(path, doc, true).nodeValue
        }
        
        const nodes = this.selector(path, doc);

        if (Array.isArray(nodes)) {
            const res = []
            nodes.forEach( elm => {
                const text = this.selector('text()', elm, true);
                const codeSpace = this.selector('@codeSpace', elm, true);
                
                
                if (text && codeSpace) {
                    const uri = codeSpace.value.replace('.xml', '#').replace('../../', 'https://lod.geospatial.jp/')
                    res.push(uri + text.nodeValue)
                } else if (text) {
                    res.push(text.nodeValue)
                }
            })
            
            if (res.length === 0) {
                return null
            }
                
            if (res.length === 1) {
                return res[0]
            }
            
            if (res.length > 1) {
                return res
            }
            
        } else {
            return text.nodeValue
        }
        
    }

    // リソースのIDを取得
    getID = (payload, doc) => {
        const suffix = this.selector(payload.xpath, doc, true).nodeValue
        return payload.prefix + suffix
    }

    // 建物の座標を取得
    getGeoCordinates = (doc) => {
        const polygonAllay = this.getLoof0FootPrint(doc).split(', ')
        const minmaxLat = {}
        const minmaxLong = {}
        
        polygonAllay.forEach (elm => {
            const currentCordinates = elm.split(' ')
            if (!minmaxLat.min && !minmaxLat.max) {
                minmaxLat.max = currentCordinates[1]
                minmaxLat.min = currentCordinates[1]
            } else {
                if (currentCordinates[1] > minmaxLat.max) {
                    minmaxLat.max = currentCordinates[1]
                }
                if (currentCordinates[1] < minmaxLat.min) {
                    minmaxLat.min = currentCordinates[1]
                }
            }
            
            if (!minmaxLong.min && !minmaxLong.max) {
                minmaxLong.max = currentCordinates[0]
                minmaxLong.min = currentCordinates[0]
            } else {
                if (currentCordinates[0] > minmaxLong.max) {
                    minmaxLong.max = currentCordinates[0]
                }
                if (currentCordinates[0] < minmaxLong.min) {
                    minmaxLong.min = currentCordinates[0]
                }
            }
        })
        
        const resCordinates = [
            ((Number(minmaxLat.max) - Number(minmaxLat.min))/2 + Number(minmaxLat.min)).toFixed(15), 
            ((Number(minmaxLong.max) - Number(minmaxLong.min))/2 + Number(minmaxLong.min)).toFixed(15)
        ]
        const elevation = this.getValue({"@type": "xsd:double", "xpath": "bldg:measuredHeight"}, doc)
        const resObject = {
            "@type": "schema:GeoCoordinates",
            "schema:latitude": { "@value": Number(resCordinates[1]), "@type": "xsd:double" },
            "schema:longitude": { "@value": Number(resCordinates[0]), "@type": "xsd:double" },
            "schema:elevation": elevation
        }
        
        return resObject
    }

    // 統計LODの標準地域コードを取得
    getStandardAreaCode = (doc) => {
        const areaCode = this.selector("uro:buildingIDAttribute/uro:BuildingIDAttribute/uro:city/text()", doc, true)
        return { "@id": "http://data.e-stat.go.jp/lod/sac/C" + areaCode }
    }

    // 住所ラベルを取得
    getAddressLabel = (doc) => {
        const areaCode = this.selector("uro:buildingIDAttribute/uro:BuildingIDAttribute/uro:city/text()", doc, true)
        if (areaCode) {
            const address = this.codelistSelector("//gml:Definition[gml:name='" + areaCode + "']/gml:description/text()", this.codelistXmlDoc, true)
            return address.nodeValue
        }
    }

    // 不動産IDを取得
    getRealEstateObject = (obj) => {
        return "realEstate"
    }

    // LOD0ポリゴンを取得
    getLoof0FootPrint = (doc) => {
        let cordinates
        
        const lod0FootPrint = this.selector('bldg:lod0FootPrint/gml:MultiSurface/gml:surfaceMember/gml:Polygon/gml:exterior/gml:LinearRing/gml:posList/text()', doc, true);
        if (lod0FootPrint) {
            cordinates = lod0FootPrint.nodeValue    
        }
        
        const lod0RoofEdge = this.selector('bldg:lod0RoofEdge/gml:MultiSurface/gml:surfaceMember/gml:Polygon/gml:exterior/gml:LinearRing/gml:posList/text()', doc, true);
        if (lod0RoofEdge) {
            cordinates = lod0RoofEdge.nodeValue    
        }
        
        const res = []
        if (cordinates) {
            const cordinatesArray = cordinates.split(" ")
            cordinatesArray.forEach((elm, index) => {
                
                if (index % 3 === 2) {
                    // console.log(elm)
                    res.push(cordinatesArray[index-2] + ' ' + cordinatesArray[index-1])
                }
            })
        }
        return res.join(', ')
    }

    // mapで指定されたとおりに値を取得
    getValue = (payload, baseDoc) =>{
        
        let res = {}

        let nodeValue
        
        if (payload.xpath) {
            nodeValue = this.getXmlNodeValue(baseDoc, payload.xpath)
        }
        
        if (payload["@value"]) {
            nodeValue = payload["@value"]
        }
        
        // 値が空だったらnullを戻す
        if (nodeValue === null) {
            return null
        }
        
        switch (payload["@type"]) {
            case "@id":
                if (payload.prefix) {
                    res["@id"] = payload.prefix + nodeValue
                } else {
                    res["@id"] = nodeValue
                }
                break;
            case "xsd:string":
                // res["@value"] = nodeValue
                
                if (Array.isArray(nodeValue)) {
                    res = nodeValue
                } else {
                    if (payload["@lang"]) {
                        res["@value"] = nodeValue
                        res["@lang"] = payload["@lang"]
                    } else {
                        res = nodeValue
                    }
                }
                break;
            case "xsd:decimal":
                res["@type"] = "xsd:decimal"
                res["@value"] = Number(nodeValue)
                break;
            case "xsd:double":
                res["@type"] = "xsd:double"
                res["@value"] = Number(nodeValue)
                break;
            case "xsd:date":
                res["@type"] = "xsd:date"
                res["@value"] = nodeValue
                break;
            default:
                res = this.gmlToJson(payload, baseDoc)
        }
        
        return res    
    }

    // gmlをJSON化
    gmlToJson = (map, baseDoc) => {
        const resultObject = {}
        
        Object.keys(map).forEach( key => {
            
            if (map[key].function) {
                let value
                switch (map[key].function) {
                    case "getValue":
                        if (baseDoc) {
                            value = this.getValue(map[key].payload, baseDoc)
                        } else {
                            value = this.getValue(map[key].payload)
                        }
                        break;
                    case "getGeoCordinates":
                        value = this.getGeoCordinates(baseDoc)
                        break;
                    case "getStandardAreaCode":
                        value = this.getStandardAreaCode(baseDoc)
                        break;
                    case "getRealEstateObject":
                        value = this.getRealEstateObject(baseDoc)
                        break;
                    case "getLoof0FootPrint":
                        value = this.getLoof0FootPrint(baseDoc)
                        break;
                    case "getAddressLabel":
                        value = this.getAddressLabel(baseDoc)
                        break;
                    case "getID":
                        value = this.getID(map[key].payload, baseDoc)
                        break;
                    default:
                        value = "non specified function"
                        break;
                }
                if (value !== null) {
                    resultObject[key] = value
                }
            } else {
                resultObject[key] = map[key]
            }
            
        })
        return resultObject
    }
}

// ネームスペースの定義
const nameSpaces = {
    "brid": "http://www.opengis.net/citygml/bridge/2.0",
    "tran": "http://www.opengis.net/citygml/transportation/2.0",
    "frn": "http://www.opengis.net/citygml/cityfurniture/2.0",
    "wtr": "http://www.opengis.net/citygml/waterbody/2.0",
    "sch": "http://www.ascc.net/xml/schematron",
    "veg": "http://www.opengis.net/citygml/vegetation/2.0",
    "xlink": "http://www.w3.org/1999/xlink",
    "tun": "http://www.opengis.net/citygml/tunnel/2.0",
    "tex": "http://www.opengis.net/citygml/texturedsurface/2.0",
    "gml": "http://www.opengis.net/gml",
    "app": "http://www.opengis.net/citygml/appearance/2.0",
    "gen": "http://www.opengis.net/citygml/generics/2.0",
    "dem": "http://www.opengis.net/citygml/relief/2.0",
    "luse": "http://www.opengis.net/citygml/landuse/2.0",
    "uro": "https://www.geospatial.jp/iur/uro/3.0",
    "xAL": "urn:oasis:names:tc:ciq:xsdschema:xAL:2.0",
    "bldg": "http://www.opengis.net/citygml/building/2.0",
    "smil20": "http://www.w3.org/2001/SMIL20/",
    "xsi": "http://www.w3.org/2001/XMLSchema-instance",
    "smil20lang": "http://www.w3.org/2001/SMIL20/Language",
    "pbase": "http://www.opengis.net/citygml/profiles/base/2.0",
    "core": "http://www.opengis.net/citygml/2.0",
    "grp": "http://www.opengis.net/citygml/cityobjectgroup/2.0"
}

// 建物JSONの最終出力形態
const mapBuilding = {
    context: {
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdf": "http://www.w3.org/2000/01/rdf-schema#",
        "schema": "http://schema.org/",
        "plateau": "https://lod.geospatial.jp/resource/",
        "pv": "https://lod.geospatial.jp/vocabulary/pv#",
        "sac": "http://data.e-stat.go.jp/lod/sac/",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "estat-attribute-code": "http://data.e-stat.go.jp/lod/ontology/attribute/code/",
    },
    body:{
        "@type": "pv:Building",
        "@id": {"function": "getID", "payload": {"prefix": "plateau:", "xpath": "@gml:id"}},
        "rdfs:label": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "gml:name", "@lang": "ja"}},
        "schema:name": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "gml:name", "@lang": "ja"}},
        "schema:description": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "gml:description", "@lang": "ja"}},
        "pv:usage": {"function": "getValue", "payload": {"@type": "@id", "xpath": "bldg:usage"}},
        "pv:yearOfConstruction": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "bldg:yearOfConstruction"}},
        "pv:yearOfDemolition": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "bldg:yearOfDemolition"}},
        "pv:roofType": {"function": "getValue", "payload": {"@type": "@id", "xpath": "bldg:roofType"}},
        "pv:storeysAboveGround": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "bldg:storeysAboveGround"}},
        "pv:storeysBelowGround": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "bldg:storeysBelowGround"}},
        "schema:datePublished": {"function": "getValue", "payload": {"@type": "xsd:date", "xpath": "core:creationDate"}},
        "schema:identifier": {"function": "getValue", "payload": {
            "@type": "schema:PropertyValue",
            "schema:name": "gml ID",
            "schema:value": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "@gml:id"}},
        }},
        "pv:measureHeight": {"function": "getValue", "payload": {
            "@type": "pv:MeasuredHeight", 
            "schema:unitCode": {"function": "getValue", "payload": {"@type": "@id", "@value": "estat-attribute-code:unitMeasure-meter"}},
            "schema:value": {"function": "getValue", "payload": {"@type": "xsd:double", "xpath": "bldg:measuredHeight"}}
        }},
        "schema:geo": {"function": "getGeoCordinates"},
        "pv:location": {"function": "getValue", "payload": {
            "@type": "pv:Location",
            "pv:prefecture": {"function": "getValue", "payload": {"@type": "@id", "xpath": "uro:buildingIDAttribute/uro:BuildingIDAttribute/uro:prefecture"}},
            "pv:city":{"function": "getValue", "payload": {"@type": "@id", "xpath": "uro:buildingIDAttribute/uro:BuildingIDAttribute/uro:city"}},
            "pv:standardAreaCode": {"function": "getStandardAreaCode"},
            "schema:address": {"function": "getAddressLabel"},
        }},
        "pv:realEstateIDAttribute": {"function": "getValue", "payload": {"@type": "@id", "prefix": "plateau:real-estate-id-", "xpath": "@gml:id"}},
        "pv:loof0FootPrint": {"function": "getLoof0FootPrint"}
    }
}

// 不動産IDJSONの出力形態
const mapRealEstate = {
    context: {
        "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        "rdf": "http://www.w3.org/2000/01/rdf-schema#",
        "schema": "http://schema.org/",
        "plateau": "https://lod.geospatial.jp/resource/",
        "pv": "https://lod.geospatial.jp/vocabulary/pv#",
        "xsd": "http://www.w3.org/2001/XMLSchema#",
    },
    body: {
        "@type": "pv:RealEstateIDAttribute",
        "@id": {"function": "getID", "payload": {"prefix": "plateau:real-estate-id-", "xpath": "@gml:id"}},
        "pv:realEstateIDOfBuilding": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "uro:bldgRealEstateIDAttribute/uro:RealEstateIDAttribute/uro:realEstateIDOfBuilding"}},
        "pv:numberOfRealEstateIDOfLand": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "uro:bldgRealEstateIDAttribute/uro:RealEstateIDAttribute/uro:numberOfRealEstateIDOfLand"}},
        "pv:realEstateIDOfLand": {"function": "getValue", "payload": {"@type": "xsd:string", "xpath": "uro:bldgRealEstateIDAttribute/uro:RealEstateIDAttribute/uro:realEstateIDOfLand"}},
        "pv:matchingScore": {"function": "getValue", "payload": {"@type": "xsd:decimal", "xpath": "uro:bldgRealEstateIDAttribute/uro:RealEstateIDAttribute/uro:matchingScore"}},
    }
}


// 建物JSON-LD生成
console.log("建物JSON-LD生成")
const converter = new Gml2JSON( "./data/gmlFIles", "./data/export/json/building", mapBuilding, nameSpaces, "//bldg:Building");
converter.gererateJSON()

// 不動産IDJSON-LD生成
console.log("不動産IDJSON-LD生成")
const converterRealEstate = new Gml2JSON( "./data/gmlFIles", "./data/export/json/realestateid", mapRealEstate, nameSpaces, "//bldg:Building");
converterRealEstate.gererateJSON()

// console.log(result)
