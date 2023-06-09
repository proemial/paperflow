import { Redis } from "@upstash/redis";
import { Env } from "../env";

const {ingestion, prompts, modelOutput, papers, ingestionLog} = Env.connectors.redis;

if (!ingestion || !prompts || !modelOutput || !papers || !ingestionLog) {
  throw new Error("[redis-client] Please fix your environment variables");
}

export const QStash = {
  ingestion: new Redis({
    url: ingestion.uri,
    token: ingestion.token
  }),
  prompts: new Redis({
    url: prompts.uri,
    token: prompts.token
  }),
  outputs: new Redis({
    url: modelOutput.uri,
    token: modelOutput.token
  }),
  papers: new Redis({
    url: papers.uri,
    token: papers.token
  }),
  ingestionLog: new Redis({
    url: ingestionLog.uri,
    token: ingestionLog.token
  }),
};
