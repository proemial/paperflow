import { PapersDao } from "data/db/paper-dao";
import { DateFactory } from "utils/date";
import { NextResponse } from "next/server";
import { redis } from "data/adapters/redis/rest-client";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
import {IngestionCache} from "data/db/ingestion-cache"
import dayjs from "dayjs";

export const revalidate = 0;
const ttl = {ex: 60 * 60 * 24 * 5};

export async function GET(request: Request) {
  const after = DateFactory.yesterday().subtract(5, 'day');
  const revisionedPapers = (await PapersDao.getSummarizedByDate(after.toDate()));

  revisionedPapers.forEach(async revisionedPaper => {
    const paper = revisionedPaper.revisions.at(-1);
    if(!paper)
      return;
    
    const { id, category } = paper.parsed;
    await IngestionCache.papers.update(paper);

    const related = await PapersDao.getByCategory(id, category, 5);
    if(related) {
      await IngestionCache.related.update(id, related);
    }
  });

  const latestPapers = (await PapersDao.getSummarizedByDate(DateFactory.yesterday().toDate()));
  const date = dayjs().format("YYYY-MM-DD");
  const ids = latestPapers.map(revisionedPaper => revisionedPaper.id);
  
  await IngestionCache.latestIds.update(date, ids);

  return NextResponse.json({ after: after.format('YYYY-MM-DD'), papers: revisionedPapers.length, ids: ids.length });
}