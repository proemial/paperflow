import { XMLParser } from "fast-xml-parser";
import { ArxivItem } from "@/app/api/arxiv/scrape/.model";

export function parseOai(text: string) {
  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true
  });

  let parsed = parser
    .parse(text)['OAI-PMH']['ListIdentifiers']['header'];

  if (!Array.isArray(parsed)) {
    parsed = [parsed];
  }

  return (parsed as Array<{ identifier: string, datestamp: string, setSpec: string | Array<string> }>)
    .map(item => item.identifier.substring(item.identifier.lastIndexOf(':') + 1)) // extract id's
    .sort()
    .reverse();
}

export async function parseArxiv(data: string) {
  const begin = now();
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

    const mapped = (parsed as { feed: { entry: Array<ArxivItem> } }).feed.entry.map(entry => ({
      ...entry,
      updated: new Date(entry.updated as string), //2023-05-02T17:59:31Z,
      published: new Date(entry.updated as string),
    }));

    return mapped;
  } finally {
    const elapsed = now() - begin;
    console.log(`[${elapsed}] parseApi`);
  }
}

function now() {
  return new Date().getTime();
}
