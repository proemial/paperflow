import { db } from "@/data/adapters/mongo/mongo-client";
import { DateMetrics } from "@/utils/date";

type IngestionIds = {
  hits: string[],
  misses: string[],
};

export type IngestionEntry = {
  date: string,
  ids: IngestionIds,
};

export const IngestionDao = {
  getOrCreate: async (date: string) => {
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
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.getOrCreate`);
    }
  },

  update: async (date: string, ingestionEntry: IngestionEntry) => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      await mongo.updateOne({ date }, { $set: ingestionEntry });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.update`);
    }
  },
};
