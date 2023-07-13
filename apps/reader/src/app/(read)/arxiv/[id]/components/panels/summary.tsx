import { Panel } from "src/components/panel";
import { Suspense } from "react";
import { GptAbstract } from "../gpt-apstract";
import { Spinner } from "src/components/spinner";

export function SummaryPanel({ id }: { id: string }) {
  return (
    <Panel title="Summary">
      <Suspense fallback={<Spinner />}>
        {/* @ts-expect-error Server Component */}
        <GptAbstract id={id} size="md" />
      </Suspense>
    </Panel>
  );
}
