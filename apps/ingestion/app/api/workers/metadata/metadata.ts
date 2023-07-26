import { PapersDao } from "data/storage/papers";
import { PipelineDao } from "data/storage/pipeline";

export async function extractMetadata(date: string) {
    const index = await PipelineDao.getIndex(date);

    if(index.length > 0){
        const metadata = await PapersDao.buildMetadata(index.map((i) => i.id));
        await PipelineDao.pushMetadata(date, metadata);
    }

    return {date, count: index.length};
}
