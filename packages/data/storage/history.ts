import { Log } from "utils/log";
import { db } from "../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";
import { ObjectId } from "mongodb";

export type UserPaper = {
  user: string,
  paper: string,
  updatedAt: string,
  viewCount?: number,
  category?: string,
  bookmarked?: boolean,
  bookmarkedAt?: string,
  likes?: string[],
  likedAt?: string,
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
      Log.metrics(begin, 'ViewHistoryDao.upsert');
    }
  },

  get: async (user: string, paper: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      return await mongo.findOne<UserPaper>({user, paper});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.get');
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
      Log.metrics(begin, 'ViewHistoryDao.bookmarked');
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
      Log.metrics(begin, 'ViewHistoryDao.readHistory');
    }
  },

  fullHistory: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      const result = mongo.find<UserPaper>(
        {user},
        {sort: {viewedAt: -1}}
      );
      return await result.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, `PapersDao.fullHistory`);
    }
  },

  clearFullHistory: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.deleteMany({user});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.clearFullHistory');
    }
  },

  bookmark: async (user: string, paper: string, category: string, bookmarked: boolean) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.findOneAndUpdate(
        {user, paper},
        {$set: {updatedAt: new Date(), bookmarkedAt: new Date(), bookmarked, category}},
        {upsert: true});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.bookmark');
    }
  },

  clearBookmarks: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.updateMany(
        {user},
        {$unset: { bookmarked: "", bookmarkedAt: "" }});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.clearBookmarks');
    }
  },

  like: async (user: string, paper: string, category: string, text: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      // Only create entry if the liked tag is not in another entry
      const result = await mongo.findOne<UserPaper>({user, likes: {$in: [text]}});
      if(!result) {
        await mongo.insertOne({
          user, paper, category,
          updatedAt: new Date(),
          likedAt: new Date(),
          likes: [text]
        });
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.like');
    }
  },

  unlike: async (user: string, text: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      // Delete like from all papers
      const result = await (
        await mongo.find<UserPaper & {_id: ObjectId}>({user, likes: {$in: [text]}})
      ).toArray();
      for (const entry of result) {
        await mongo.findOneAndUpdate(
          {_id: entry._id},
          {$set: {
            updatedAt: new Date(),
            likedAt: new Date(),
            likes: entry.likes?.filter(l => l !== text),
          }});
      }
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.unlike');
    }
  },

  clearLikes: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      await mongo.updateMany(
        {user},
        {$unset: { likes: "", likedAt: "" }});
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.clearLikes');
    }
  },

  liked: async (user: string) => {
    const mongo = await db('history');
    const begin = DateMetrics.now();

    try {
      const result = mongo.find<UserPaper>(
        {user, likes: {$exists: true}},
        {sort: {likedAt: -1}}
      );
      return await result.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, 'ViewHistoryDao.liked');
    }
  },
};
