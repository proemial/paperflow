import { IngestionCache } from "data/storage/v1/ingestion-cache";
import { CardList } from "./card-list";

export const revalidate = 60;

export default async function HomePage() {
  const latestIds = await IngestionCache.latestIds.get();

  return (
    <>
      {/* @ts-expect-error Server Component */}
      <CardList latestIds={latestIds} />
    </>
  );
}
