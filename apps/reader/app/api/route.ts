import { PapersDao } from "data/db/paper-dao";
import { DateFactory } from "utils/date";
import { NextResponse } from "next/server";
import { redis } from "data/adapters/redis/rest-client";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
import dayjs from "dayjs";

export const revalidate = 0;

export async function GET(request: Request) {
  const after = DateFactory.yesterday().subtract(5, 'day');
  const revisionedPapers = (await PapersDao.getSummarizedByDate(after.toDate()));

  revisionedPapers.forEach(async revisionedPaper => {
    const paper = revisionedPaper.revisions.at(-1);
    const { id, link, published, updated, title, authors, category, abstract } = paper.parsed;
    const {summary, lastUpdated} = paper;
    const ingestionDate = dayjs(lastUpdated).format("YYYY-MM-DD");
  
    console.log('updating redis ...', ingestionDate, published, updated, id);
    await redis.ingestion.json.set(`ingestion:paper:summarised:${paper.parsed.id}`, "$", {
      ingestionDate, id, published, title, summary, authors, abstract,
      category: arxivCategories.find((catarxivCategory) => catarxivCategory.key === category),
      link: link.source,
    });
  });
  
  // await redis.ingestion.json.set('ingestion:status:summarised:latest', "$", {
  //   date,
  //   ids,
  // });

  return NextResponse.json({ after: after.format('YYYY-MM-DD'), papers: revisionedPapers.length });
}