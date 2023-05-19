import { db } from "../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";

type IngestionIds = {
  newIds: string[],
  hits: string[],
  misses: string[],
};

export type IngestionState = {
  date: string,
  ids: IngestionIds,
};

export const IngestionDao = {
  get: async (date: string) => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      const ingestionEntry = await mongo.findOne<IngestionState>({ date });

      return ingestionEntry || undefined;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.get`);
    }
  },

  getOrCreate: async (date: string) => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      let ingestionEntry = await mongo.findOne<IngestionState>({ date });
      if (!ingestionEntry) {
        ingestionEntry = {
          date,
          ids: {
            newIds: [],
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

  update: async (date: string, ingestionEntry: IngestionState) => {
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
