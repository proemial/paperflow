import { PapersDao } from "data/storage/papers";
import { Suspense } from "react";
import { ActionsMenu } from "./components/actions-menu";
import { GptAbstract } from "./components/gpt-apstract";
import { MetadataPanel } from "./components/panels/metadata";
import { QuestionsPanel } from "./components/panels/questions";
import { RelatedPanel } from "./components/panels/related-papers";
import { StatisticsPanel } from "./components/panels/statistics";
import { SummaryPanel } from "./components/panels/summary";
import { PaperCard } from "./components/paper-card";
import { EmptySpinner, Spinner } from "src/components/spinner";

type Props = {
  params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
  return (
    <Suspense fallback={<CenteredSpinner />}>
      {/* @ts-expect-error Server Component */}
      <PageContent id={params.id} />
    </Suspense>
  );
}

async function PageContent({ id }: { id: string }) {
  const paper = await PapersDao.getArXivAtomPaper(id);

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
        <div className="flex flex-col gap-6">
          <SummaryPanel id={id} />

          <StatisticsPanel closed />

          <MetadataPanel paper={paper} closed />

          <QuestionsPanel paper={paper} />
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
