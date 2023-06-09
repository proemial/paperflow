import dayjs from "dayjs";
import { QStash } from "../adapters/redis/qstash-client";

export const IngestionLogger = {
    log: async (msg: string) => {
      await QStash.ingestionLog.append(
        dayjs().subtract(1, 'day').format("YYYY-MM-DD"), 
        `[${dayjs().subtract(1, 'day').format("HH:mm:ss")}] ${msg} \n`
      )
    },
};
