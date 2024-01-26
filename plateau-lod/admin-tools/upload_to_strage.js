// const { initializeApp, cert } = require('firebase-admin/app');
// const { getStorage } = require('firebase-admin/storage');
import { config } from 'dotenv'
import { initializeApp, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import { PromisePool } from '@supercharge/promise-pool';

import fs from 'fs'
import path from 'path'

config()
const serviceAccount = JSON.parse(fs.readFileSync(process.env.SERVICE_ACCOUNT))

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://plateau-lod.appspot.com'
});


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

const uploadFile = (bucket, filePath, destination) => {
  return new Promise((resolve, reject) => {
    bucket.upload(filePath, { destination }, (err, file) => {
      if (err) {
        reject(err);
      } else {
        resolve(file);
      }
    });
  });
};

const runDirectory = (prefix, currentDir, fileList) => {
  let counter = 0;
  let c_s = 0;
  let c_e = 0;
  const bucket = getStorage().bucket();
  const time_start = Date.now();
  return new Promise((resolve, reject) => {
    PromisePool.for(fileList)
      .withConcurrency(20)
      .process(async (filename) => {
        if (filename === '.DS_Store') {
          console.log('is DS_Store');
          return {};
        }
        counter += 1;
        // console.log(">> " + currentDir + " > resource: " + fileList.length + " (" + counter + "/" + dirList.length + ")");
        const filePath = path.join(currentDir, filename);
        const destination = `resource/${prefix}${filename}`;
        try {
          await uploadFile(bucket, filePath, destination);
          c_s += 1;
          if (counter % 100 === 0) {
            const millis_spend = Date.now() - time_start;
            console.log("File " + filename + " uploaded successfully. Counter " + counter  + ", spend time " + Math.floor(millis_spend / 1000));
          }
          // console.log(`File ${filename} uploaded successfully.`);
        } catch (uploadErr) {
          c_e += 1;
          console.error('Error uploading file:' + counter + ":" + filename, uploadErr);
        }
        return {}
      })
      .then((result) => {
        const millis_spend = Date.now() - time_start;
        console.log(currentDir + " finished. " + c_s + "/" + counter + " files uploaded. " + c_e + " errors. Spended " + Math.floor(millis_spend / 1000) + "[sec].");
        resolve(true);
      }).catch((err) => {
        reject(err);
      })
  });
};

const importResources = async (dirpath) => {
  const dirList = getDirectories(dirpath);
  const prefix = "plateau:"

  if (dirList && dirList.length > 0) {
    for (const dir of dirList) {
      try {
        const currentDir = path.join(dirpath, dir);
        const fileList = fs.readdirSync(currentDir);
        try {
          await runDirectory(prefix, currentDir, fileList);
        } catch (err) {
          console.error("Directory error:" + dir, err);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
};


// 建物
importResources('./input-resources/building')
// 不動産ID
importResources('./input-resources/realestateid')

  

