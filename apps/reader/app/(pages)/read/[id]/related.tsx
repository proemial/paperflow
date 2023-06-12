import { PaperflowCard } from "@/app/components/paperflow-card/card";
import { SkeletonCard } from "@/app/components/paperflow-card/skeleton";
import { PipelineDao } from "data/storage/pipeline";
import { Suspense } from "react";

export async function RelatedResearch({ id, category }: { id: string, category: string }) {
  const index = await PipelineDao.getIngestionIndex();
  const ingested = await PipelineDao.getIndex(index?.at(-1));
  const filtered = ingested?.filter(entry => entry.id !== id && entry.category === category);

  return (
    <div className="flex flex-col gap-2">
      {filtered?.map((entry, i) => <>
        <Suspense fallback={<SkeletonCard />}>
          {/* @ts-expect-error Server Component */}
          <PaperflowCard key={i} id={entry.id} compact />
        </Suspense>
      </>)}
    </div>
  );
}
