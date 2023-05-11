import IngestionSummary from '@/components/ingestion-summary';
import { IngestionDao } from '@/data/db/ingestion-dao';

export default async function Page({ params }: { params: { date: string } }) {
  const ingestionState = await IngestionDao.get(params.date);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-white">
        <div className="space-y-3">
          <IngestionSummary ingestionState={ingestionState} />
        </div>
      </div>
    </div>
  );
}
