import dayjs from "dayjs";
import { UpStash } from "../adapters/redis/upstash-client";

export const IngestionLogger = {
    log: async (date: string, msg: string) => {
      await UpStash.ingestionLog.append(
        date, 
        `[${dayjs().format("DD.MM.YYYY HH:mm:ss")}] ${msg} \n`
      )
    },
};
