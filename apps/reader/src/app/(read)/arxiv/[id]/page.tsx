import { ActionsMenu } from "./components/actions-menu";
import { PaperCard } from "./components/paper-card";
import { Panel } from "src/components/panel";
import { PapersDao } from "data/storage/papers";
import { Suspense } from "react";
import { sanitize } from "@/src/components/sanitizer";
import dayjs from "dayjs";
import { RelatedResearch } from "./components/related-research";
import Markdown from "./components/markdown";

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
            <>
              <div>
                <Markdown>{paper.parsed.title}</Markdown>
              </div>
              <div className="flex py-2 gap-4 flex-nowrap overflow-scroll no-scrollbar">
                {paper.parsed.authors.map((author, index) => (
                  <div key={index} className="whitespace-nowrap">
                    {author}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                arXiv, {dayjs(paper.raw.published).format("YYYY-MM-DD hh:mm")}
              </div>
            </>
          </Panel>

          <Panel title="Ask a question" closed>
            <>
              <div>When was the study performed?</div>
              <div>How were the participants recruited?</div>
              <div>
                What is the median diagnostic delay in Bangladesh for other
                comparable respiratory cases?
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Ask your own question"
                  className="w-full bg-black border border-input"
                />
              </div>
              <div>
                If you ask a novel and relevant question, you will have the
                opportunity to make it public and we will forward it to the
                author
              </div>
            </>
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

async function GptAbstract({ id, size }: { id: string; size: "sm" | "md" }) {
  const { text } = await PapersDao.getGptSummary(id, size);
  const sanitized = sanitize(text);

  return <Markdown>{sanitized.sanitized}</Markdown>;
}
