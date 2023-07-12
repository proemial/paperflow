import { ActionsMenu } from "./components/actions-menu";
import { PaperCard } from "./components/paper-card";
import { Panel } from "src/components/panel";
import { PapersDao } from "data/storage/papers";
import { Suspense } from "react";
import { sanitize } from "@/src/components/sanitizer";
import dayjs from "dayjs";

type Props = {
  params: { id: string };
};

export default async function ReaderPage({ params }: Props) {
  const paper = await PapersDao.getArXivAtomPaper(params.id);

  return (
    <main className="flex min-h-screen flex-col justify-start">
      <PaperCard id={params.id}>
        <Suspense fallback={<div>S</div>}>
          {/* @ts-expect-error Server Component */}
          <GptAbstract id={params.id} size="sm" />
        </Suspense>
      </PaperCard>

      <ActionsMenu className="p-4 top-0 sticky bg-background" />

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
              <div>{paper.parsed.title}</div>
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

          <div>
            <PaperCard id={"012"} variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
            <PaperCard id={"234"} variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
            <PaperCard id={"567"} variant="related">
              New Reinforcement Learning framework RLTF improves code generation
              using real-time feedback
            </PaperCard>
          </div>
        </div>
      </div>
    </main>
  );
}

async function GptAbstract({ id, size }: { id: string; size: "sm" | "md" }) {
  const { text } = await PapersDao.getGptSummary(id, size);
  const sanitized = sanitize(text);

  return <>{sanitized.sanitized}</>;
}
