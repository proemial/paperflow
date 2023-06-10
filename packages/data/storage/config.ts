import { DateMetrics } from "utils/date";
import { PipelineConfig, Redis, PromptConfig } from "../adapters/redis/redis-client";

export const ConfigDao = {
    getPipelineConfig: async () => {
        const begin = DateMetrics.now();

        try {
          return await Redis.config.get('pipeline') as PipelineConfig;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] ConfigDao.getPipelineConfig`);
        }
    },

    getPromptConfig: async () => {
        const begin = DateMetrics.now();

        try {
          return await Redis.config.get('prompts') as PromptConfig;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] ConfigDao.getPromptConfig`);
        }
    },
};
