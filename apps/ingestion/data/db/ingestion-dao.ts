import { db } from "@/data/adapters/mongo/mongo-client";
import { DateMetrics } from "@/utils/date";

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
    const begin = DateMetrics.now();

    try {
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
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.upsert`);
    }
  },

  update: async (date: string, ingestionEntry: IngestionEntry) => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      await mongo.updateOne({ date }, { $set: ingestionEntry });
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.update`);
    }
  },
};
