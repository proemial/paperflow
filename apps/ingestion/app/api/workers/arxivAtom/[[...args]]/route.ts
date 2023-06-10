import { fetchUpdatedArXivAtomPapers } from "data/adapters/arxiv/arxiv-atom";
import { DateMetrics } from "utils/date";
import { NextResponse } from "next/server";
import { ConfigDao } from "data/storage/config";
import { PipelineDao } from "data/storage/pipeline";
import { dateAndIndexFromParams } from "../../../utils";
import { PipelineStage } from "data/adapters/redis/redis-client";
import { normalizeError } from "utils/error";
import { IngestionLogger } from "data/storage/ingestion-log";
import { PapersDao } from "@/../../packages/data/storage/papers";

export const revalidate = 1;

// 'https://ingestion.paperflow.ai/api/workers/arxivAtom/2023-06-08/0'

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}

async function run(params: { args: string[] }) {
  const begin = DateMetrics.now();
  let result = '';

  const {date, index} = dateAndIndexFromParams(params);

  try {
    const pipeline = await PipelineDao.get(date);
    if(pipeline.stages.arxivAtom[index].status !== 'scheduled')
      return NextResponse.json({result});
    await PipelineDao.updateStatus(date, PipelineStage.arxivAtom, index, 'running');

    const config = (await ConfigDao.get()).stages.arxivAtom;

    const ids = pipeline.stages.arxivAtom[index].ids.split(',');
    const papers = await fetchUpdatedArXivAtomPapers(ids, config);

    if(papers?.length > 0) {
      await PapersDao.pushArXivAtomPapers(papers);
    }

    await PipelineDao.updateStatus(date, PipelineStage.arxivAtom, index, 'completed');

    result = `ids: ${ids.length}, papers: ${papers.length}`;

    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    await PipelineDao.updateStatus(date, PipelineStage.arxivAtom, index, 'error');

    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    const msg = `[arxivAtom][${DateMetrics.elapsed(begin)}] ${result}`;
    await IngestionLogger.log(date, `[arxivAtom][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
