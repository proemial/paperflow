import { IngestionCache } from "data/storage/v1/ingestion-cache";
import { PaperflowCard } from "@/app/components/paperflow-card/card";

export async function RelatedResearch({
  id,
  category,
}: {
  id: string;
  category: { key: string; title: string; category: string };
}) {
  const related = await IngestionCache.related.byId(id);

  return (
    <div className="flex flex-col gap-2">
      {related?.map((data, i) => {
        return <PaperflowCard key={i} {...data} compact />;
      })}
    </div>
  );
}
