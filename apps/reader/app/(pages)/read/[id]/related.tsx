import { PipelineDao } from "data/storage/pipeline";
import { PaperflowCard } from "@/app/components/paperflow-card/card";

export async function RelatedResearch({ id, category }: { id: string, category: string }) {
  const index = await PipelineDao.getIngestionIndex();
  const ingested = (await PipelineDao.getIndex(index.at(-1)));
  const filtered = ingested.filter(entry => entry.id !== id && entry.category === category);

  return (
    <div className="flex flex-col gap-2">
      {filtered?.map((entry, i) => {
        {/* @ts-expect-error Server Component */}
        return <PaperflowCard key={i} id={entry.id} compact />;
      })}
    </div>
  );
}
