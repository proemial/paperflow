import { MongoClient } from 'mongodb';

import { Env } from '../env';

const uri = Env.connectors.mongo.uri.new as string;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

class Singleton {
  private static _instance: Singleton;
  private client: MongoClient;
  private clientPromise: Promise<MongoClient>;
  private constructor() {
    this.client = new MongoClient(uri, options);
    this.clientPromise = this.client.connect();
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._mongoClientPromise = this.clientPromise;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.clientPromise;
  }
}
const clientPromise = Singleton.instance;

export const dbNew = async (collection: string) => {
  try {
    return (await clientPromise).db("paperflow").collection(collection);
  } catch (e) {
    console.error(e);
    throw e;
  }
};

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
