import { PipelineDao } from "data/storage/pipeline";
import { CardList } from "./card-list";
import { cookies } from "next/headers";
import { UpdateIndex } from "data/adapters/redis/redis-client";

export const revalidate = 60;

export default async function HomePage() {
  const filter = (index?: UpdateIndex) => {
    const cookieStore = cookies();
    const category = cookieStore.get("category");
    console.log("category", category);

    if (!index) return [];

    if (!category || category.value === "*") return index;

    if (category.value !== "physics")
      return index?.filter((entry) =>
        entry.category.startsWith(category.value)
      );

    return index?.filter((entry) => {
      return (
        entry.category.startsWith(category.value) ||
        entry.category.startsWith("astro") ||
        entry.category.startsWith("cond-mat") ||
        entry.category.startsWith("hep") ||
        entry.category.startsWith("gr-qc") ||
        entry.category.startsWith("nlin") ||
        entry.category.startsWith("nucl") ||
        entry.category.startsWith("quant")
      );
    });
  };

  const ingestionIndex = await PipelineDao.getIngestionIndex();
  const index = await PipelineDao.getIndex(ingestionIndex.at(-1));

  const latestIds = filter(index)
    .map((entry) => entry.id)
    .sort()
    .reverse();

  return <CardList latestIds={latestIds.slice(0, latestIds.length / 4)} />;
}
