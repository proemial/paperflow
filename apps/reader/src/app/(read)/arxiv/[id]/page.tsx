import { PapersDao } from "data/storage/papers";
import { Suspense } from "react";
import { Panel } from "src/components/panel";
import { ActionsMenu } from "./components/actions-menu";
import { Metadata } from "./components/metadata";
import { PaperCard } from "./components/paper-card";
import { Questions } from "./components/questions";
import { RelatedResearch } from "./components/related-research";
import { GptAbstract } from "./components/gpt-apstract";

type Props = {
  params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
  const paper = await PapersDao.getArXivAtomPaper(params.id);

  return (
    <main className="flex min-h-screen flex-col justify-start">
      <PaperCard id={params.id} date={paper.parsed.updated}>
        <Suspense fallback={<div>S</div>}>
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
          <Panel title="Summary">
            <Suspense fallback={<div>S</div>}>
              {/* @ts-expect-error Server Component */}
              <GptAbstract id={params.id} size="md" />
            </Suspense>
          </Panel>

          <Panel title="Article Metadata" closed>
            <Metadata paper={paper} />
          </Panel>

          <Panel title="Ask a question" closed>
            <Questions />
          </Panel>
        </div>
      </div>

      <Panel title="Related papers" className="px-4 mt-6 mb-4">
        <Suspense fallback={<div>S</div>}>
          {/* @ts-expect-error Server Component */}
          <RelatedResearch
            id={paper.parsed.id}
            category={paper.parsed.category}
          />
        </Suspense>
      </Panel>
    </main>
  );
}
