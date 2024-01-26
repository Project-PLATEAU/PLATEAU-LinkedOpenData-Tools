import * as functions from 'firebase-functions';
import * as express from 'express';
import {initializeApp} from 'firebase-admin/app';
import {getFirestore} from 'firebase-admin/firestore';
// import * as QueryString from 'querystring';
import {Readable} from 'stream';
import {JsonLdParser} from 'jsonld-streaming-parser';
import rdfSerializer from 'rdf-serialize';
import * as stringifyStream from 'stream-to-string';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors({origin: true}));
initializeApp(functions.config().firebase);

app.get('/resource/:id', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  // const id: string | string[] | QueryString.ParsedQs | QueryString.ParsedQs[] = String(req.params.id) ?? '';
  const id: string | string[] = String(req.params.id) ?? '';
  if (id === '') {
    throw new functions.https.HttpsError('invalid-argument', 'Parameter Error');
  }

  // firebase からデータを取得
  const db = getFirestore();
  const resourceId = 'plateau:' + String(id);
  const bldgRef = db.collection('resource').doc(resourceId);

  try {
    const snapshot = await bldgRef.get();
    const bldgs = snapshot.data();

    if (!bldgs) {
      res.status(404).send(resourceId);
    } else {
      const acceptHeader = req.headers['accept'];

      if (acceptHeader === 'text/turtle') { // turtleの場合
        // let objBldgs = {}
        const objBldgs = {...JSON.parse(JSON.stringify(bldgs))};
        // res.send(objBldgs);
        try {
          const stream = Readable.from(JSON.stringify(objBldgs));
          const jsonLdParser = new JsonLdParser();
          const suadStream = jsonLdParser.import(stream);
          const serialStream = rdfSerializer.serialize(suadStream, {contentType: 'text/turtle'});
          res.type('text/turtle');
          res.send(await stringifyStream(serialStream));
        } catch (e) {
          res.send(e);
        }
      } else if (['application/ld+json', 'application/json'].includes(acceptHeader as string)) { // json-ldの場合
        const objBldgs = {...JSON.parse(JSON.stringify(bldgs))};
        res.type('application/json');
        res.send(objBldgs);
      } else { // defaultはHTMLを表示
        res.redirect('/view/'+id);
      }
    }
  } catch (e) {
    res.status(500).send(e);
  }
  // const bldgs = (await bldgRef.get()).data()
  // if (!bldgs) {
  //   res.status(404).send(resourceId);
  // }
  // acceptHeaderを判定
});

const resource = functions.https.onRequest(app);
module.exports = {resource};
