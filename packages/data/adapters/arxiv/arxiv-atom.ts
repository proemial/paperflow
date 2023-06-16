import { XMLParser } from "fast-xml-parser";
import { Md5 } from "ts-md5";
import { splitIntoBuckets } from "utils/array";
import { DateMetrics } from "utils/date";
import { fetchData, } from "../fetch";
import { PipelineStageConfig } from "../redis/redis-client";
import { ArXivAtomPaper, RawArxivPaper, extractId } from "./arxiv.models";

const papersByIds = (ids: string) => `https://export.arxiv.org/api/query?id_list=${ids}&max_results=50`;

export async function fetchUpdatedArXivAtomPapers(ids: string[], config: PipelineStageConfig) {
  const hits: Array<ArXivAtomPaper> = [];

  const buckets = splitIntoBuckets(ids, config.bucketSize as number);

  let count = 0;
  while (count++ < buckets.length) {
    hits.push(
      ...await fetchByIds(buckets[count - 1].join(','))
    );
    await sleep(config.sleep as number);
  }

  return hits;
}

async function fetchByIds(ids: string) {
  const result = await fetchData(papersByIds(ids));
  const data = (await result.text()).replaceAll('\n', '');
  const json = await parseArXivAtom(data);

  return json;
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function parseArXivAtom(data: string) {
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
            published: new Date(entry.published as string),
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
        } as ArXivAtomPaper;
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
