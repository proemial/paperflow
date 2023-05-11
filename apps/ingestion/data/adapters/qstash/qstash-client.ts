import { Client, PublishJsonRequest } from "@upstash/qstash";
import { Env } from "../env";

const client = new Client({
  token: process.env.QSTASH_TOKEN as string,
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
  summarizer = "https://ingestion.paperflow.ai/api/worker/summarize",
}

export const qstash = {
  client,

  publishJSON: async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
    return await publishJSON(req);
  },

  publish: async (worker: Workers, body: any) => {
    return await publishJSON({
      url: worker,
      body,
    });
  }
};
