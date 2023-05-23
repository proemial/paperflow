import { gptPrompt } from "data/adapters/openai/openai";
import { PapersDao } from "data/db/paper-dao";
import { ConfigDao } from "data/db/config-dao";
import { SummariesDao } from "data/db/summaries-dao";
import { DateMetrics } from "utils/date";
import { log } from "console";
import { NextResponse } from "next/server";
import { Md5 } from "ts-md5";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const response = await run(params.id);

  return NextResponse.json(response);
}
export async function POST(request: Request, { params }: { params: { id: string } }) {
  const response = await run(params.id);

  return NextResponse.json(response);
}

async function run(id: string) {
  const begin = DateMetrics.now();
  log('[summarise>>', id);

  try {
    // Fetch paper 
    const paper = await PapersDao.getByIdAndStatus(id, 'initial');
    if (!paper) {
      return NextResponse.json({ error: 'paper not found' }, { status: 404 });
    }
    log('paper', paper.parsed.hash);

    // Fetch prompt
    const prompt = await ConfigDao.getPrompt();
    if (!prompt) {
      return NextResponse.json({ error: 'prompt not found' }, { status: 404 });
    }
    log('prompt', prompt.hash, Md5.hashStr(JSON.stringify(prompt.args)));

    // Check if summarisation is already done
    const cachedSummary = await SummariesDao.get(paper.parsed.hash, prompt.hash);
    if (cachedSummary) {
      log('cachedSummary found');
      if (!paper.raw.summary) {
        // Update DB
        const dbResult = await PapersDao.updateSummary(id, paper.raw.id, cachedSummary as string, prompt.hash);
        log('summary updated', dbResult.modifiedCount);
      }
      return NextResponse.json({ summary: cachedSummary });
    }

    // Run summarisation
    const summary = await gptPrompt(paper.parsed.title, paper.parsed.abstract, prompt);
    log('summary', summary.text);

    if (summary.text) {
      // Update DB
      const dbResult = await PapersDao.updateSummary(id, paper.raw.id, summary.text, prompt.hash);
      log('summary updated', dbResult.modifiedCount);

      // Update cache
      const cacheResult = await SummariesDao.set(paper.parsed.hash, prompt.hash, summary.text);
      log('summary cached', cacheResult);
    }

    const response = { summary: summary.text };
    log('<<summarise]', response);
    return NextResponse.json(response);
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/workers/summarise/${id}`);
  }
}