import { Client, PublishJsonRequest } from "@upstash/qstash";
import { Env } from "../env";
import { PipelineStage } from "../redis/redis-client";

if (!Env.connectors.qstash) {
  throw new Error("[qstash-client] Please fix your environment variables");
}

const client = new Client({
  token: Env.connectors.qstash.token,
});

const publishJSON = async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
  if (Env.isDev) {
    console.log('[DEV] qstash.publishJSON', req);
    // @ts-ignore
    return Promise.resolve({
      messageId: 'fake-message-id'
    });
  };

  const res = await client.publishJSON(req);

  console.log('[qstash]', res);
  return res;
}

type PublishResponse<PublishRequest> = PublishRequest extends { cron: string }
  ? { scheduleId: string }
  : { messageId: string };

export enum Workers {
  scraper = "https://ingestion.paperflow.ai/api/worker/scrape",
  summariser = "https://ingestion.paperflow.ai/api/worker/summarise",
  arxivAtom = "https://ingestion.paperflow.ai/api/workers/arxivAtom"
}

export const QStash = {
  client,

  publishJSON: async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
    return await publishJSON(req);
  },

  publish: async (url: Workers, body: any, args?: string) => {
    return await publishJSON({
      url: !args ? url : `${url}/${args}`,
      body,
    });
  },

  schedule: async (date: string, stage: PipelineStage, index: 0) => {
    return await publishJSON({
      url: `${Workers.arxivAtom}/${date}/${stage}/${index}`,
      body: '',
    });
  },
};
