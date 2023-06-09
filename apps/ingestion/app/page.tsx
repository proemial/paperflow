import { IngestionDao } from 'data/storage/v1/ingestion-dao';
import dayjs from 'dayjs';

export const revalidate = 60;

export default async function Page() {
  const date = dayjs().format("YYYY-MM-DD");
  const ingestionState = await IngestionDao.get(date);

  return (
    <div></div>
  );
}
