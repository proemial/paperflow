import { getSession } from "@auth0/nextjs-auth0";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { UserPaper, ViewHistoryDao } from "data/storage/history";
import { PipelineDao } from "data/storage/pipeline";
import Link from "next/link";
import { ClearBookmarks, ClearLikes } from "./clear-buttons";

type Props = {
  params: { date: string };
};

export default async function FeedTest({ params }: Props) {
  const userHistory = await getUserHistory();
  const metadata = await getMetadata(params.date);

  const userCategories = getWeighedCategories(userHistory);
  const likes = getLikes(userHistory);

  const feedPapers = getFeedPapers(metadata, likes, userCategories);

  return (
    <main className="flex min-h-screen flex-col items-begin justify-between p-24">
      <div>
        {userCategories.length > 0 && <ClearBookmarks />}
        {likes.length > 0 && <ClearLikes />}
      </div>
      <h1>Weighed paper categories</h1>
      {userCategories.map((category, index) => (
        <div key={index}>
          {arXivCategory(category.category).title} weight: {category.weight}
        </div>
      ))}

      <h1>Liked tags</h1>
      {likes.map((like, index) => (
        <div key={index}>{like}</div>
      ))}

      <h1>
        Feed papers ({feedPapers.length} / {Object.keys(metadata).length})
      </h1>
      {feedPapers.map((paper, index) => (
        <div key={index}>
          {/* @ts-ignore */}
          <Link href={`/arxiv/${paper.id}`} className="text-purple-500">
            {paper.id}
          </Link>
          <div className="text-xs">
            <div className="mb-1">
              <PaperCategories
                categories={paper.categories}
                userCategories={userCategories}
              />
            </div>
            <div className="mb-4">
              <PaperTags tags={paper.tags} userLikes={likes} />
            </div>
          </div>
        </div>
      ))}
    </main>
  );
}

function PaperCategories({
  categories,
  userCategories,
}: {
  categories: string[];
  userCategories: WeighedCategory[];
}) {
  const cats = userCategories.map((c) => c.category);
  return (
    <>
      {categories.map((m, index) => (
        <span
          key={index}
          className={`mr-2 px-1 rounded-lg text-foreground whitespace-nowrap ${
            cats.includes(m) ? "bg-secondary" : "border border-foreground"
          }`}
        >
          {arXivCategory(m).title}
        </span>
      ))}
    </>
  );
}

function PaperTags({
  tags,
  userLikes,
}: {
  tags: string[];
  userLikes: string[];
}) {
  const tagsClean = tags.map((tag) => tag.slice(1));
  return (
    <>
      {tagsClean.map((tag, index) => (
        <span
          key={index}
          className={`mr-2 px-1 rounded-lg text-foreground whitespace-nowrap ${
            userLikes.includes(tag)
              ? "bg-secondary"
              : "border border-foreground"
          }`}
        >
          #{tag}
        </span>
      ))}
    </>
  );
}

function getFeedPapers(
  metadata: PaperMetadata[],
  likes: string[],
  categories: WeighedCategory[]
) {
  const feedPapers = [] as PaperMetadata[];
  // Match tags
  metadata.forEach((entry) => {
    for (let i = 0; i < entry.tags.length; i++) {
      if (likes.includes(entry.tags[i].slice(1))) {
        feedPapers.push(entry);
        break;
      }
    }
  });

  if (feedPapers.length === 0) {
    // Match primary categories
    categories.forEach((cat) => {
      const unMatched = metadata.filter(
        (entry) => !feedPapers.find((paper) => paper.id === entry.id)
      );
      unMatched.forEach((entry) => {
        if (entry.categories[0] === cat.category) feedPapers.push(entry);
      });
    });
  }

  return feedPapers.length > 0 ? feedPapers : metadata;
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
  return await ViewHistoryDao.fullHistory(session?.user.sub);
}

function getLikes(userHistory: UserPaper[]) {
  const likes = new Set<string>();

  userHistory
    .filter((h) => h.likes)
    .forEach((h) => {
      h.likes.forEach((l) => likes.add(l));
    });

  return [...likes];
}

function getWeighedCategories(userHistory: UserPaper[]) {
  const categories = [] as WeighedCategory[];

  const find = (entry: UserPaper) =>
    categories.find((c) => c.category === entry.category);

  userHistory
    .filter((h) => h.bookmarked || h.likes)
    .forEach((h) => {
      if (!find(h)) {
        categories.push({ category: h.category, weight: 0 });
      }

      const hit = find(h);
      if (h.bookmarked) {
        hit.weight += 1;
      }
      if (h.likes) {
        hit.weight += h.likes.length;
      }
    });

  return categories
    .filter((c) => c.weight > 0)
    .sort((a, b) => b.weight - a.weight);
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
