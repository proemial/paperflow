import { ConfigDao } from "data/storage/config";
import { dateFromParams } from "@/app/api/utils";
import { ArXivPaper, fetchUpdatedPapers } from "data/adapters/arxiv/arxiv-oai";
import { IngestionLogger } from "data/storage/ingestion-log";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}
export async function POST(request: Request, { params }: { params: { args: string[] } }) {
  return await run(params);
}

async function run(params: { args: string[] }) {
  const begin = DateMetrics.now();
  let result = '';

  const date = dateFromParams(params);

  try {
    const config = (await ConfigDao.get()).stages.arxivOai;
    const papers = await fetchUpdatedPapers(date, config);

    const newPapers = await pushPaperUpdates(date, papers);
    const newSummaries = await pushGptUpdates(date, papers);

    result = `allPapers: ${papers.length}, newPapers: ${newPapers}, newSummaries: ${newSummaries}`;

    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    const msg = `[arxivOai][${DateMetrics.elapsed(begin)}] ${result}`;
    await IngestionLogger.log(date, `[arxivOai][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}

async function pushPaperUpdates(date: string, papers: ArXivPaper[]) {
  const pipeline = await PipelineDao.get(date);

  const nestedIds = pipeline.stages.arxivAtom?.map(action => action.ids.split(','));
  const pipelineIds = nestedIds.reduce((acc, val) => acc.concat(val), []);

  const newPapers = papers.filter(paper => !pipelineIds.find(id => id === paper.id));

  if(newPapers?.length > 0) {
    await PapersDao.push(newPapers);
    await PipelineDao.pushArxivIds(date, newPapers.map(paper => paper.id).join(','));
  }

  return newPapers.length;
}

async function pushGptUpdates(date: string, papers: ArXivPaper[]) {
  const pipeline = await PipelineDao.get(date);

  const pipelineIds = pipeline.stages.gptSummary?.map(action => action.payload.id);
  console.log(pipelineIds);

  const newPapers = papers.filter(paper => !pipelineIds.find(id => id === paper.id));

  if(newPapers?.length > 0) {
    await PipelineDao.pushGptSummary(date, newPapers.map(paper => ({
      id: paper.id,
      size: 'sm',
    })));
  }

  return newPapers.length;
}
