import { UserTags, buildFeed } from "src/utils/feed";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import {
  ClearBookmarks,
  ClearCache,
  ClearHistory,
  ClearLikes,
} from "./clear-buttons";
import { ViewHistoryDao } from "data/storage/history";
import { getSession } from "@auth0/nextjs-auth0";
import { Badge } from "src/components/card/badge";
import { LinkButton } from "./link-button";
import { filterFeed } from "@/src/utils/feed-filter";

type Props = {
  params: { date: string };
};

export default async function FeedTest({ params }: Props) {
  const feed = await buildFeed(params.date);
  const highScoring = feed.papers.filter((p) => p.score > 4);
  const filteredFeed = filterFeed(feed.papers);

  const session = await getSession();
  const history =
    (session && (await ViewHistoryDao.fullHistory(session.user.sub))) || [];
  const likes = (session && history.filter((h) => h.likes)) || [];

  const likedTags = [] as {
    id: string;
    text: string;
    category: string;
    likes: string[];
  }[];
  likes.forEach((liked) => {
    liked.likes.forEach((tag) => {
      likedTags.push({
        id: liked.paper,
        text: tag,
        category: liked.category,
        likes: liked.likes,
      });
    });
  });

  return (
    <main className="flex min-h-screen flex-col items-begin justify-between p-24">
      <div>
        {feed.elapsed}ms{" "}
        {session && (
          <>
            {feed.bookmarks.length > 0 && (
              <ClearBookmarks count={feed.bookmarks.length} />
            )}
            {feed.tags.liked.length > 0 && (
              <ClearLikes count={feed.tags.liked.length} />
            )}
            <ClearCache count={history.length} />
            {history.length > 0 && <ClearHistory count={history.length} />}
          </>
        )}
      </div>
      <div className="flex gap-1">
        {likedTags.map((liked, index) => (
          <Badge
            key={index}
            id={liked.id}
            text={liked.text}
            category={liked.category}
            likes={liked.likes}
          />
        ))}
      </div>

      <h1 className="mb-0">{feed.papers.length} Feed papers</h1>
      <div className="text-secondary mb-3">
        {highScoring.length} has a score above 4 (daily total:{" "}
        {feed.papers.length})
      </div>
      {filteredFeed.map((paper, index) => (
        <div key={index}>
          <div className="flex justify-between">
            <LinkButton id={paper.id} />
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
