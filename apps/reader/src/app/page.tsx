import { Suspense } from "react";
import { Spinner, EmptySpinner } from "../components/spinner";
import { PipelineDao } from "data/storage/pipeline";
import { PaperCard } from "src/components/card";
import { getSession } from "@auth0/nextjs-auth0";
import logo from "src/images/logo.png";

export default async function Home() {
  const session = await getSession();
  if (!session?.user) {
    return (
      <main className="flex min-h-screen flex-col justify-center items-center">
        <img src={logo.src} width="50%" />
        <div className="text-4xl md:text-7xl">paperflow</div>
      </main>
    );
  }

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
