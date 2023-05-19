import { fetchUpdatedIds } from "@/data/adapters/arxiv/arxiv-oao";
import { IngestionDao, IngestionState } from "@/data/db/ingestion-dao";
import { DateMetrics } from "@/utils/date";
import { log } from "console";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { Workers, qstash } from "@/data/adapters/qstash/qstash-client";
import { PapersDao } from "@/data/db/paper-dao";

export const revalidate = 1;

export async function GET() {
  const begin = DateMetrics.now();

  try {
    const date = dayjs().format("YYYY-MM-DD");
    log('[tick>>', { date });
    let ingestionState = await IngestionDao.getOrCreate(date);

    // 1. Check for updates
    const ids = await fetchLatestPapers(date, ingestionState);

    // 2. Schedule scraping
    if (ids.length > 0) {
      ingestionState.ids.newIds.push(...ids);
      await IngestionDao.update(date, ingestionState);
      await qstash.publish(Workers.scraper, { date }, date);
    }

    // 3. Get papers to summarise (status intial, category from config)
    const papers = await PapersDao.getIdsByStatusFiltered('initial');
    log('papers', papers.length);

    // 4. Schedule summarisation
    if (papers.length > 0) {
      papers.forEach(async paper => {
        await qstash.publish(Workers.summariser, { id: paper.id }, paper.id);
      });

      // ingestionState.ids.newIds.push(...ids);
      // await IngestionDao.update(date, ingestionState);
    }

    const response = { date, ids: ids.length, papers: papers.length };
    log('<<tick]', response);
    return NextResponse.json(response);
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick`);
  }
}

async function fetchLatestPapers(date: string, ingestionState: IngestionState) {
  const ids = await fetchUpdatedIds(date);

  return ids.filter(id => !ingestionState.ids.newIds.includes(id));
}
