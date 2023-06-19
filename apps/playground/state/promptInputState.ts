import { ChatCompletionRequestMessageRoleEnum } from "openai";
import { atomFamily } from "recoil";

export type GptInput = {
  category: {
    key: string,
    title: string,
    category: string,
  },
  count: number,
  gpt4: boolean,
  messages: Array<{
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
  }>,
}

export const gptInputState = atomFamily<GptInput | undefined, string>({
  key: 'gptInputState',
  default: undefined,
});

export type DavinciInput = {
  category: {
    key: string,
    title: string,
    category: string,
  },
  model: string,
  count: number,
  temperature: number,
  maxTokens: number,
  role: string,
  prompt: string,
}

export const davinciInputState = atomFamily<DavinciInput | undefined, string>({
  key: 'davinciInputState',
  default: undefined,
});
