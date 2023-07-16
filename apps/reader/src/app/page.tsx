import { Suspense } from "react";
import { Spinner, EmptySpinner } from "../components/spinner";
import { PipelineDao } from "data/storage/pipeline";
import { PaperCard } from "src/components/card";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col justify-begin">
      <Suspense fallback={<CenteredSpinner />}>
        {/* @ts-expect-error Server Component */}
        <PageContent />
      </Suspense>
    </main>
  );
}

async function PageContent() {
  const ingestionIndex = await PipelineDao.getIngestionIndex();
  const index = await PipelineDao.getIndex(ingestionIndex.at(-1));

  const latestIds = index
    .map((entry) => entry.id)
    .sort()
    .reverse();
  const randomIds = getMultipleRandom(latestIds, 20);

  return (
    <>
      {randomIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
          {/* @ts-expect-error Server Component */}
          <PaperCard key={index} id={id} />
        </Suspense>
      ))}
    </>
  );
}

function getMultipleRandom(arr: string[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

function CenteredSpinner() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Spinner />
    </div>
  );
}
