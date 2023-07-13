import { ArXivAtomPaper } from "data/adapters/arxiv/arxiv.models";
import { Suspense } from "react";
import { Panel } from "src/components/panel";
import { RelatedResearch } from "../related-research";

export function RelatedPanel({ paper }: { paper: ArXivAtomPaper }) {
  return (
    <Panel title="Related papers" className="px-4 mt-6 mb-4">
      <Suspense fallback={<div>S</div>}>
        {/* @ts-expect-error Server Component */}
        <RelatedResearch
          id={paper.parsed.id}
          category={paper.parsed.category}
        />
      </Suspense>
    </Panel>
  );
}
