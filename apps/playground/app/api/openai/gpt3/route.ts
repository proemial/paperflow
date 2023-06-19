import { Env } from 'data/adapters/env';
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import { logError, logMetric, now } from "utils/metrics";
import { NextResponse } from "next/server";
import { CreateCompletionResponseUsage } from "openai/api";

const configuration = new Configuration({
  apiKey: Env.connectors.openai.apiKey,
});
const openai = new OpenAIApi(configuration);

type Prompt = {
  gpt4: boolean,
  messages: Array<{
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
  }>,
}

export type WithTextAndUsage = {
  text?: string,
  usage?: CreateCompletionResponseUsage,
}

export async function POST(request: Request) {
  console.log('Extracting prompt from request');
  const prompt = await request.json();

  console.log('Prompt extracted, sending to OpenAI');
  const completion = await gptPrompt(prompt);

  return NextResponse.json(completion);
}

async function gptPrompt({ messages, gpt4 }: Prompt) {
  const key = `OpenAI[${messages.length}]`;
  const begin = now();

  try {
    const completion = await openai.createChatCompletion({
      model: gpt4 ? 'gpt-4' : 'gpt-3.5-turbo',
      messages,
    });

    return { ...completion.data, text: completion.data.choices[0].message?.content } as WithTextAndUsage;
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
