import { DateMetrics } from '@/utils/date';
import { MongoClient } from 'mongodb';
import { Env } from '../env';

const uri = process.env.MONGO_CONNECT_STRING;
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

export const db = async (collection: string) => {
  const begin = DateMetrics.now();

  try {
    return (await clientPromise).db("paperflow").collection(collection);
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] Mongo connected to ${collection}`);
  }
};

export default clientPromise;