import dayjs from "dayjs";
import utc from "dayjs-plugin-utc";
import "dayjs/plugin/utc";

export function now() {
  return new Date().getTime();
}

export function yesterday() {
  dayjs.extend(utc);
  return dayjs.utc().subtract(1, 'day').set('hour', 0).set('minute', 0).set('second', 0);
}

export const fetchData = async (url: string) => {
  const begin = now();
  try {
    return await fetch(url);
  } finally {
    const elapsed = now() - begin;
    console.log(`[${elapsed}] ${url}`);
  }
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function splitIntoBuckets(inputArray: string[], bucketSize: number): string[][] {
  const buckets: string[][] = [];
  for (let i = 0; i < inputArray.length; i += bucketSize) {
    const bucket: string[] = inputArray.slice(i, i + bucketSize);
    buckets.push(bucket);
  }
  return buckets;
}
