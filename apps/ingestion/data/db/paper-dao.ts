import { db } from "@/data/adapters/mongo/mongo-client";
import { ArxivPaper } from "../adapters/arxiv/arxiv.models";

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

    const lastUpdated = new Date();
    const id = paper.parsed.id;
    const status = 'new';

    await mongo.updateOne({ id }, {
      $set: { id, status, lastUpdated },
      $addToSet: { revisions: paper }
    }, { upsert: true });

    return (await mongo.findOne<RevisionedPaper>({ id })) as RevisionedPaper;
  }
};
