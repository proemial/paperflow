import { DateMetrics } from "utils/date";
import { UpStash } from "../adapters/redis/upstash-client";
import {ArXivOaiPaper} from "../adapters/arxiv/arxiv-oai"
import { ArXivAtomPaper } from "../adapters/arxiv/arxiv.models"
import { WithTextAndUsage } from "@/adapters/openai/openai";

enum PapersDaoKey {
  Oai = 'arxiv:oai',
  Atom = 'arxiv:atom',
  Gpt = 'gpt:3.5',
};

export const PapersDao = {
  getArXivOaiPaper: async (id: string) => {
    const begin = DateMetrics.now();

    try {
      return await UpStash.papers.get(`${id}:${PapersDaoKey.Oai}`) as ArXivOaiPaper;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.getArXivOaiPaper`);
    }
  },

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
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.pushArXivOaiPapers`);
    }
  },

  getArXivAtomPaper: async (id: string) => {
    const begin = DateMetrics.now();

    try {
      return await UpStash.papers.get(`${id}:${PapersDaoKey.Atom}`) as ArXivAtomPaper;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.getArXivAtomPaper`);
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
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.pushArXivAtomPapers`);
    }
  },

  getGptSummary: async (id: string, size: string) => {
    const begin = DateMetrics.now();

    try {
      return await UpStash.papers.get(`${id}:${PapersDaoKey.Gpt}:${size}`) as WithTextAndUsage;

    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.getGptSummary`);
    }
  },

  pushGptSummary: async (id: string, size: string, summary: WithTextAndUsage) => {
    const begin = DateMetrics.now();

    try {
      await UpStash.papers.set(`${id}:${PapersDaoKey.Gpt}:${size}`, summary);
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      console.log(`[${DateMetrics.elapsed(begin)}] PapersDao.pushArXivAtomPapers`);
    }
  },

};
