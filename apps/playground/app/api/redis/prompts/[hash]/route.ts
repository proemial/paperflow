import { logError, logMetric, now } from "utils/metrics";
import { NextResponse } from "next/server";
import { UpStash } from "data/adapters/redis/upstash-client";

export async function GET(request: Request, { params }: { params: { hash: string } }) {
  const key = `Redis[GET:prompts/${params.hash}]`;
  const begin = now();

  try {
    const cached = await UpStash.prompts.get(params.hash);
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
  const key = `Redis[SET:prompts/${params.hash}]`;
  const begin = now();

  try {
    const data = await request.json();
    const output = await UpStash.prompts.set(params.hash, data);

    return NextResponse.json(output);
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
