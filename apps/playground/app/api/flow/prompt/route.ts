import { NextResponse } from "next/server";
import { Md5 } from "ts-md5";
import { ArxivFeedItem } from "@/app/api/arxiv/rss/[category]/route";
import { logError, logMetric, now } from "@/utils/metrics";
import { ChatCompletionRequestMessageRoleEnum } from "openai";

export const revalidate = 1;

type Payload = {
  category: string,
  count: number,
  messages: Array<{
    role: ChatCompletionRequestMessageRoleEnum,
    content: string,
  }>,
}

export type ParsedArxivItem = {
  title: string,
  contentSnippet: string,
  authors: string[],
  link: string
};

// TODO: Caching for PUT vs. GET
export async function PUT(request: Request) {
  const host = request.headers.get('origin');

  const promptData: Payload = await request.json();
  console.log('promptData', promptData);

  const hash = Md5.hashStr(JSON.stringify(promptData));

  await addToRedis(hash, host, promptData);

  return await getFromArxiv(hash, host, promptData);
}

async function addToRedis(hash: string, host: string | null, promptData: Payload) {
  const url = `${host}/api/redis/prompts/${hash}`;
  const key = `PUT[${url}]`;
  const begin = now();

  try {
    await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(promptData),
    });
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}

async function getFromArxiv(hash: string, host: string | null, promptData: Payload) {
  const url = `${host}/api/arxiv/rss/${promptData.category}`;
  const key = `GET[${url}]`;
  const begin = now();

  try {
    const arxivResponse = await fetch(url).then((res) => res.json() as Promise<Array<ArxivFeedItem>>)
    const output = arxivResponse.slice(0, promptData.count);

    const mapOutput = output.map((item) => {
      const { title, contentSnippet, creator, link } = item;

      const authors = creator
        .replace(/<[^>]*>?/gm, "")
        .split(",")
        .map((s) => s.trim());

      const parsedTitle = title.split(/(\(|\. \()arXiv/)[0];

      return { title: parsedTitle, contentSnippet, authors, link } as ParsedArxivItem;
    });

    // TODO: Add hash to output

    return NextResponse.json(mapOutput);
  } catch (e) {
    logError(key, begin, e);
    throw e;
  } finally {
    logMetric(key, begin);
  }
}
