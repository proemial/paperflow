import { UserPaper } from 'data/storage/history';
import { create } from 'zustand'

export type ViewHistoryState = {
  papers: UserPaper[],
  getPaper: (userId: string, paperId: string) => Promise<void>,
  toggleBookmark: (userId: string, paperId: string) => Promise<void>,
};

export const useViewHistory = create<ViewHistoryState>((set, get) => ({
  papers: [],
  getPaper: async (userId: string, paperId: string) => {
    const papers = get().papers;
    const hit = papers.find(paper => paper.user === userId && paper.paper === paperId)

    if(!hit) {
      const paper = await getUserPaper(paperId);

      if(paper) {
        set({
          papers: [
            ...papers,
            paper
          ]
        });
      }
    }
  },

  toggleBookmark: async (userId: string, paperId: string) => {
    const papers = get().papers;
    const paper = findPaper(papers, userId, paperId);
    paper.bookmarked = !paper.bookmarked;

    set({
      papers: [
        ...papers.filter(p => p.user !== userId || p.paper !== paperId),
        paper
      ]
    })
    toggleBookmark(paper);
  }
}));

async function getUserPaper(paperId: string) {
  return await (
    await fetch(`/api/history/${paperId}`)
  ).json() as UserPaper;
}

async function toggleBookmark(paper: UserPaper) {
  fetch(`/api/history/`, {method: 'POST', body: JSON.stringify({...paper, action: 'bookmark'})});
}

export function findPaper(papers: UserPaper[], userId: string, paperId: string) {
  console.log('papers', papers, userId, paperId);

  return papers.find(p => p.user === userId && p.paper === paperId);;
}
