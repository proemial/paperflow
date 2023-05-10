import { Redis } from "@upstash/redis";

const url = process.env.REDIS_INGESTION_URL as string;
const token = process.env.REDIS_INGESTION_TOKEN as string;

export const redis = new Redis({ url, token });

  // await redis.json.set('json:1', { foo: 'bar', bar: ['baz'] }, { nx: true });
  // const x = await redis.json.get('json:1');
  // console.log(x);