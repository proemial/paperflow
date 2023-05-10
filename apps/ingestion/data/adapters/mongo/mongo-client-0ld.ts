import { MongoClient } from 'mongodb';
import { elapsed, now } from '../../../utils/date';

type Db = {
  connected: boolean,
  client?: MongoClient,
}

const db: Db = {
  connected: false,
}

let closeRequested = now();

function client(): MongoClient {
  const begin = now();

  db.client = new MongoClient(process.env.MONGO_CONNECTSTRING as string);
  db.client.on('open', () => {
    db.connected = true;
    console.log(`[${elapsed(begin)}] DB connected`);
  });
  db.client.on('topologyClosed', () => {
    db.connected = false;
    console.log(`[${elapsed(closeRequested)}] DB closed`);
  });

  return db.client;
}

export const mongoOld = {
  client: client(),

  close: () => {
    if (db.connected) {
      closeRequested = now();
      db.client?.close()
    }
  },

  collections: {
    demo: () => client().db('paperflow').collection('demo'),
  }
}