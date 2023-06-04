import { PaperflowCard } from "@/app/components/paperflow-card/card";
import { IngestionDao } from "data/db/ingestion-dao";
import { AxeIcon } from "lucide-react";

export default async function ReaderPage({
  params,
}: {
  params: { id: string };
}) {
  const data = await IngestionDao.getByIdFromRedis(params.id);

  return (
    <div className="md:flex">
      <div className="m-2">
        <PaperflowCard {...data} />
      </div>
      <div className="border-zinc-300 max-sm:border-y max-sm:mt-2 md:border-l md:ml-2 md:h-[100dvh] md:w-full">
        <div className="flex justify-between md:border-b p-4">
          <div>Stats</div>
          <div className="flex gap-3">
            <div>💬 12</div>
            <div>♺ 38</div>
            <div>♡ 203</div>
            <div>▥ 19,4K</div>
          </div>
        </div>
      </div>
    </div>
  );
}
