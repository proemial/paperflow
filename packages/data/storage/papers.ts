import { DateMetrics } from "utils/date";
import { UpStash } from "../adapters/redis/upstash-client";
import {ArXivOaiPaper} from "../adapters/arxiv/arxiv-oai"
import { ArXivAtomPaper } from "../adapters/arxiv/arxiv.models"

enum PapersDaoKey {
  Oai = 'arxiv:oai',
  Atom = 'arxiv:atom',
};

export const PapersDao = {
  pushArXivOaiPapers: async (papers: ArXivOaiPaper[]) => {
    const begin = DateMetrics.now();

    if(papers.length < 1)
      return;

    try {
      const pipeline = UpStash.papers.pipeline();
      papers.forEach(paper => {
        pipeline.set(`${paper.id}:${PapersDaoKey.Oai}`, paper);
      })

      await pipeline.exec();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.push`);
    }
  },

  pushArXivAtomPapers: async (papers: ArXivAtomPaper[]) => {
    const begin = DateMetrics.now();

    if(papers.length < 1)
      return;

    try {
      const pipeline = UpStash.papers.pipeline();
      papers.forEach(paper => {
        pipeline.set(`${paper.parsed.id}:${PapersDaoKey.Atom}`, paper);
      })

      await pipeline.exec();
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.push`);
    }
  },

};
