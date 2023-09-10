import { Log } from "utils/log";
import { db } from "../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";

export type Conversation = {
    paper: string,
    messages: Message[],
}

export type Message = {
    createdAt: string,
    text: string,
    user?: string,
    replies?: Message[],

    role?: "question" | "answer" | "suggestion" | undefined,
    visibility?: 'public' | 'private' | undefined,
    scores?: {
        [key: string]: number,
    },
}

export const ConversationsDao = {
    upsertMessage: async (paper: string, message: Message) => {
      const mongo = await db('conversations');
      const begin = DateMetrics.now();

      try {
        return await mongo.findOneAndUpdate(
          {paper},
          // @ts-ignore
          {$push: {messages: message}},
          {upsert: true, returnDocument: 'after'});
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'ConversationsDao.upsert');
      }
    },

    updateWithReply: async (paper: string, index: number, message: Message) => {
      const mongo = await db('conversations');
      const begin = DateMetrics.now();

      try {
        return await mongo.findOneAndUpdate(
          {paper},
          // @ts-ignore
          {$push: {'messages.$[element].replies': message}},
          {arrayFilters: [ { element: index } ], returnDocument: 'after'});
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'ConversationsDao.upsert');
      }
    },

    get: async (paper: string, user?: string) => {
      const mongo = await db('conversations');
      const begin = DateMetrics.now();

      try {
        const result = mongo.aggregate<Conversation>([
            {$match: {paper}},
            {$project: {
                messages: {
                    $filter: {
                      input: "$messages",
                      as: "messages",
                      cond: {
                        $or: [
                          {$eq: ["$$messages.visibility", "public"]},
                          user && {$eq: ["$$messages.user", user]} // optional
                        ]
                      }
                    }
                  }
            }}
        ])
        return await result.next();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'ConversationsDao.get');
      }
    },
}
