import { PaperflowCard } from "@/app/components/paperflow-card/card";
import Spinner from "@/app/components/spinner";
import Link from "next/link";
import { Suspense } from "react";

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
            <PaperflowCard id={id} />
          </Suspense>))}
      </div>
      {randomIds && (
        <div className="flex items-end justify-end">
          <Link href="" className="italic px-4">Load more</Link>
        </div>
      )}
    </div>
  );
}
