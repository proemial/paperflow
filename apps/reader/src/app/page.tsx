import { PipelineDao } from "data/storage/pipeline";
import { PaperCard } from "src/components/card";
import { Suspense } from "react";
import { Spinner } from "../components/spinner";

export default async function Home() {
  const ingestionIndex = await PipelineDao.getIngestionIndex();
  const index = await PipelineDao.getIndex(ingestionIndex.at(-1));

  const latestIds = index
    .map((entry) => entry.id)
    .sort()
    .reverse();
  const randomIds = getMultipleRandom(latestIds, 20);

  return (
    <main className="flex min-h-screen flex-col justify-start">
      {randomIds.map((id, index) => (
        <Suspense key={index} fallback={<Spinner />}>
          {/* @ts-expect-error Server Component */}
          <PaperCard key={index} id={id} />
        </Suspense>
      ))}
    </main>
  );
}

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}
