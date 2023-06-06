import { IngestionCache } from "data/db/ingestion-cache";
import { CardList } from "./card-list";

export const revalidate = 0;

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export default async function HomePage() {
  const latestIds = await IngestionCache.getLatestFromRedis();
  const randomIds = getMultipleRandom(latestIds.ids, 20);
  const randomPapers = await IngestionCache.getByIdsFromRedis(randomIds);

  return <CardList data={randomPapers} />;
}
