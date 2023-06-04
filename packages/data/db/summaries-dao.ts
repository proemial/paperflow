import { ArxivPaper, arxivCategories } from "../adapters/arxiv/arxiv.models";
import { redis } from "../adapters/redis/rest-client";
import dayjs from "dayjs";

export const SummariesDao = {
  get: async (paperHash: string, promptHash: string) => {
    return await redis.ingestion.get(`summary:${paperHash}:${promptHash}`);
  },

  set: async (paper: ArxivPaper, promptHash: string, summary: string) => {
    await redis.ingestion.set(`summary:${paper.parsed.hash}:${promptHash}`, summary);

    // New cache format
    const ingestionDate = dayjs().format("YYYY-MM-DD");
    const { id, link, published, title, authors, category } = paper.parsed;

    if(ingestionDate === dayjs(published).format("YYYY-MM-DD")) {
      console.log('Appending ...');
      redis.ingestion.json.arrappend('ingestion:status:summarised:latest', "$.ids", id);
    } else {
      console.log('Creating new ...');
      await redis.ingestion.json.set('ingestion:status:summarised:latest', "$", {
        date: dayjs(published).format("YYYY-MM-DD"),
        ids: [id],
      });
    }
    console.log(await redis.ingestion.json.get('ingestion:status:summarised:latest'));

    await redis.ingestion.json.set(`ingestion:paper:summarised:${paper.parsed.id}`, "$", {
      ingestionDate, id, published, title, summary, authors, 
      category: arxivCategories.find((catarxivCategory) => catarxivCategory.key === category),
      link: link.source,
    });
    console.log(await redis.ingestion.json.get(`ingestion:paper:summarised:${paper.parsed.id}`));

    const data = await redis.ingestion.json.get('ingestion:status:summarised:latest') as {date: Date, ids: string[]};
    console.log(data)
  },
}