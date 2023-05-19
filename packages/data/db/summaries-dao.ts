import { redis } from "../adapters/redis/rest-client";

export const SummariesDao = {
  get: async (paperHash: string, promptHash: string) => {
    return await redis.ingestion.get(`summary:${paperHash}:${promptHash}`);
  },

  set: async (paperHash: string, promptHash: string, summary: string) => {
    return await redis.ingestion.set(`summary:${paperHash}:${promptHash}`, summary);
  },
}