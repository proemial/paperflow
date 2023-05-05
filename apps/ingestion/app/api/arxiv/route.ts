import { categories } from "@/app/api/arxiv/.categories";
import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";
import { ArxivItem } from "@/app/api/arxiv/.model";
import { log } from "util";

// New publications across categories
// https://export.arxiv.org/oai2?verb=ListIdentifiers&from=2023-05-04&until=2023-05-04&metadataPrefix=arXivRaw
// RAW format
// https://export.arxiv.org/oai2?verb=GetRecord&identifier=oai:arXiv.org:2305.02322&metadataPrefix=arXivRaw
// Best format
// https://export.arxiv.org/api/query?id_list=2305.02322

const searchByCat = (cat: string, start: number) => `https://export.arxiv.org/api/query?search_query=cat:${cat}&start=${start}&sortBy=lastUpdatedDate&sortOrder=descending`;

export async function GET(request: Request) {
  const ids = await fetchUpdatedIds('2023-05-04'); // ~1200 id's

  const category = categories[1].key; // CS: 503, CS.AI: 86
  const dateOffset = (24*60*60*1000) * 2; // 2 days
  const dateLimit = new Date();
  dateLimit.setTime(dateLimit.getTime() - dateOffset);

  const output: Array<ArxivItem> = [];

  let count = 0;
  while(count++ < 20) {
    const result = await fetchAndPrint(category, count * 10);
    result.forEach(item => {
      if(item.updated.getTime() >= dateLimit.getTime()) {
        console.log(item.published, item.updated, item.id.substring(item.id.lastIndexOf('/')+1), item.title)
        output.push(item);
      } else {
        console.log('BREAKING AT: ', item.published, item.updated, item.id.substring(item.id.lastIndexOf('/')+1), item.title)
        count = 99;
      }
    })

    if(count < 20)
      await sleep(100);
  }

  return NextResponse.json(output);
}

async function fetchUpdatedIds(date: string) {
  const result = await fetchData(`https://export.arxiv.org/oai2?verb=ListIdentifiers&from=${date}&until=${date}&metadataPrefix=arXivRaw`);
  const data = await result.text();

  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true
  });
  const parsed = parser.parse(data)['OAI-PMH']['ListIdentifiers']['header'] as Array<{identifier: string, datestamp: string, setSpec: string | Array<string>}>;

  return parsed.map(item => item.identifier.substring(item.identifier.lastIndexOf(':')+1));
}

async function fetchAndPrint(cat: string, start: number) {
  const result = await fetchData(searchByCat(cat, start));
  const data = (await result.text()).replaceAll('\n', '');
  const json = await parseApi(data);

  // json.forEach((entry) => console.log(entry.published, entry.updated, entry.id.substring(entry.id.lastIndexOf('/')+1), entry.title));

  return json;
}

const fetchData = async (url: string) => {
  const begin = now();
  try {
    return await fetch(url);
  } finally {
    const elapsed = now() - begin;
    console.log(`[${elapsed}] ${url}`);
  }
}

const parseApi = async (data: string) => {
  const begin = now();
  try {
    const parser2 = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix : "",
      allowBooleanAttributes: true,
      removeNSPrefix: true
    });
    // return parser2.parse(data) as {feed: {entry: Array<ArxivItem>}};

    const parsed = parser2.parse(data) as {feed: {entry: Array<ArxivItem>}};
    return parsed.feed.entry.map(entry => ({
      ...entry,
      updated: new Date(entry.updated as string), //2023-05-02T17:59:31Z,
      published: new Date(entry.updated as string),
    }))
  } finally {
    const elapsed = now() - begin;
    console.log(`[${elapsed}] parseApi`);
  }
}

function now() {
  return new Date().getTime();
}
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
