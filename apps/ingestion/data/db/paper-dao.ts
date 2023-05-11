import { db } from "@/data/adapters/mongo/mongo-client";
import { DateMetrics } from "@/utils/date";
import { log } from "console";
import { AnyBulkWriteOperation } from "mongodb";
import { ArxivPaper } from "../adapters/arxiv/arxiv.models";

export type PaperStatus = "initial" | "summarised";

export type RevisionedPaper = {
  id: string,
  status: PaperStatus,
  lastUpdated: Date,
  revisions: ArxivPaper[],
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

  updateSummary: async (id: string, revId: string, summary: string) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const result = await mongo.updateOne(
        { id, "revisions.raw.id": revId },
        {
          $set: {
            status: 'summarised',
            "revisions.$.summary": summary
          }
        });

      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.updateSummary`);
    }
  }
};
