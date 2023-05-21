import { fetchUpdatedIds } from "data/adapters/arxiv/arxiv-oao";
import { IngestionDao, IngestionState } from "data/db/ingestion-dao";
import { DateMetrics } from "utils/date";
import { log } from "console";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { Workers, qstash } from "data/adapters/qstash/qstash-client";
import { PapersDao } from "data/db/paper-dao";
import { normalizeError } from "utils/error";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  const response = await run(params.args);

  return NextResponse.json(response);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  const response = await run(params.args);

  return NextResponse.json(response);
}

async function run(args: string[]) {
  const begin = DateMetrics.now();

  try {
    const date = args
      ? dayjs().format(args[0])
      : dayjs().format("YYYY-MM-DD");

    log('[tick>>', { date });

    const ids = await scrape(date);
    const papers = await summarise();

    const response = { date, ids: ids?.length, papers: papers?.length };
    log('<<tick]', response);
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick`);
  }
}

async function scrape(date: string) {
  const begin = DateMetrics.now();

  try {
    let ingestionState = await IngestionDao.getOrCreate(date);

    // Check for updates
    const ids = await fetchLatestPapers(date, ingestionState);

    // Schedule scraping
    if (ids.length > 0) {
      ingestionState.ids.newIds.push(...ids);
      await IngestionDao.update(date, ingestionState);
      await qstash.publish(Workers.scraper, { date }, date);
    }

    return ids;
  } catch (e) {
    console.error(e);
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick:scrape`);
  }
}

async function summarise() {
  const begin = DateMetrics.now();

  try {
    // Get papers to summarise (status intial, category from config)
    const papers = await PapersDao.getIdsByStatusFiltered('initial');
    log('papers', papers.length);

    // Schedule summarisation
    if (papers.length > 0) {
      papers.forEach(async paper => {
        await qstash.publish(Workers.summariser, { id: paper.id }, paper.id);
      });

      // ingestionState.ids.newIds.push(...ids);
      // await IngestionDao.update(date, ingestionState);
    }

    return papers;
  } catch (e) {
    console.error(e);
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/tick:summarise`);
  }
}

async function fetchLatestPapers(date: string, ingestionState: IngestionState) {
  const ids = await fetchUpdatedIds(date);

  return ids.filter(id => !ingestionState.ids.newIds.includes(id));
}

