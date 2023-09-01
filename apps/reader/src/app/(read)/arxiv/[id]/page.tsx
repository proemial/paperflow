import { PapersDao } from "data/storage/papers";
import { ConfigDao } from "data/storage/config";
import { Suspense } from "react";
import { ActionsMenu } from "./components/menu/actions-menu";
import { GptAbstract } from "./components/gpt-apstract";
import { MetadataPanel } from "./components/panels/metadata";
import { QuestionsPanel } from "./components/panels/questions";
import { RelatedPanel } from "./components/panels/related-papers";
import { StatisticsPanel } from "./components/panels/statistics";
import { SummaryPanel } from "./components/panels/summary";
import { PaperCard } from "./components/paper-card";
import { EmptySpinner, Spinner } from "src/components/spinner";
import { ViewHistoryDao } from "data/storage/history";
import { getSession } from "@auth0/nextjs-auth0";
import { revalidatePath } from "next/cache";
import { UsersDao } from "data/storage/users";

type Props = {
  params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
  revalidatePath("/history");
  revalidatePath("/");

  return (
    <Suspense fallback={<CenteredSpinner />}>
      {/* @ts-expect-error Server Component */}
      <PageContent id={params.id} />
    </Suspense>
  );
}

async function PageContent({ id }: { id: string }) {
  const paper = await PapersDao.getArXivAtomPaper(id);
  const { model } = await ConfigDao.getPaperbotConfig();
  await logHistory(id, paper.parsed.category);

  return (
    <main className="flex min-h-screen flex-col justify-start">
      <PaperCard id={id} date={paper.parsed.updated}>
        <Suspense fallback={<EmptySpinner />}>
          {/* @ts-expect-error Server Component */}
          <GptAbstract id={id} size="sm" />
        </Suspense>
      </PaperCard>

      <ActionsMenu id={id} className="p-4 top-0 sticky bg-background z-50" />

      <div className="px-4 pt-2">
        <div className="flex flex-col gap-6 text-base">
          <SummaryPanel id={id} />

          <StatisticsPanel closed />

          <MetadataPanel paper={paper} closed />

          <QuestionsPanel paper={paper} model={model} />
        </div>
      </div>

      <RelatedPanel paper={paper} />
    </main>
  );
}

function CenteredSpinner() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <Spinner />
    </div>
  );
}

async function logHistory(id, category) {
  const session = await getSession();
  if (session) {
    await ViewHistoryDao.upsert(session.user.sub, id, category);
    await UsersDao.updateReadStats(session.user.sub);
  }
}
