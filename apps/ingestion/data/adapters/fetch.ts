import { DateMetrics } from "../../utils/date";


export const fetchData = async (url: string) => {
  const begin = DateMetrics.now();

  try {
    return await fetch(url);
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] ${url}`);
  }
}
