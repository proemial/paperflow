import { DateMetrics } from "utils/date";
import { Log } from "utils/log";
import { UpStash } from "../adapters/redis/upstash-client";

type Suggestions = {
  id: string,
  suggestions: string[],
}

export const BotDao = {
  getSuggestions: async (id: string) => {
    const begin = DateMetrics.now();

    try {
      return await UpStash.papers.get(`${id}:gpt-4:suggestions`) as Suggestions | undefined;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, `PapersDao.getSuggestions`);
    }
  },

  pushSuggestions: async (id: string, suggestions: string[]) => {
    const begin = DateMetrics.now();

    try {
      await UpStash.papers.set(`${id}:gpt-4:suggestions`, {suggestions, id});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, `PapersDao.pushSuggestions`);
    }
  },
};
