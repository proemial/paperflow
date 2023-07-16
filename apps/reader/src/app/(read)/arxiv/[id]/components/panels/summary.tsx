import { Panel } from "src/components/panel";
import { Suspense } from "react";
import { GptAbstract } from "../gpt-apstract";
import { EmptySpinner } from "src/components/spinner";

export function SummaryPanel({ id, closed }: { id: string; closed?: boolean }) {
  return (
    <Panel title="Summary" closed={closed}>
      <Suspense fallback={<EmptySpinner />}>
        {/* @ts-expect-error Server Component */}
        <GptAbstract id={id} size="md" />
      </Suspense>
    </Panel>
  );
}
