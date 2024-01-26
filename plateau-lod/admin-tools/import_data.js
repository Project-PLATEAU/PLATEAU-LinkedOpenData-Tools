import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore, GeoPoint } from 'firebase-admin/firestore'

config()
const serviceAccount = JSON.parse(fs.readFileSync(process.env.SERVICE_ACCOUNT))
initializeApp({ credential: cert(serviceAccount) })
const db = getFirestore();

const convertMillisecondsToTime = (milliseconds) => {
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

// ディレクトリ一覧を取得
const getDirectories = (inputDir) => {
      
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

const putData = async (ref, data) => {
  await ref.set(data)
}

const importResourecs = (path) => {
  
  const dirList = getDirectories(path)
  
  if (dirList && dirList.length > 0) {


    dirList.forEach( async dir => {
      
      // 実行時間をはかっておく
      const start = performance.now();
      
      const currentDir = path + "/" + dir
      const fileList = fs.readdirSync(currentDir)
      
      let counter = 0
      
      counter += 1
      console.log(">> " + currentDir + " > resource: " + fileList.length + " (" + counter + "/" + dirList.length + ")")
  
      for (const filename of fileList) {
        const json = JSON.parse(fs.readFileSync(currentDir + "/" + filename, "utf8"))
        const bldgRef = db.collection('resource').doc(json['@id'])
          
        if (json['schema:geo']) {
          json['geo'] = new GeoPoint(json['schema:geo']['schema:latitude']['@value'], json['schema:geo']['schema:longitude']['@value'])
        }
          
        await putData(bldgRef, json)
          
      }
      
      // 実行時間
      const end = performance.now();
      const duration = end - start
      const time = convertMillisecondsToTime(duration)
      console.log(">>>> " + currentDir + " done! (" + time + ")");
      
    })
    
  }
}

// 建物
importResourecs('./input-resources/building')
// 不動産ID
importResourecs('./input-resources/realestateid')

  

