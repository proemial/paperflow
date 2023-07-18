import { db } from "../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";

export type UserPaper = {
  user: string,
  paper: string,
  updatedAt: string,
  viewCount?: number,
  category?: string,
  bookmarked?: boolean,
  likes?: string[],
}

export const ViewHistoryDao = {
  upsert: async (user: string, paper: string, category: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.findOneAndUpdate(
        {user, paper},
        {$inc: {viewCount: 1}, $set: {updatedAt: new Date(), viewedAt: new Date(), category}},
        {upsert: true, returnDocument: 'after'});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.upsert`);
    }
  },

  get: async (user: string, paper: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      return await mongo.findOne<UserPaper>({user, paper});
      // if(hit) return hit;

      // return await mongo.findOneAndUpdate(
      //   {user, paper},
      //   {$set: {viewCount: 0, updatedAt: new Date()}},
      //   {upsert: true, returnDocument: 'after'});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      // console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.get`);
    }
  },

  bookmarked: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      const result = mongo.find<UserPaper>(
        {user, bookmarked: true},
        {sort: {bookmarkedAt: -1}}
      );
      return await result.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.get`);
    }
  },

  readHistory: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      const result = mongo.find<UserPaper>(
        {user, viewCount: {$exists: true}},
        {sort: {viewedAt: -1}}
      );
      return await result.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.get`);
    }
  },

  bookmark: async (user: string, paper: string, bookmarked: boolean) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.findOneAndUpdate(
        {user, paper},
        {$set: {updatedAt: new Date(), bookmarkedAt: new Date(), bookmarked}},
        {upsert: true});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.bookmark`);
    }
  },

  like: async (user: string, paper: string, likes: string[]) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.findOneAndUpdate(
        {user, paper},
        {$set: {updatedAt: new Date(), likes}});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] ViewHistoryDao.like`);
    }
  },
};
