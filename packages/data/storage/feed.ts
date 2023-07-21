import { UpStash } from "../adapters/redis/upstash-client";
import { DateMetrics } from "utils/date";
import { Log } from "utils/log";

type FeedItem = {
  id: string,
  score: number,
  categories: string[],
  tags: string[]}
;

export const FeedCache = {
    get: async (key: string) => {
      const begin = DateMetrics.now();

      try {
        return await UpStash.feed.get(key) as FeedItem[];
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, `FeedDao.get`);
      }
    },

    push: async (key: string, items: FeedItem[]) => {
      const begin = DateMetrics.now();

      try {
        await UpStash.feed.set(key, items);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, `FeedDao.push`);
      }
    },

    delete: async (key: string) => {
      const begin = DateMetrics.now();

      try {
        const keys = await UpStash.feed.keys(`${key}*`);
        const pipeline = UpStash.feed.pipeline();
        keys.forEach(key => {
          pipeline.del(key);
        })

        await pipeline.exec();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, `FeedDao.get`);
      }
    },
}
