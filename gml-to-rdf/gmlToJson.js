const { XMLParser, XMLBuilder, XMLValidator } = require('fast-xml-parser');
const fs = require("fs");
const { exit } = require('process');

const options = {
  ignoreAttributes: false,
  format: true,
};

const buildingAttributeRoles = [
  'uro:buildingIDAttribute',
  'uro:buildingDetailAttribute',
  'uro:largeCustomerFacilityAttribute',
  'uro:buildingDisasterRiskAttribute',
  'uro:keyValuePairAttribute',
  'uro:buildingDataQualityAttribute',
  'uro:ifcBuildingAttribute',
  'uro:IfcProject',
  'uro:IfcSite',
  'uro:IfcProjectedCRS',
  'uro:IfcPsetBuildingCommon',
  'uro:indoorBuildingAttribute',
  'uro:IndoorFacilityAttribute',
  'uro:bldgFacilityTypeAttribute',
  'uro:bldgFacilityIdAttribute',
  'uro:bldgFacilityAttribute',
  'uro:bldgDmAttribute'
]

// 再帰処理の中で無視するプロパティ（別途個別に手当する）
const ignoreAttributeList = [
  'bldg:lod1Solid',
  'bldg:lod0RoofEdge',
  // 'gen:stringAttribute',
  // 'gen:intAttribute',
]

const context = {
  "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  "rdf": "http://www.w3.org/2000/01/rdf-schema#",
  "schema": "http://schema.org/",
  "plateau": "https://lod.geospatial.jp/resource/",
  "pv": "https://lod.geospatial.jp/vocabulary/pv#",
  "sac": "http://data.e-stat.go.jp/lod/sac/",
  "estat-attribute": "http://data.e-stat.go.jp/lod/ontology/attribute/",
  "xsd": "http://www.w3.org/2001/XMLSchema#",
}


/*
codelistsフォルダの中身のxmlを取り出してcodeListオブジェクトにする
 */
const getCodeList = () => {
  const codeListFilepath = './data/codelists/'
  const codeList = fs.readdirSync(codeListFilepath)
  const attributes = {}
  
  codeList.forEach(filename => {
    // console.log(filename)
    const fileNameAndExtension = filename.split('.')
    const excludeExtension = fileNameAndExtension[0]
    const fileExtension = fileNameAndExtension[1]
    if (fileExtension !== 'xml') return
    const xml = fs.readFileSync(codeListFilepath + filename, "utf8").toString();
    const obj = parser.parse(xml);
    
    if (obj['gml:Dictionary'] && obj['gml:Dictionary']['gml:dictionaryEntry']) {
      attributes[excludeExtension] = []
      const details = obj['gml:Dictionary']['gml:dictionaryEntry']
      if (details && Array.isArray(details)) {
        details.forEach(d => {
          attributes[excludeExtension].push({
            name: d['gml:Definition']['gml:name'],
            description: d['gml:Definition']['gml:description']
          })
        })
      } else {
        attributes[excludeExtension].push({
          name: details['gml:name'],
          description: details['gml:description']
        })
      }
    }
  })
  // console.log(attributes)
  return attributes
}

const codeList = getCodeList() //xmlファイルをオブジェクトに取り出したもの
const inputFilepath = './data/gmlFiles/Takamatsu/'
const outputFilepath = './data/JSON/'
const thirdMeshList = fs.readdirSync(inputFilepath)

thirdMeshList.forEach((filename, index) => {
  // if (filename !== '51332779_bldg_6697_op.gml') return //テスト用行
  console.log(filename)
  const fileNameAndExtension = filename.split('.')
  const excludeExtension = fileNameAndExtension[0]
  const fileExtension = fileNameAndExtension[1]
  if (fileExtension !== 'gml') return

  const xml = fs.readFileSync(inputFilepath + filename, "utf8").toString();
  const obj = parser.parse(xml);
  const buidingMembers = obj['core:CityModel']['core:cityObjectMember']
  
  const result = []
  buidingMembers.forEach(res => {
    result.push(makeObject(res, context))
  })
  /*
  if (Array.isArray(list)) {
    for(const obj of list) {
      makeObject(obj, list2)
    }
  } else {
    makeObject(list, list2)
  }
  


  const list3 = list2.filter((d) => {
    return d !== null
  })
  */
  // const data = JSON.stringify(list3,null," ")
  
  const data = JSON.stringify(result,null," ")
  

  fs.writeFileSync(outputFilepath + excludeExtension + '.json', data);
})

function makeObject(one, context) {
  try {
    const body = one['bldg:Building']
    
    // {
    //   "plateau:bldg_9554bef1-3d9d-4791-a454-18548664e493": {
    //       "@type": "pv:Building",
    //       "rdfs:label": {
    //           "@language": "ja",
    //           "@value": "国土交通省ビルヂング"
    //       },
    //       "schema:name": {
    //           "@language": "ja",
    //           "@value": "国土交通省ビルヂング"
    //       },
    //       "schema:description": {
    //           "@language": "ja",
    //           "@value": "この建物に関する説明"
    //       },
    //       "pv:usage": {
    //           "@id": "https://lod.geospatial.jp/codelists/Building_usage#1"
    //       },
    //       "pv:class": {
    //           "@id": "https://lod.geospatial.jp/codelists/Building_class#3001"
    //       },
    //       "pv:yearOfConstruction": {
    //           "@type": "xsd:decimal",
    //           "@value": 1977
    //       },
    //       "pv:yearOfDemolition": {
    //           "@type": "xsd:decimal",
    //           "@value": 2023
    //       },
    //       "pv:roofType": {
    //           "@id": "https://lod.geospatial.jp/codelists/Building_roofType#1"
    //       },
    //       "pv:storeysAboveGround": {
    //           "@type": "xsd:decimal",
    //           "@value": 5
    //       },
    //       "pv:storeysBelowGround": {
    //           "@type": "xsd:decimal",
    //           "@value": 2
    //       },
    //       "schema:datePublished": {
    //           "@type": "xsd:date",
    //           "@value": "2023-03-22"
    //       },
    //       "pv:measureHeight": {
    //           "@type": "pv:MeasuredHeight",
    //           "schema:unitCode": {
    //               "@id": "estat-attribute-code:unitMeasure-meter"
    //           },
    //           "schema:value": {
    //               "@type": "xsd:decimal",
    //               "@value": 15
    //           }
    //       },
    //       "schema:geo": {
    //           "@type": "schema:GeoCoordinates",
    //           "schema:latitude": {
    //               "@value": 34.22376061983865,
    //               "@type": "xsd:double"
    //           },
    //           "schema:longitude": {
    //               "@value": 133.9989003754713,
    //               "@type": "xsd:double"
    //           },
    //           "schema:elevation": {
    //               "@value": 99.948,
    //               "@type": "xsd:double"
    //           }
    //       },
    //       "pv:location": {
    //           "@type": "pv:Location",
    //           "pv:prefecture": {
    //               "@id": "https://lod.geospatial.jp/codelists/Common_localPublicAuthorities#37"
    //           },
    //           "pv:city": {
    //               "@id": "https://lod.geospatial.jp/codelists/Common_localPublicAuthorities#37201"
    //           },
    //           "pv:standardAreaCode": {
    //               "@id": "sac:C37201"
    //           },
    //           "schema:address": "香川県高松市"
    //       },
    //       "pv:realEstateIDAttribute": {
    //           "@id": "plateau:real-estate-id-9554bef1-3d9d-4791-a454-18548664e493"
    //       },
    //       "pv:loof0FootPrint": "133.9814498 34.3974288, 133.8928726 34.222741, 134.2162826 34.2295538, 134.1187789 34.3979954, 133.9814498 34.3974288"
    //   }
    // }
  
    
    // 高さオブジェクトを生成
    const height = getMeasuredHeight(body)
    
    // rooftop形状を生成
    let type = getLOD0Type(body)
    const lod1list = getLOD1Array(body)
    const minmax = calculateMinAndMaxHeight(lod1list)
    let lod0 = getBottomSurfaceFromLOD1Array(lod1list, minmax[0])

    // console.log(lod0)
    if(!lod0) {
      console.log('error')
    }
    
    const coords = { 'pv:lod0FootPrint': createFootPrint(lod0, type, height) }
    const center = { 'schema:geo': createCenter(coords['pv:lod0FootPrint']) }
    const location = { 'pv:location': getLocation(body) }
    const identifier = { 'schema:identifier': getIdentifier(body) }
    // const lod1HeightType = { getLod1HeightType(body) }

    
    // 無視リストを使って不要要素を削除してから渡す
    const buildingObject = buildJsonBody('bldg:Building', removeIgnoredAttribute(body, ignoreAttributeList))
    
    const essentialObject = {
      '@context': context,
      '@type': 'pv:Building',
      '@id': 'plateau:' + buildingObject['@_gml:id'] // "bldg_9554bef1-3d9d-4791-a454-18548664e493" => plateau:bldg_377a735d-ce3f-4223-98f5-8a2fc6c9d8e9
    }
    
    const estateData = { 'pv:realEstateID': getEstate(body, buildingObject['@_gml:id']) }
    
    // 最後に不要なオブジェクトを削除しておく（リストを使ったループ処理にすべき）
    delete buildingObject['@_gml:id']
    delete buildingObject['gen:stringAttribute']
    delete buildingObject['gen:intAttribute']
    
    const result =  { ...essentialObject, ...buildingObject, ...center, ...location, ...coords, ...identifier, ...estateData }
    
    // null なオブジェクトは削除しておく
    Object.keys(result).forEach(elm => {
      if (result[elm] === null) {
        delete result[elm]
      }
    })
    
    return result
    
  } catch (e) {
    console.error(e)
    return null
  }
}

// Array, Object, Literal判定
function detectType (item) {
  if (isArray (item)) {
    return 'Array'
  }
  if (isObject (item)) {
    return 'Object'
  }
  return typeof item
  
}
// Array判定
function isArray (item) {
  return Object.prototype.toString.call(item) === '[object Array]';
}

// OBJECT判定
function isObject (item) {
  return typeof item === 'object' && item !== null && !isArray(item);
}

// 不要要素削除
function removeIgnoredAttribute(obj, list) {
  Object.keys(obj).forEach(key => {
    if (list.includes(key)) {
      delete obj[key]
    }
  })
  return obj
}

// 下層オブジェクトを条件ごとに解体整形する
function makeObjectShallow(obj) {
  const rgClassName = /.*:[A-Z]/g
  let codeSpace
  let text
  let uom
  let name
  let value
  
  Object.keys(obj).forEach (res => {
    if (res.match(rgClassName)) {
      
      obj = { ...obj, ...obj[res] }
      delete obj[res]
    }
    
    // intAttribute / stringAttribute の @_name を回収
    if (res === '@_name') {
      name = obj[res]
    }
    
    // intAttribute / stringAttribute の @_name を回収
    if (res === 'gen:value') {
      value = obj[res]
    }
    
    // 建物高さの単位を格納
    if (res === '@_uom') {
      uom = obj[res]
    }
    
    // コードスペースをURI化して回収
    if (res === '@_codeSpace') {
      codeSpace = obj[res].replace('../../', 'https://lod.geospatial.jp/')
      codeSpace = codeSpace.replace('.xml', '#')
    }
    if (res === '#text') {
      text = obj[res]
    }
    
  })
  
  if (name === '建物不動産ID' && value) {
    return {
      'pv:buildingRealEstateID': value,
    }
  }
  
  if (name === '土地不動産ID' && value) {
    return {
        'pv:landRealEstateID': value,
    }
  }
  
  if (name === '建物不動産ID数' && value) {
    return {
      'pv:unitRealEstateNumber': value,
    }
  }
  
  if (name === '土地不動産ID数' && value) {
    return {  
      'pv:landRealEstateNumber': value,
    }
  }
  
  // 建物高さオブジェクトを整形
  if (uom === 'm' && text) {
    return {
      '@type': 'pv:MeasuredHeight',
      'schema:unitCode': 'estat-attribute-code:unitMeasure-meter',
      'schema:value': text
    }
  }
  
  // コード値を整形
  if (codeSpace && text) {
    return { '@id': codeSpace + text }
  }
  
  return obj
}





// 属性を抜き出す
function buildJsonBody(keyLabel, node) {
  
  let returnObject = {}
  
  Object.keys(node).forEach (res => {
    
    // ノードのtypeを判定
    // console.log(res + ': 実行')
    let type = detectType (node[res])
    switch (type) {
      case 'Object':

        // classを追加する処理だが、makeObjectShallowに一本化できると思う。気が向いたら対応する。
        const preObj = {}
        const regex = /.*:[A-Z]/g

        if (res.match(regex)) { // クラスだったら@typeを追加
          preObj['@type'] = res
          returnObject[res] = { ...preObj, ...buildJsonBody(res, node[res])}
        } else { // クラスじゃなかったらそのまま処理
          // 戻ってきた子要素にClassのインスタンスに分解すべき要素があれば
          let resObject = buildJsonBody(res, node[res])
          returnObject[res] = makeObjectShallow(resObject)
        }

        break;
      case 'Array':
        // console.log('Arrayを処理')
        returnObject[res] = []
        // console.log(node[res])
        node[res].forEach(innerValue => {
          
          let resObject = buildJsonBody(res, innerValue)
          returnObject[res].push(makeObjectShallow(resObject))
        })
        
        break;
      case 'string':
        returnObject[res] = node[res]
        break;
      case 'number':
        returnObject[res] = node[res]
        break;
      case 'int':
        returnObject[res] = node[res]
        break;
      case 'bigint':
        returnObject[res] = node[res]
        break;
      default:
        console.log(`Skiped this type: ${type}.`);
        break;
      
    }    

  })
  return returnObject
}

function getMeasuredHeight(body) {
  if (body['bldg:measuredHeight'] && body['bldg:measuredHeight']['#text']) {
    return body['bldg:measuredHeight']['#text']
  } else {
    // console.log('no height')
    // 後でgmlIDからheight情報を探し、手打ちでFirestoreを更新しましょう
    // 例：extendedAttribute_key.xml=2だと「LOD1の立ち上げに使用する建築物の高さ」とかなってやがる
    return 0.5
  }
}

function getLOD0Type(body) {
  if(body['bldg:lod0FootPrint']) {
    return 1
  } else if (body['bldg:lod0RoofEdge']) {
    return 2
  } else {
    return 0
  }
}

function getLOD1Array(body) {
  const lodlist = []
  if(body['bldg:lod1Solid']){
    const list1 = body['bldg:lod1Solid']['gml:Solid']['gml:exterior']['gml:CompositeSurface']['gml:surfaceMember']
    if(Array.isArray(list1)) {
      for(const surfaceMenber of list1) {
        const posList = surfaceMenber['gml:Polygon']['gml:exterior']['gml:LinearRing']['gml:posList']
        lodlist.push(posList)
      }
    }
  }
  return lodlist
}

function getBottomSurfaceFromLOD1Array(lod1list, min) {
  for(let i = 0; i < lod1list.length; i ++) {
    const onelist = lod1list[i]
    const posList = onelist.split(' ')
    const length = (posList.length / 3)
    let flag = true
    for(let j = 0; j < length; j ++) {
      if(Number(posList[j * 3 + 2]) !== min) {
        flag = false
      }
    }
    if(flag) {
      return onelist
    }
  }
  return null
}

function calculateMinAndMaxHeight(lod1list) {
  const heightList = []
  for(const onelist of lod1list) {
    const posList = onelist.split(' ')
    const length = (posList.length / 3)
    for(let i = 0; i < length; i ++) {
      heightList.push(Number(posList[i * 3 + 2]))
    }
  }
  heightList.sort((first, second) => first - second)
  const min = heightList[0]
  const max = heightList[heightList.length - 1]
  return [min, max]
}

function createFootPrint(lod0, type, height) {
  const valueList = lod0.split(' ');
  const length = (valueList.length / 3)
  const coordsList = []
  for(let i = 0; i < length; i ++) {
    let altitude = 0
    if(type == 1) {
      altitude = Number(valueList[i * 3 + 2])
    } else if(type == 2) {
      altitude = Number(valueList[i * 3 + 2]) - height
    }
    coordsList.push([Number(valueList[i * 3]), Number(valueList[i * 3 + 1]), altitude])
  }
  return coordsList
}

function createCenter(coordsList) {
  let latitude = 0;
  let longitude = 0;
  let altitude = 0;
  for(const coord of coordsList){
    latitude = latitude + coord[0]
    longitude = longitude + coord[1]
    altitude = altitude + coord[2]
  }

  return {
    '@type': 'schema:GeoCoordinates',
    'schema:latitude': latitude / coordsList.length,
    'schema:longitude': longitude / coordsList.length,
    'schema:elevation': altitude / coordsList.length
  }
}

function getLocation(body) {
  let attribute = null
  if (body['uro:buildingIDAttribute'] && body['uro:buildingIDAttribute']['uro:BuildingIDAttribute']) {
    const city = body['uro:buildingIDAttribute']['uro:BuildingIDAttribute']['uro:city']
    let code = city['#text']
    const fileName = city['@_codeSpace'].match(/\/(\w+)\./)[1];
    const target = codeList[fileName].find(list => list.name === code)
    if (target) {
      // 0から始まるコードの場合0が抜けてしまうので、もう一度つける
      if (code.toString().length === 4) code = '0' + code
      attribute = {
        '@type': 'pv:Location',
        'pv:standardAreaCode': 'sac:C' + code,
        'schema:address': target.description
      }
    }
  }
  return attribute
}

function getSurveyYear(body) {
  let attribute = null
  if (body['uro:buildingDetailAttribute'] && body['uro:buildingDetailAttribute']['uro:BuildingDetailAttribute']) {
    const target = body['uro:buildingDetailAttribute']['uro:BuildingDetailAttribute']['uro:surveyYear']
    if (target) attribute = target
  }
  return attribute
}

function getIdentifier(body) {
  let attribute = null
  if (body['uro:buildingIDAttribute'] && body['uro:buildingIDAttribute']['uro:BuildingIDAttribute']) {
    const target = body['uro:buildingIDAttribute']['uro:BuildingIDAttribute']['uro:buildingID']
    if (target) {
      attribute = {
        '@type': 'schema:PropertyValue',
        'schema:name': 'ビルディングID',
        'schema:value': target
      }
    }
  }
  return attribute
}

function getLod1HeightType(body) {
  if (body['uro:buildingDataQualityAttribute'] && body['uro:buildingDataQualityAttribute']['uro:BuildingDataQualityAttribute']) {
    const type = body['uro:buildingDataQualityAttribute']['uro:BuildingDataQualityAttribute']['uro:lod1HeightType']
    const val = type['#text']
    const codeSpace = type['@_codeSpace']
    const dirName = codeSpace.match(/\/(\w+)\//)[1];
    const fileName = codeSpace.match(/\/(\w+)\./)[1];
    return 'https://lod.geospatial.jp/' + dirName + '/' + fileName + '/' + val
  } else {
    return null
  }
}

function getEstate(body, id) {
  let attribute = null
  let realEstateId = ''
  let unitRealEstateNumber = 0
  let unitRealEstateIds = []
  let landRealEstateNumber = 0
  let landRealEstateIds = []
  const relatedRolesString = body['gen:stringAttribute']
  
  if (relatedRolesString) {
    // console.log(relatedRolesString)
    if (Array.isArray(relatedRolesString)) {
      let indexUnit = 0
      let indexLand = 0
      relatedRolesString.forEach((role) => {
        if (role['@_name'] === '建物不動産ID') {
          realEstateId = role['gen:value']
        }
        if (role['@_name'] === '区分不動産ID') {
          unitRealEstateIds.push(role['gen:value'] + '-' + ++indexUnit)
        }
        if (role['@_name'] === '土地不動産ID') {
          landRealEstateIds.push(role['gen:value'] + '-' + ++indexLand )
        }
      })
    }
    const relatedRolesInt = body['gen:intAttribute']
    if (relatedRolesInt) {
      if (Array.isArray(relatedRolesInt)) {
        relatedRolesInt.forEach(role => {
          if (role['@_name'] === '区分所有数') {
            unitRealEstateNumber = role['gen:value']
          }
          if (role['@_name'] === '土地不動産ID数') {
            landRealEstateNumber = role['gen:value']
          }
          
        })
      }
    }
    if (realEstateId) {
      attribute = {
        "@type": "pv:RealEstateID",
        "@id": id.replace('plateau:bldg','plateau:realEstateID'),
        "pv:buildingRealEstateID":realEstateId
      }
      if (unitRealEstateNumber > 0) {
        attribute["pv:unitRealEstateNumber"] = unitRealEstateNumber
        attribute["pv:unitRealEstateID"] = unitRealEstateIds
      }
      if (landRealEstateNumber > 0) {
        attribute["pv:landRealEstateNumber"] = landRealEstateNumber
        attribute["pv:landRealEstateID"] = landRealEstateIds
      }
    }
  }
  return attribute
}
