import { DateMetrics } from "utils/date";
import { QStash } from "../adapters/redis/qstash-client";
import { LatestIds, SummarisedPaper } from "./ingestion-models";
import { ArxivPaper, arxivCategories } from "../adapters/arxiv/arxiv.models";
import dayjs from "dayjs";
import { RevisionedPaper } from "./paper-dao";

enum IngestionCacheKey {
  Summary = 'ingestion:status:summarised:latest',
  Paper = 'ingestion:paper:summarised',
  Related = 'ingestion:paper:related',
};

const ttl = {ex: 60 * 60 * 24 * 5};

export const IngestionCache = {
  latestIds: {
    get: async () => {
      const begin = DateMetrics.now();
  
      try {
        return await QStash.ingestion.json.get(IngestionCacheKey.Summary) as LatestIds;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.latestIds.get`);
      }
    },

    update: async (date: string, ids: string[]) => {
      get: async () => {
        const begin = DateMetrics.now();
    
        try {
          await QStash.ingestion.json.set(IngestionCacheKey.Summary, "$", {
            date,
            ids,
          });
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.latestIds.update`);
        }
      }
    },
  },

  papers: {
    byIds: async (ids: string[]) => {
      const begin = DateMetrics.now();
  
      try {
        const pipeline = QStash.ingestion.pipeline();
        ids.forEach(id => {
          pipeline.get(`ingestion:paper:summarised:${id}`);
        })
      
        return await pipeline.exec() as Array<SummarisedPaper>;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.papers.byIds`);
      }
    },

    byId: async (id: string) => {
      const begin = DateMetrics.now();
  
      try {
        return await QStash.ingestion.get(`ingestion:paper:summarised:${id}`) as SummarisedPaper;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.papers.byId`);
      }
    },

    update: async (paper: ArxivPaper) => {
      get: async () => {
        const begin = DateMetrics.now();
    
        try {
          const { id, link, published, title, authors, category, abstract } = paper.parsed;
          const {summary, lastUpdated} = paper;
          const ingestionDate = dayjs(lastUpdated).format("YYYY-MM-DD");
        
          console.log(`set[${IngestionCacheKey.Paper}:${paper.parsed.id}] `);
          await QStash.ingestion.set(
            `${IngestionCacheKey.Paper}:${paper.parsed.id}`, 
            JSON.stringify({
              ingestionDate, id, published, title, summary, authors, abstract,
              category: arxivCategories.find((arxivCategory) => arxivCategory.key === category),
              link: link.source,
            }), 
            ttl,
          );
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.papers.update`);
        }
      }
    },
  },

  related: {
    byId: async (id: string) => {
      const begin = DateMetrics.now();
  
      try {
        return await QStash.ingestion.get(`${IngestionCacheKey.Related}:${id}`) as Array<{
          id: string,
          published: string,
          title: string,
          summary: string,
          authors: string[],
          category: {key: string, title: string, category: string},
          link: string,
          ingestionDate: string,
          abstract: string,
        }>;
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.related.byId`);
      }
    },

    update: async (id: string, related: RevisionedPaper[]) => {
      get: async () => {
        const begin = DateMetrics.now();
    
        try {
          console.log(`set[${IngestionCacheKey.Related}:${id}] `);
          await QStash.ingestion.set(
            `${IngestionCacheKey.Related}:${id}`, 
            JSON.stringify(related?.map((revisionedPaper, i) => {
              const paper = revisionedPaper.revisions.at(-1);

              if(!paper)
                return undefined;

              const { id, link, published, title, authors, category, abstract } = paper.parsed;
              const {summary, lastUpdated} = paper;
              const ingestionDate = dayjs(lastUpdated).format("YYYY-MM-DD");

              return {
                id: paper.parsed.id,
                published: `${published}`,
                title,
                summary: paper.summary,
                authors,
                category: arxivCategories.find((arxivCategory) => arxivCategory.key === category),
                link: paper.parsed.link.source,
                ingestionDate: `${revisionedPaper.lastUpdated}`,
                abstract,
              };
            })), 
            ttl,
          );
        } catch (error) {
          console.error(error);
          throw error;
        } finally {
          console.log(`[${DateMetrics.elapsed(begin)}] IngestionCache.related.update`);
        }
      }
    },
  }

};
