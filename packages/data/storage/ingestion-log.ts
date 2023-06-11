import dayjs from "dayjs";
import { UpStash } from "../adapters/redis/upstash-client";

// @ts-ignore
import dayjsPluginUTC from 'dayjs-plugin-utc'
dayjs.extend(dayjsPluginUTC)

export const IngestionLogger = {
    log: async (date: string, msg: string) => {
      console.log(msg);

      await UpStash.ingestionLog.append(
        date,
        `[${dayjs().utcOffset(120).format("DD.MM.YYYY HH:mm:ss")}] ${msg} \n`
      )
    },
};
