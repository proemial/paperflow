import { NextResponse } from "next/server";
import { Md5 } from "ts-md5";
import { WithTextAndUsage } from "@/app/api/openai/gpt3/route";
import { logError, logMetric, now } from "utils/metrics";
import { ChatCompletionRequestMessageRoleEnum } from "openai";

export const revalidate = 1;

type WithMessages = Array<{
  role: ChatCompletionRequestMessageRoleEnum,
  content: string,
}>;

type Payload = {
  hash: string,
  title: string,
  contentSnippet: string,
  category: string,
  count: number,
  messages: WithMessages,
}

export async function POST(request: Request) {
  const host = request.headers.get('origin');

  const promptData: Payload = await request.json();
  console.log('item/route promptData', promptData);

  let tokensFound = false;
  const messages = promptData.messages.map(message => {
    if (message.content.includes('$t') || message.content.includes('$a')) {
      tokensFound = true;
      return {
        ...message,
        content: message.content
          .replace('$t', promptData.title)
          .replace('$a', promptData.contentSnippet),
      };
    }
    return message;
  });
  if (!tokensFound) {
    const lastMessage = messages[messages.length - 1];
    messages[messages.length - 1] = {
      ...lastMessage,
      content: lastMessage.content + ` "${promptData.title} ${promptData.contentSnippet}"`,
    };
  }
  const promptDataWithArxivData = {
    messages,
  };
  console.log('item/route promptDataWithArxivData', promptDataWithArxivData);

  const hash = Md5.hashStr(JSON.stringify(promptDataWithArxivData));
  console.log('item/route hash', hash);

  const redisOutput = await getFromRedis(hash, host);
  if (redisOutput) {
    return NextResponse.json(redisOutput);
  }

  const openaiOutput = await getFromOpenAI(hash, host, promptDataWithArxivData);
  if (openaiOutput) {
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
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function getFromOpenAI(hash: string, host: string | null, promptData: { messages: WithMessages }) {
  const url = `${host}/api/openai/gpt3/`;
  const key = `POST[${url}]`;
  const begin = now();

  try {
    console.log('promptData', promptData);
    const openaiResponse = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(promptData),
    });
    return await openaiResponse.json() as WithTextAndUsage;
  } catch (e) {
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
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
