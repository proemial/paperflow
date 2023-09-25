import { Log } from "utils/log";
import { dbOld } from "@/adapters/mongo/mongo-client.old";
import { DateMetrics } from "utils/date";
import { User, UserEvent, UserEventType } from "./users.models";

// https://auth0.com/docs/manage-users/user-migration/bulk-user-exports

export const UsersDao  = {
    upsert: async (user: UserEvent) => {
      const mongo = await dbOld('users');
      const begin = DateMetrics.now();

      const now = new Date();

      try {
        const result = await mongo.findOneAndUpdate(
          {id: user.id},
          {
            $inc: getStatIncrement(user.event),
            $set: {info: user.info, updatedAt: now},
            $setOnInsert: {createdAt: now, waitlistEmail: user.waitlistEmail}
          },
          {upsert: true, returnDocument: 'after'});

        return result?.value;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'UsersDao.upsert');
      }
    },

    updateReadStats: async (userId: string) => {
      const history = await dbOld('history');
      const users = await dbOld('users');
      const begin = DateMetrics.now();

      const now = new Date();

      try {
        const reads = await history.countDocuments({user: userId})
        await users.findOneAndUpdate(
          {id: userId},
          {
            $set: {updatedAt: now, "stats.reads": reads},
          }
        );

      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'UsersDao.updateReadStats');
      }
    },

    get: async (id: string) => {
      const mongo = await dbOld('users');
      const begin = DateMetrics.now();

      try {
        return await mongo.findOne<User>({id});
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'UsersDao.get');
      }
    },

    getByIds: async (ids: string[]) => {
      const mongo = await dbOld('users');
      const begin = DateMetrics.now();

      try {
        const result = mongo.find<User>({id: {$in: ids}});
        return await result.toArray();
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        Log.metrics(begin, 'UsersDao.getByIds');
      }
    },
}

function getStatIncrement(type: UserEventType) {
    const stat = {} as any;
    stat[`stats.${type}s`] = 1;

    // $inc: {logins: 1}
    return stat;
}
