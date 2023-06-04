import { IngestionDao } from "data/db/ingestion-dao";
import { CardList } from "./card-list";

export const revalidate = 1;

function getMultipleRandom(arr, num) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, num);
}

export default async function HomePage() {
  const latestIds = await IngestionDao.getLatestFromRedis();
  const randomIds = getMultipleRandom(latestIds.ids, 20);
  const randomPapers = await IngestionDao.getByIdsFromRedis(randomIds);

  return <CardList data={randomPapers} />;
}
