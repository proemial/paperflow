import { PapersDao } from "data/db/paper-dao";
import { DateFactory } from "utils/date";
import { NextResponse } from "next/server";
import { redis } from "data/adapters/redis/rest-client";
import { arxivCategories } from "data/adapters/arxiv/arxiv.models";
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
    const { id, link, published, title, authors, category, abstract } = paper.parsed;
    const {summary, lastUpdated} = paper;
    const ingestionDate = dayjs(lastUpdated).format("YYYY-MM-DD");
  
    console.log(`set[ingestion:paper:summarised:${paper.parsed.id}] `);
    await redis.ingestion.set(
      `ingestion:paper:summarised:${paper.parsed.id}`, 
      JSON.stringify({
        ingestionDate, id, published, title, summary, authors, abstract,
        category: arxivCategories.find((arxivCategory) => arxivCategory.key === category),
        link: link.source,
      }), 
      ttl,
    );

    const related = await PapersDao.getByCategory(id, category, 5);
    if(related) {
      console.log(`set[ingestion:paper:related:${paper.parsed.id}] `);
      await redis.ingestion.set(
        `ingestion:paper:related:${paper.parsed.id}`, 
        JSON.stringify(related?.map((revisionedPaper, i) => {
          const paper = revisionedPaper.revisions.at(-1);
          if(!paper)
            return undefined;

          const { published, title, authors, abstract } = paper.parsed;
    
          return {
            id: paper.parsed.id,
            published: `${published}`,
            title,
            summary: paper.summary,
            authors,
            category,
            link: paper.parsed.link.source,
            ingestionDate: `${revisionedPaper.lastUpdated}`,
            abstract,
          };
        })), 
        ttl,
      );
    }
  });

  // const latestPapers = (await PapersDao.getSummarizedByDate(DateFactory.yesterday().toDate()));
  // const date = dayjs().format("YYYY-MM-DD");
  // const ids = latestPapers.map(revisionedPaper => revisionedPaper.id);
  
  // await redis.ingestion.json.set('ingestion:status:summarised:latest', "$", {
  //   date,
  //   ids,
  // });

  return NextResponse.json({ after: after.format('YYYY-MM-DD'), papers: revisionedPapers.length });
}