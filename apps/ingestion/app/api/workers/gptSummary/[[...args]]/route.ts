import { PipelineStage } from "data/adapters/redis/redis-client";
import { ConfigDao } from "data/storage/config";
import { IngestionLogger } from "data/storage/ingestion-log";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { NextResponse } from "next/server";
import { DateMetrics } from "utils/date";
import { normalizeError } from "utils/error";
import { dateAndIndexFromParams } from "../../../utils";
import { Md5 } from "ts-md5";
import { gptPrompt } from "data/adapters/openai/openai";

export const revalidate = 1;

// 'https://ingestion.paperflow.ai/api/workers/gptSummary/2023-06-08/0'

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
    const pipeline = await PipelineDao.getPipeline(date);
    const {payload, status} = pipeline.stages.gptSummary[index];
    const {id, size} = payload;

    if(status === 'completed') {
      result = 'allready completed'
      return NextResponse.json({result});
    }
    await PipelineDao.updateStatus(date, PipelineStage.gptSummary, index, 'running');

    // Get paper
    const paper = await PapersDao.getArXivOaiPaper(id);
    if (!paper) {
      result = 'paper not found'
      return NextResponse.json({result}, { status: 404 });
    }

    // Get prompt template
    const promptTemplates = await ConfigDao.getPromptConfig();
    if (!promptTemplates) {
      result = 'prompt not found'
      return NextResponse.json({result}, { status: 404 });
    }

    // Check if summarisation is already done
    const cachedSummary = await PapersDao.getGptSummary(id, size);
    if (cachedSummary) {
      result = 'cached summary'
      return NextResponse.json({ summary: cachedSummary });
    }

    // Run summarisation
    const summary = await gptPrompt(paper.title, paper.abstract, promptTemplates.sm);
    if (summary.text) {
      // Update DB
      await PapersDao.pushGptSummary(id, size, summary);
      await PipelineDao.pushToIndex(date, paper.categories[0], paper.id);
    }
    await PipelineDao.updateStatus(date, PipelineStage.gptSummary, index, 'completed');

    result = `[DONE][${date}/${index}] id: ${id}, size: ${size}, summary: ${summary.text?.split(' ').length}, usage: ${summary.usage?.total_tokens}`;

    return NextResponse.json({result});
  } catch (e) {
    console.error(e);
    result = `[ERROR][${date}/${index}]` + normalizeError(e).message;
    await PipelineDao.updateStatus(date, PipelineStage.gptSummary, index, 'error');

    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    const msg = `[gptSummary][${DateMetrics.elapsed(begin)}] ${result}`;
    await IngestionLogger.log(date, `[gptSummary][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
