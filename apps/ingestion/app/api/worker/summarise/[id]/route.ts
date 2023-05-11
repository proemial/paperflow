import { gptPrompt } from "@/data/adapters/openai/openai";
import { PapersDao } from "@/data/db/paper-dao";
import { ConfigDao, asOpenAIPrompt } from "@/data/db/config-dao";
import { SummariesDao } from "@/data/db/summaries-dao";
import { DateMetrics } from "@/utils/date";
import { log } from "console";
import { NextResponse } from "next/server";

export const revalidate = 1;

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const begin = DateMetrics.now();

  const { id } = params;

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
    log('prompt', prompt.hash);

    // Check if summarisation is already done
    const cachedSummary = await SummariesDao.get(paper.parsed.hash, prompt.hash);
    if (cachedSummary) {
      log('cachedSummary found');
      return NextResponse.json({ summary: cachedSummary });
    }

    // Run summarisation
    const summary = await gptPrompt(paper.parsed.abstract, asOpenAIPrompt(prompt));
    log('summary', summary.text);

    if (summary.text) {
      // Update DB
      const dbResult = await PapersDao.updateSummary(id, paper.raw.id, summary.text);
      log('summary updated', dbResult.modifiedCount);

      // Update cache
      const cacheResult = await SummariesDao.set(paper.parsed.hash, prompt.hash, summary.text);
      log('summary cached', cacheResult);
    }

    return NextResponse.json({ summary: summary.text });
  } finally {
    console.log(`[${DateMetrics.elapsed(begin)}] /api/workers/summarise/${id}`);
  }
}