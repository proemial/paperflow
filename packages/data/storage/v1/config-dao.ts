import { dbOld } from "../../adapters/mongo/mongo-client.old";
import { DateMetrics } from "utils/date";
import { GptPrompt } from "../../adapters/openai/openai";

export type PromptTemplate = {
  hash: string,
  args: {
    model: string,
    messages: Array<GptPrompt>,
  }
}

export const ConfigDao = {
  getPrompt: async () => {
    const mongo = await dbOld('config');
    const begin = DateMetrics.now();

    try {
      const prompt = await mongo.findOne<PromptTemplate>({ _type: 'prompt' });

      return prompt;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PromptDao.getDefaults`);
    }
  },

  getFilter: async () => {
    const mongo = await dbOld('config');
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
