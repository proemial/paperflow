import dayjs from "dayjs";
import { UpStash } from "../adapters/redis/upstash-client";

export const IngestionLogger = {
    log: async (msg: string) => {
      await UpStash.ingestionLog.append(
        dayjs().subtract(1, 'day').format("YYYY-MM-DD"), 
        `[${dayjs().subtract(1, 'day').format("HH:mm:ss")}] ${msg} \n`
      )
    },
};
