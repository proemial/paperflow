import { ArXivAtomPaper } from '@/../../packages/data/adapters/arxiv/arxiv.models';
import { PapersDao } from '@/../../packages/data/storage/papers';
import { NextResponse } from "next/server";
import { DateMetrics } from 'utils/date';
import { normalizeError } from 'utils/error';
import dayjs from "dayjs";

export async function POST(request: Request) {
  const begin = DateMetrics.now();
  let result = '';

  try {
    console.log('Extracting ids from request');
    const ids = await request.json();

    const indexedPapers = {} as {[id: string]: ArXivAtomPaper & {age: number}};
    const papers = await PapersDao.getArXivAtomPapers(ids);
    papers.forEach(paper => {
      indexedPapers[paper.parsed.id as string] = {
        ...paper,
        age: Math.round((dayjs(paper.raw.updated).unix() - dayjs(paper.raw.published).unix()) / (60*60*24))
      };
    })

    const summaries = await PapersDao.getGptSummaries(ids);
    // console.log('summaries', summaries);

    papers.forEach(paper => {
      indexedPapers[paper.parsed.id as string].summary = summaries.find(summary => summary.id === paper.parsed.id)?.text;
    })

    result = `ids: ${ids.length}, papers: ${papers.length}`;
    return NextResponse.json(indexedPapers);
  } catch (e) {
    console.error(e);
    result = '[ERROR]' + normalizeError(e).message;
    return new NextResponse(normalizeError(e).message, { status: 500 });
  } finally {
    console.log(`[api/papers][${DateMetrics.elapsed(begin)}] ${result}`);
  }
}
