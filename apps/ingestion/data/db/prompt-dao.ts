import { db } from "@/data/adapters/mongo/mongo-client";
import { DateMetrics } from "@/utils/date";

export type Prompt = {
  model: string,
  score: number,
  hash: string,
  default?: boolean,
  args: {
    [key: string]: string,
  }
}

export function asOpenAIPrompt({ model, args }: Prompt) {
  return {
    model,
    prompt: args.prompt,
    role: args.role,
  }
}

export const PromptDao = {
  getAll: async () => {
    const mongo = await db('prompts');
    const begin = DateMetrics.now();

    try {
      const prompts = await mongo.find<Prompt>({});

      return prompts.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getAll`);
    }
  },

  getDefault: async () => {
    const mongo = await db('prompts');
    const begin = DateMetrics.now();

    try {
      const prompts = await mongo.findOne<Prompt>({ default: true });

      return prompts;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getDefaults`);
    }
  },
};
