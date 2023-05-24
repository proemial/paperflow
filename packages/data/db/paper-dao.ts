import { db } from "../adapters/mongo/mongo-client";
import { DateMetrics } from "utils/date";
import { AnyBulkWriteOperation } from "mongodb";
import { ArxivPaper } from "../adapters/arxiv/arxiv.models";
import { ConfigDao } from "../db/config-dao";

export type PaperStatus = "initial" | "summarised";

export type RevisionedPaper = {
  id: string,
  status: PaperStatus,
  lastUpdated: Date,
  revisions: ArxivPaper[],
};

export type WithId = {
  id: string,
};

export const PapersDao = {
  upsert: async (paper: ArxivPaper) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const lastUpdated = new Date();
      const id = paper.parsed.id;
      const status = 'initial';

      await mongo.updateOne({ id }, {
        $set: { id, status, lastUpdated },
        $addToSet: { revisions: paper }
      }, { upsert: true });

      return (await mongo.findOne<RevisionedPaper>({ id })) as RevisionedPaper;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.upsert`);
    }
  },

  upsertMany: async (papers: ArxivPaper[]) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      await mongo.bulkWrite(papers.map(paper => {
        const lastUpdated = new Date();
        const id = paper.parsed.id;
        const status = 'initial';

        const result: AnyBulkWriteOperation = {
          updateOne: {
            filter: { id },
            update: {
              $set: { id, status, lastUpdated },
              // @ts-ignore
              $addToSet: { revisions: paper }
            },
            upsert: true,
          }
        };

        return result;
      }));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.upsertMany`);
    }
  },

  updateSummary: async (id: string, revId: string, summary: string, promptHash: string) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const result = await mongo.updateOne(
        { id, "revisions.raw.id": revId },
        {
          $set: {
            status: 'summarised',
            "revisions.$.summary": summary,
            "revisions.$.prompt": promptHash,
          }
        });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.updateSummary`);
    }
  },

  getByIds: async (ids: string[]) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const papers = mongo.find<RevisionedPaper>({ id: { $in: ids } }, {
        projection: {
          id: 1, status: 1, lastUpdated: 1,
          revisions: { $slice: -1 },
        }
      });

      return (await papers.toArray()).map(paper => ({
        id: paper.id,
        status: paper.status,
        lastUpdated: paper.lastUpdated,
        revisions: paper.revisions
      }));
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.getByIds`);
    }
  },

  getById: async (id: string) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const paper = await mongo.findOne<RevisionedPaper>({ id }, {
        projection: {
          id: 1, status: 1, lastUpdated: 1,
          revisions: { $slice: -1 },
        }
      });

      return paper && {
        id: paper.id,
        status: paper.status,
        lastUpdated: paper.lastUpdated,
        revisions: paper.revisions
      };
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.getById`);
    }
  },

  getByIdAndStatus: async (id: string, status: string) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const paper = await mongo.findOne<RevisionedPaper>({ id, status }, {
        projection: {
          revisions: { $slice: -1 },         // last element
          // "revisions.parsed.abstract": 1  // only abstract
        }
      });

      return paper && paper?.revisions[0];
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.getById`);
    }
  },

  getIdsByStatusFiltered: async (status: string) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    const filterConfig = await ConfigDao.getFilter();
    const filter = { 'revisions.parsed.category': { $regex: filterConfig?.regex } };

    try {
      const paperIds = mongo.find<WithId>({ status, ...filter }, {
        projection: { id: 1 }
      });

      return await paperIds.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.getById`);
    }
  },

  getIdsByIdsFiltered: async (ids: string[]) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    const filterConfig = await ConfigDao.getFilter();
    const filter = { 'revisions.parsed.category': { $regex: filterConfig?.regex } };

    try {
      const paperIds = mongo.find<WithId>({ id: { $in: ids }, ...filter }, {
        projection: { id: 1 }
      });

      return await paperIds.toArray();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.getById`);
    }
  },
};

async function getCategoryFilter(filter?: boolean) {
  if (!filter)
    return {};

  const filterConfig = await ConfigDao.getFilter();
  if (!filterConfig)
    return {};

  return { $regex: filterConfig.regex };
}
