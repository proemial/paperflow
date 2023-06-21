import { DateMetrics } from "utils/date";
import { Pipeline, Redis, PipelineStage, GptSummaryPayload, GptSummaryWorker, WorkerStatus, UpdateIndex } from "../adapters/redis/redis-client";
import { Log } from "utils/log";

export const PipelineDao = {
    getPipeline: async (date: string) => {
        const begin = DateMetrics.now();

        try {
          const pipelineFromDb = await Redis.pipeline.get(date) as Pipeline;

          if(!pipelineFromDb) {
            const newPipeline = {
                stages: {
                  arxivOai: [],
                  arxivAtom: [],
                  gptSummary: [],
                }
            };
            await Redis.pipeline.set(date, newPipeline);
            await Redis.pipeline.createIndex(date);

            return newPipeline;
          }

          return pipelineFromDb;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.getPipeline`);
        }
    },

    pushArxivIds: async (date: string, ids: string) => {
        const begin = DateMetrics.now();

        try {
            await Redis.pipeline.pushActions(date, PipelineStage.arxivAtom, [{ids, status: 'idle'}]);
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.pushArxivIds`);
        }
    },

    pushGptSummary: async (date: string, payloads: GptSummaryPayload[]) => {
        const begin = DateMetrics.now();

        try {
            await Redis.pipeline.pushActions(date, PipelineStage.gptSummary, payloads.map(payload => ({payload, status: 'idle'})));
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.pushArxivIds`);
        }
    },

    updateStatus: async (date: string, stage: PipelineStage, index: number, status: WorkerStatus) => {
      const begin = DateMetrics.now();

      try {
          await Redis.pipeline.updateStatus(date, stage, index, status);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, `PipelineDao.updateStatus`);
      }
    },

    getIndex: async (date: string) => {
        const begin = DateMetrics.now();

        try {
          return await Redis.pipeline.getIndex(date) as UpdateIndex;
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.getIndex`);
        }
    },

    pushToIndex: async (date: string, category: string, id: string) => {
        const begin = DateMetrics.now();

        try {
            await Redis.pipeline.pushToIndex(date, category, id);
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.pushToIndex`);
        }
    },

    getIngestionIndex: async () => {
        const begin = DateMetrics.now();

        try {
          return (
            await Redis.pipeline.getIngestionIndex() as string[]
          ).sort();
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          Log.metrics(begin, `PipelineDao.getIngestionIndex`);
        }
    },
};
