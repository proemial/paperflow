import { XMLParser } from "fast-xml-parser";
import { fetchData, } from "@/data/adapters/fetch";

const idsByDate = (date: string) => `https://export.arxiv.org/oai2?verb=ListIdentifiers&from=${date}&until=${date}&metadataPrefix=arXivRaw`;

export async function fetchUpdatedIds(date: string) {
  const result = await fetchData(idsByDate(date));
  const data = await result.text();

  const parsed = parseOai(data);
  console.log('ids', parsed.length);

  return parsed;
}

function parseOai(text: string) {
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
