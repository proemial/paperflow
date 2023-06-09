import { ArxivPaper, arxivCategories } from "../adapters/arxiv/arxiv.models";
import { UpStash } from "../adapters/redis/upstash-client";
import dayjs from "dayjs";

export const SummariesDao = {
  get: async (paperHash: string, promptHash: string) => {
    return await UpStash.ingestion.get(`summary:${paperHash}:${promptHash}`);
  },

  set: async (paper: ArxivPaper, promptHash: string, summary: string) => {
    await UpStash.ingestion.set(`summary:${paper.parsed.hash}:${promptHash}`, summary);

    // New cache format
    const ingestionDate = dayjs().format("YYYY-MM-DD");
    const { id, link, published, title, authors, category, abstract } = paper.parsed;

    if(ingestionDate === dayjs(published).format("YYYY-MM-DD")) {
      console.log('Appending ...');
      UpStash.ingestion.json.arrappend('ingestion:status:summarised:latest', "$.ids", id);
    } else {
      console.log('Creating new ...');
      await UpStash.ingestion.json.set('ingestion:status:summarised:latest', "$", {
        date: dayjs(published).format("YYYY-MM-DD"),
        ids: [id],
      });
    }
    console.log(await UpStash.ingestion.json.get('ingestion:status:summarised:latest'));

    await UpStash.ingestion.json.set(`ingestion:paper:summarised:${paper.parsed.id}`, "$", {
      ingestionDate, id, published, title, summary, authors, abstract,
      category: arxivCategories.find((catarxivCategory) => catarxivCategory.key === category),
      link: link.source,
    });
    console.log(await UpStash.ingestion.json.get(`ingestion:paper:summarised:${paper.parsed.id}`));

    const data = await UpStash.ingestion.json.get('ingestion:status:summarised:latest') as {date: Date, ids: string[]};
    console.log(data)
  },
}