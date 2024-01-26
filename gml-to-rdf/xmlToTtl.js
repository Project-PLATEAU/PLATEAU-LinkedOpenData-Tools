/*
attributeのxmlデータをttlファイルに書き出す
実行は　node xml2ttl.js "./codelists/"　←ファイルパス
 */


const fs = require("fs");
const { XMLParser } = require('fast-xml-parser');
const options = {
  ignoreAttributes: false,
  format: true,
};
const parser = new XMLParser(options);

function appendItem(outputFule, schema, entry) {
  let name = entry['gml:Definition']['gml:name']
  name = name.toString().replace(/\//, '_')
  const description = entry['gml:Definition']['gml:description']
  fs.appendFileSync(outputFule, "\n");
  fs.appendFileSync(outputFule, 'ns:' + name + ' a skos:Concept ;');
  fs.appendFileSync(outputFule, "\n");
  fs.appendFileSync(outputFule, 'skos:inScheme ns:' + schema + ' ;');
  fs.appendFileSync(outputFule, "\n");
  fs.appendFileSync(outputFule, 'skos:prefLabel "' + description + '" .');
}

const inputFilepath = './data/codelists/'
const outputFilepath = './data/rdf/'
const thirdMeshList = fs.readdirSync(inputFilepath)

let fileCount = 0

thirdMeshList.forEach((filename) => {
  const fileNameAndExtension = filename.split('.')
  const fileNameExExtension = fileNameAndExtension[0]
  const fileExtension = fileNameAndExtension[1]
  if (fileExtension !== 'xml') return
  // if (fileNameExExtension !== 'Appearance_mimeType') return //テスト用
  console.log(fileNameExExtension)
  const xml = fs.readFileSync(inputFilepath + filename, "utf8").toString();
  const obj = parser.parse(xml);
  
  try {
    if (obj['gml:Dictionary']) {
      const directory = obj['gml:Dictionary']
      if (directory['gml:dictionaryEntry']) {
        const schema = directory['gml:name']
        const entry = directory['gml:dictionaryEntry']
      
        const outFile = outputFilepath + fileNameExExtension + '.ttl'
        // ファイル書き込み
        const prefix = '@prefix ns: <https://lod.geospatial.jp/codelists/' + schema + '#> .'
        fs.writeFileSync(outFile, prefix);
        fs.appendFileSync(outFile, "\n");
        fs.appendFileSync(outFile, '@prefix skos: <http://www.w3.org/2004/02/skos/core#> .');
        fs.appendFileSync(outFile, "\n\n");
        fs.appendFileSync(outFile, 'ns:' + schema + ' a skos:ConceptScheme .');
        fs.appendFileSync(outFile, "\n");
      
        if (Array.isArray(entry)) {
          entry.forEach(ent => {
            appendItem(outFile, schema, ent)
          })
        } else {
          appendItem(outFile, schema, entry)
        }
      }
      fileCount++
    }
  } catch(error) {
    console.log(error)
  } finally {
    console.log(fileCount + '件変換')
  }
})


