import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from "openai";
import { logError, logMetric, now } from "@/utils/metrics";
import { NextResponse } from "next/server";
import { CreateCompletionResponseUsage } from "openai/api";

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

type Prompt = {
  model: string,
  temperature: number,
  maxTokens: number,
  prompt: string,
  text: string,
  role: string,
}

export type WithTextAndUsage = {
  text?: string,
  usage?: CreateCompletionResponseUsage,
}

export async function POST(request: Request) {
  console.log('Extracting prompt from request');
  const prompt = await request.json();

  console.log('Prompt extracted, sending to OpenAI');
  const completion = prompt.model === 'text-davinci-003'
    ? await davinciPrompt(prompt)
    : await gptPrompt(prompt);

  return NextResponse.json(completion);
}

async function davinciPrompt({ text, maxTokens, temperature, model }: Prompt) {
  const key = `OpenAI[${model}/${temperature}/${maxTokens}]`;
  const begin = now();

  try {
    console.log('Creating completion');
    const completion = await openai.createCompletion({
      model,
      temperature,
      max_tokens: maxTokens,
      prompt: createPrompt(text),
    });

    return { ...completion.data, text: completion.data.choices[0].text } as WithTextAndUsage;
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function gptPrompt({ text, model, role }: Prompt) {
  const key = `OpenAI[${model}/${role}]`;
  const begin = now();

  try {
    const completion = await openai.createChatCompletion({
      model: model,
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.System,
          content: role,
        },
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content: createPrompt(text),
        }
      ],
    });

    return { ...completion.data, text: completion.data.choices[0].message?.content } as WithTextAndUsage;
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

function createPrompt(abstract: string) {
  return `Write an extremely short summary of the following text in the style of an engaging tweet "${abstract}"`;
}
