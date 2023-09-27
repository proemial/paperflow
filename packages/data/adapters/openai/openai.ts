import { PromptTemplate } from "../../storage/v1/config-dao";
import { DateMetrics } from "utils/date";
import { ChatCompletionRequestMessageRoleEnum, Configuration, CreateCompletionResponseUsage, OpenAIApi } from "openai";
import { Env } from "../env";

if (!Env.connectors.openai) {
  throw new Error("[openai-client] Please fix your environment variables");
}

export type GptPrompt = {
  role: ChatCompletionRequestMessageRoleEnum,
  content: string,
};

export type WithTextAndUsage = {
  text?: string,
  usage?: CreateCompletionResponseUsage,
}

const configuration = new Configuration({
  apiKey: Env.connectors.openai.apiKey,
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
    console.log('completion.data', completion.data);


    return { text: completion.data.choices[0].message?.content, usage: completion.data.usage } as WithTextAndUsage;
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
