import { XMLParser } from "fast-xml-parser";
import { fetchData, } from "../fetch";
import dayjs from "dayjs";
import { PipelineStageConfig } from "../redis/redis-client";

// Docs
// https://www.openarchives.org/OAI/openarchivesprotocol.html

// ListIdentifiers example:
// https://export.arxiv.org/oai2?verb=ListIdentifiers&from=2023-06-07&until=2023-06-08&metadataPrefix=arXivRaw

// ListRecords example (with continuation)
// https://export.arxiv.org/oai2?verb=ListRecords&from=2023-06-07&until=2023-06-08&metadataPrefix=arXivRaw
// https://export.arxiv.org/oai2?verb=ListRecords&resumptionToken=6625893|1001

// GetRecord example
// https://export.arxiv.org/oai2?verb=GetRecord&identifier=oai:arXiv.org:1306.1917&metadataPrefix=oai_dc

const idsByTypeAndDate = (type: string, from: string, to: string) => `https://export.arxiv.org/oai2?verb=${type}&from=${from}&until=${to}&metadataPrefix=arXivRaw`;
const idsByTypeAndToken = (type: string, token: string) => `https://export.arxiv.org/oai2?verb=${type}&resumptionToken=${token}`;

export async function fetchUpdatedIds(date: string) {
  const result = await fetchData(idsByTypeAndDate('ListIdentifiers', date, date));
  const text = await result.text();

  if(result.status !== 200)
    throw new Error(text);

  return parseListIdentifiers(text);
}

export async function fetchUpdatedPapers(date: string, config: PipelineStageConfig) {
  const to = dayjs(date).add(1, 'day').format("YYYY-MM-DD");

  let result = [] as ArXivPaper[];

  let token: string | undefined = '';
  while(token !== undefined) {
    const response = await fetchData(
      token
        ? idsByTypeAndToken('ListRecords', token)
        : idsByTypeAndDate('ListRecords', date, to)
    );
    const text = await response.text();

    if(response.status !== 200)
      throw new Error(text);

    const data = parseListRecords(text);
    result = [...result, ...data.records.map(record => record.metadata)];
    token = data.resumptionToken.token;

    const sleep = config.sleep as number || 2500;
    console.log(`sleeping for ${sleep}ms ...`);
    await delay(sleep);
  }

  const filtered = result.filter(paper => dayjs(paper.version.date).format("YYYY-MM-DD") === date);
  console.log('result', {unfiltered: result.length, filtered: filtered.length});

  return filtered;
}

function parseListIdentifiers(text: string) {
  const parser = new XMLParser({
    ignoreAttributes: true,
    removeNSPrefix: true
  });

  try {
    let parsed = parser
      .parse(text)['OAI-PMH']['ListIdentifiers']['header'];

    if (!Array.isArray(parsed)) {
      parsed = [parsed];
    }

    return (parsed as Array<ArxivHeader>)
      .map(item => item.identifier.substring(item.identifier.lastIndexOf(':') + 1)) // extract id's
      .sort()
      .reverse();
  } catch (error) {
    console.error(error);

    let parsedError = parser
      .parse(text)['OAI-PMH']['error'];
    console.error(parsedError);

    throw new Error(parsedError);
  }
}

function parseListRecords(text: string) {
  const parser = new XMLParser({
    removeNSPrefix: true,
    ignoreAttributes : false,
    numberParseOptions: {
      leadingZeros: false,
      hex: false,
      skipLike: /[\w]+\.[\w]+/, // Don't convert doi's to numbers
    },
  });

  try {
    let raw = parser
      .parse(text)['OAI-PMH']['ListRecords'] as RawArXivResponse;

      const arXivResponse: ArXivResponse = {
        resumptionToken: {
          token: raw?.resumptionToken["#text"],
          cursor: Number(raw?.resumptionToken["@_cursor"] || '-1'),
          completeListSize: Number(raw?.resumptionToken["@_completeListSize"] || '-1'),
        },
        records: (raw?.record || []).map(record => ({
          header: {
            identifier: record?.header?.identifier,
            datestamp: record?.header?.datestamp,
            setSpec: Array.isArray(record?.header?.setSpec || []) ? record?.header?.setSpec as string[] : [record?.header?.setSpec as string]
          },
          metadata: {
            id: `${record?.metadata?.arXivRaw?.id}`,
            submitter: record?.metadata?.arXivRaw?.submitter,
            version: toArxivVersion(record?.metadata?.arXivRaw?.version),
            title: record?.metadata?.arXivRaw?.title,
            authors: (record?.metadata?.arXivRaw?.authors || '').split(','),
            categories: (record?.metadata?.arXivRaw?.categories || '').split(' '),
            comments: record?.metadata?.arXivRaw?.comments,
            abstract: record?.metadata?.arXivRaw?.abstract,
            doi: record?.metadata?.arXivRaw?.doi,
            license: record?.metadata?.arXivRaw?.license,
            journalRef: record?.metadata?.arXivRaw?.["journal-ref"],
            mscClass: record?.metadata?.arXivRaw?.["msc-class"],
          }
        }))
      }
      console.log('parsed count', arXivResponse.records.length);
      console.log('arXivResponse.resumptionToken', arXivResponse.resumptionToken);


    return arXivResponse;
  } catch (error) {
    console.error(error);

    let parsedError = parser
      .parse(text)['OAI-PMH']['error'];
    console.error(parsedError);

    throw new Error(parsedError);
  }
}

function toArxivVersion(rawVersion?: RawArXivVersion | RawArXivVersion[]): ArXivVersion {
  if(!rawVersion || Array.isArray(rawVersion) && rawVersion.length < 1) {
    return {
      date: dayjs(0).toDate(),
      size: '0',
      version: '',
    }
  }

  return (Array.isArray(rawVersion) ? rawVersion : [rawVersion]).map(version => ({
    date: dayjs(version.date).toDate(),
    size: version.size,
    version: version["@_version"],
  })).sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1).at(-1) as ArXivVersion;
}

type ArXivResponse = {
  records: ArXivRecord[],
  resumptionToken: ArXivResumptionToken,
}

type ArXivResumptionToken = {
  token: string,
  cursor: number,
  completeListSize: number,
};

type ArXivRecord = {
  header: ArxivHeader
  metadata: ArXivPaper,
};

type ArxivHeader = {
  identifier: string,
  datestamp: string,
  setSpec: string[]
};

export type ArXivPaper = {
  id: string,
  submitter: string,
  version: ArXivVersion,
  title: string,
  authors: string[],
  categories: string[],
  comments: string,
  abstract: string,
  doi?: string,
  license?: string,
  journalRef?: string,
  mscClass?: string,
}

type ArXivVersion = {
  date: Date,
  size: string,
  version: string,
}

type RawArXivResponse = {
  record: RawArXivRecord[],
  resumptionToken: {
    '#text': string,
    '@_cursor': number,
    '@_completeListSize': number,
  }
  // <resumptionToken cursor="0" completeListSize="3179">6625712|1001</resumptionToken>
}

type RawArXivRecord = {
  header: RawArxivHeader
  metadata: {
    arXivRaw: RawArXivPaper,
  },
};

type RawArxivHeader = {
  identifier: string,
  datestamp: string,
  setSpec: string | Array<string>
};

type RawArXivPaper = {
  id: string,
  submitter: string,
  version: RawArXivVersion | Array<RawArXivVersion>,
  title: string,
  authors: string,    // comma separated
  categories: string, // space separated
  comments: string,
  abstract: string,
  doi?: string,
  license?: string,
  'journal-ref'?: string,
  'msc-class'?: string,
}

type RawArXivVersion = {
  date: string,
  size: string,
  '@_version': string,
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
