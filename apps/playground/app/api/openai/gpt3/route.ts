import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import { logError, logMetric, now } from "@/utils/metrics";
import { NextResponse } from "next/server";
import { CreateCompletionResponseUsage } from "openai/api";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

type Prompt = {
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

async function gptPrompt({ messages }: Prompt) {
  const key = `OpenAI[${messages.length}]`;
  const begin = now();

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
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
