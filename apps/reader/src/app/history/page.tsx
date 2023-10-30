import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { Suspense } from "react";
import { PaperCard } from "src/components/card/card";
import { EmptySpinner, Spinner } from "src/components/spinner";
import { NothingHereYet } from "src/components/nothing-yet";

export const revalidate = 1;

export default async function HistoryPage() {
  return (
    <main className="flex min-h-screen flex-col justify-begin">
      <div className="text-xl px-4 py-6 bg-background h-full top-0 sticky shadow">
        History
      </div>
      <Suspense fallback={<CenteredSpinner />}>
        <PageContent />
      </Suspense>
    </main>
  );
}

async function PageContent() {
  const session = await getSession();
  const read = await ViewHistoryDao.readHistory(session?.user.sub);
  const latestIds = read.map((entry) => entry.paper).slice(0, 20);

  return (
    <>
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
        <Suspense key={index} fallback={<EmptySpinner />}>
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
