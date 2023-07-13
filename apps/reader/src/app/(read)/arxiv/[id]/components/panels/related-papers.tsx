import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Suspense } from "react";
import { Panel } from "src/components/panel";
import { RelatedResearch } from "../related-research";
import { Spinner } from "src/components/spinner";

type Props = {
  paper: ArXivAtomPaper;
  closed?: boolean;
};

export function RelatedPanel({ paper, closed }: Props) {
  return (
    <Panel title="Related papers" className="px-4 mt-6 mb-4" closed={closed}>
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Server Component */}
        <RelatedResearch
          id={paper.parsed.id}
          category={paper.parsed.category}
        />
      </Suspense>
    </Panel>
  );
}
