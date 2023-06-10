import { DateMetrics } from "utils/date";
import { Pipeline, Redis, PipelineStage } from "../adapters/redis/redis-client";

export const PipelineDao = {
    get: async (date: string) => {
        const begin = DateMetrics.now();

        try {
          const pipelineFromDb = await Redis.pipeline.get(date) as Pipeline;

          if(!pipelineFromDb) {
            const newPipeline = {
                stages: {
                    arxivAtom: [],
                }
            };
            await Redis.pipeline.set(date, newPipeline);

            return newPipeline;
          }

          return pipelineFromDb;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] PipelineDao.get`);
        }
    },

    pushArxivIds: async (date: string, ids: string[]) => {
        const begin = DateMetrics.now();

        try {
            await Redis.pipeline.pushActions(date, PipelineStage.arxivAtom, ids.map(id => ({id, status: 'idle'})))
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
            console.log(`[${DateMetrics.elapsed(begin)}] PipelineDao.pushArxivIds`);
        }
    }
};
