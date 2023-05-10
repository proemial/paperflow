import { db } from "@/data/adapters/mongo/mongo-client";

export type IngestionEntry = {
  date: string,
  ids: {
    hits: string[],
    misses: string[],
  },
};

export const IngestionDao = {
  upsert: async (date: string) => {
    const mongo = await db('ingestion');

    let ingestionEntry = await mongo.findOne<IngestionEntry>({ date });
    if (!ingestionEntry) {
      ingestionEntry = {
        date,
        ids: {
          hits: [],
          misses: [],
        },
      }
      await mongo.insertOne(ingestionEntry);
    }

    return ingestionEntry;
  },

  update: async (date: string, ingestionEntry: IngestionEntry) => {
    const mongo = await db('ingestion');

    await mongo.updateOne({ date }, { $set: ingestionEntry });
  },
};
