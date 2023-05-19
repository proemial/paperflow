import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";
import "dayjs/plugin/utc";

export const DateMetrics = {
  now: () => new Date().getTime(),
  elapsed: (begin: number) => DateMetrics.now() - begin,
}

export const DateFactory = {
  yesterday: () => {
    dayjs.extend(utc);
    return dayjs.utc().subtract(2, 'day').set('hour', 0).set('minute', 0).set('second', 0);
  },
}

export const DateFormat = {
  now: () => dayjs().format("YYYY-MM-DD HH:mm:ss.SSS"),
  today: () => dayjs().format("YYYY-MM-DD"),
}
