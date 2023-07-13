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
import { Spinner } from "src/components/spinner";

type Props = {
  params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
  const paper = await PapersDao.getArXivAtomPaper(params.id);

  return (
    <main className="flex min-h-screen flex-col justify-start">
      <PaperCard id={params.id} date={paper.parsed.updated}>
        <Suspense fallback={<Spinner />}>
          {/* @ts-expect-error Server Component */}
          <GptAbstract id={params.id} size="sm" />
        </Suspense>
      </PaperCard>

      <ActionsMenu
        id={params.id}
        className="p-4 top-0 sticky bg-background z-50"
      />

      <div className="px-4 pt-2">
        <div className="flex flex-col gap-6">
          <SummaryPanel id={params.id} />

          <StatisticsPanel />

          <MetadataPanel paper={paper} />

          <QuestionsPanel />
        </div>
      </div>

      <RelatedPanel paper={paper} />
    </main>
  );
}
