import { getSession } from "@auth0/nextjs-auth0";
import { ViewHistoryDao } from "data/storage/history";
import { Suspense } from "react";
import { PaperCard } from "@/src/components/card/card";
import { EmptySpinner, Spinner } from "src/components/spinner";
import { NothingHereYet } from "@/src/components/nothing-yet";

export const revalidate = 1;

export default async function BookmarksPage() {
  return (
    <main className="flex h-full min-h-screen flex-col justify-begin">
      <Suspense fallback={<CenteredSpinner />}>
        {/* @ts-expect-error Server Component */}
        <PageContent />
      </Suspense>
    </main>
  );
}

async function PageContent() {
  const session = await getSession();
  const bookmarked = await ViewHistoryDao.bookmarked(session?.user.sub);
  const latestIds = bookmarked.map((entry) => entry.paper);

  return (
    <>
      {latestIds.length === 0 && <NothingHereYet />}
      {latestIds.map((id, index) => (
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
