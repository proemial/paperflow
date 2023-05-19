import { redis } from 'data/adapters/redis/rest-client';
import { NextResponse } from "next/server";
import { logError, logMetric, now } from "utils/metrics";

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const key = `Redis[GET:model-outputs/${params.hash}]`;
  const begin = now();

  try {
    const cached = await redis.outputs.get(params.hash);
    if (cached)
      console.log(`CACHE HIT: ${key}`);

    return NextResponse.json(cached);
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

export async function PUT(request: Request, { params }: { params: { hash: string } }) {
  const key = `Redis[SET:model-outputs/${params.hash}]`;
  const begin = now();

  try {
    const data = await request.json();
    const output = await redis.outputs.set(params.hash, data);

    return NextResponse.json(output);
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
