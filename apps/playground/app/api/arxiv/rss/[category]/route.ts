import { NextResponse } from 'next/server';
import Parser from "rss-parser";
import { logError, logMetric, now } from "@/utils/metrics";

const TEN_HOURS = 10 * 60 * 60;

export type ArxivFeed = {
    publisher: string;
    title: string;
    description: string;
    link: string;
    items: ArxivFeedItem[];
};

export type ArxivFeedItem = {
    title: string;
    link: string;
    creator: string;
    content: string;
    contentSnippet: string;
};

export async function GET(request: Request, { params }: {params: { category: string }}) {
  const arxivUrl = `http://export.arxiv.org/rss/${params.category}?version=1.0`;

  const key = `GET[${arxivUrl}]`;
  const begin = now();

  try {
    const res = await fetch(arxivUrl, {
      next: { revalidate: TEN_HOURS },
    });
    const data = await res.text();

    const parser = new Parser<Omit<ArxivFeed, "items">, ArxivFeedItem>();
    const parsed = (await parser.parseString(data)).items;

    return NextResponse.json(parsed);
  } catch(e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
