import { PromptTemplate } from "@/data/db/config-dao";
import { DateMetrics } from "@/utils/date";
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateCompletionResponseUsage, OpenAIApi } from "openai";

export type GptPrompt = {
  role: ChatCompletionRequestMessageRoleEnum,
  content: string,
};

export type WithTextAndUsage = {
  text?: string,
  usage?: CreateCompletionResponseUsage,
}

const configuration = new Configuration({
  apiKey: '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',
});

const openai = new OpenAIApi(configuration);

export async function gptPrompt(title: string, abstract: string, template: PromptTemplate) {
  const key = `OpenAI[${template.args.model}]`;
  const begin = DateMetrics.now();

  try {
    const completion = await openai.createChatCompletion({
      model: template.args.model,
      messages: createPrompt(title, abstract, template.args.messages),
    });

    return { ...completion.data, text: completion.data.choices[0].message?.content } as WithTextAndUsage;
  } catch (e) {
    console.error(key, DateMetrics.elapsed(begin), e);
    throw e;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] ${key}`);
  }
}

function createPrompt(title: string, abstract: string, messages: Array<GptPrompt>) {
  let tokensFound = false;

  const prompt = messages.map(message => {
    if (message.content.includes('$t') || message.content.includes('$a')) {
      tokensFound = true;
      return {
        ...message,
        content: message.content
          .replaceAll('$t', `${title}`)
          .replaceAll('$a', `${abstract}`),
      };
    }
    return message;
  });
  if (!tokensFound) {
    const lastMessage = messages[messages.length - 1];
    messages[messages.length - 1] = {
      ...lastMessage,
      content: lastMessage.content + ` ${title} ${abstract}`,
    };
  }
  console.log('messages', messages, prompt);


  return prompt;
}
