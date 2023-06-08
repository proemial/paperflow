import { fetchUpdatedItems } from "data/adapters/arxiv/arxiv-api";
import { PapersDao } from "data/db/paper-dao";
import { DateFactory } from "utils/date";
import { log } from "console";
import { NextResponse } from "next/server";
import { IngestionDao } from 'data/db/ingestion-dao';

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { date: string } }) {
  // const response = await run(params.date);

  // return NextResponse.json(response);
  return NextResponse.json({});
}
export async function POST(request: Request, { params }: { params: { date: string } }) {
  // const response = await run(params.date);

  // return NextResponse.json(response);
  return NextResponse.json({});
}

async function run(date: string) {
  log('[scrape>>', date);

  const ingestionState = await IngestionDao.getOrCreate(date);

  const limit = DateFactory.yesterday().subtract(1, 'day');
  const output = await fetchUpdatedItems(ingestionState.ids.newIds, limit);

  if (output.misses.length > 0 || output.hits.length > 0) {
    if (output.hits.length > 0) {
      await PapersDao.upsertMany(output.hits);
    }

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
  return response;
}