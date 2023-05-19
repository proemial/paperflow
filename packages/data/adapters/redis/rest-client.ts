import { Redis } from "@upstash/redis";
import { Env } from "../env";

export const redis = {
  ingestion: new Redis({
    url: Env.connectors.redis.ingestion.uri,
    token: Env.connectors.redis.ingestion.token
  }),
  prompts: new Redis({
    url: Env.connectors.redis.prompts.uri,
    token: Env.connectors.redis.prompts.token
  }),
  outputs: new Redis({
    url: Env.connectors.redis.modelOutput.uri,
    token: Env.connectors.redis.modelOutput.token
  }),
};
