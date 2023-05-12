import IngestionSummary from '@/components/ingestion-summary';
import { IngestionDao } from '@/data/db/ingestion-dao';
import dayjs from 'dayjs';

export const revalidate = 60;

export default async function Page() {
  const date = dayjs().format("YYYY-MM-DD");
  const ingestionState = await IngestionDao.get(date);

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-white">
        <div className="space-y-3">
          {/* @ts-expect-error Server Component */}
          <IngestionSummary ingestionState={ingestionState} />
        </div>
      </div>
    </div>
  );
}
