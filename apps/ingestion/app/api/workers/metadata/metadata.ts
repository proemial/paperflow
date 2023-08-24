import { IngestionLogger } from "data/storage/ingestion-log";
import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";
import { DateMetrics } from "utils/date";

export async function extractMetadata(date: string) {
    const index = await PipelineDao.getIndex(date);
    const begin = DateMetrics.now();

    if(index.length > 0){
        const metadata = await PapersDao.buildMetadata(index.map((i) => i.id));
        await PipelineDao.pushMetadata(date, metadata);

        await IngestionLogger.log(date, `[metadata][${DateMetrics.elapsed(begin)}] indexLength: ${index.length}, metadata length: ${Object.keys(metadata).length}`);
    }

    return {date, count: index.length};
}
