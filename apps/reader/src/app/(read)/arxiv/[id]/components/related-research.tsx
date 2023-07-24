import { PaperCard } from "src/components/card/card";
import { Suspense } from "react";
import { PipelineDao } from "data/storage/pipeline";
import { EmptySpinner } from "src/components/spinner";
import { arXivCategory } from "data/adapters/arxiv/arxiv.models";

type Props = {
  id: string;
  category: string;
};

export async function RelatedResearch({ id, category }: Props) {
  const index = await PipelineDao.getIngestionIndex();
  const ingested = await PipelineDao.getIndex(index?.at(-1));

  const paperCategory = arXivCategory(category);
  const filtered = ingested
    ?.filter((e) => e.id !== id)
    .map((e) => ({ id: e.id, ...arXivCategory(e.category) }))
    .filter((e) => e.category === paperCategory.category);

  const sameCategory = filtered.filter((e) => e.key === paperCategory.key);
  const sameTopic = filtered.filter(
    (e) => e.category === paperCategory.category && !sameCategory.includes(e)
  );

  const finalSet = [...sameCategory, ...sameTopic];
  console.log(finalSet);

  return (
    <>
      {finalSet?.slice(0, 10).map((entry, i) => (
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
