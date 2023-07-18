import { Suspense } from "react";
import { Spinner, EmptySpinner } from "../components/spinner";
import { PipelineDao } from "data/storage/pipeline";
import { PaperCard } from "@/src/components/card/card";
import { getSession } from "@auth0/nextjs-auth0";
import logo from "src/images/logo.png";
import { ViewHistoryDao } from "data/storage/history";

export const revalidate = 1;

export default async function HomePage() {
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

  let latestIds = index
    .map((entry) => entry.id)
    .sort()
    .reverse();

  const { user } = await getSession();
  if (user) {
    const read = (await ViewHistoryDao.readHistory(user.sub)).map(
      (paper) => paper.paper
    );
    latestIds = latestIds.filter((id) => !read.includes(id));
  }

  const randomIds = latestIds.slice(0, 20);

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

function CenteredSpinner() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Spinner />
    </div>
  );
}
