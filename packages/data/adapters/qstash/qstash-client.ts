import { Client, PublishJsonRequest } from "@upstash/qstash";
import { PipelineDao } from "../../storage/pipeline";
import { TemporaryDummyEvent, UserEvent } from "../../storage/users.models";
import { Env } from "../env";
import { PipelineStage } from "../redis/redis-client";

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

const ingestionUrl = 'https://ingestion.paperflow.ai/api/workers';
const paperflowUrl = 'https://paperflow.ai/api';

export const QStash = {
  client,

  publishJSON: async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
    return await publishJSON(req);
  },

  schedule: async (date: string, stage: PipelineStage, indices?: number[]) => {
    if(!indices) {
      await publishJSON({
        url: `${ingestionUrl}/${stage}/${date}`,
        body: '',
      });
      await PipelineDao.updateStatus(date, stage, 0, 'scheduled');
      return;
    }

    for (let index = 0; index < indices.length; index++) {
      await publishJSON({
        url: `${ingestionUrl}/${stage}/${date}/${indices[index]}`,
        body: '',
      });
      await PipelineDao.updateStatus(date, stage, indices[index], 'scheduled');
    }
  },

  postEvent: async (event: string, body: UserEvent | TemporaryDummyEvent) => {
    await publishJSON({
      url: `${paperflowUrl}/events/${event}`,
      body,
    });
  },
};
