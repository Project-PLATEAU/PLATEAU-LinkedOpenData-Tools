const fs = require("fs");
const path = require('path');
const jsonld = require('jsonld');


class Json2Ntriple {
  constructor(inputDirPath, outputDirPath ) {
    this.inputDirPath = inputDirPath
    this.outputDirPath = outputDirPath
  }
  
  // ディレクトリ一覧を取得
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
  
  convertJsonToNtriples = async (inputFilepath, outputFilepath) => {
    const txt = await fs.promises.readFile(inputFilepath, "utf8")
    const json = JSON.parse(txt)
    await jsonld.toRDF(json, {format: 'application/n-quads'}).then( async nquads => {
      await fs.promises.writeFile(outputFilepath, nquads);
    })
  }
  
  // main function
  gererateNtriples = async () => {
      
    console.log("gererateNtriples")
    
    //　指定したディレクトリ配下のサブディレクトリ一覧を取得
    const dirList = this.getDirectories(this.inputDirPath)
    
    if (dirList && dirList.length > 0) {
      
      for (const dir of dirList) {
      
          
        // 実行時間をはかっておく
        const start = performance.now();
        
        const currentDir = this.inputDirPath + "/" + dir
                        
        const fileList = fs.readdirSync(currentDir, {withFileTypes: true})
        .filter(dirent => dirent.isFile()).map(({name}) => name) //フォルダ除外
        .filter(function(file) {
            return path.extname(file).toLowerCase() === '.jsonld'; //拡張子jsonldだけ
        });
        
        // ディレクトリと件数をコンソールに出力
        console.log(currentDir + ": " + fileList.length)

        
        for (const file of fileList) {
          try {
            const inputFilePath = `${currentDir}/${file}`;
            const outputFilePath = `${this.outputDirPath}/${dir}/${file.replace('.jsonld', '.nt')}`;
            
            // console.log(file)
            
            // ディレクトリがなかったら作成
            if (!fs.existsSync(this.outputDirPath + "/" + dir)) {
              fs.mkdirSync(this.outputDirPath + "/" + dir, { recursive: true });
            }
            await this.convertJsonToNtriples(inputFilePath, outputFilePath)
            // const json = JSON.parse(await fs.readFile(inputFilePath, "utf8"))
            // await jsonld.toRDF(json, {format: 'application/n-quads'}).then( async nquads => {
            //   // const outFile = this.outputDirPath + "/" + dir + "/" + file.replace(".jsonld", ".nt")
            //   await fs.writeFile(outputFilePath, nquads);
            // })

          } catch(error) {
            console.log(error)
          }
        }
        
        // 実行時間
        const end = performance.now();
        const duration = end - start
        const time = this.convertMillisecondsToTime(duration)
        console.log(">>>> " + currentDir + " done! (" + time + ")");
      }
      
    }
  }
  
}

const converter = new Json2Ntriple('./data/export/json/building', './data/export/Ntriple/building')
converter.gererateNtriples()

const converterRealEstate = new Json2Ntriple('./data/export/json/realestateid', './data/export/Ntriple/realestateid')
converterRealEstate.gererateNtriples()
