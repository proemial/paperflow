import { PaperflowCard } from "@/app/components/paperflow-card";
import { IngestionDao } from "data/db/ingestion-dao";

export default async function ReaderPage({params}: {params: { id: string }}) {
  const data = await IngestionDao.getByIdFromRedis(params.id);

  return (
    <div>
      <PaperflowCard {...data} />
    </div>
  );
}
