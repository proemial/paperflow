import { DateMetrics } from "utils/date";
import { QStash } from "../adapters/redis/qstash-client";
import {ArXivPaper} from "../adapters/arxiv/arxiv-oai"

enum PapersDaoKey {
  Oai = 'arxiv:oai',
};

export const PapersDao = {
  push: async (papers: ArXivPaper[]) => {
    const begin = DateMetrics.now();

    if(papers.length < 1)
      return;

    try {
      const pipeline = QStash.papers.pipeline();
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

};
