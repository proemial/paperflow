import { Client, PublishJsonRequest } from "@upstash/qstash";
import { Env } from "../env";
import { PipelineStage } from "../redis/redis-client";
import { PipelineDao } from "../../storage/pipeline";

if (!Env.connectors.qstash) {
  throw new Error("[qstash-client] Please fix your environment variables");
}

const client = new Client({
  token: Env.connectors.qstash.token,
});

const publishJSON = async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
  // if (Env.isDev) {
  //   console.log('[DEV] qstash.publishJSON', req);
  //   // @ts-ignore
  //   return Promise.resolve({
  //     messageId: 'fake-message-id'
  //   });
  // };

  try {
    const res = await client.publishJSON(req);
    console.log('[qstash]', res);

    return res;
  } catch(e) {
    console.log('QStash error!');
    throw e;
  }

}

type PublishResponse<PublishRequest> = PublishRequest extends { cron: string }
  ? { scheduleId: string }
  : { messageId: string };

const baseUrl = 'https://ingestion.paperflow.ai/api/workers';

export const QStash = {
  client,

  publishJSON: async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
    return await publishJSON(req);
  },

  schedule: async (date: string, stage: PipelineStage, indices: number[]) => {
    for (let index = 0; index < indices.length; index++) {
      await publishJSON({
        url: `${baseUrl}/${stage}/${date}/${indices[index]}`,
        body: '',
      });
      await PipelineDao.updateStatus(date, stage, indices[index], 'scheduled');
    }
  },
};
