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
      const prompt = await mongo.findOne<Prompt>({ _type: 'prompt' });

      return prompt;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getDefaults`);
    }
  },

  getFilter: async () => {
    const mongo = await db('config');
    const begin = DateMetrics.now();

    try {
      const filter = await mongo.findOne<{ regex: string }>({ _type: 'filter' });

      return filter;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getDefaults`);
    }
  },
};
