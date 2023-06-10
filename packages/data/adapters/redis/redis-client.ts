import { createClient } from 'redis';
import { Env } from "../env";
import { DateMetrics } from 'utils/date';

// JSON.SET 2023-06-08:pipeline "$.stages.scrape-arxiv[?(@.id=='2305.06356')].status" '"crazy"'
// JSON.ARRAPPEND pipeline:2023-06-08 $.stages.scrapeArxiv '{"id": "2305.06354", "status": "idle"}'

const env = Env.connectors.redis.pipeline;

if (!env) {
  throw new Error("[redis-client] Please fix your environment variables");
}

export const Redis = {
  pipeline: {
    get: async (date: string) => {
      const begin = DateMetrics.now();
      const client = await connect();

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
      const client = await connect();

      try {
        await client.json.SET(`pipeline:${date}`, '$', pipeline);

      } catch (e) {
        console.error(e);
      } finally {
        await closeConnetion(client);
       console.log(`[${DateMetrics.elapsed(begin)}] pipeline.get`);
      }
    },

    pushActions: async (date: string, stage: PipelineStage, actions: ArxivAtomWorker[]) => {
      const begin = DateMetrics.now();
      const client = await connect();
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
  },
};

async function connect() {
  const begin = DateMetrics.now();

  try {
    const client = createClient({
      password: env.password,
      socket: {
          host: env.uri,
          port: 19573
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

export type PipelineConfig = {
  stages: {
    [name: string]: string[]
  }
};

export type Pipeline = {
  stages: {
    arxivAtom: ArxivAtomWorker[]
  }
}

export enum PipelineStage {
  arxivOai = 'arxivOai',
  arxivAtom = 'arxivAtom',
}

export type ArxivAtomWorker = {
  id: string,
  status: WorkerStatus,
};

export type WorkerStatus = 'idle' | 'running' | 'compelete' | 'error'
