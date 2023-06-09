import { PapersDao } from "data/db/papers-dao";
import { log } from "console";
import { fetchUpdatedPapers } from "data/adapters/arxiv/arxiv-oai";
import { PipelineDao } from "data/db/pipeline-dao";
import dayjs from "dayjs";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";
import {IngestionLogger} from "data/db/ingestion-log"

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params.args);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params.args);
}

async function run(args: string[]) {
  const begin = DateMetrics.now();
  let result = '';

  const date = args
    ? dayjs().format(args[0])
    : dayjs().subtract(1, 'day').format("YYYY-MM-DD");

  try {
    const oaiPapers = await fetchUpdatedPapers(date);
    const pipeline = await PipelineDao.get(date);

    const newPapers = oaiPapers.filter(paper => !pipeline.stages.scrapeArxiv.find(action => action.id === paper.id));

    await PapersDao.push(newPapers);
    await PipelineDao.pushArxivIds(date, newPapers.map(paper => paper.id));

    result = `allPapers: ${oaiPapers.length}, newPapers: ${newPapers.length}`;
    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/scheduler/arxiv-ids`);
    await IngestionLogger.log(date, `[arxiv-ids][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
