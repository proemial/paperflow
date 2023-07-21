import { FeedItem } from "../app/api/feed/[page]/route";

export function filterFeed(feedPapers: FeedItem[]) {
    const highScoring = feedPapers.filter((p) => p.score > 4);
    const lowScoring = feedPapers.filter((p) => p.score <= 4);

      let papers = highScoring;
      if(papers.length < 20) {
          papers = [
              ...papers,
              ...lowScoring.slice(0, 20 - papers.length + 3)
          ]
      }
      if(papers.length > 50)
      papers = papers.slice(0, 40 + 3)

      return papers;
  }
