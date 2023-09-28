import { Log } from "utils/log";
import { db } from "../adapters/mongo/mongo-client.new";
import { DateMetrics } from "utils/date";

export type Conversation = {
  paper: string,
  messages: Message[],
}

export type Message = {
  id: string
  createdAt: string,
  content: string,
  role: "system" | "user",

  user?: string,
  visibility?: "public" | "private" | undefined,
  replies?: Message[],
  scores?: {
    [key: string]: number,
  },
}

export const ConversationsDao = {
  upsert: async (paper: string, messageData: Message | Message[]) => {
    const mongo = await db("conversations");
    const begin = DateMetrics.now();

    try {
      const messages = Array.isArray(messageData) ? messageData : [messageData];
      return await mongo.findOneAndUpdate(
        { paper },
        // @ts-ignore
        { $push: { messages: { $each: messages } } },
        { upsert: true, returnDocument: "after" });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, "ConversationsDao.upsert");
    }
  },

  updateWithReply: async (paper: string, index: number, message: Message) => {
    const mongo = await db("conversations");
    const begin = DateMetrics.now();

    try {
      return await mongo.findOneAndUpdate(
        { paper },
        // @ts-ignore
        { $push: { "messages.$[element].replies": message } },
        { arrayFilters: [{ element: index }], returnDocument: "after" });
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, "ConversationsDao.upsert");
    }
  },

  get: async (paper: string, user?: string) => {
    const mongo = await db("conversations");
    const begin = DateMetrics.now();

    try {
      const result = mongo.aggregate<Conversation>([
        { $match: { paper } },
        {
          $project: {
            messages: {
              $filter: {
                input: "$messages",
                as: "messages",
                cond: {
                  $or: [
                    { $eq: ["$$messages.visibility", "public"] },
                    user && { $eq: ["$$messages.user", user] } // optional
                  ]
                }
              }
            }
          }
        }
      ]);
      return await result.next();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      Log.metrics(begin, "ConversationsDao.get");
    }
  }
};
