import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { logError, logMetric, now } from "@/utils/metrics";

const url = process.env.REDIS_PROMPTS_URL as string;
const token = process.env.REDIS_PROMPTS_TOKEN as string;

const redis = new Redis({ url, token });

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const key = `Redis[GET:prompts/${params.hash}]`;
  const begin = now();

  try {
    const cached = await redis.get(params.hash);
    if(cached)
      console.log(`CACHE HIT: ${key}`);

    return NextResponse.json(cached);
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

export async function PUT(request: Request, { params }: { params: { hash: string } }) {
  const key = `Redis[SET:prompts/${params.hash}]`;
  const begin = now();

  try {
    const data = await request.json();
    const output = await redis.set(params.hash, data);

    return NextResponse.json(output);
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
