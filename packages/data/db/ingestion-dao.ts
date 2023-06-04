import { redis } from "../adapters/redis/rest-client";
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

export type IngestionCounts = {
  date: string,
  count: number,
}

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

  getLatestFromRedis: async () => {
    const begin = DateMetrics.now();

    try {
      return await redis.ingestion.json.get('ingestion:status:summarised:latest') as LatestIds;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.getLatestFromRedis`);
    }
  },

  getByIdsFromRedis: async (ids: string[]) => {
    const begin = DateMetrics.now();

    try {
      const pipeline = redis.ingestion.pipeline();
      ids.forEach(id => {
        pipeline.json.get(`ingestion:paper:summarised:${id}`);
      })
    
      return await pipeline.exec() as Array<SummarisedPaper>;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.getByIdsFromRedis`);
    }
  },

  getByIdFromRedis: async (id: string) => {
    const begin = DateMetrics.now();

    try {
      return await redis.ingestion.json.get(`ingestion:paper:summarised:${id}`) as SummarisedPaper;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] IngestionDao.getByIdFromRedis`);
    }
  },
};

export type LatestIds = {
  date: string, 
  ids: string[]
};

export type SummarisedPaper = {
  ingestionDate: string, 
  id: string, 
  published: string, 
  title: string, 
  summary: string, 
  authors: string[],
  category: {key: string, title: string, category: string},
  link: string,
  qas?: Array<{q: string, a: string}>,
  tage?: string[],
};
