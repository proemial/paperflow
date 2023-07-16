import { DateMetrics } from "utils/date";
import { PipelineConfig, Redis, PromptConfig, Model } from "../adapters/redis/redis-client";
import { Log } from "utils/log";

export const ConfigDao = {
    getPipelineConfig: async () => {
        const begin = DateMetrics.now();

        try {
          return await Redis.config.get('pipeline') as PipelineConfig;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `ConfigDao.getPipelineConfig`);
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
          Log.metrics(begin, `ConfigDao.getPromptConfig`);
        }
    },

    getPaperbotConfig: async () => {
        const begin = DateMetrics.now();

        try {
          return await Redis.config.get('paperbot') as {model: Model};
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `ConfigDao.getPapepbotConfig`);
        }
    },
};
