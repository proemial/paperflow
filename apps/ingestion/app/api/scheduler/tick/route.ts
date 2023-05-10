import { fetchUpdatedItems } from "@/data/adapters/arxiv/arxiv-api";
import { fetchUpdatedIds } from "@/data/adapters/arxiv/arxiv-oao";
import { DocsDao } from "@/data/db/paper-dao";
import { IngestionDao } from "@/data/db/ingestion-dao";
import { DateFactory, DateMetrics } from "@/utils/date";
import dayjs from "dayjs";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function GET() {
  const begin = DateMetrics.now();

  try {
    const date = dayjs().format("YYYY-MM-DD");

    const ids = await fetchUpdatedIds(date);

    let ingestionState = await IngestionDao.getOrCreate(date);

    const newIds = ids.filter(id => !ingestionState.ids.hits.includes(id) && !ingestionState.ids.misses.includes(id));

    const limit = DateFactory.yesterday();
    const output = await fetchUpdatedItems(newIds, limit);

    if (output.misses.length > 0 || output.hits.length > 0) {
      if (output.hits.length > 0) {
        DocsDao.upsertMany(output.hits);
      }

      ingestionState.ids.hits.push(...output.hits.map(item => item.parsed.id));
      ingestionState.ids.misses.push(...output.misses.map(item => item.parsed.id));
      await IngestionDao.update(date, ingestionState);
    }

    // TODO: push to qStash

    return NextResponse.json({ updated: output.hits.length, ignored: output.misses.length });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick`);
  }
}