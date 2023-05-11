import { DateMetrics } from "@/utils/date";
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateCompletionResponseUsage, OpenAIApi } from "openai";

type Prompt = {
  model: string,
  prompt: string,
  role: string,
}

export type WithTextAndUsage = {
  text?: string,
  usage?: CreateCompletionResponseUsage,
}

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

export async function gptPrompt(text: string, { model, role, prompt }: Prompt) {
  const key = `OpenAI[${model}]`;
  const begin = DateMetrics.now();

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
          content: createPrompt(text, prompt),
        }
      ],
    });

    return { ...completion.data, text: completion.data.choices[0].message?.content } as WithTextAndUsage;
  } catch (e) {
    console.error(key, begin, e);
    throw e;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] ${key}`);
  }
}

function createPrompt(text: string, prompt: string) {
  return `${prompt} "${text}"`;
}
