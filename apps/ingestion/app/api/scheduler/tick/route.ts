import { fetchUpdatedIds } from "@/data/adapters/arxiv/arxiv-oao";
import { IngestionDao, IngestionState } from "@/data/db/ingestion-dao";
import { DateMetrics } from "@/utils/date";
import { log } from "console";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { qstash } from "@/data/adapters/qstash/qstash-client";

export const revalidate = 1;

export async function GET() {
  const begin = DateMetrics.now();

  try {
    const date = dayjs().format("YYYY-MM-DD");
    let ingestionState = await IngestionDao.getOrCreate(date);

    // 1. Check for updates
    const ids = await fetchLatestPapers(date, ingestionState);
    if (ids.length > 0) {
      // TODO: qStash POST https://ingestion.paperflow.ai/worker/scrape {date, ids}
      const res = await qstash.publishJSON({
        url: "https://ingestion.paperflow.ai/worker/scrape",
        body: { date, ids },
      });
      console.log('qstash response', res);

      ingestionState.ids.newIds.push(...ids);
      await IngestionDao.update(date, ingestionState);
    }

    // 2. Get papers to summarise (status intial, category from config)

    // 3. push to qStash (limit by category)

    return NextResponse.json({ date, ids: ids.length });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick`);
  }
}

async function fetchLatestPapers(date: string, ingestionState: IngestionState) {
  const ids = await fetchUpdatedIds(date);

  return ids.filter(id => !ingestionState.ids.newIds.includes(id));
}
