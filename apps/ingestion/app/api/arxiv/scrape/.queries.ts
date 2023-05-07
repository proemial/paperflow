import { ArxivItem } from "@/app/api/arxiv/scrape/.model";
import dayjs from "dayjs";
import { fetchData, sleep, splitIntoBuckets } from "./.utils";
import { parseArxiv, parseOai } from "./.parser";

const idsByDate = (date: string) => `https://export.arxiv.org/oai2?verb=ListIdentifiers&from=${date}&until=${date}&metadataPrefix=arXivRaw`;
const papersByIds = (ids: string) => `https://export.arxiv.org/api/query?id_list=${ids}&max_results=50`;

export async function fetchUpdatedIds(date: string) {
  const result = await fetchData(idsByDate(date));
  const data = await result.text();
  console.log('data', data);


  return parseOai(data)
}

export async function fetchUpdatedItems(ids: string[], limit: dayjs.Dayjs) {
  const output: Array<ArxivItem> = [];

  const buckets = splitIntoBuckets(ids, 50);
  const maxBucketCount = buckets.length;

  // 3. Fetch all new items from query endpoint, using id_list
  let count = 0;
  while (count++ < maxBucketCount) {
    const result = await fetchByIds(buckets[count - 1].join(','));

    result.forEach((item, i) => {
      if (item.updated.getTime() >= limit.valueOf()) {
        output.push(item);
      }
    })

    if (count < maxBucketCount)
      await sleep(100);
  }

  return output.sort((a, b) => (b.updated as Date).getTime() - (a.updated as Date).getTime());
}

async function fetchByIds(ids: string) {
  const result = await fetchData(papersByIds(ids));
  const data = (await result.text()).replaceAll('\n', '');
  const json = await parseArxiv(data);

  return json;
}
