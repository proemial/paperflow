import { ArxivPaper, arxivCategories } from "../adapters/arxiv/arxiv.models";
import { QStash } from "../adapters/redis/qstash-client";
import dayjs from "dayjs";

export const SummariesDao = {
  get: async (paperHash: string, promptHash: string) => {
    return await QStash.ingestion.get(`summary:${paperHash}:${promptHash}`);
  },

  set: async (paper: ArxivPaper, promptHash: string, summary: string) => {
    await QStash.ingestion.set(`summary:${paper.parsed.hash}:${promptHash}`, summary);

    // New cache format
    const ingestionDate = dayjs().format("YYYY-MM-DD");
    const { id, link, published, title, authors, category, abstract } = paper.parsed;

    if(ingestionDate === dayjs(published).format("YYYY-MM-DD")) {
      console.log('Appending ...');
      QStash.ingestion.json.arrappend('ingestion:status:summarised:latest', "$.ids", id);
    } else {
      console.log('Creating new ...');
      await QStash.ingestion.json.set('ingestion:status:summarised:latest', "$", {
        date: dayjs(published).format("YYYY-MM-DD"),
        ids: [id],
      });
    }
    console.log(await QStash.ingestion.json.get('ingestion:status:summarised:latest'));

    await QStash.ingestion.json.set(`ingestion:paper:summarised:${paper.parsed.id}`, "$", {
      ingestionDate, id, published, title, summary, authors, abstract,
      category: arxivCategories.find((catarxivCategory) => catarxivCategory.key === category),
      link: link.source,
    });
    console.log(await QStash.ingestion.json.get(`ingestion:paper:summarised:${paper.parsed.id}`));

    const data = await QStash.ingestion.json.get('ingestion:status:summarised:latest') as {date: Date, ids: string[]};
    console.log(data)
  },
}