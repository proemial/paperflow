import { PipelineDao } from "data/storage/pipeline";
import { CardList } from "./card-list";

export const revalidate = 60;

export default async function HomePage() {
  const ingestionIndex = await PipelineDao.getIngestionIndex();
  const index = await PipelineDao.getIndex(ingestionIndex.at(-1));
  const latestIds = index?.filter(entry => entry.category.startsWith('cs.'))
                          .map(entry => entry.id)
                          .sort()
                          .reverse();

  return (
    <CardList latestIds={latestIds.slice(0, latestIds.length / 4)} />
  );
}
