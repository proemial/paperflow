import { db } from "../../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";
import { IngestionState } from "./ingestion-models";

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

  getLatest: async () => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      const ingestionEntry = await mongo.findOne<IngestionState>(
        { "ids.hits": { $exists: true, $not: { $size: 0 } } },
        { sort: { _id: -1 } }
      );

      return ingestionEntry || undefined;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.get`);
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

  getCounts: async () => {
    const mongo = await db('ingestion');
    const begin = DateMetrics.now();

    try {
      const ingestionEntriesCursor = mongo.find<IngestionState>({}, { sort: { _id: -1 } });
      const ingestionEntries = await ingestionEntriesCursor.toArray();

      return ingestionEntries.map(entry => ({
        date: entry.date,
        count: entry.ids.hits.length,
      })) || [];
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.get`);
    }
  },
};
