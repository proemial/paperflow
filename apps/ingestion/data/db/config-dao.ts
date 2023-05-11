import { db } from "@/data/adapters/mongo/mongo-client";
import { DateMetrics } from "@/utils/date";

export type Prompt = {
  hash: string,
  args: {
    [key: string]: string,
  }
}

export function asOpenAIPrompt({ args }: Prompt) {
  return {
    model: args.model,
    prompt: args.prompt,
    role: args.role,
  }
}

export const ConfigDao = {
  getPrompt: async () => {
    const mongo = await db('config');
    const begin = DateMetrics.now();

    try {
      const prompts = await mongo.findOne<Prompt>({ _type: 'prompt' });

      return prompts;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getDefaults`);
    }
  },
};
