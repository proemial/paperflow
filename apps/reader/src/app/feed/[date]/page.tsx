import { UserTags, getFeed } from "@/src/utils/feed";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import Link from "next/link";
import { ClearBookmarks, ClearLikes } from "./clear-buttons";

type Props = {
  params: { date: string };
};

export default async function FeedTest({ params }: Props) {
  const feed = await getFeed(params.date);

  return (
    <main className="flex min-h-screen flex-col items-begin justify-between p-24">
      <div>
        {feed.elapsed}ms{" "}
        {feed.bookmarks.length > 0 && (
          <ClearBookmarks count={feed.bookmarks.length} />
        )}
        {feed.tags.liked.length > 0 && (
          <ClearLikes count={feed.tags.liked.length} />
        )}
      </div>

      <h1 className="mb-0">{feed.papers.length} Feed papers</h1>
      <div className="text-secondary mb-3">
        {feed.highScoring.length} of {feed.total} with score above 4
      </div>
      {feed.papers.map((paper, index) => (
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
              <PaperTags paperTags={paper.tags} userTags={feed.tags} />
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
