import { fetchUpdatedItems } from "@/data/adapters/arxiv/arxiv-api";
import { IngestionDao } from "@/data/db/ingestion-dao";
import { PapersDao } from "@/data/db/paper-dao";
import { DateFactory } from "@/utils/date";
import { log } from "console";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function POST(request: Request) {
  const { date, ids } = await request.json() as { date: string, ids: string[] };
  log('[scrape>>', date, ids);

  const limit = DateFactory.yesterday();
  const output = await fetchUpdatedItems(ids, limit);

  if (output.misses.length > 0 || output.hits.length > 0) {
    if (output.hits.length > 0) {
      await PapersDao.upsertMany(output.hits);
    }

    let ingestionState = await IngestionDao.getOrCreate(date);

    ingestionState.ids.hits.push(...output.hits.map(item => item.parsed.id));
    ingestionState.ids.misses.push(...output.misses.map(item => item.parsed.id));
    await IngestionDao.update(date, ingestionState);
  }

  const response = {
    papers: {
      updated: output.hits.length,
      ignored: output.misses.length
    }
  }
  log('<<scrape]', response);
  return NextResponse.json(response);
}