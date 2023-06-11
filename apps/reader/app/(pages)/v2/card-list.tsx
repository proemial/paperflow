import { PaperflowCard } from "@/app/components/paperflow-card/cardv2";
import Link from "next/link";

export const revalidate = 5;

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export async function CardList({ latestIds }: { latestIds?: string[] }) {
  const randomIds = getMultipleRandom(latestIds, 20);

  return (
    <div className="flex flex-col gap-1 m-2">
      <div className="max-sm:flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-2 flex-1">
        {randomIds?.map((id, i) => (<>
          {/* @ts-expect-error Server Component */}
          <PaperflowCard key={i} id={id} />
          </>))}
      </div>
      {randomIds && (
        <div className="flex items-end justify-end">
          <Link href="" className="italic px-4">Load more</Link>
        </div>
      )}
    </div>
  );
}
