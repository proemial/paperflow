import { NextResponse } from "next/server";
import { Md5 } from "ts-md5";
import { WithTextAndUsage } from "@/app/api/openai/route";
import { logError, logMetric, now } from "@/utils/metrics";

export const revalidate = 1;

type Payload = {
  hash: string,
  text: string,
  category: string,
  model: string,
  temperature: number,
  maxTokens: number,
  prompt: string,
  count: number,
}

export async function POST(request: Request) {
  const host = request.headers.get('origin');

  const promptData: Payload = await request.json();
  console.log('item/route promptData', promptData);
  const hash = Md5.hashStr(JSON.stringify(promptData));
  console.log('item/route hash', hash);

  const redisOutput = await getFromRedis(hash, host);
  if(redisOutput) {
    return NextResponse.json(redisOutput);
  }

  const openaiOutput = await getFromOpenAI(hash, host, promptData);
  if(openaiOutput) {
    await addToRedis(hash, host, openaiOutput);
  }

  return NextResponse.json(openaiOutput);
}

async function getFromRedis(hash: string, host: string | null) {
  const url = `${host}/api/redis/model-outputs/${hash}`;
  const key = `GET[${url}]`;
  const begin = now();

  try {
    const redisResult = await fetch(url);
    return await redisResult.json() as WithTextAndUsage;
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function getFromOpenAI(hash: string, host: string | null, promptData: Payload) {
  const url = `${host}/api/openai/`;
  const key = `POST[${url}]`;
  const begin = now();

  try {
    console.log('promptData', promptData);
    const openaiResponse = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(promptData),
    });
    return await openaiResponse.json() as WithTextAndUsage;
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function addToRedis(hash: string, host: string | null, openaiOutput: WithTextAndUsage) {
  const url = `${host}/api/redis/model-outputs/${hash}`;
  const key = `PUT[${url}]`;
  const begin = now();

  try {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(openaiOutput),
    });
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
