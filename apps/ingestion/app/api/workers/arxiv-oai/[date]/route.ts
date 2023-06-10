import { dateFromParams } from "@/app/api/utils";
import { fetchUpdatedPapers } from "data/adapters/arxiv/arxiv-oai";
import { IngestionLogger } from "data/storage/ingestion-log";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { date: string } }) {
  return await run(params);
}
export async function POST(request: Request, { params }: { params: { date: string } }) {
  return await run(params);
}

async function run(params: { date: string }) {
  const begin = DateMetrics.now();
  let result = '';

  const date = dateFromParams(params);

  try {
    const oaiPapers = await fetchUpdatedPapers(date);
    const pipeline = await PipelineDao.get(date);

    const newPapers = oaiPapers.filter(paper => !pipeline.stages.arxivAtom.find(action => action.id === paper.id));

    await PapersDao.push(newPapers);
    await PipelineDao.pushArxivIds(date, newPapers.map(paper => paper.id));

    result = `allPapers: ${oaiPapers.length}, newPapers: ${newPapers.length}`;
    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/arxiv-oai`);
    await IngestionLogger.log(date, `[arxiv-oai][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
