import { getSession } from "@auth0/nextjs-auth0";
import { UserPaper, ViewHistoryDao } from "data/storage/history";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { DateMetrics } from "utils/date";
import { sanitize } from "utils/sanitizer";
import dayjs from "dayjs";

export async function buildFeed(date: string) {
    const begin = DateMetrics.now();
    const metadata = await getMetadata(date);
    const {tags, bookmarks, size} = await getUserHistory();

    const papers = getFeedPapers(metadata, tags, size);

    const elapsed = DateMetrics.elapsed(begin);

    return {papers, tags, bookmarks, elapsed}
}

function getFeedPapers(metadata: PaperMetadata[], userTags: UserTags, size: number) {
    const feedPapers = metadata.map((m) => ({
      ...m,
      score: 0,
    }));

    if(size === 0) {
      return feedPapers;
    }

    const find = (id: string) => feedPapers.find((p) => p.id === id);

    metadata.forEach((entry) => {
      for (let i = 0; i < entry.tags.length; i++) {
        if (userTags.liked.includes(entry.tags[i])) {
          find(entry.id).score += 20;
        }
        if (userTags.bookmarked.includes(entry.tags[i])) {
          find(entry.id).score += 5;
        }
        if (userTags.viewed.includes(entry.tags[i])) {
          find(entry.id).score += 1;
        }
        if(dayjs().diff(dayjs(entry.published), 'days') < 30) {
          find(entry.id).score += 1;
        }
      }
    });

    return feedPapers.sort((a, b) => b.score - a.score);
  }

  async function getMetadata(date: string) {
    const metadata = await PipelineDao.getMetadata(date);

    if (!metadata) return [];

    return Object.keys(metadata).map((id) => ({
      id,
      ...metadata[id],
    })) as PaperMetadata[];
  }

  async function getUserHistory() {
    const session = await getSession();

    const empty = {
      bookmarks: [],
      tags: {
        liked: [],
        bookmarked: [],
        viewed: [],
      },
      size: 0,
    };

    if(!session) {
      return empty;
    }
    const history = await ViewHistoryDao.fullHistory(session?.user.sub);
    if(history.length < 1) {
        return empty;
    }

    const summaries = await PapersDao.getGptSummaries(
      history.map((h) => h.paper)
    );

    const withTags = history.map((h) => {
      const summary = summaries.find((s) => s.id === h.paper);
      const tags = sanitize(summary.text).hashtags;
      return {
        ...h,
        tags,
      };
    });

    const tags = {
      liked: getLikedTags(withTags),
      bookmarked: getBookmarkTags(withTags),
      viewed: getViewTags(withTags),
    };
    const bookmarks = withTags.filter((h) => h.bookmarked);

    return {tags, bookmarks, size: history.length};
  }

  function getLikedTags(userHistory: Array<UserPaper & { tags: string[] }>) {
    const likes = new Set<string>();

    userHistory
      .filter((h) => h.likes)
      .forEach((h) => {
        h.likes.forEach((l) => likes.add(`#${l}`));
      });

    return [...likes];
  }

  function getBookmarkTags(userHistory: Array<UserPaper & { tags: string[] }>) {
    const likes = new Set<string>();

    userHistory
      .filter((h) => h.bookmarked)
      .forEach((h) => {
        h.tags.forEach((t) => likes.add(t));
      });

    return [...likes];
  }

  function getViewTags(userHistory: Array<UserPaper & { tags: string[] }>) {
    const likes = new Set<string>();

    userHistory
      .filter((h) => !h.bookmarked && !h.likes)
      .forEach((h) => {
        h.tags.forEach((t) => likes.add(t));
      });

    return [...likes];
  }

  export type PaperMetadata = {
    id: string;
    categories: string[];
    tags: string[];
    published: Date;
    updated: Date;
  };

  export type UserTags = {
    liked: string[];
    bookmarked: string[];
    viewed: string[];
  };
