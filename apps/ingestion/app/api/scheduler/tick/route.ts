import { fetchUpdatedItems } from "@/data/adapters/arxiv/arxiv-api";
import { fetchUpdatedIds } from "@/data/adapters/arxiv/arxiv-oao";
import { DocsDao } from "@/data/db/paper-dao";
import { IngestionDao } from "@/data/db/ingestion-dao";
import { DateFactory } from "@/utils/date";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const revalidate = 1;

// /api/scheduler/tick
// /api/worker/summarise/:id
export async function GET() {
  const date = dayjs().format("YYYY-MM-DD");

  const ids = await fetchUpdatedIds(date);

  let ingestionState = await IngestionDao.upsert(date);

  const newIds = ids.filter(id => !ingestionState.ids.hits.includes(id) && !ingestionState.ids.misses.includes(id));
  console.log('new ids', newIds.length);

  const limit = DateFactory.yesterday();
  const output = await fetchUpdatedItems(newIds, limit, 1);

  output.hits.forEach(async item => {
    await DocsDao.upsert(item);
  });

  ingestionState.ids.hits.push(...output.hits.map(item => item.parsed.id));
  ingestionState.ids.misses.push(...output.misses.map(item => item.parsed.id));
  await IngestionDao.update(date, ingestionState);

  // TODO: push to qStash

  return NextResponse.json(output);
}