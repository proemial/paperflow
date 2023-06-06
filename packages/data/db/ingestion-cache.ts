import { DateMetrics } from "utils/date";
import { redis } from "../adapters/redis/rest-client";
import { LatestIds, SummarisedPaper } from "./ingestion-models";

export const IngestionCache = {
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
