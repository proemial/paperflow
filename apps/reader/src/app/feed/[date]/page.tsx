import { getSession } from "@auth0/nextjs-auth0";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { UserPaper, ViewHistoryDao } from "data/storage/history";
import { PipelineDao } from "data/storage/pipeline";
import Link from "next/link";
import { DateMetrics } from "utils/date";
import { ClearBookmarks, ClearLikes } from "./clear-buttons";
import { PapersDao } from "data/storage/papers";
import { sanitize } from "utils/sanitizer";

type Props = {
  params: { date: string };
};

export default async function FeedTest({ params }: Props) {
  const begin = DateMetrics.now();
  const userHistory = await getUserHistory(); // all-time [p.id, p.cat, u.likes, u.bookmark]
  const metadata = await getMetadata(params.date); // daily: [p.id, p.cats, p.tags]

  const tags = {
    liked: getLikedTags(userHistory),
    bookmarked: getBookmarkTags(userHistory),
    viewed: getViewTags(userHistory),
  };

  const bookmarks = userHistory.filter((h) => h.bookmarked);

  const feedPapers = getFeedPapers(metadata, tags);
  const elapsed = DateMetrics.elapsed(begin);

  const highScoring = feedPapers.filter((p) => p.score > 4);

  return (
    <main className="flex min-h-screen flex-col items-begin justify-between p-24">
      <div>
        {elapsed}ms{" "}
        {bookmarks.length > 0 && <ClearBookmarks count={bookmarks.length} />}
        {tags.liked.length > 0 && <ClearLikes count={tags.liked.length} />}
      </div>

      <h1 className="mb-0">Feed papers</h1>
      <div className="text-secondary mb-3">
        {highScoring.length} of {feedPapers.length} with score above 4
      </div>
      {feedPapers.map((paper, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <>
              {/* @ts-ignore */}
              <Link href={`/arxiv/${paper.id}`} className="text-purple-500">
                {paper.id}
              </Link>
            </>
            <div>{paper.score}</div>
          </div>
          <div className="text-xs">
            <div className="mb-1">
              <PaperCategories categories={paper.categories} />
            </div>
            <div className="mb-4">
              <PaperTags paperTags={paper.tags} userTags={tags} />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}

function PaperCategories({ categories }: { categories: string[] }) {
  return (
    <>
      {categories.map((m, index) => (
        <span key={index} className={`text-foreground whitespace-nowrap`}>
          {`[${arXivCategory(m).title}] `}
        </span>
      ))}
    </>
  );
}

function PaperTags({
  paperTags,
  userTags,
}: {
  paperTags: string[];
  userTags: UserTags;
}) {
  const getStyle = (tag: string) => {
    if (userTags.liked.includes(tag)) {
      return "bg-purple-900";
    }
    if (userTags.bookmarked.includes(tag)) {
      return "bg-purple-600";
    }
    if (userTags.viewed.includes(tag)) {
      return "bg-purple-400";
    }
    return "border border-purple-300 text-purple-300";
  };

  return (
    <>
      {paperTags.map((tag, index) => (
        <span
          key={index}
          className={`mr-2 px-1 rounded-lg text-foreground whitespace-nowrap ${getStyle(
            tag
          )}`}
        >
          {tag}
        </span>
      ))}
    </>
  );
}

function getFeedPapers(metadata: PaperMetadata[], userTags: UserTags) {
  const feedPapers = metadata.map((m) => ({
    ...m,
    score: 0,
  }));
  console.log("userTags", userTags);

  const find = (id: string) => feedPapers.find((p) => p.id === id);

  // Match tags
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
  const history = await ViewHistoryDao.fullHistory(session?.user.sub);
  const summaries = await PapersDao.getGptSummaries(
    history.map((h) => h.paper)
  );

  return history.map((h) => {
    const summary = summaries.find((s) => s.id === h.paper);
    const tags = sanitize(summary.text).hashtags;
    return {
      ...h,
      tags,
    };
  });
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

type PaperMetadata = {
  id: string;
  categories: string[];
  tags: string[];
  published: Date;
  updated: Date;
};

type WeighedCategory = {
  category: string;
  weight: number;
};

type UserTags = {
  liked: string[];
  bookmarked: string[];
  viewed: string[];
};
