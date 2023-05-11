import { Client, PublishJsonRequest } from "@upstash/qstash";
import { Env } from "../env";

const client = new Client({
  token: process.env.QSTASH_TOKEN as string,
});

type PublishResponse<PublishRequest> = PublishRequest extends {
  cron: string;
} ? {
  scheduleId: string;
} : {
  messageId: string;
};

export const qstash = {
  client,

  publishJSON: async <R extends PublishJsonRequest = PublishJsonRequest>(req: R): Promise<PublishResponse<R>> => {
    if (Env.isDev) {
      console.log('[DEV] qstash.publishJSON', req);
      // @ts-ignore
      return Promise.resolve({
        messageId: 'fake-message-id'
      });
    };

    return await client.publishJSON(req);
  }
};
