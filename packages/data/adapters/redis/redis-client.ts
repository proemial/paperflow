import { createClient } from 'redis';
import { Env } from "../env";
import { DateMetrics } from 'utils/date';

const pipelineEnv = Env.connectors.redis.pipeline;
const configEnv = Env.connectors.redis.config;

if (!pipelineEnv || !configEnv) {
  throw new Error("[redis-client] Please fix your environment variables");
}

export const Redis = {
  config: {
    get: async () => {
      const begin = DateMetrics.now();
      console.log('configEnv', configEnv);

      const client = await connect(configEnv);

      try {
        return await client.json.GET('ingestion') as PipelineConfig;
      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.get`);
      }
    },
  },
  pipeline: {
    get: async (date: string) => {
      const begin = DateMetrics.now();
      const client = await connect(pipelineEnv);

      try {
        return await client.json.GET(`pipeline:${date}`) as Pipeline;

      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.get`);
      }
    },

    set: async (date: string, pipeline: Pipeline) => {
      const begin = DateMetrics.now();
      const client = await connect(pipelineEnv);

      try {
        await client.json.SET(`pipeline:${date}`, '$', pipeline);

      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.get`);
      }
    },

    pushActions: async (date: string, stage: PipelineStage, actions: ArxivAtomWorker[] | GptSummaryWorker[]) => {
      const begin = DateMetrics.now();
      const client = await connect(pipelineEnv);
      try {
        const batch = client.multi();
        actions.forEach(action => {
          batch.json.ARRAPPEND(`pipeline:${date}`, `$.stages.${stage}`, action);
        })
        await batch.execAsPipeline();

      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.pushActions`);
      }
    },

    updateStatus: async (date: string, stage: PipelineStage, index: number, status: WorkerStatus) => {
      const begin = DateMetrics.now();
      const client = await connect(pipelineEnv);

      try {
        // JSON.SET 2023-06-08:pipeline "$.stages.scrape-arxiv[?(@.id=='2305.06356')].status" '"crazy"'
        await client.json.SET(`pipeline:${date}`, `$.stages.${stage}[${index}].status`, status);

      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.get`);
      }
    },
  },
};

async function connect(env: {uri: string, password: string, port: number}) {
  const begin = DateMetrics.now();

  try {
    const client = createClient({
      password: env.password,
      socket: {
          host: env.uri,
          port: env.port
      }
    });
    await client.connect();

    return client;
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] redis.connect`);
  }
}

async function closeConnetion(client: any) {
  const begin = DateMetrics.now();

  try {
    await client.quit();
  } catch (e) {
    console.error(e);
    throw e;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] redis.close`);
  }
}

export enum PipelineStage {
  arxivOai = 'arxivOai',
  arxivAtom = 'arxivAtom',
  gptSummary = 'gptSummary',
  relatedPapers = 'relatedPapers',
}

export type Pipeline = {
  stages: {
    arxivOai: ArxivAtomWorker[],
    arxivAtom: ArxivAtomWorker[],
    gptSummary: GptSummaryWorker[],
  }
}

export type ArxivAoiWorker = {
  status: WorkerStatus,
};

export type ArxivAtomWorker = {
  ids: string, // comma separated to support the redis ui
  status: WorkerStatus,
};

export type GptSummaryWorker = {
  payload: GptSummaryPayload,
  status: WorkerStatus,
};

export type GptSummaryPayload = {
  id: string,
  size: 'sm';// | 'md' | 'lg',
};

export type WorkerStatus = 'idle' | 'scheduled' | 'running' | 'compelete' | 'error'

export type PipelineConfig = {
  stages: {
    [name: string]: PipelineStageConfig,
  }
};

export type PipelineStageConfig = {
  [key: string]: string | number,
}
