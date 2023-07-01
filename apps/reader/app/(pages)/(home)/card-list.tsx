import { CardLink } from "@/app/components/paperflow-card/card-link";
import {
  HashBadge,
  HashBadges,
} from "@/app/components/paperflow-card/hashtags";
import { sanitize } from "@/app/components/paperflow-card/sanitizer";
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/app/components/shadcn-ui/Card";
import Spinner from "@/app/components/spinner";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";
import { PapersDao } from "data/storage/papers";
import { Suspense } from "react";
import dayjs from "dayjs";

export const revalidate = 5;

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export function CardList({ latestIds }: { latestIds?: string[] }) {
  const randomIds = getMultipleRandom(latestIds, 20);

  return (
    <div className="flex flex-col gap-1 m-2">
      <div className="max-sm:flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        {randomIds?.map((id, i) => (
          <Suspense key={i} fallback={<Spinner />}>
            {/* @ts-expect-error Server Component */}
            <PaperCard id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}

async function PaperCard({ id }: { id: string }) {
  const { text } = await PapersDao.getGptSummary(id, "sm");
  const paper = await PapersDao.getArXivAtomPaper(id);
  const { category } = paper?.parsed;

  const sanitized = sanitize(text);

  return (
    <Card className="max-sm:w-full">
      <CardHeader className="p-3">
        <CardDescription>
          <CardLink
            id={id}
            title={sanitized.sanitized}
            className="hover:underline"
          />{" "}
          <span className="text-slate-300">
            {dayjs(paper.raw.published).format("YYYY-MM-DD")}
          </span>
        </CardDescription>
        <CardDescription className="pt-2">
          <HashBadge text={arXivCategory(category)?.title} heavy />
          <HashBadges hashtags={sanitized.hashtags} />
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
