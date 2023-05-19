import dayjs from "dayjs";
import { XMLParser } from "fast-xml-parser";
import { splitIntoBuckets } from "utils/array";
import { DateMetrics } from "utils/date";
import { fetchData, } from "../fetch";
import { ArxivPaper, RawArxivPaper, extractId } from "./arxiv.models";
import { Md5 } from "ts-md5";

const papersByIds = (ids: string) => `https://export.arxiv.org/api/query?id_list=${ids}&max_results=50`;

export async function fetchUpdatedItems(ids: string[], since: dayjs.Dayjs, maxCount?: number) {
  const hits: Array<ArxivPaper> = [];
  const misses: Array<ArxivPaper> = [];

  const buckets = splitIntoBuckets(ids, 50);

  let count = 0;
  while (count++ < buckets.length) {
    const result = await fetchByIds(buckets[count - 1].join(','));

    for (const item of result) {
      if (isRecent(item, since))
        hits.push(item);
      else
        misses.push(item);

      if (maxCount && hits.length >= maxCount)
        return buildOutput(hits, misses);
    }

    await sleep(100);
  }

  return buildOutput(hits, misses);
}

async function fetchByIds(ids: string) {
  const result = await fetchData(papersByIds(ids));
  const data = (await result.text()).replaceAll('\n', '');
  const json = await parseArxiv(data);

  return json;
}

const buildOutput = (hits: ArxivPaper[], misses: ArxivPaper[]) => {
  return {
    hits: hits.sort(comparator),
    misses,
  }
};

const comparator = (a: ArxivPaper, b: ArxivPaper) => (b.parsed.updated as Date).getTime() - (a.parsed.updated as Date).getTime();
const isRecent = (item: ArxivPaper, since: dayjs.Dayjs) => (item.parsed.updated as Date).getTime() >= since.valueOf();
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function parseArxiv(data: string) {
  const begin = DateMetrics.now();
  try {
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      allowBooleanAttributes: true,
      removeNSPrefix: true
    });

    const parsed = parser.parse(data);
    if (!Array.isArray(parsed.feed.entry)) {
      parsed.feed.entry = [parsed.feed.entry];
    }

    const mapped = (parsed as { feed: { entry: Array<RawArxivPaper> } }).feed.entry.map(entry => {
      try {
        return {
          parsed: {
            id: extractId(entry.id),
            updated: new Date(entry.updated as string),
            published: new Date(entry.updated as string),
            category: entry.primary_category.term,
            categories: Array.isArray(entry.category) ? entry.category?.map((category: any) => category.term) : [entry.category.term],
            authors: Array.isArray(entry.author) ? entry.author.map((author: any) => author.name) : [entry.author.name],
            link: {
              pdf: entry.link.find((link: any) => link.rel === 'related' && link.type === 'application/pdf')?.href,
              source: entry.link.find((link: any) => link.rel === 'alternate' && link.type === 'text/html')?.href,
            },
            title: entry.title,
            abstract: entry.summary,
            hash: Md5.hashStr(entry.summary),
          },
          raw: entry,
        } as ArxivPaper;
      } catch (e) {
        console.error('entry', entry.category, e);
        throw e;
      }
    });

    return mapped;
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] parseApi`);
  }
}