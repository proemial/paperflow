import { DateMetrics } from "utils/date";
import { PipelineConfig, Redis } from "../adapters/redis/redis-client";

export const ConfigDao = {
    get: async () => {
        const begin = DateMetrics.now();

        try {
          return await Redis.config.get() as PipelineConfig;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] ConfigDao.get`);
        }
    },
};
