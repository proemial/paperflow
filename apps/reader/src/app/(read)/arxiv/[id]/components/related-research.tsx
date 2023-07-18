import { PaperCard } from "@/src/components/card/card";
import { Suspense } from "react";
import { PipelineDao } from "data/storage/pipeline";
import { EmptySpinner } from "src/components/spinner";

type Props = {
  id: string;
  category: string;
};

export async function RelatedResearch({ id, category }: Props) {
  const index = await PipelineDao.getIngestionIndex();
  const ingested = await PipelineDao.getIndex(index?.at(-1));
  const filtered = ingested?.filter(
    (entry) => entry.id !== id && entry.category === category
  );

  return (
    <>
      {filtered?.slice(0, 3).map((entry, i) => (
        <div key={i}>
          <Suspense fallback={<EmptySpinner />}>
            {/* @ts-expect-error Server Component */}
            <PaperCard id={entry.id} />
          </Suspense>
        </div>
      ))}
    </>
  );
}
