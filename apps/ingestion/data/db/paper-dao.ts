import { db } from "@/data/adapters/mongo/mongo-client";
import { ArxivPaper } from "../adapters/arxiv/arxiv.models";
import { AnyBulkWriteOperation } from "mongodb";
import { DateMetrics } from "@/utils/date";

export type PaperStatus = "new" | "summarise_started" | "summarised";

export type RevisionedPaper = {
  id: string,
  status: PaperStatus,
  lastUpdated: Date,
  revisions: ArxivPaper[],
};

export const DocsDao = {
  upsert: async (paper: ArxivPaper) => {
    const mongo = await db('papers');
    const begin = DateMetrics.now();

    try {
      const lastUpdated = new Date();
      const id = paper.parsed.id;
      const status = 'new';

      await mongo.updateOne({ id }, {
        $set: { id, status, lastUpdated },
        $addToSet: { revisions: paper }
      }, { upsert: true });

      return (await mongo.findOne<RevisionedPaper>({ id })) as RevisionedPaper;
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
        const status = 'new';

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
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] DocsDao.upsertMany`);
    }
  },
};
