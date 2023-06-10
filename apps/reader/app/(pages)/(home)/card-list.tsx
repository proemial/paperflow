import { LatestIds, SummarisedPaper } from "data/storage/v1/ingestion-models";
import { PaperflowCard } from "@/app/components/paperflow-card/card";
import Link from "next/link";
import { IngestionCache } from "data/storage/v1/ingestion-cache";

export const revalidate = 5;

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export async function CardList({ latestIds }: { latestIds?: LatestIds }) {
  const randomIds = getMultipleRandom(latestIds.ids, 20);
  const data = await IngestionCache.papers.byIds(randomIds);

  console.log(data);

  return (
    <div className="flex flex-col gap-1 m-2">
      <div className="max-sm:flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        {data?.map((entry, i) => (
          <PaperflowCard key={i} {...entry} />
        ))}
      </div>
      {data && (
        <div className="flex items-end justify-end">
          <Link href="" className="italic px-4">Load more</Link>
        </div>
      )}
    </div>
  );
}
