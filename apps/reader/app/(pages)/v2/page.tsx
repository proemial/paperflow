import { PipelineDao } from "data/storage/pipeline";
import { CardList } from "./card-list";

export const revalidate = 60;

export default async function HomePage() {
  const index = await PipelineDao.getIngestionIndex();
  const latestIds = (await PipelineDao.getIndex(index.at(-1))).map(entry => entry.id);

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <CardList latestIds={latestIds} />
    </>
  );
}
