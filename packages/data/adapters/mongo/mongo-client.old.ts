import { MongoClient } from 'mongodb';
import { Env } from '../env';

const uri = Env.connectors.mongo.uri.old;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (Env.isDev) {
  // Handle hot reload

  let globalWithMongoClientPromise = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>;
  };
  if (!globalWithMongoClientPromise._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongoClientPromise._mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongoClientPromise._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export const dbOld = async (collection: string) => {
  try {
    return (await clientPromise).db("paperflow").collection(collection);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export default clientPromise;
